Template.queryDisplay.helpers( 
    {
        "queryResults": function() {
            var queryResults = Session.get("queryResults");
            return queryResults || [];
        }
    }
);

Template.queryPage.events (
    {
        "keyup #query": function() {
            // Clear timout if there is a pending query
            var handler = Session.get("timeoutHander");
            if (typeof handler !== 'undefined') clearTimeout(handler);

            var new_hander = setTimeout( function() {

                var input = $("#query").val();

                Meteor.call('coursesForQuery', input, function(err, results) {
                    if (err === undefined) {
                        Session.set("queryResults", results);
                    }
                });

            }, 500 );
 
            Session.set("timeoutHander", new_hander);
        }
    }
);
