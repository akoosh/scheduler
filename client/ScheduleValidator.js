// ScheduleValidator.js


/* Prototype methods */

ScheduleValidator = function(scheduleFilters) {
    this.scheduleFilters = scheduleFilters;
    this.scheduleFilters.push(new ScheduleFilter()); // testing filter
}

ScheduleValidator.prototype.scheduleIsValid = function(schedule) {
    var validSchedule = this.scheduleHasNoTimeOverlap(schedule) && this.schedulePassesFilters(schedule);

    console.log("scheduleIsValid: ", validSchedule);
    return validSchedule;
}

ScheduleValidator.prototype.scheduleHasNoTimeOverlap = function(courses) {
    var renderPackets = Scheduler.Converter.generateRenderPackage(courses);
    var days = this.daysForRenderPackets(renderPackets);

    var scheduleHasNoTimeOverlap = !this.daysHaveTimeOverlap(days);
    
    console.log("scheduleHasNoTimeOverlap: ", scheduleHasNoTimeOverlap);
    return scheduleHasNoTimeOverlap;
}

ScheduleValidator.prototype.daysForRenderPackets = function(renderPackets) {
    var days = {};

    // Load the corses into a temporary associative array for comparision
    // This is to allow us to reduce the number of comparisons between courses where
    // we only need to check between courses on the same day
    for( packet in renderPackets ) {
        packet = renderPackets[packet];
        for( block in packet.time_blocks ) {
            block = packet.time_blocks[block];

            // If the day has not been generated make it
            if( typeof days[block.day] === "undefined" ) {
                days[block.day] = [];
            } 

            // Add the block to the day
            days[block.day].push( block );
        }
    }
    
    return days;
}

ScheduleValidator.prototype.daysHaveTimeOverlap = function(days) {
    for( day in days ) {
        day = days[day];
        
        if( day.length == 1 ) {
            continue;
        }
        
        for( a in day ) {
            var dayA = day[a];
            
            for( b in day ) {
                var dayB = day[b];
                
                // Don't compare the same course with itself
                if( a==b ) { 
                    continue; 
                }

                // 1D Rect collision
                if(this.daysOverlap(dayA, dayB)) {
                    return true;
                }
            }
        }
    }

    return false;

}

ScheduleValidator.prototype.daysOverlap = function(firstDay, secondDay) {
    var overlap = (firstDay.start < secondDay.end && firstDay.end > secondDay.start) ||
                  (firstDay.end > secondDay.start && firstDay.start < secondDay.end);

    return overlap;
}

ScheduleValidator.prototype.schedulePassesFilters = function(schedule) {
    for (var scheduleFilter in this.scheduleFilters) {
        scheduleFilter = this.scheduleFilters[scheduleFilter];
        console.log(scheduleFilter);        
        if (!scheduleFilter.filterSchedule(schedule)) {
            console.log("schedulePassesFilters: false");
            return false;
        }
    }
    
    console.log("schedulePassesFilters: true");
    return true;
}
