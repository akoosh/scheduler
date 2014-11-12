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
              "name" : c.course.title,
              "unit" : c.course.units,
              "id"   : c.classes.number,
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

  "drawSchedule" : function( renderPackets ) {
    var canvas = $("canvas");
    if( canvas.length == 0 ) {
      return;
    }

    var dayToOffset = function( day ) {
      var result = 0;

      switch( day ) {
        case "M":
          result = 1;
          break;

        case "T":
          result = 2;
          break;

        case "W":
          result = 3;
          break;

        case "TH":
          result = 4;
          break;

        case "F":
          result = 5;
          break;

        case "S":
          result = 6;
          break;
      }

      return result;
    };

    var startToY = function( val ) {
      return Math.floor( val * canvas.height() );
    };

    var rangeToSize = function( begin, end ) {
      return Math.floor( (end-begin)*canvas.height() );
    };

    canvas.clearCanvas();
    canvas.removeLayers();

    var hasDrawn = false;

    // Draw BG image
    canvas.drawImage({
      "layer": true,
      "source": "/image/schedule.200.500.png",
      "fromCenter": false,
      "index": 0,
      "load": function() {
        if( !hasDrawn ) {
          hasDrawn = true;
          canvas.drawLayers();
        }
      },
    });

    for( packet in renderPackets ) {
      packet = renderPackets[packet];
      for( block in packet.time_blocks ) {
        block = packet.time_blocks[block];
        var x = 50*dayToOffset( block.day ) + 3;
        var y = startToY( block.start );
        var width = 44;
        var height = rangeToSize( block.start, block.end );
        canvas.drawRect({
          "layer": true,
          "fillStyle": '#8891FF',
          "group": ["days"],
          "x": x, 
          "y": y,
          "width": width,
          "height": height,
          "fromCenter": false,
          "cornerRadius": 2,
          "strokeStyle": '#000',
          "strokeWidth": 2,
          "mouseover": function(layer){
            $(this).animateLayer(layer, {
              "fillStyle": '#6974FF',
            }, 100);
          },
          "mouseout": function(layer){
            $(this).animateLayer(layer, {
              "fillStyle": '#8891FF',
              "rotate": "+=45",
            }, 100);
          },

          "data": {
            "id": packet.info.id,
          },
        });
      }
    }


  },

  // renders a schedule using render packets
  "generateSchedules" : function( key ) {
    Scheduler.Schedules.bucketIterator = new BucketIterator( Scheduler.ScheduleManager.get( key ) );

    Session.set( "scheduleCount", Scheduler.Schedules.bucketIterator.size );
    Scheduler.Schedules.renderSchedule();
  },

  // Goes to the next available schedule
  "nextSchedule" : function() {
    Scheduler.Schedules.bucketIterator.inc();
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
    // If the schedule was found then render the schedule
    if( schedule !== null ) {
      // Generate render packets for the schedule
      var renderPackets = Scheduler.Schedules.generateRenderPackage( schedule );

      // Generate the schedule using the render packes
      Scheduler.Schedules.drawSchedule( renderPackets );
    }
  },
};

