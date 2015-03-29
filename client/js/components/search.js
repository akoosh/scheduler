Template.queryDisplay.helpers( {
        "queryResults": function() {
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
        }

    }
);

Template.searchLayout.events( {
  "click .addButton": function(e, t) {
      var slotSelected = Session.get("Scheduler.slotSelected");

      // first time adding class
      if (slotSelected === undefined) {
          slotSelected = 0;
          Session.set("Scheduler.slotSelected", slotSelected );
      }

      var slots = Session.get("Scheduler.slots") || [],
          query = $("#query").val();

      var next = slotSelected == slots.length;

      var curSlot = slots[slotSelected] || { index: slotSelected, name: query, classes: [], selectedClasses: {}, isCollapsed : false };


      var classesToAdd = this.id !== undefined ? [this] : Session.get( "Scheduler.searchResults" );
      _.each(classesToAdd, function (cl) {
          if (curSlot.selectedClasses[cl.number] === undefined) {
              curSlot.selectedClasses[cl.number] = true;
              curSlot.classes.push(cl);
          }
      });

      slots[slotSelected] = curSlot;

      Session.set("Scheduler.slots", slots);

      if( next ) {
        Session.set("Scheduler.slotSelected", slotSelected+1 );
      }

  },

  "click .loadMoreResults": function() {
    var renderOptions = Session.get("Scheduler.searchRenderOptions");
    if( renderOptions ) {
      renderOptions.max += 10;

      Scheduler.qTip.clearTips();
      Session.set("Scheduler.searchRenderOptions", renderOptions );
    }
  },

  "click .loadMoreClasses": function(e, template) {
    var courseId = $(e.target).attr("course"),
        renderOptions = Session.get("Scheduler.searchRenderOptions");

    if( renderOptions && courseId ) {
      if( renderOptions.courses[courseId] === undefined ) {
        renderOptions.courses[courseId] = { max : 4 };
      }

      renderOptions.courses[courseId].max += 4;

      Scheduler.qTip.clearTips();
      Session.set("Scheduler.searchRenderOptions", renderOptions );
    }
  },

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

Template.searchLayout.rendered = function() {
  var containerHeight = $(window).height();
  $( "#searchPageContainer, #pageLoader" ).css( "height", containerHeight );
  $( ".searchLayout, .planLayout" ).css( "height", containerHeight-110 );

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

