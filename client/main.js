// Stuff
Template.home_page.events( {
	"keydown #query":function(){
		var results = Scheduler.QueryMapper.parse( $("#query").val() );

		if( !( results instanceof Array ) || results.length <= 0 )
		{
			return null;
		}

		$("#results").empty();

		console.log( results );

		for( var result in results )
		{
			var text = "Category: " + results[result].cat + ", Match: " + results[result].match + ", Value: " + results[result].value;
			var rsl = $("<div>",{
				"text":text,
			});

			$("#results").append( rsl );
		}
		
	},
});
