// Schedules page handler
// Arthur W
// 10/27/2014

Scheduler.Schedules = {
  "bucketIterator" : null,

  // Converts an array of classes into units of renderable data
  "generateRenderPackage" : function( classes ) {
    var result = [];
    for( c in classes ) {
      c = classes[c];
      for( section in c.classes.sections ) {
        section = c.classes.sections[section];
        for( time in section.times ) {
          time = section.times[time];
          result.push( {
            "info" : {
              "name"    : c.course.title,
              "unit"    : c.course.units,
              "id"      : c.classes.number,
              "subject" : c.course.subject_with_number,
            },
            "time" : time,
            "time_blocks": Scheduler.Schedules.generateTimeBlocks( time ),
          });
        }
      }
    }
    return result;
  },

  // Converts the passed time string to military time if applicable
  "timeStringConvert" : function(timeString) {
    var result = Scheduler.Schedules.timeStringToInt( timeString );
    if( timeString.search(/pm/gi) != -1 && result < 0.5 ){
      result += 0.5;
    }

    return result;
  },

  "timeStringToInt" : function(timeString) {
    var val = 0;

    // Clean the input
    timeString = timeString.trim();
    timeString = timeString.replace( /\D/gi, "" );

    // Remove leading zeros
    while( timeString.charAt( 0 ) == "0" ) {
      timeString = timeString.slice(1);
    }

    // Consume time string to build value
    while( timeString.length != 0 ) {
      var c = parseInt( timeString[0] );
      timeString = timeString.slice(1);

      switch( timeString.length ) {
        // X#:##
        case 3:
          val += c * 0.41666666666666663;
        break;

        // #X:##
        case 2:
          val += c * 0.041666666666666664;
        break;

        // ##:x#
        case 1:
          val += c * 0.006944444444444444;
        break;

        // ##:#x
        case 0:
          val += c * 0.0006944444444444444;
        break;
      }
    }

    // Clamp val in the range [0, 1]
    if( val < 0 ) {
      val = 0;
    } else if( val > 1 ) {
      val = 1;
    }

    return Math.round( val * 10000 ) / 10000;
  },

  // Generates time string tokens
  "parseTimeString" : function( times ) {
    var result = [];
    times = times.split("");

    for( time in times ) {
      time = times[time];

      // Handle special cases
      // Add the h to Thursday days
      if( time == "H" ) {
        result[result.length-1] += "H";
        continue;
      }

      result.push( time );
    }

    return result;
  },

  "timeStringHour" : function( raw ) {
    var result = 0;
    raw = raw.split(":");
    result = parseInt(raw[0]);
    if( raw[1].search(/pm/gi) != -1 && result != 12 ){
      result = parseInt(raw[0])+12;
    }
    return result;
  },

  "timeStringMinute" : function( raw ) {
    var result = 0;
    raw = raw.split(":");
    result = parseInt(raw[1]);
    return result;

  },

  // Returns a array of time block objects converted into a general form
  // {time} => [ { day, start, end }, { day, start, end }, ... ]
  // where start and end are in the range [0-1] which represents 00:00 - 23:59
  "generateTimeBlocks" : function( time ) {
    var result = [];
    var dayToFull = {
      "M" : "Monday",
      "T" : "Tuesday",
      "W" : "Wednesday",
      "TH" : "Thursday",
      "F" : "Friday",
      "S" : "Saturday",
    };
    var start = moment().seconds(0), end = moment().seconds(0);
    // Moment.js date time formatting for fullCalendar
    var timeString = Scheduler.Schedules.parseTimeString( time.days );
    for( day in timeString ) {
      day = timeString[day];
      if( day == "H" ) {
        result[result.length-1].day += day;
        continue;
      }

      start.day( dayToFull[day] );
      end.day( dayToFull[day] );

      start.hour( Scheduler.Schedules.timeStringHour( time.start_time ) );
      end.hour( Scheduler.Schedules.timeStringHour( time.end_time ) );

      start.minute( Scheduler.Schedules.timeStringMinute( time.start_time ) );
      end.minute( Scheduler.Schedules.timeStringMinute( time.end_time ) );

      result.push( {
        "day"  : day,
        "start": Scheduler.Schedules.timeStringConvert( time.start_time ),
        "end": Scheduler.Schedules.timeStringConvert( time.end_time ),
        "mStart" : start.format(),
        "mEnd" : end.format(),
      });
    }
    return result;
  },

  /*
  "drawSchedule" : function( renderPackets ) {

    // Create a renderer object
    var renderer = new ScheduleRenderer( "canvas" ) ;

    if( renderer != null ) {
      renderer.clear();
      renderer.drawBackground();
      renderer.drawPackets( renderPackets );
    }
  },
  */

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

  "generateEvents" : function(schedule) {
    var result = [];
    var packets = Scheduler.Schedules.generateRenderPackage( schedule );
    for(var packet in packets ) {
       packet = packets[packet];
      for( var block in packet.time_blocks ) {
        block = packet.time_blocks[block];

        result.push( {
          "title" : packet.info.subject + " " + packet.info.name,
          "start" : block.mStart,
          "end"   : block.mEnd,
        });
      }
    }
    return result;
  },

  "renderSchedule" : function() {
    Session.set( "currentSchedule", Scheduler.Schedules.bucketIterator.position );
    Session.set( "addCodes", Scheduler.Schedules.bucketIterator.getCourseArray() );
    Session.set( "scheduleCourses", Scheduler.Schedules.bucketIterator.getSchedule() );
    var schedule = Scheduler.Schedules.bucketIterator.getSchedule();
    var events = Scheduler.Schedules.generateEvents( schedule );
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
    /*
    // If the schedule was found then render the schedule
    if( schedule !== null ) {
      // Generate render packets for the schedule

      // Generate the schedule using the render packes
      Scheduler.Schedules.drawSchedule( renderPackets );
    }
    */
  },
};

