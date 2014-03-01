// Query Mapper source file
// 02/28/2014
// ZT & AW

Scheduler.QueryMapper = {
	
	// Filter object for the filets
	Filter : function( category, regex ){
		this.category = category;
		this.regex = regex;
		this.parse = function( input )
		{
			var results = input.match( regex );
			if( results instanceof Array && results.length > 0 )
			{
				
				return { "cat": this.category, "match": results[0], "value" : results[1]  };
			}

			return null;
		}

	},
	
	// Filters that are loaded at runtime
	filters : [],

	// Returns an array of matches for a given collection of filters
	parse : function( input ){
		var matches = [];
		for( filter in Scheduler.QueryMapper.filters )
		{
				var result = Scheduler.QueryMapper.filters[filter].parse( input );

			if( result )
			{
				 matches.push( result );
			}
		}

		return matches;
	},

	// Inits the query mapper
	init : function()
	{
		Scheduler.QueryMapper.filters.push( new Scheduler.QueryMapper.Filter( "units" ,/\b([1-6])\s?units?\b/ ) );
//		Scheduler.QueryMapper.filters.push( new Scheduler.QueryMapper.Filter( "time" ,/\b[1-6]\s?units?\b/ ) );
		Scheduler.QueryMapper.filters.push( new Scheduler.QueryMapper.Filter( "ge code" ,/\b(?:ge)?\s?([a-e][1-5]?)\s?(?:ge)?\b/ ) );
		Scheduler.QueryMapper.filters.push( new Scheduler.QueryMapper.Filter( "subject_with_number",/\b((?:[a-z]{2,4})?\s?\d{3})\b/ ) );
	}

};

Scheduler.QueryMapper.init();

