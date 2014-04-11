Template.home_page.events( 
    {
		"keyup #query": function() {
			var handler = Session.get("timeout_handler");
			if (typeof handler !== 'undefined') clearTimeout(handler);

			var new_hander = setTimeout( function() {

				var input = $("#query").val();
				var filter_objects = Scheduler.QueryMapper.generateFilterObjects( input );
				console.log(filter_objects);
				var query_display = [];

				for (var i=0; i < filter_objects.length; ++i) {
					var display_object = {};
					display_object.filters = filter_objects[i];
					display_object.results = Scheduler.Courses.find_by_filter_object( filter_objects[i] );
					query_display.push( display_object );
				}

				Session.set("query_display", query_display);

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
