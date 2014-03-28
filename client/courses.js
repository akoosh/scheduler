Scheduler.Courses = {

	is_course_title: function( title ) {
        rexp = RegExp(title, 'i');
		return CoursesModel.find( { "title": rexp }, { "_id": 1 } ).fetch().length > 0;
	},

	is_professor: function( professor ) {
        rexp = RegExp('^' + professor, 'i');
		return CoursesModel.find( { "classes.sections.professors": rexp }, { "_id": 1 } ).fetch().length > 0;
	}
};

