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
  "click .nextSchedule" : function( e, template ) {
    Scheduler.Schedules.nextSchedule(); 
  },

  "click .prevSchedule" : function( e, template ) {
    Scheduler.Schedules.prevSchedule(); 
  },

  "click .getAddCodes" : function(e,template) {
  },

  "click .saveFavorite" : function(e,template) {
    var name = prompt( "Please enter favorite schedule name", "Favorite Schedule " + new Date() );
    if( name ) {
      Meteor.call( "saveFavorite", { name : name, classes: Session.get( "Scheduler.currentSchedule" ), slots : Session.get("Scheduler.slots") } );
    }
  },

  "click .exportSchedule" : function(e,template) {
    alert( Scheduler.Schedules.getAddCodes() );
  }
});

Template.schedulePage.rendered = function() {
//  Scheduler.Schedules.generateSchedules();
}

Template.schedulePageControls.rendered = function() {
  Scheduler.qTip.updateTips( 'button' );
}

Template.schedulePageInteractionControls.rendered = function() {
  Scheduler.qTip.updateTips( 'button' );
}








