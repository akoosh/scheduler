// Main.js
// events and helpers for queryDisplay and courseDisplay templates

Template.queryDisplay.helpers( {
        "queryResults": function() {
            var queryResults = Session.get("queryResults");
            return queryResults || [];
        }
    }
);

Template.courseDisplay.helpers( {

        // Adds the subject_with_number field to the classes objects
        "augmentedClasses": function() {
            var outerThis = this;
            return _.map( outerThis.classes, 
                function(cl) { 
                    return _.extend(cl, { subject_with_number: outerThis.subject_with_number } ); 
                }
            );
        },

        "geCodes": function() {
          var result = [];

          // TODO: split the GE codes to be displayed as individual icons
          if( this.ge_code != "" ) {
            var formattedGeCode = this.ge_code.replace( "GE", "" );
            result.push( formattedGeCode );
          }

          return result;
        }
    }
);

Template.planLayout.helpers( {

        "slots": function() {
            var plan = Session.get("slots");
            return plan || [];
        }
    }
);

Template.slotDisplay.helpers( {
        
        "slotNumber": function() {
            var slots = Session.get("slots") || [];
            var nextSlot = slots.length + 1;
            return this.index !== undefined ? this.index + 1 : nextSlot;
        },

        "selectedOrEmpty": function() {
            var result = "";
            var slotSelected = Session.get("slotSelected");
            var slots = Session.get("slots") || [];

            if (slotSelected === this.index || (this.index === undefined && slotSelected === slots.length)) {
                result = "selected";
            }

            return result;
        }
    }
);

Template.queryPage.events ( {
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

        "click .addButton": function(e) {
            var slotSelected = Session.get("slotSelected");
            // first time adding class
            if (slotSelected === undefined) {
                slotSelected = 0;
                Session.set("slotSelected", slotSelected);
            }

            var slots = Session.get("slots") || [];

            var curSlot = slots[slotSelected] || { index: slotSelected, classes: [], selectedClasses: {} };

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
            var curSlot = slots[slotSelected] || { index: slotSelected, classes: [], selectedClasses: {} };

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
                slot.index = index;
            });

            Session.set("slots", slots);
        },

        "click .slotDisplay": function() {
            if (this.index !== undefined) {
                Session.set("slotSelected", this.index);
            }
            else {
                var slots = Session.get("slots") || [];
                Session.set("slotSelected", slots.length);
            }
        },

        "click .generateButton": function() {
            var slots = Session.get("slots") || [];
            var classesArray = _.map(slots, function(slot) {
                return _.pluck(slot.classes, 'number');
            });

            Scheduler.ScheduleManager.set(classesArray, "plan");

            // Setup the available schedules
            Session.set( "availableSchedules", Scheduler.ScheduleManager.list() );
        }
    }
);

Template.courseDisplay.qTipTimeout = 0;
Template.courseDisplay.rendered = function() {
  clearTimeout( Template.courseDisplay.qTipTimeout );
  Template.courseDisplay.qTipTimeout = setTimeout( function() {
    $('[title]').qtip("destroy");
    $('[title]').qtip({
      style : {
        classes : Scheduler.render.qTipClasses
      }
    });
  }, 50 );
}











