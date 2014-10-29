// Schedules page handler
// Arthur W
// 10/27/2014

Scheduler.Schedules = {
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
              "name" : c.course.title,
              "unit" : c.course.units,
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

  // Returns a array of time block objects converted into a general form
  // {time} => [ { day, start, end }, { day, start, end }, ... ]
  // where start and end are in the range [0-1] which represents 00:00 - 23:59
  "generateTimeBlocks" : function( time ) {
    var result = [];

    var timeString = Scheduler.Schedules.parseTimeString( time.days );
    for( day in timeString ) {
      day = timeString[day];
      if( day == "H" ) {
        result[result.length-1].day += day;
        continue;
      }

      result.push( {
        "day"  : day,
        "start": Scheduler.Schedules.timeStringConvert( time.start_time ),
        "end": Scheduler.Schedules.timeStringConvert( time.end_time ),
      });
    }
    return result;
  },

  "generateSchedule" : function( renderPackets ) {
    var dayToOffset = function( day ) {
      var result = 0;

      switch( day ) {
        case "M":
          result = 0;
          break;

        case "T":
          result = 1;
          break;

        case "W":
          result = 2;
          break;

        case "TH":
          result = 3;
          break;

        case "F":
          result = 4;
          break;

        case "S":
          result = 5;
          break;
      }

      return result;
    };

    var canvas = $("canvas");
    for( packet in renderPackets ) {
      packet = renderPackets[packet];
      for( block in packet.time_blocks ) {
        block = packet.time_blocks[block];
        console.log( block );
        canvas.drawRect({
          fillStyle: '#000',
          x: 50*dayToOffset( block.day ), 
          y: 0,
          width: 49,
          height: 10
        });
      }
    }
  },

  // renders a schedule using render packets
  "renderSchedule" : function( key ) {
    // Get the schedule from storage
    var schedule = Scheduler.ScheduleManager.get( key );

    // If the schedule was found then render the schedule
    if( schedule !== null ) {
      // Generate render packets for the schedule
      var renderPackets = Scheduler.Schedules.generateRenderPackage( schedule );

      // Generate the schedule using the render packets
      Scheduler.Schedules.generateSchedule( renderPackets );
    }
    
  },
};
