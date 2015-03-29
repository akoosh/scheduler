// schedulePage.js: Events and helpers for the schedulePage
// Arthur Wuterich

Template.schedulePageControls.helpers( {
  // Returns the number of schedules that have been generated
  "scheduleCount" : function() {
    var result = Session.get( "Scheduler.scheduleCount" );

    if( Scheduler.Schedules.bucketIterator == null ) {
      result = 0;
    }

    return result;
  },

  // Returns the index of the current schedule
  "currentSchedule" : function() {
    var result = Session.get( "Scheduler.currentScheduleIndex" );

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

  "click .saveFavorite" : function(e,template) {
    var name = prompt( "Please enter favorite schedule name", "Favorite Schedule " + new Date() );
    Meteor.call( "saveFavorite", { name : name, classes: Session.get( "Scheduler.currentScheduleId" ), slots : Session.get("Scheduler.slots") } );
  },

  "click .scheduleButton" : function(e,template) {
    Scheduler.PageLoader.loadPage( "searchPage" );
  },

  "click .gotoFavoriteView" : function(e,template) {
    Scheduler.PageLoader.loadPage( "favoritePage" );
  }
});

Template.schedulePageTable.helpers( {

  // Returns an array with the currently displayed courses in raw form
  "formattedRow" : function() {
    var courses = Session.get( "Scheduler.scheduleCourses" );

    // Get the rows for the current courses
    var rows = Scheduler.Converter.coursesToRows( courses );

    return rows;
  }

});

Template.schedulePage.rendered = function() {
  Scheduler.Schedules.generateSchedules();
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







