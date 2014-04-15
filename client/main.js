Template.filter_display.arrayify_filter = function(filter) {
    array = [];
    for (var attr in filter) {
        var obj = {};
        obj.key = attr;
        obj.value = filter[attr];
        array.push(obj);
    }
    return array;
}

Template.query_display.filter_and_results = function() {
	var filter_and_results = Session.get("filter_and_results");
	return typeof filter_and_results !== 'undefined' ? filter_and_results : [];
}

Template.query_page.events( 
    {
		"keyup #query": function() {
			var handler = Session.get("timeout_handler");
			if (typeof handler !== 'undefined') clearTimeout(handler);

			var new_hander = setTimeout( function() {

				var input = $("#query").val();
				var query_objects = Scheduler.Courses.find_by_query( input );
				Session.set("filter_and_results", query_objects);

			}, 2000 );
 
			Session.set("timeout_handler", new_hander);
		}
		/*

			$("#results").empty();

			if( !( results instanceof Array ) || results.length <= 0 )
			{
				return null;
			}

			// Generate results per filter object
			
			// Render the filter objects
			for( var i = 0; i < results.length; i++ )
			{

				var queryResults = Scheduler.Courses.find_by_filter_object( results[i] );
				var filterText = '';

				// Generate a name for the filter
				for( var attr in results[i] )
				{
					filterText += attr + " : " +results[i][attr] + ', ';
				}

				filterText += queryResults.length + ' results';

				// Create the filter object
				var rsl = $("<div>",{
					'class' :	'filter',
					'text'	:	filterText,
				});

				// For each result add a result row if there are any queryResults
				for( var j = 0; j < queryResults.length; j++ )
				{
					var crs = queryResults[j];

					var resultText = crs['title'] + ', ' + crs['subject_with_number'];

					var resultRow = $('<div>', {
						'class' : 'result_'+(j%2?'a':'b'),
						'text'	:	resultText,
					});

					rsl.append( resultRow );
				}

				$("#results").append( rsl );
			}
		},
	*/
    }
);
