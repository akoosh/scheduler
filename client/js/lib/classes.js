// Classes helpers for CoursesModel
// Arthur Wuterich
// 10/22/2014

Meteor.startup( function() {
  Scheduler.Classes = {
    // Returns a class object for the provided number
    // returns object with null classes and courses if not found
    classForNumber : function(number) {
      var result = {};

      // Get the course object/s that have a class that contains the 
      // class with the provided class number
      var course = CoursesModel.find( { 
        classes : { 
          $elemMatch : { 
            number : String(number)
          } 
        } 
      }).fetch();

      // If the course was found then pull the correct class from the 
      // course object
      if( course.length ) {
        course = course[0];
        for( c in course.classes ) {
          c = course.classes[c]

          if( c["number"] == number ) {
            // Wrap the information we want to carry over into the class object from the course object
            result = this.mergeCourseClass( course, c );
            break;
          }
        }
      }

      return result;
    },

    // Will return a new object with a combination of data from the course and class objects
    "mergeCourseClass" : function( course, classes ) {
      var result = {};

      result["title"] = course.title;
      result["units"] = course.units;
      result["id"] = classes.number;
      result["subject_with_number"] = course.subject_with_number;
      result["sections"] = classes.sections;
      result["description"] = course.description;

      return result;
    },
  };
});
