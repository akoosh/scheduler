// Query Mapper source file
// 02/28/2014
// ZT & AW

course_title = {
	'intro to computer science':true,
	'intro biology':true,
	'data structures':true,
	'weight lifting':true,
};

subjects = {
	'cs':true,
	'bio':true,
	'math':true,
	'pols':true,
};

professor_name = {
	'billy bob':true,
	'john doe':true,
	'frank manning':true,
};

Scheduler.QueryMapper = {

	_regexIsMember : function( regex )
	{
		return function( str ){
				var result = str.match( regex );
				return result ? result[1] : null;
		};
	},

	_valueIsMember : function( set )
	{
		return function( value ){
			for ( var str in set )
			{
				if( str.indexOf( value ) != -1 )
				{
					return value;
				}
			}

			return null;
		};
	},

	_valueFunction : function( fun )
	{
		return function( value ){
			// if value has comma exit
			return fun(value)?value:null;
		}
	},
	
	// Filter object for the filets
	Filter : function( category, isMember ){
		this.category = category;
		this.isMember = isMember;
		this.parse = function( input )
		{
			if( typeof isMember !== 'function' )
			{
				//console.error( "Filter function is not defined correctly for filter with category: " + this.category );
				return null;
			}

			
			var result = this.isMember( input );

			if( result )
			{
				return { 
					"type": this.category, 
					"value" : result,
				};
			}

			return null;

		}
	},
	
	addFilter : function( category, isMember )
	{
		var filter = new Scheduler.QueryMapper.Filter( category, isMember );
		Scheduler.QueryMapper.filters.push( filter );
		
	},

	// Filters that are loaded at runtime
	filters : [],

	// Returns an array of matches for a given collection of filters
	filterTokenize : function( input ){
		var tokens = Scheduler.QueryMapper.stringTokenize( input );
		var filters = Scheduler.QueryMapper.filters;
		var filterTokens = [];

		while( tokens.length )
		{
			// Get the leading token
			var tkn = tokens.shift();
			var lastToken = "";
			var possibleMatches = [];
			var matches =  [];

			do
			{
				matches = [];

				// For each of the filters check if they match against the current token
				for( var f = 0; f < filters.length; f++ )
				{
					var match = filters[f].parse( tkn );

					if( match != null )
					{
						matches.push( match );

						if( f == 0 ){
							break;
						}
					}
				}


				//console.log( "Matches with token " + tkn + ": " + matches.length );
				// check if matches is zero
				if( matches.length > 0 )
				{
					// Copy the matches array into the lastMatches array
					possibleMatches = matches.slice();

					if( tokens.length == 0 )
					{
						break;
					}

					// get next token and add to the current token
					lastToken = tokens.shift();
					//console.log( "Got next token: " + lastToken );
					tkn += " " + lastToken;
				}
				else if( lastToken.length > 0 )
				{
					//console.log( "unshifted: " + lastToken );
					tokens.unshift( lastToken );
					lastToken = "";
				}

				// if no more tokens exit
			} while( matches.length != 0 );

			// have array of filters that matches 1 or more tokens
			filterTokens = filterTokens.concat( possibleMatches );

		} 

		return filterTokens;

	},
	
	// Will return an array of tokens
	stringTokenize: function( val )
	{

		var result = [];

		if( typeof val === 'string' )
		{
			val = val
					// Replace multiple commas with single commas
					.replace( /,{2,}/g , "," )			
					// Put spaces around commas to tokenize
					.replace( /,/g, " , " )
					// Remove duplicate spaces
					.replace( /\s{2,}/g , " " )
					.trim()
					// Remove leading and tailing commas
					.replace( /^,\s?|\s?,$/g , "" )
					.toLowerCase();

			if( val.length > 0 )
			{
				result = val.split( ' ' );
			}
		}

		return result;
	},

	makeNewFilter : function ( prototype )
	{
		var obj = JSON.parse( JSON.stringify( prototype ) );
		obj.readOnly = [];

		return obj;
	},
	
	generateFilterObjects : function( input )
	{
		var filterTokens = Scheduler.QueryMapper.filterTokenize( input );
		var result = [ { readOnly : [] } ];
		var pos = 0;
		var minPos = 0;

		// While there are tokens process the filter objects
		while( filterTokens.length )
		{
			var tkn = filterTokens.shift();


			if( tkn.type == 'separator' )
			{
				result.push( { readOnly : [] } );
				minPos = ++pos;
				continue;
			}

			var newFilters = [];


			var canCopy = true;
			// Check each filter for the given property
			for( var i = result.length-1; i >= minPos; i-- )
			{
				// If the filter does not have a readonly flag for the attribute then it is either not a part of the object
				// or has not been changed
				if( $.inArray( tkn.type, result[i].readOnly ) == -1 )
				{
					result[i][tkn.type] = tkn.value;
					result[i].readOnly.push( tkn.type );
					canCopy = false;
				}
				else if( canCopy && result[i][tkn.type] != tkn.value )
				{
					var newFilter = Scheduler.QueryMapper.makeNewFilter( result[i] );
					pos++;
					newFilter[tkn.type] = tkn.value;
					newFilter.readOnly.push( tkn.type );
					newFilters.push( newFilter );
				}
			}

			if( newFilters.length > 0 )
			{
				result = result.concat( newFilters );
			}
		}

		// if the first result has no read only members then there
		// were no matches, return an empty array
		if( result[0].readOnly.length == 0 )
		{
			result = [];
		}

		// Remove the read only attribute from the filter objects
		for( var i = 0; i < result.length; i++ )
		{
			delete result[i].readOnly;
		}

		//console.log( result );

		return result;
	},

	// Inits the query mapper
	init : function()
	{
	

		Scheduler.QueryMapper.addFilter( "separator", Scheduler.QueryMapper._regexIsMember( /(^,$)/ ) );
		Scheduler.QueryMapper.addFilter( "units", Scheduler.QueryMapper._regexIsMember( /^([1-6])\s?(?:units?)?$/ ) );
		Scheduler.QueryMapper.addFilter( "ge code", Scheduler.QueryMapper._regexIsMember( /^(ge\s?[a-e]?[1-5]?)$/ ) );
		Scheduler.QueryMapper.addFilter( "time", Scheduler.QueryMapper._regexIsMember( /^(\d?\d?:?\d?\d\s?[ap]?\.?m?\.?)$/ ) );
		Scheduler.QueryMapper.addFilter( "full day", Scheduler.QueryMapper._regexIsMember( /^((?:mon|tues?|wedn?e?s?|thurs?|fri|satu?r?|sun)(?:day)?)$/ ) );

		Scheduler.QueryMapper.addFilter( "subject", Scheduler.QueryMapper._valueFunction( Scheduler.Courses.is_subject ) );
		Scheduler.QueryMapper.addFilter( "professor", Scheduler.QueryMapper._valueFunction( Scheduler.Courses.is_professor ) );
		Scheduler.QueryMapper.addFilter( "course title", Scheduler.QueryMapper._valueFunction( Scheduler.Courses.is_course_title ) );

	}

};

Scheduler.QueryMapper.init();

