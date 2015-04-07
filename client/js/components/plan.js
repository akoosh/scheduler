
Meteor.startup( function() {
  Scheduler.Plan = {
     newPlan : function() {
      return { selectedClasses: {}, slots : [], selectedSlot : 0 };
    },

    newSlot : function( name ) {
      var plan = this.getPlan();
      return { index: plan.slots.length, name: name, classes: [], isCollapsed : false };
    },

    getPlan : function() {
      var plan = Session.get("Scheduler.plan");

      if( !plan ) {
        plan = this.newPlan(); 
        Session.set("Scheduler.plan", plan);
      }

      return plan;
    }

  };
});


Template.planLayoutControls.helpers( {
  "generateButtonEnabled" : function() {
    var plan = Session.get("Scheduler.plan"), 
        result = "disabled";
  
    if( plan && plan.slots.length ) {
      result = "";
    }

    return result;
  }, 

  "clearAllSlotsEnabled" : function() {
    var plan = Session.get("Scheduler.plan"), 
        result = "disabled";

    if( plan && plan.slots.length && plan.slots[0].classes.length ) {
      result = "";
    }

    return result;
  }

});

Template.planLayout.helpers( {
        "slots": function() {
          var result = [],
              plan = Session.get("Scheduler.plan");

          if( plan ) {
            result = plan.slots;
          }

          return result;
        }
    }
);

Template.slotDisplay.helpers( {
        
        "slotName": function() {
          var result = "New Slot";
          
          if( this.name && this.index != undefined ) {
            result = this.name;
          }

          if( result.length > 8 ) {
            result = result.substr(0,8) + "...";
          }

          return result;
        },

        "selectedOrEmpty": function() {
            var result = "";
            plan = Session.get("Scheduler.plan");

            if ( !plan || ( plan.selectedSlot === this.index || (this.index === undefined && plan.selectedSlot=== plan.slots.length))) {
                result = "selected";
            }

            return result;
        },

        "modifiedClasses" : function() {
          var result = [];
 
          if( this.classes ) {
            result = ClassesModel.find( { number : { $in : this.classes } },{ sort : { subject_number : 1, subject : 1 } } ).fetch();
          }

          if( this.isCollapsed ) {
            result = result.slice( 0, 0 );
          }

          return result
        },

        "truncated" : function() {
          var result = false;

          return result;
        },

        "hasClasses" : function() {
          var result = false;

          if( this.classes.length ) {
            result = true;
          }

          return result;
        },

        "numberOfClassesLabel" : function() {
          var result = "No Classes";

          if( this.classes.length == 1 ) {
            result = "1 Class";
          } else if( this.classes.length ) {
            result = this.classes.length + " Classes";
          }

          return result;
        }
    }
);

Template.slotCollapse.events( {
  "click .slot-collapse, click .slot-expand" : function(e, t) {
    var plan = Session.get( "Scheduler.plan" );
    if( plan ) {
      if( plan.slots[t.data.index] ) {
        plan.slots[t.data.index].isCollapsed = !plan.slots[t.data.index].isCollapsed;
        Session.set( "Scheduler.plan", plan );
      }
    }
  }
});

Template.slotRemove.events( {
  "click .slot-remove" : function( e, t ) {
    setTimeout( function() {
      var plan = Session.get( "Scheduler.plan" );

      if( plan && t.data && t.data.index != undefined ) {

        // Remove the slot
        var slot = plan.slots.splice( t.data.index, 1 );

        // Recalc indicies
        _.each(plan.slots, function(slot, index) {
          slot.index = index;
        });


        if( slot.length ) {
          _.each( slot[0].classes, function(ele) {
            if( plan.selectedClasses[ele] !== undefined ) {
              delete plan.selectedClasses[ele];
            }
          });
        }
        
        Scheduler.qTip.hideTips();
        Session.set( "Scheduler.plan", plan );
      }   
    }, 0 );
  }
});

Template.planLayout.events( {
  "click .removeButton": function() {
    var self = this;
    setTimeout( function() {
      var plan = Session.get("Scheduler.plan"),
          query = $("#query").val()

      // Remove the class from the buckets
      _.each( plan.slots, function(ele) {
        ele.classes = _.reject( ele.classes, function(c){ return c == self.number; } )
      });

      // Remove any slots that have no classes
      plan.slots = _.reject( plan.slots, function(ele){ return ele.classes.length == 0; } );

      // Reset the selectedSlot if it is over the maximum
      if( plan.selectedSlot >= plan.slots.length ) {
        plan.selectedSlot = plan.slots.length-1;
      }

      delete plan.selectedClasses[self.number];

      Scheduler.qTip.hideTips();
      Session.set("Scheduler.plan", plan);
    }, 0 );
  },

  "click .slotDisplay": function( e, t ) {
    var plan = Session.get("Scheduler.plan");

    if( plan ) {
      if (this.index !== undefined) {
        plan.selectedSlot = this.index;
      } else {
        plan.selectedSlot = plan.slots.length;
      }

      Session.set("Scheduler.plan", plan);
    }
  },
} );

Template.planLayoutControls.events( {
        "click .viewFavorites": function() {
          var haveFavorites = true;

          if( haveFavorites ) {
            Scheduler.PageLoader.loadPage( "favorite" );
          }
        },

        "click .clearAllSlots": function() {
          Session.set( "Scheduler.plan", Scheduler.Plan.newPlan() );
        },

        "click .generateButton": function() {
          var plan = Session.get("Scheduler.plan");

          if( plan ) {
            var classesArray = _.map(plan.slots, function(slot) {
                return slot.classes;
            });

            if( classesArray.length ) {
              // Setup the available schedules

              // Transition to the schedule view
              if( Scheduler.Schedules.generateSchedules( classesArray ) ) {
                Scheduler.PageLoader.loadPage( "schedule" );
              }
            }
          }
        }
});

Template.slotCollapse.helpers( {
  isCollapsedClass : function() {
    var result = "slot-collapse";

    if( this.isCollapsed ) {
      result = "slot-expand";
    }

    return result;
  },

  collapsedGlyph : function() {
    var result = "glyphicon glyphicon-chevron-down";

    if( this.isCollapsed && this.classes.length > 0 ) {
      result = "glyphicon glyphicon-chevron-right";
    }

    return result;
  }
});

Template.planLayout.rendered = function() {
  Scheduler.qTip.updateTips( '#planLayout .info-icon.info-question' );
}

Template.slotDisplay.rendered = function() {
  Scheduler.qTip.updateTips( ".slot-remove, .slot-add, th.name", {     
    position: {
      my: 'top right',  
      at: 'bottom right',
      target: "mouse",
    }  
  });

}

Template.planLayoutControls.rendered = function() {
  Scheduler.qTip.updateTips( '.generateButton, .viewFavorites', {     
    position: {
      my: 'top right',  
      at: 'bottom right',
      target: "mouse",
    }  
  });
}
