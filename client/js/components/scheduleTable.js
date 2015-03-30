Template.scheduleTable.helpers( {

  // Returns an array with the currently displayed courses in raw form
  "formattedRow" : function() {
    var courses = Session.get( "Scheduler.scheduleCourses" );

    // Get the rows for the current courses
    var rows = Scheduler.Converter.coursesToRows( courses );

    return rows;
  },

  "addCodes" : function () {
    var result = "",
        codes = Scheduler.Schedules.getAddCodes();

    if( codes.length ) {
      result = codes.join( " " );
    }

    return result; 
  }

});

Template.scheduleTable.rendered = function() {
  Scheduler.qTip.updateTips( '.addCodes' );
}

Template.classRow.rendered = function() {
  Scheduler.qTip.updateTips( '.sectionRow' );
}
