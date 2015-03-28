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

        this.bucketIterator = new BucketIterator( classes );
        Session.set( "scheduleCount", this.bucketIterator.size );
      }
    },

    // Goes to the next available schedule
    "nextSchedule" : function() {
     var cPos = this.bucketIterator.position;
      do { 
        this.bucketIterator.inc();
        if( this.bucketIterator.position == cPos ) {
          break;
        }
      } while( !this.bucketIterator.isValid() );
      this.renderSchedule();
    },

    // Goes to the prev available schedule
    "prevSchedule" : function() {
     var cPos = this.bucketIterator.position;
      do { 
        this.bucketIterator.dec();
        if( this.bucketIterator.position == cPos ) {
          break;
        }
      } while( !this.bucketIterator.isValid() );
      this.renderSchedule();
    },

    // Goes to the requsted schedule
    "gotoSchedule" : function(pos) {
      this.bucketIterator.setPosition( pos );
      this.renderSchedule();
    },

    "renderSchedule" : function() {
      var scheduleContainer = $("#calendar");
      if( scheduleContainer.length && this.bucketIterator ) {
          Session.set( "currentScheduleIndex", this.bucketIterator.position );
          Session.set( "currentSchedule", this.bucketIterator.getCourseArray() );
          Session.set( "scheduleCourses", this.bucketIterator.getSchedule() );

          var schedule = this.bucketIterator.getSchedule();
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
