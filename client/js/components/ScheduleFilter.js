// Scheduler.ScheduleFilter.js
// Cameron Hall

Meteor.startup( function() {

  Scheduler.ScheduleFilter = function(days, startTime, endTime) {
  /*
      //console.log( days, startTime, endTime );
      this.setStartTime(startTime);
      this.setEndTime(endTime);
      this.includedDays = days;

  */
  }

  Scheduler.ScheduleFilter.prototype.setStartTime = function(startTime) {
      this.startTime = Scheduler.Converter.timeStringConvert(startTime);
  }

  Scheduler.ScheduleFilter.prototype.setEndTime = function(endTime) {
      this.endTime = Scheduler.Converter.timeStringConvert(endTime);
  }

  Scheduler.ScheduleFilter.prototype.filterSchedule = function(schedule) {
      for (var Class in schedule) {
          Class = schedule[Class];
      
          if (!this.classPassesFilter(Class)) {
              //console.log("Scheduler.ScheduleFilter: ", Class, "did not pass.");
              return false;
          }
      }

      return true;
  }

  Scheduler.ScheduleFilter.prototype.classPassesFilter = function(Class) {
      if (this.classContainsIncludedDays(Class)) {
          return this.classTimesAreValid(Class);
      }

      return true;
  }

  Scheduler.ScheduleFilter.prototype.classContainsIncludedDays = function(Class) {
      for (var section in Class.sections) {
          section = Class.sections[section];

          if (this.sectionContainsIncludedDays(section)) {
              return true;
          }
      }

      return false;
  }

  Scheduler.ScheduleFilter.prototype.sectionContainsIncludedDays = function(section) {
      for (var meeting in section.times) {
          meeting = section.times[meeting];
          
          var days = this.daysArrayForDaysString(meeting.days);
          
          for (var day in days) {
              day = days[day];

              if (this.includedDays.indexOf(day) != -1) {
                  return true;
              }
          }
      }

      return false;
  }

  Scheduler.ScheduleFilter.prototype.daysArrayForDaysString = function(daysString) {
      var days = [];

      for (var i = 0; i < daysString.length; ++i) {
          var dayCode = daysString.charAt(i);
          
          if (dayCode == "T" && daysString.charAt(i + 1) == "H") {
              dayCode = "TH";
              ++i;
          }

          days.push(dayCode);
      }

      return days;
  }

  Scheduler.ScheduleFilter.prototype.classTimesAreValid = function(Class) {
      for (var section in Class.sections) {
          section = Class.sections[section];

          if (!this.sectionTimesAreValid(section)) {
              //console.log("Scheduler.ScheduleFilter: ", section, " times are not valid.");
              return false;
          }
      }

      return true;
  }

  Scheduler.ScheduleFilter.prototype.sectionTimesAreValid = function(section) {
      for (var meeting in section.times) {
          meeting = section.times[meeting];
              
          var meetingStart = Scheduler.Converter.timeStringConvert(meeting.start_time);
          var meetingEnd = Scheduler.Converter.timeStringConvert(meeting.end_time);
          
          if (!this.timesAreValid(meetingStart, meetingEnd)) {
              return false;
          }
      }

      return true;
  }
      
  Scheduler.ScheduleFilter.prototype.timesAreValid = function(meetingStart, meetingEnd) {
      
      // class must start after the filter's start time and must not end
      // after the filer's end time
      if ((meetingStart > this.startTime) && (meetingEnd < this.endTime)) {
          return true;
      } else {
          //console.log("meetingStart:", meetingStart);
          //console.log("startTime:", this.startTime);
          //console.log("meetingEnd:", meetingEnd);
          //console.log("endTime:", this.endTime);
      }
  }
});
