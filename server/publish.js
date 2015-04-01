

// Only return course data if the user is logged into the system
Meteor.publish( "courseData", function() {
  var result = undefined;

  // Make sure the user is authorized to view the scheduler course data by checking the
  // username against the Students collection. We take the MD5 of the username
  // which should match an entry in the collection.
  if( this.userId ) {
    var user = Meteor.users.findOne( this.userId );
    if( user ) {
      if( Students.findOne( { "id" : CryptoJS.MD5(user.username).toString() } ) ) {
        result = CoursesModel.find();
      }
    }
  }

  return result;
});

Meteor.publish( "classData", function() {
  var result = undefined;

  if( this.userId ) {
    var user = Meteor.users.findOne( this.userId );
    if( user ) {
      if( Students.findOne( { "id" : CryptoJS.MD5(user.username).toString() } ) ) {
        result = ClassesModel.find();
      }
    }
  }

  return result;
});

Meteor.publish( "userSchedules", function() {
  var result = undefined;

  if( this.userId ) {
    result = ScheduleModel.find( { createdBy : this.userId } );
  }

  return result;
});

Meteor.publish( "userFavoriteSchedules", function() {
  var result = undefined;

  if( this.userId ) {
    result = UserFavoriteSchedules.find( { createdBy : this.userId } );
  }

  return result;
});
