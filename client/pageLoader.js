// pageLoader.js: Helpers and events for the page loader wrapper template
// PageLoader template allows us to change and template without a page refresh
// Arthur Wuterich

Template.pageLoader.rendered = function() {

  // Mock schedule
  Scheduler.ScheduleManager.set( [ [ 2846, 2676, 2678 ], [ 1977, 1799 ], [ 1397, 1677 ], [ 1197, 3735, 1637 ] ], "mock" );

  // Setup the available schedules
  Session.set( "availableSchedules", Scheduler.ScheduleManager.list() );

  // Setup the available favorites
  Session.set( "favoriteSchedules", Scheduler.ScheduleManager.listFavorites() );

}

Template.pageLoader.helpers( {
  // Attempts to load the template provided by its name
  "loadPage" : function(name) {
    var page = Session.get("current_page");
    if( typeof page === "undefined" ) {
      page = "queryPage";
      Session.set( "current_page", page );
    }

    return { template: Template[page] };
  },

  // Returns the array of available schedules
  "schedules" : function() {
    return Session.get( "availableSchedules" );
  },

  // Returns the array of available schedules
  "numberOfFavorites" : function() {
    var result = Session.get( "favoriteSchedules" ).length;

    // Return the result if it exists
    return result ? result : 0;
  },
});

Template.pageLoader.events( {

  // Transition events
  "mouseup #schedule_transition" : function() {
    Session.set( "current_page", "schedulePage" );
  },

  "mouseup #course_transition" : function() {
    Session.set( "current_page", "queryPage" );
  },

  // Sets the current displayed schedule to the 'key' attr of the calling object
  // side-effect: Will change the current template to the schedule page
  "mouseup .setSchedule" : function( e, template ) {
    var id = $(e.target).attr("key");
    if( id ) {
      Session.set( "currentScheduleId", id );
      Session.set( "current_page", "schedulePage" );
      setTimeout( function() {
        Scheduler.Schedules.generateSchedules( id );
      }, 200 );
    }
  },

  "mouseup .viewFavorites" : function( e, template ) {
    console.log( "Load the favorites view" );
    /*
    var id = $(e.target).attr("key");
    Session.set( "currentScheduleId", id );
    Session.set( "current_page", "schedulePage" );
    setTimeout( function() {
      Scheduler.Schedules.generateSchedules( id );
    }, 200 );
    */
  },
});
