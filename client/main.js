Template.home_page.events( {
	"keyup #query":function(){

		var input = $("#query").val();
		var results = Scheduler.QueryMapper.generateFilterObjects( input );

		console.log( results );

		$("#results").empty();


		if( !( results instanceof Array ) || results.length <= 0 )
		{
			return null;
		}

		// Generate results per filter object
		
		// Render the filter objects
		for( var i = 0; i < results.length; i++ )
		{

			var queryResults = [
				{ 'title' : 'Testing 123', 'subject_with_number' : 'TST101', }, 
				{ 'title' : 'Testing 321', 'subject_with_number' : 'TST102', }, 
				{ 'title' : 'Testing 321', 'subject_with_number' : 'TST102', }, 
				];// QueryMapper.GetResults( results[i] );
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

				var resultText = crs['title'] + ' ' + crs['subject_with_number'];

				var resultRow = $('<div>', {
					'class' : 'result_'+(j%2?'a':'b'),
					'text'	:	resultText,
				});

				rsl.append( resultRow );
			}

			$("#results").append( rsl );
		}
	},
});
