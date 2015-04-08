// Schedule generation controller
// Arthur W
// 10/27/2014

Meteor.startup( function() {

  Scheduler.Schedules = {
    "bucketIterator"  : null,

    // renders a schedule using render packets returns if the generation has returned any valid schedules
    "generateSchedules" : function(classes) {
      var result = false;
      if( classes !== undefined && classes.length ) {

        this.bucketIterator = new BucketIterator( classes );
        result = this.bucketIterator.hasValidSchedules();
        Session.set( "Scheduler.scheduleCount", this.bucketIterator.size );
      }
      return result;
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
        Session.set( "Scheduler.currentSchedule", this.bucketIterator.getCourseArray() );

        var schedule = this.bucketIterator.getSchedule();
        var events = Scheduler.Converter.generateEvents( schedule );

        Scheduler.fullCalendar.render( "#calendar", {
          events : events
        });
      }
    },
  };

});
