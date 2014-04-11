Scheduler.Courses = {

	build_query: function( filter_object ) {
		query_object = {}
		for (var key in filter_object) {
			if (filter_object.hasOwnProperty(key) && key in this.KeyMapper) {
				query_object[this.KeyMapper[key]] = this.ValueMapper[key](filter_object[key]);
			}
		}
		return query_object;
	},

	find_by_filter_object: function( filter_object ) {
		query_object = this.build_query(filter_object);
		if ( ! $.isEmptyObject( query_object ) ) {
			return CoursesModel.find( query_object ).fetch();
		}
		else return [];
	},

	is_course_title: function( title ) {
		if (title.length < 3) return false;
		rexp = RegExp(title, 'i');
		return CoursesModel.find( { "title": rexp }, { "_id": 1 } ).fetch().length > 0;
	},

	is_professor: function( professor ) {
		rexp = RegExp('^' + professor, 'i');
		return CoursesModel.find( { "classes.sections.professors": rexp }, { "_id": 1 } ).fetch().length > 0;
	},

	is_subject: function ( subject ) {
		return CoursesModel.find( { "subject": subject.toUpperCase() }, {"_id": 1} ).fetch().length > 0;
	}
};

Scheduler.Courses.KeyMapper = {
	"units": "units",
	"ge code": "ge_code",
	"subject": "subject",
	"professor": "classes.sections.professors",
	"course title": "title"
};

Scheduler.Courses.ValueMapper = {

	"units": function(units) {
		return RegExp(units);
	},

	"ge code": function(ge_code) {
		return RegExp(ge_code.replace(' ', ''), 'i');
	},

	"course title": function(course_title) {
		return RegExp(course_title, 'i');
	},

	"professor": function(professor) {
		return RegExp( '^' + professor, 'i');
	},

	"subject": function(subject) {
		return subject.toUpperCase();
	}
};

