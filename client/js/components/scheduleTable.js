Template.scheduleTable.helpers( {

  // Returns an array with the currently displayed courses in raw form
  "formattedRow" : function() {
    var classes = Session.get( "Scheduler.currentSchedule" ),
        rows = [];

    if( classes ) {
      // Get the rows for the current courses
      
      classes = ClassesModel.find( { number : { $in : classes } } ).fetch();

      if( classes.length ) {
        rows = Scheduler.Converter.classesToRows( classes );
      }
    }

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
