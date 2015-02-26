// Classes helpers for CoursesModel
// Arthur Wuterich
// 10/22/2014

Scheduler.Classes = {
  // Returns a class object for the provided number
  // returns object with null classes and courses if not found
  "classForNumber" : function(number) {
    result = {
      "classes" : null,
      "course" : null,
    };

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
          result["course"] = course; 
          result["classes"] = c;
          break;
        }
      }
    }

    return result;
  },
};
