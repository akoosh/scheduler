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
        Session.set( "Scheduler.scheduleCount", this.bucketIterator.size );
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

    "getAddCodes" : function() {
      return this.bucketIterator.getCourseArray();
    },

    "renderSchedule" : function() {
      var scheduleContainer = $("#calendar");
      if( scheduleContainer.length && this.bucketIterator ) {
          Session.set( "Scheduler.currentScheduleIndex", this.bucketIterator.position );
          Session.set( "Scheduler.currentScheduleId", this.bucketIterator.getCourseArray() );
          Session.set( "Scheduler.scheduleCourses", this.bucketIterator.getSchedule() );

          var schedule = this.bucketIterator.getSchedule();
          var events = Scheduler.Converter.generateEvents( schedule );

          Scheduler.fullCalendar.render( "#calendar", {
            events : events
          });


      }
    },
  };

});
