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

			}, 500 );
 
			Session.set("timeout_handler", new_hander);
		}
}
);
