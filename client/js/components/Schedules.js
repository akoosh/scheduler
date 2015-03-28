// Schedule generation controller
// Arthur W
// 10/27/2014

Meteor.startup( function() {

  Scheduler.Schedules = {
    "bucketIterator"  : null,

    // renders a schedule using render packets
    "generateSchedules" : function(classes) {
      if( classes !== undefined ) {
        // Wrap the objects if needed
        if( typeof classes[0] !== "object" ) {
          classes = classes.map( function(ele) { return [ ele ]; } );
        }

        Scheduler.Schedules.bucketIterator = new BucketIterator( classes );
        Session.set( "scheduleCount", Scheduler.Schedules.bucketIterator.size );
      }
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

    // Goes to the prev available schedule
    "prevSchedule" : function() {
     var cPos = Scheduler.Schedules.bucketIterator.position;
      do { 
        Scheduler.Schedules.bucketIterator.dec();
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
      var scheduleContainer = $("#calendar");
      if( scheduleContainer.length ) {
          Session.set( "currentScheduleIndex", Scheduler.Schedules.bucketIterator.position );
          Session.set( "currentSchedule", Scheduler.Schedules.bucketIterator.getCourseArray() );
          Session.set( "scheduleCourses", Scheduler.Schedules.bucketIterator.getSchedule() );

          var schedule = Scheduler.Schedules.bucketIterator.getSchedule();
          var events = Scheduler.Converter.generateEvents( schedule );

          $(scheduleContainer).fullCalendar( "destroy" );
          $(scheduleContainer).fullCalendar({
            defaultView   : "agendaWeek",
            titleFormat   : "",
            header        : false,
            allDaySlot    : false,
            height        : 400,
            columnFormat  : "dddd",
            events : events,
            eventRender: function(event, element) {
                element.qtip({
                  content: {
                    text: event.description,
                    title: event.title + " " + event.code
                  },
                  style : Scheduler.qTipHelper.styles.defaultStyle,
                  show : {
                    solo : true
                  },
                  position: {
                    target: 'mouse', // Track the mouse as the positioning target
                    adjust: { x: 5, y: 5 } // Offset it slightly from under the mouse
                  }
                });
            }
          });
      }
    },
  };

});
