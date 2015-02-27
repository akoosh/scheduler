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


});

Template.schedulePage.events( {
  "click #next_schedule" : function( e, template ) {
    Scheduler.Schedules.nextSchedule(); 
  }
});

// I am declaring this method this way to allow other templates, and template helpers, 
// to find this function and provide this functionality
// Checks with a static dictionary to prevent values from being repeated
// The logic is simple: if the previous value was experianced before return the empty string
// else return the value and update the static dictionary
Template.registerHelper( "removeDuplicate", function( value, key, ctx ) {

    // Make sure the session dict is available; else create it
    if( Template.sectionRow.dict === undefined )  {
      Template.sectionRow.dict = {};
    }

    // Check the dict for the key and then check if the value is the same
    if( Template.sectionRow.dict[key] !== undefined && Template.sectionRow.dict[key] == value ) {
        value = "";
    } else {
      Template.sectionRow.dict[key] = value;
    }

    return value; 
});

Template.sectionRow.rendered = function() {
    // Use the remove duplicate method if it is available
    Template.sectionRow.dict = {};
}

Template.sectionRow.helpers( {
  // Flatten the times array into a single line per time entry for the sectionRow
  "formatTimes" : function( times, options ) {
    var result = "";
    for( time in times ) {
      time = times[time];
      result += time.days + " " + time.start_time + " - " + time.end_time + " ";
    }

    // Use the remove duplicate method if it is available
    if( typeof Blaze._globalHelpers["removeDuplicate"] === "function") {
      result = Blaze._globalHelpers["removeDuplicate"]( result, "time" );
    }

    return result;
  },

});


