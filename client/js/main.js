// Setup the global Scheduler object
// This is where we will store components for the scheduler application
Scheduler = {}

DEBUG = true;


// Main application startup
Meteor.startup( function() {

  // Check to see if the gate page has been accessed before and if so
  // then check to see if the access time has elapsed. If the access time is still
  // valid then let the user into the application without having to reauth
  var accessToken = parseInt( localStorage.getItem("_user_access_token") ),
      resultingPage = "ssuGatePage",
      currentDate = new Date();

  // Give the user 10 minutes of access without checking auth
  if( accessToken && currentDate.getTime() - accessToken < ( 1000 * 60 * 10 ) ) {
    resultingPage = "searchPage"
  }

  Session.set( "current_page", resultingPage );
});

