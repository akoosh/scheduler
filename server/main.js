Meteor.startup(function () {
    Meteor.methods({
        coursesForQuery: function(query) {
            return "courses for " + query;
        }
    });
});
