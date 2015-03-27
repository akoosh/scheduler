// Setup the global Scheduler object
// This is where we will store components for the scheduler application
Scheduler = {
  storageObject : localStorage,
  userStorage : localStorage
}

DEBUG = true;


// Main application startup
Meteor.startup( function() {

  // Setup the user storage container
  Scheduler.userStorage = new Storage();

  // Check to see if the gate page has been accessed before and if so
  // then check to see if the access time has elapsed. If the access time is still
  // valid then let the user into the application without having to reauth
  var accessTime = parseInt( Scheduler.storageObject.getItem("_user_access_token") ),
      accessId = Scheduler.storageObject.getItem("_user_access_id"),
      resultingPage = "ssuGatePage",
      currentDate = new Date();

  // Give the user 10 minutes of access without checking auth
  if( accessTime && currentDate.getTime() - accessTime < ( 1000 * 60 * 10 ) ) {
    resultingPage = "searchPage"

    // Setup storageObject
    if( accessId ) {
      Scheduler.userStorage.loadUserData( accessId );
    }
  }

  Session.set( "current_page", resultingPage );

  // User storage callback after data has been loaded
  Scheduler.userStorage.updateCallback = function() {
    var numberOfFavoriteSchedules = Scheduler.ScheduleManager.listFavorites().length;
  
    Session.set( "numberOfFavoriteSchedules", numberOfFavoriteSchedules );
  }

});

