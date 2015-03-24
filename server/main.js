// Main meteor server functions
Meteor.startup(function () {
    process.env.JASMINE_CLIENT_UNIT = 0;
    Meteor.methods({
        coursesForQuery: function(query) {
            return Scheduler.Courses.coursesForString(query);
        }
    });
});
