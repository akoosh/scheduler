// Setup the global Scheduler object
// This is where we will store components for the scheduler application
Scheduler = { }

DEBUG = true;

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

// Main application startup
Meteor.startup( function() {


});

// Resets session variables when the user changes
Tracker.autorun(function() {
  if ( Meteor.userId() ) {
    Session.set( "Scheduler.slots", undefined );
    Session.set( "Scheduler.searchResults", undefined );
  }
});

