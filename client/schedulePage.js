// schedulePage.js: Events and helpers for the schedulePage
// Arthur Wuterich

Template.schedulePage.helpers( {
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
    var result = Session.get( "currentSchedule" );
    if( Scheduler.Schedules.bucketIterator == null ) {
      result = 0;
    }
    return result;
  },

  // Returns an array with the currently displayed courses in raw form
  "formattedRow" : function() {
    var courses = Session.get( "scheduleCourses" );

    // Get the rows for the current courses
    var rows = Scheduler.Converter.coursesToRows( courses );

    return rows;
  },

});

Template.schedulePage.events( {
  "click #next_schedule" : function( e, template ) {
    Scheduler.Schedules.nextSchedule(); 
  }
});


Template.sectionRow.helpers( {
});


