// ScheduleConverter.js: Responsible for converting schedule information into full-calendar and native representations
// Arthur Wuterich
// 2/19/2015

Scheduler.Converter = {
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
            "time_blocks": Scheduler.Converter.generateTimeBlocks( time ),
          });
        }
      }
    }
    return result;
  },

  // Converts the passed time string to military time if applicable
  "timeStringConvert" : function(timeString) {
    var result = Scheduler.Converter.timeStringToInt( timeString );
    if( timeString.search(/pm/gi) != -1 && result < 0.5 ){
      result += 0.5;
    }

    return result;
  },

  // Converts a time string into an integer representaiton on the domain [0,1]
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
        case 3: val += c * 0.41666666666666663; break;

        // #X:##
        case 2: val += c * 0.041666666666666664; break;

        // ##:x#
        case 1: val += c * 0.006944444444444444; break;

        // ##:#x
        case 0: val += c * 0.0006944444444444444; break;
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

  // Returns the integer representation of the hour portion of a time string
  // EX: '12:30 PM' => 12
  "timeStringHour" : function( raw ) {
    var result = 0;
    if( typeof raw == "string" && raw.length > 0 ) {
      raw = raw.split(":");
      result = parseInt(raw[0]);
      if( raw[1].search(/pm/gi) != -1 && result != 12 ){
        result = parseInt(raw[0])+12;
      }
    }
    return result;
  },

  // Returns the integer representation of the minute portion of a time string
  // EX: '12:30 PM' => 30
  "timeStringMinute" : function( raw ) {
    var result = 0;
    if( typeof raw == "string" && raw.length > 0 ) {
      raw = raw.split(":");
      result = parseInt(raw[1]);
    }
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
    var timeString = Scheduler.Converter.parseTimeString( time.days );
    for( day in timeString ) {
      day = timeString[day];
      if( day == "H" ) {
        result[result.length-1].day += day;
        continue;
      }

      start.day( dayToFull[day] );
      end.day( dayToFull[day] );

      start.hour( Scheduler.Converter.timeStringHour( time.start_time ) );
      end.hour( Scheduler.Converter.timeStringHour( time.end_time ) );

      start.minute( Scheduler.Converter.timeStringMinute( time.start_time ) );
      end.minute( Scheduler.Converter.timeStringMinute( time.end_time ) );

      result.push( {
        "day"  : day,
        "start": Scheduler.Converter.timeStringConvert( time.start_time ),
        "end": Scheduler.Converter.timeStringConvert( time.end_time ),
        "mStart" : start.format(),
        "mEnd" : end.format(),
      });
    }
    return result;
  },

  // Returns an array of events based on the passed schedule
  "generateEvents" : function(schedule) {
    var result = [];
    var packets = Scheduler.Converter.generateRenderPackage( schedule );
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

};
