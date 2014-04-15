// Entry source file
// 02/21/2014
// ZT & AW

Scheduler.Entry = {

	// Creates a new entry in the database
	//  plan: id of the plan object
	create : function( plan ){
		EntriesModel.insert( { 
			"plan" : plan
		});
	},

	// Adds the provided course(s) to the given entry
	//  entry: id of the entry object
	//  courses: An single entry id or an array of entry ids
	add_courses : function( entry, courses ){
		
		// Make sure that courses is an array
		courses = courses instanceof Array ? courses : [courses];
		EntriesModel.update( { "_id" : entry }, { $addToSet : { "courses" : { $each : courses } } } );
	},

	remove_course : function( entry, course ){
	},

	delete : function( entry ){
	},

	rename : function( entry, name ){
	},
};
