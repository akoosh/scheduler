// Setup the global Scheduler object
// This is where we will store components for the scheduler application
Scheduler = { }

DEBUG = true;

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

// Main application startup
Meteor.startup( function() {

  var entryPage = "searchPage";
  Session.set( "current_page", entryPage );

});

// Resets session variables when the user changes
Tracker.autorun(function() {
  if ( Meteor.userId() ) {
    Session.set( "slots", undefined );
    Session.set( "queryResults", undefined );
  }
});

