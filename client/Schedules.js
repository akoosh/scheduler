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
          });
        }
      }
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
    if( while timeString.length != 0 ) {
      var c = timeString[0];
      timeString = timeString.slice(1);

      // PM case
      switch( timeString.length ) {
        case 3:
          val += 0.5;
        break;

        case 2:
        break;

        case 1:
        break;

        case 0:
        break;
      }
    }

    val = timeString;
    return val;
  },

  // Returns a array of time block objects converted into a general form
  // {time} => [ { day, start, end }, { day, start, end }, ... ]
  // where start and end are in the range [0-1] which represents 00:00 - 23:59
  "generateTimeBlocks" : function( times ) {
    var result = [];
    for( time in times ) {
      time = times[time];
      var timeString = time.days.split("");
      for( day in timeString ) {
        day = timeString[day];
        result.append( {
          "day"  : day,
          "start": 0,
          "end"  : 1
        });
      }
    }
    return result;
  },

  // renders a schedule using render packets
  "renderSchedule" : function( render ) {
  },
};
