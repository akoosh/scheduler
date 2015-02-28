// Schedule generation controller
// Arthur W
// 10/27/2014

Scheduler.Schedules = {
  "bucketIterator"  : null,

  // renders a schedule using render packets
  "generateSchedules" : function( key ) {
    Scheduler.Schedules.bucketIterator = new BucketIterator( Scheduler.ScheduleManager.get( key ) );

    Session.set( "scheduleCount", Scheduler.Schedules.bucketIterator.size );
    Scheduler.Schedules.renderSchedule();
  },

  // Goes to the next available schedule
  "nextSchedule" : function() {
   var cPos = Scheduler.Schedules.bucketIterator.position;
    do { 
      Scheduler.Schedules.bucketIterator.inc();
      if( Scheduler.Schedules.bucketIterator.position == cPos ) {
        break;
      }
    } while( !Scheduler.Schedules.bucketIterator.isValid() );
    Scheduler.Schedules.renderSchedule();
  },

  // Goes to the requsted schedule
  "gotoSchedule" : function(pos) {
    Scheduler.Schedules.bucketIterator.setPosition( pos );
    Scheduler.Schedules.renderSchedule();
  },

  "renderSchedule" : function() {
    Session.set( "currentSchedule", Scheduler.Schedules.bucketIterator.position );
    Session.set( "scheduleCourses", Scheduler.Schedules.bucketIterator.getSchedule() );
    var schedule = Scheduler.Schedules.bucketIterator.getSchedule();
    var events = Scheduler.Converter.generateEvents( schedule );
    $('#calendar').fullCalendar( "destroy" );
    $('#calendar').fullCalendar({
      "defaultView"   : "agendaWeek",
      "titleFormat"   : "",
      "header"        : false,
      "allDaySlot"    : false,
      "height"        : 800,
      "columnFormat"  : "dddd",
      "events" : events,
    });
  },
};

