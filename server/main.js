// Main meteor server functions
Meteor.startup(function () {
    Meteor.methods({
        coursesForQuery: function(query) {
            return Scheduler.Courses.coursesForString(query);
        }
    });
});
