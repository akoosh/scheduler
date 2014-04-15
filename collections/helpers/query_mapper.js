// Query Mapper source file
// 02/28/2014
// ZT & AW

Scheduler.QueryMapper = {
	PRIORITY: { NORMAL: 0, HIGH: 1 },
	timeoutHandle : 0,

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
	Filter : function( category, isMember, priority ){
		this.category = category;
		this.isMember = isMember;
		this.priority = typeof priority !== 'undefined' ? priority : Scheduler.QueryMapper.PRIORITY.NORMAL;
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
					"priority":this.priority,
					"value" : result,
				};
			}

			return null;

		}
	},
	
	addFilter : function( category, isMember, priority )
	{
		var filter = new Scheduler.QueryMapper.Filter( category, isMember, priority );
		Scheduler.QueryMapper.filters.push( filter );
		
	},

	// Filters that are loaded at runtime
	filters : [],

	// Returns an array of matches for a given collection of filters
	filterTokenize : function( input ){
		var tokens = this.stringTokenize( input );
		var filters = this.filters;
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
				// If there are matches then process the matches
				if( matches.length > 0 )
				{
					// Get the highest priority in the matches array
					var highestPriority = 0;

					for( var i = 0; i < matches.length; i++ )
					{
						console.log( matches[i] );
						if( matches[i].priority > highestPriority )
						{
							highestPriority = matches[i].priority;
						}
					}

					// Remove all matches that have lower priority
					for( var i = 0; i < matches.length; i++ )
					{
						if( matches[i].priority < highestPriority )
						{
							matches.splice( i--, 1 );
						}
					}

					// Copy the matches array into the lastMatches array
					possibleMatches = matches.slice();

					// If we do not have any more tokens then exit the loop
					if( tokens.length == 0 )
					{
						break;
					}

					// get next token and add to the current token
					lastToken = tokens.shift();

					//console.log( "Got next token: " + lastToken );
					tkn += " " + lastToken;
				}
				
				// If we had no matches and the last token has been defined then reinsert the last token before exiting loop
				if( matches.length == 0 && lastToken.length > 0 )
				{
					//console.log( "unshifted: " + lastToken );
					tokens.unshift( lastToken );
					lastToken = "";
				}

				// If there were no matches exit the loop
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
				if( ! _.contains( result[i].readOnly, tkn.type ) )
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
	
		Scheduler.QueryMapper.addFilter( "separator", this._regexIsMember( /(^,$)/ ), this.PRIORITY.HIGH );
		Scheduler.QueryMapper.addFilter( "units", this._regexIsMember( /^([1-6])\s?(?:units?)?$/ ) );
		Scheduler.QueryMapper.addFilter( "ge code", this._regexIsMember( /^(ge\s?[a-e]?[1-5]?)$/ ), this.PRIORITY.HIGH );
		Scheduler.QueryMapper.addFilter( "time", this._regexIsMember( /^(\d?\d?:?\d?\d\s?[ap]?\.?m?\.?)$/ ) );
		Scheduler.QueryMapper.addFilter( "full day", this._regexIsMember( /^((?:mon|tues?|wedn?e?s?|thurs?|fri|satu?r?|sun)(?:day)?)$/ ) );

		Scheduler.QueryMapper.addFilter( "subject", this._valueFunction( Scheduler.Courses.is_subject ), this.PRIORITY.HIGH );
		Scheduler.QueryMapper.addFilter( "professor", this._valueFunction( Scheduler.Courses.is_professor ) );
		Scheduler.QueryMapper.addFilter( "course title", this._valueFunction( Scheduler.Courses.is_course_title ) );

	}

};

