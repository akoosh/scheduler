
Template.planLayoutControls.helpers( {
  "generateButtonEnabled" : function() {
    var slots = Session.get("Scheduler.slots") || [], 
        result = "disabled";
  
    if( slots.length ) {
      result = "";
    }

    return result;
  }, 

  "favoritesButtonEnabled" : function() {
    var condition = UserFavoriteSchedules.findOne(), 
        result = "disabled";
  
    if( condition ) {
      result = "";
    }

    return result;
  },

  "clearAllSlotsEnabled" : function() {
    var slots = Session.get("Scheduler.slots") || [], 
        result = "disabled";

    if( slots.length && slots[0].classes.length ) {
      result = "";
    }

    return result;
  }

});

Template.planLayout.helpers( {

        "slots": function() {
            var plan = Session.get("Scheduler.slots");
            return plan || [];
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
            var slotSelected = Session.get("Scheduler.slotSelected");
            var slots = Session.get("Scheduler.slots") || [];

            if (slotSelected === this.index || (this.index === undefined && slotSelected === slots.length)) {
                result = "selected";
            }

            return result;
        },

        "modifiedClasses" : function() {
          var result = [];
 
          if( this.classes ) {
            result = ClassesModel.find( { number : { $in : this.classes } } ).fetch();
          }

          if( this.isCollapsed ) {
            result = result.slice( 0, 0 );
          }

          return result
        },

        "truncated" : function() {
          var result = this.isCollapsed;

          return result;
        },

        "hasMoreClasses" : function() {
          var result = false;

          if( this.isCollapsed ) {
            result = this.classes.length > 0 && false;
          }

          return result;
        },

        "numberOfClasses" : function() {
          var result = 0;

          if( this.classes ) {
            result = this.classes.length;
          }

          return result;
        }
    }
);

Template.slotCollapse.events( {
  "click .slot-collapse, click .slot-expand" : function(e, t) {
    var slots = Session.get( "Scheduler.slots" );
    if( slots ) {
      if( slots[t.data.index] ) {
        slots[t.data.index].isCollapsed = !slots[t.data.index].isCollapsed;
        Session.set( "Scheduler.slots", slots );
      }
    }
  }
});

Template.slotRemove.events( {
  "click .slot-remove" : function( e, t ) {
    var slots = Session.get( "Scheduler.slots" );

    if( slots && t.data && t.data.index != undefined ) {

      // Remove the slot
      slots.splice( t.data.index, 1 );

      // Recalc indicies
      _.each(slots, function(slot, index) {
      slot.index = index;
      });

      Session.set( "Scheduler.slots", slots );
    }   
  }
});

Template.planLayout.events( {
  "click .removeButton": function() {
      var slotSelected = Session.get("Scheduler.slotSelected") || 0,
          slots = Session.get("Scheduler.slots") || [],
          query = $("#query").val();

      var curSlot = slots[slotSelected] || { index: slotSelected, name: "slot", classes: [], selectedClasses: {}, isCollapsed : false };

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

      Scheduler.qTip.hideTips();
      Session.set("Scheduler.slots", slots);
  },

  "click .slotDisplay": function( e, t ) {
      if (this.index !== undefined) {
          Session.set("Scheduler.slotSelected", this.index);
          Session.set("Scheduler.slotClicked", this.index);
      } else {
          var slots = Session.get("Scheduler.slots") || [];
          Session.set("Scheduler.slotSelected", slots.length);
      }
  },
} );

Template.planLayoutControls.events( {
        "click .viewFavorites": function() {
          var haveFavorites = true;

          if( haveFavorites ) {
            Scheduler.PageLoader.loadPage( "favoritePage" );
          }
        },

        "click .clearAllSlots": function() {
          Session.set( "Scheduler.slotSelected", 0 );
          Session.set("Scheduler.slotClicked", -1 );
          Session.set( "Scheduler.slots", [] );
        },

        "click .generateButton": function() {
          var slots = Session.get("Scheduler.slots") || [];
          var classesArray = _.map(slots, function(slot) {
              return slot.classes;
          });

          if( classesArray.length ) {
            // Setup the available schedules

            // Transition to the schedule view
            Scheduler.Schedules.generateSchedules( classesArray );
            Scheduler.PageLoader.loadPage( "schedulePage" );
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
