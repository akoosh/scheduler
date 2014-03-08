Template.home_page.events( {
	"keyup #query":function(){

		var input = $("#query").val();
		var results = Scheduler.QueryMapper.filterTokenize( input ) ;


		if( !( results instanceof Array ) || results.length <= 0 )
		{
			return null;
		}

		$("#results").empty();

		for( var result in results )
		{
			var text = "Type: " + results[result].type + ", Value: " + results[result].value;
			var rsl = $("<div>",{
				"text":text,
			});

			$("#results").append( rsl );
		}

	},
});
