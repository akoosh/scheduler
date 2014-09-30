Scheduler.Courses = {

    find_by_query: function(query) {
        filter_objects = Scheduler.QueryMapper.generateFilterObjects(query);
        var query_results = [];

        for (var i=0; i < filter_objects.length; ++i) {
            var query_object = {};
            query_object.filter = filter_objects[i];
            query_object.results = this.find_by_filter_object( filter_objects[i] );
            query_results.push( query_object );
        }
        return query_results;
    },

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
        if ( ! _.isEmpty( query_object ) ) {
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
    },

    init: function() {
        Scheduler.QueryMapper.init()
    }
};

Scheduler.Courses.KeyMapper = {
    "units": "units",
    "ge code": "ge_code",
    "subject": "subject",
    "professor": "classes.sections.professors",
    "course title": "title",
    "time": "classes.sections.times.start_time",
    "full day": "classes.sections.times.days"
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
    },

    "time": function(time) {
        var regexResults = time.toUpperCase().match(/(\d\d?):?(\d?\d?)\s?([AP])/);

        var hour = regexResults[1];
        hour = hour.length === 2 ? hour : "0" + hour;

        var minute = regexResults[2];
        minute = minute.length === 2 ? minute : "00";

        var meridian = regexResults[3];
        meridian = meridian.length === 2 ? meridian : meridian + "M";

        return hour + ":" + minute + " " + meridian;
    },

    "full day": function(day) {
        code = day.search(/th/i) === -1 ? day.slice(0,1) : day.slice(0,2);
        return RegExp( code + "((?!" + code + ").)*", 'i');
    }
};

Scheduler.Courses.init()
