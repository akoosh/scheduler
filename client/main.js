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

            var curSlot = slots[slotSelected] || { slotNumber: slotSelected+1, classes: [], selectedClasses: {} };

            var classesToAdd = this.classes !== undefined ? this.classes : [this];
            _.each(classesToAdd, function (cl) {
                if (curSlot.selectedClasses[cl.number] === undefined) {
                    curSlot.selectedClasses[cl.number] = true;
                    curSlot.classes.push(cl);
                }
            });

            slots[slotSelected] = curSlot;

            Session.set("slots", slots);
        },

        "click .removeButton": function() {
            var slotSelected = Session.get("slotSelected") || 0;
            var slots = Session.get("slots") || [];
            var curSlot = slots[slotSelected] || { slotNumber: slotSelected+1, classes: [], selectedClasses: {} };

            // find and remove the appropriate class
            var outerThis = this;
            curSlot.classes = _.reject(curSlot.classes, function(ele) { return ele.number === outerThis.number; });
            delete curSlot.selectedClasses[this.number];

            // update slots with the new curSlot
            slots[slotSelected] = curSlot;

            // remove all slots that contain no classes
            slots = _.reject(slots, function(ele) { return ele.classes.length === 0; });

            // recalculate slot number in case an upper slot was removed
            _.each(slots, function(slot, index) {
                slot.slotNumber = index+1;
            });

            Session.set("slots", slots);
        }
    }
);
