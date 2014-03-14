Template.home_page.events( {
	"keyup #query":function(){

		var input = $("#query").val();
		var results = Scheduler.QueryMapper.generateFilterObjects( input );

		$("#results").empty();


		if( !( results instanceof Array ) || results.length <= 0 )
		{
			return null;
		}
		
		for( var i = 0; i < results.length; i++ )
		{
			var text = '';
			for( var attr in results[i] )
			{
				text += attr + " : " +results[i][attr] + ", ";
			}

			var rsl = $("<div>",{
				"text":text,
			});

			$("#results").append( rsl );
		}
	},
});
