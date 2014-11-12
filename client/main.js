Template.filterDisplay.helpers( {
  "arrayify_filter" : function(filter) {
    array = [];
    for (var attr in filter) {
      var obj = {};
      obj.key = attr;
      obj.value = filter[attr];
      array.push(obj);
    }
    return array;
  }
});

Template.queryDisplay.helpers( {
  "filter_and_results" : function() {
      var filter_and_results = Session.get("filter_and_results");
      return typeof filter_and_results !== 'undefined' ? filter_and_results : [];
  },
});

Template.queryPage.events( {
        "keyup #query": function() {
            // Clear timout if there is a pending query
            var handler = Session.get("timeoutHander");
            if (typeof handler !== 'undefined') clearTimeout(handler);

            var new_hander = setTimeout( function() {

                var input = $("#query").val();
                Session.set("query", input );
                Meteor.call('coursesForQuery', input, function(err, result) {
                    if ( err === undefined ) {
                        Session.set("filter_and_results", result);
                    }
                });

            }, 500 );
 
            Session.set("timeoutHander", new_hander);
        }
});


