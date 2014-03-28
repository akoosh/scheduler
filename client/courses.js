Scheduler.Courses = {

	is_course_title: function( title ) {
		return CoursesModel.find( { "title": /^title/i }, { "_id": 1 } ).fetch().length > 0;
	},

	is_professor: function( professor ) {
		return db.Courses.find( { "classes.sections.professors": /^professor/i }, { "_id": 1 } ).fetch().length > 0;
	}
};

