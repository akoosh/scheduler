Scheduler.Courses = {

	is_course_title: function( title ) {
		return CoursesModel.find( { "title": title } ).fetch().length > 0;
	}
};

