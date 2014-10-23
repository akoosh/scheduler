// Classes helpers for CoursesModel
// Arthur Wuterich
// 10/22/2014

Scheduler.Classes = {
  // Returns a class object for the provided number
  // return empty array if class is not found
  classForNumber : function(number) {
    if( typeof number === "string" ) {
      return CoursesModel.find( { 
        classes : { 
          $elemMatch : { 
            number : number 
          } 
        } 
      }).fetch();
    } else {
      // Return empty array if the input was invalid
      return [];
    }
  },
};
