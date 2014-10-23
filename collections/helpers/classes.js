// Classes helpers for CoursesModel
// Arthur Wuterich
// 10/22/2014

Scheduler.Classes = {
  // Returns a class object for the provided number
  // return empty array if class is not found
  classForNumber : function(number) {
    result = null;

    // Get the course object
    if( typeof number === "string" ) {
      var course = CoursesModel.find( { 
        classes : { 
          $elemMatch : { 
            number : number 
          } 
        } 
      }).fetch();

      // If the course was found then pull the correct class from the 
      // course object
      if( course.length != 0 ) {
        course = course[0];
        for( c in course.classes ) {
          c = course.classes[c]
          if( c["number"] == number ) {
            result = c;
            break;
          }
        }
      }
    }

    return result;
  },
};
