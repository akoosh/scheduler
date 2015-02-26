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
  "courses" : function() {
    return Session.get( "scheduleCourses" );
  },

  // Return an array of the add codes for the currently displayed corses
  "addCodes" : function() {
    return Session.get( "addCodes" ).join(" ");
  }  
});

Template.schedulePage.events( {
  "click #next_schedule" : function( e, template ) {
    Scheduler.Schedules.nextSchedule(); 
  }
});

Template.sectionRow.helpers( {
  // Flatten the times array into a single line per time entry for the sectionRow
  "formatTimes" : function( times, options ) {
    var result = "";
    for( time in times ) {
      time = times[time];
      result += time.days + " " + time.start_time + " - " + time.end_time + " ";
    }
    return result;
  },
});


