Template.schedulePage.helpers( {
  "scheduleCount" : function() {
    var result = Session.get( "scheduleCount" );
    if( Scheduler.Schedules.bucketIterator == null ) {
      result = 0;
    }
    return result;
  },

  "currentSchedule" : function() {
    var result = Session.get( "currentSchedule" );
    if( Scheduler.Schedules.bucketIterator == null ) {
      result = 0;
    }
    return result;
  },

  "courses" : function() {
    return Session.get( "scheduleCourses" );
  }

});

Template.schedulePage.events( {
  "click #load_mock" : function( e, template ) {
    var id = Session.get( "currentScheduleId" );
    Scheduler.Schedules.generateSchedules( id );
  },

  "click #next_schedule" : function( e, template ) {
    Scheduler.Schedules.nextSchedule(); 
  },
});
