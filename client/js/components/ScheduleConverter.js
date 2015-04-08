// ScheduleConverter.js: Responsible for converting schedule information into full-calendar and native representations
// Arthur Wuterich
// 2/19/2015

Meteor.startup( function() {

  Scheduler.Converter = {
    // Converts an array of classes into units of renderable data
    "generateRenderPackage" : function( classes ) {
      var result = [];
      for( var c in classes ) {
        c = classes[c];
        for( var meeting in c.meetings ) {
          meeting = c.meetings[meeting];
          var valid = meeting.start_time != "" && meeting.end_time != "";
          result.push( {
            "info" : c,
            "time" : meeting,
            "valid" : valid,
            "time_blocks": Scheduler.Converter.generateTimeBlocks( meeting ),
          });
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

      console.log( timeString );

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
          case 3: val += c * 0.416666666; break;

          // #X:##
          case 2: val += c * 0.041666666; break;

          // ##:x#
          case 1: val += c * 0.006944444; break;

          // ##:#x
          case 0: val += c * 0.000694444; break;
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

    // Returns an array of events based on the passed schedule.
    // This is used within full-calendar to render time blocks
    "generateEvents" : function(schedule) {
      var result = [];
      var packets = Scheduler.Converter.generateRenderPackage( schedule );
      for(var packet in packets ) {
         packet = packets[packet];

         if( !packet.valid ) {
          continue;
         }

        for( var block in packet.time_blocks ) {
          block = packet.time_blocks[block];
          result.push( {
            title : packet.info.subject_with_number + " " + packet.info.title,
            start : block.mStart,
            end   : block.mEnd,
            description: packet.info.description,
            code: "("+packet.info.number+")"
          });
        }
      }
      return result;
    },

    // Generate a row for display on the scheduler page
    "generateRow": function(c,meeting,dict) {

      var row = {
        "subject_with_number":c.subject_with_number,
        "title":c.title,
        "type":meeting.type,
        "professor":meeting.professor,
        "location":meeting.location,
        "times":Scheduler.Converter.formatTimes( meeting ),
        "units":c.units,
        "id":c.number,
        "description": c.description
      };

      // Removes duplicate row information
      for( var key in row ) {
        if( dict[key] !== undefined && dict[key] == row[key] ) {
          row[key] = "";
        } else {
          dict[key] = row[key];
        }
      }

      return row;
    },

    // Flatten the times array into a single line per time entry for the sectionRow
    "formatTimes" : function( meeting ) {
      var result = meeting.days + " " + meeting.start_time + " - " + meeting.end_time + " ";

      return result;
    },

    // Will return a collection of row elements for display in the schedule template
    // returns an array of objects => [ { }, ..., { } ] which holds data for each row
    // also will remove duplicate row data
    "classesToRows" : function(classes) {
      var result = [], dict = {};

      for( var c in classes ) {
        c = classes[c];
        for( var meeting in c.meetings ) {
          meeting = c.meetings[meeting];
          result.push(Scheduler.Converter.generateRow( c, meeting, dict ) );
        }
      }

      return result;
    },
  };

});















