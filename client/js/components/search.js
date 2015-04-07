Template.classDisplay.helpers( {
  "addDisabled" : function(e,t) {
    var result = "",
        plan = Session.get( "Scheduler.plan" );

    if( plan ) {
      if( plan.selectedClasses[this.number] !== undefined ) {
        result = "disabled";
      }
    }

    return result;
  }
});
Template.queryDisplay.helpers( {
        queryResults: function() {
            var queryResults = Session.get("Scheduler.searchResults") || [],
                renderOptions = Session.get("Scheduler.searchRenderOptions");

            if( renderOptions ) {
              queryResults = queryResults.slice(0,renderOptions.max);
            }

            return queryResults;
        },

        // Returns true if the current searchMinValue is lower than the total number of results
        moreResults : function() {
          var queryResults = Session.get("Scheduler.searchResults"),
              renderOptions = Session.get("Scheduler.searchRenderOptions"),
              result = false;

          if( renderOptions && queryResults ) {
            result = queryResults.length>renderOptions.max;
          }

          return result;
        },

        hasResults : function() {
          var result = false,
              queryResults = Session.get("Scheduler.searchResults");

          if( queryResults && queryResults.length ) {
            result = true;
          }

          return result;
        },

        addAllDisabled : function() {
          var result       = '',
              queryResults = Session.get("Scheduler.searchResults"),
              plan         = Session.get("Scheduler.plan");

          if( plan && queryResults ) {
            var classNumbers = _.pluck( queryResults, "number" );

            // If size of the difference from class numbers and selected class numbers is 0 then there are no classes we can possibly add 
            // so disable the add all button
            if( _.difference( classNumbers, _.keys( plan.selectedClasses ) ).length == 0 ) {
              result = "disabled";
            }
          }

          return result;
        }

    }
);

Template.searchResults.events( {
  "click .addButton": function(e, t) {
    var plan = Session.get("Scheduler.plan") || Scheduler.Plan.newPlan(),
        query = $("#query").val();
        classes = this.meetings ? [ this ] : Session.get( "Scheduler.searchResults" ),
        hasAddedClasses = false,
        hasAddedSlotOffset = 0,
        self = this;

    // Add the slot if needed
    if( plan.slots[plan.selectedSlot] === undefined ) {
      hasAddedSlotOffset = 1;
      plan.slots.push( Scheduler.Plan.newSlot( query ) );
    }

    // Add each class to the current slot
    _.each( classes, function(ele) {
      if( plan.selectedClasses[ele.number] === undefined ) {
        plan.selectedClasses[ele.number] = hasAddedClasses = true;
        plan.slots[plan.selectedSlot].classes.push( ele.number );
      }
    });

    // If we added to the end of the list then auto-inc the slot
    if( hasAddedClasses && plan.selectedSlot == plan.slots.length - hasAddedSlotOffset ) {
      plan.selectedSlot++;
    }

    Scheduler.qTip.hideTips();
    Session.set("Scheduler.plan", plan);
  },

  "click .loadMoreResults": function() {
    var renderOptions = Session.get("Scheduler.searchRenderOptions");
    if( renderOptions ) {
      renderOptions.max += 10;

      Scheduler.qTip.clearTips();
      Session.set("Scheduler.searchRenderOptions", renderOptions );
    }
  }

} );



Template.classDisplay.helpers( {

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

Template.searchResults.rendered = function() {

  // Setup the default view render options
  var searchRenderOptions = {
    max : 10,
    courses: { }
  };

  Session.set( "Scheduler.searchRenderOptions", searchRenderOptions );
}

Template.classButton.rendered = function() {
  Scheduler.qTip.updateTips( ".removeButton", {     
    position: {
      my: 'top right',  
      at: 'bottom right',
      target: "mouse",
    }  
  });
}

Template.classDisplay.rendered = function() {
  Scheduler.qTip.updateTips( '.classDisplay * .addButton, .class-icon, .addButton, .loadMoreResults' );
}

