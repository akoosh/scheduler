Template.schedule_page.helpers( {
  "var" : function(name) {
    var result = Session.get( name );
    if( Scheduler.Schedules.bucketIterator == null ) {
      result = 0;
    }

    return result;
  },

  "courses" : function() {
    return Session.get( "scheduleCourses" );
  }

});

Template.schedule_page.events( {
  "click #load_mock" : function( e, template ) {
    Scheduler.Schedules.generateSchedules( "mock" );
  },

  "click #next_schedule" : function( e, template ) {
    Scheduler.Schedules.nextSchedule(); 
  },
});
