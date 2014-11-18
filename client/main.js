Template.queryDisplay.helpers( 
    {
        "queryResults": function() {
            var queryResults = Session.get("queryResults");
            return queryResults || [];
        }
    }
);

Template.courseDisplay.helpers(
    {
        augmentedClasses: function() {
            var outerThis = this;
            return _.map( outerThis.classes, 
                function(cl) { 
                    return _.extend(cl, { subject_with_number: outerThis.subject_with_number } ); 
                }
            );
        }
    }
);

Template.planLayout.helpers( 
    {

        "slots": function() {
            var plan = Session.get("slots");
            return plan || [];
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
        },

        "click .addButton": function() {
            var slotSelected = Session.get("slotSelected") || 0;
            var slots = Session.get("slots") || [];

            var curSlot = slots[slotSelected] || [];

            if (this.classes !== undefined) curSlot = curSlot.concat(this.classes);
            else curSlot.push(this);

            slots[slotSelected] = curSlot;

            Session.set("slots", slots);
        },

        "click .removeButton": function() {
            var slotSelected = Session.get("slotSelected") || 0;
            var slots = Session.get("slots") || [];
            var curSlot = slots[slotSelected] || [];

            var outerThis = this;
            curSlot = _.reject(curSlot, function(ele) { return ele.number === outerThis.number; });

            slots[slotSelected] = curSlot;

            slots = _.reject(slots, function(ele) { return ele.length === 0; });

            Session.set("slots", slots);
        }
    }
);
