// schedulePage.js: Events and helpers for the schedulePage
// Arthur Wuterich

Template.schedulePageControls.helpers( {
  // Returns the number of schedules that have been generated
  "scheduleCount" : function() {
    var result = Session.get( "scheduleCount" );
    if( Scheduler.Schedules.bucketIterator == null ) {
      result = 0;
    }
    return result;
  },

  // Returns the index of the current schedule
  "currentSchedule" : function() {
    var result = Session.get( "currentScheduleIndex" );
    if( Scheduler.Schedules.bucketIterator == null ) {
      result = 0;
    }
    return result;
  }

});

Template.schedulePage.events( {
  "click #next_schedule" : function( e, template ) {
    Scheduler.Schedules.nextSchedule(); 
  },

  "click #prev_schedule" : function( e, template ) {
    Scheduler.Schedules.prevSchedule(); 
  },

  "click #save_schedule" : function(e,template) {
    var name = prompt( "Please enter favorite schedule name", "Favorite Schedule " + new Date() );
    Scheduler.ScheduleManager.setFavorite( name, Session.get( "currentSchedule" ), Session.get("slots") );
    Session.set( "favoriteSchedules", Scheduler.ScheduleManager.listFavorites() );
  },

  "click #back_to_search" : function(e,template) {
    Scheduler.qTipHelper.clearTips();
    Session.set( "current_page", "searchPage" );
  },
});

Template.schedulePageTable.helpers( {

  // Returns an array with the currently displayed courses in raw form
  "formattedRow" : function() {
    var courses = Session.get( "scheduleCourses" );

    // Get the rows for the current courses
    var rows = Scheduler.Converter.coursesToRows( courses );

    return rows;
  }

});

Template.schedulePage.rendered = function() {
  var scheduleId = Session.get( "currentScheduleId" );
  if( scheduleId ) {
    Scheduler.Schedules.generateSchedules( scheduleId );
  } else {
    Session.set( "current_page", "searchPage" );
  }
}

Template.schedulePageControls.rendered = function() {
  Scheduler.qTipHelper.updateTips( 'button' );
}

Template.schedulePageInteractionControls.rendered = function() {
  Scheduler.qTipHelper.updateTips( 'button' );
}

Template.sectionRow.rendered = function() {
  Scheduler.qTipHelper.updateTips( '.sectionRow' );
}







