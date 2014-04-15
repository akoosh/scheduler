Meteor.startup(function () {
	Meteor.methods({
		coursesForQuery: function(query) {
			return Scheduler.Courses.find_by_query(query);
		}
	});
});
