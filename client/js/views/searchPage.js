// Main.js
// events and helpers for queryDisplay and courseDisplay templates

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
                      Session.set( "Scheduler.searchResults", results );

                      var renderOptions = Session.get( "Scheduler.searchRenderOptions" );

                      // Reset the search view render options
                      if( renderOptions ) {
                        renderOptions.max = 10;
                        renderOptions.courses = {};
                        Session.set( "Scheduler.searchRenderOptions", renderOptions );
                      }
                    }
                });

            }, 200 );
 
        },

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
                return _.pluck(slot.classes, 'number');
            });
            
            Meteor.call("saveSchedule", { name : "generated-"+new Date(), classes : classesArray }, function(err, result) {
              if( result ) {
                Session.set( "Scheduler.currentScheduleId", result );

                if( classesArray.length ) {
                  // Setup the available schedules

                  // Transition to the schedule view
                  Scheduler.Schedules.generateSchedules( classesArray );
                  Scheduler.PageLoader.loadPage( "schedulePage" );
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
  var searchRenderOptions = {
    max : 10,
    courses: { }
  };

  Session.set( "Scheduler.searchRenderOptions", searchRenderOptions );
  Session.set( "Scheduler.searchResults", [] );
}

Template.classButton.rendered = function() {
  Scheduler.qTip.updateTips( '.removeButton' );
}

Template.classDisplay.rendered = function() {
  Scheduler.qTip.updateTips( '.classDisplay * .addButton, .class-icon, .addButton, .loadMoreResults' );
}

Template.planLayout.rendered = function() {
  Scheduler.qTip.updateTips( '#planLayout .info-icon.info-question' );
}

Template.slotDisplay.rendered = function() {
  Scheduler.qTip.updateTips( ".slot-remove, .slot-add, th.name" );
}

Template.planLayoutControls.rendered = function() {
  Scheduler.qTip.updateTips( '.generateButton, .viewFavorites' );
}








