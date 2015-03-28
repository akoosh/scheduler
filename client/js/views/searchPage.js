// Main.js
// events and helpers for queryDisplay and courseDisplay templates

Template.queryDisplay.helpers( {
        "queryResults": function() {
            var queryResults = Session.get("queryResults") || [],
                renderOptions = Session.get("searchViewRenderOptions");

            if( renderOptions ) {
              queryResults = queryResults.slice(0,renderOptions.max);
            }

            return queryResults;
        },

        // Returns true if the current searchMinValue is lower than the total number of results
        moreResults : function() {
          var queryResults = Session.get("queryResults"),
              renderOptions = Session.get("searchViewRenderOptions"),
              result = false;

          if( renderOptions && queryResults ) {
            result = queryResults.length>renderOptions.max;
          }

          return result;
        },

    }
);

Template.planLayoutControls.helpers( {
  "generateButtonEnabled" : function() {
    var slots = Session.get("slots") || [], result = "disabled";
  
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
  }

});

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
        },

        "modifiedClasses" : function() {
          
          var result = this.classes || [];

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
    var slots = Session.get( "slots" );
    if( slots ) {
      if( slots[t.data.index] ) {
        slots[t.data.index].isCollapsed = !slots[t.data.index].isCollapsed;
        Session.set( "slots", slots );
      }
    }
  },
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

    if( this.isCollapsed && this.classes.length > 3 ) {
      result = "glyphicon glyphicon-chevron-right";
    }

    return result;
  }
});

Template.searchPage.events ( {
        "keyup #query": function() {
            // Clear timout if there is a pending query
            Template.searchPage.searchTimeoutHandler;
            clearTimeout( Template.searchPage.searchTimeoutHandler );

            Template.searchPage.searchTimeoutHandler = setTimeout( function() {

                var input = $("#query").val();

                Meteor.call('coursesForQuery', input, function(err, results) {
                    if (err === undefined) {
                      $(".searchLayout").animate({ scrollTop: 0 }, "fast");
                      Session.set( "queryResults", results );

                      var renderOptions = Session.get( "searchViewRenderOptions" );

                      // Reset the search view render options
                      if( renderOptions ) {
                        renderOptions.max = 10;
                        renderOptions.courses = {};
                        Session.set( "searchViewRenderOptions", renderOptions );
                      }
                    }
                });

            }, 200 );
 
        },

        "click .addButton": function(e) {
            var slotSelected = Session.get("slotSelected");
            // first time adding class
            if (slotSelected === undefined) {
                slotSelected = 0;
                Session.set("slotSelected", slotSelected);
            }

            var slots = Session.get("slots") || [];

            var curSlot = slots[slotSelected] || { index: slotSelected, classes: [], selectedClasses: {}, isCollapsed : false };

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

            Scheduler.qTipHelper.hideTips();
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

        "click .loadMoreResults": function() {
          var renderOptions = Session.get("searchViewRenderOptions");
          if( renderOptions ) {
            renderOptions.max += 10;

            Scheduler.qTipHelper.clearTips();
            Session.set("searchViewRenderOptions", renderOptions );
          }
        },

        "click .loadMoreClasses": function(e, template) {
          var courseId = $(e.target).attr("course"),
              renderOptions = Session.get("searchViewRenderOptions");

          if( renderOptions && courseId ) {
            if( renderOptions.courses[courseId] === undefined ) {
              renderOptions.courses[courseId] = { max : 4 };
            }

            renderOptions.courses[courseId].max += 4;

            Scheduler.qTipHelper.clearTips();
            Session.set("searchViewRenderOptions", renderOptions );
          }
        },

        "click .logoutButton": function() {
          Session.set( "current_page", "ssuGatePage" );
        },

        "click .viewFavorites": function() {
          var haveFavorites = true;

          if( haveFavorites ) {
            Scheduler.qTipHelper.hideTips();
            Session.set( "current_page", "favoritePage" );
          }
        },

        "click .generateButton": function() {
            var slots = Session.get("slots") || [];
            var classesArray = _.map(slots, function(slot) {
                return _.pluck(slot.classes, 'number');
            });
            
            Meteor.call("saveSchedule", { name : "generated-"+new Date(), classes : classesArray }, function(err, result) {
              if( result ) {
                Session.set( "currentSchedule", result );

                if( classesArray.length ) {
                  // Setup the available schedules

                  // Transition to the schedule view
                  Scheduler.qTipHelper.clearTips();
                  Scheduler.Schedules.generateSchedules( classesArray );
                  Session.set( "current_page", "schedulePage" );
                }
              }
            });
        }
    }
);

Template.searchPage.rendered = function() {
  var containerHeight = $(window).height();
  $( "#searchPageContainer" ).css( "height", containerHeight );
  $( ".searchLayout, .planLayout" ).css( "height", containerHeight-110 );
  // Setup the default view render options
  var searchViewRenderOptions = {
    max : 10,
    courses: { }
  };
  Session.set( "searchViewRenderOptions", searchViewRenderOptions );
}

Template.classButton.rendered = function() {
  Scheduler.qTipHelper.updateTips( '.removeButton' );
}

Template.classDisplay.rendered = function() {
  Scheduler.qTipHelper.updateTips( '.classDisplay * .addButton, .class-icon' );
}

Template.planLayout.rendered = function() {
  Scheduler.qTipHelper.updateTips( '#planLayout .info-icon.info-question' );
}

Template.planLayoutControls.rendered = function() {
  Scheduler.qTipHelper.updateTips( '.generateButton, .viewFavorites' );
}








