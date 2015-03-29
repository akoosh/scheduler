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

// Entry point for application
Session.set( "Scheduler.currentPage", "searchPage" );

// Resets session variables when the user changes
Tracker.autorun(function() {
  if ( Meteor.userId() ) {
    Session.set( "Scheduler.slots", undefined );
    Session.set( "Scheduler.searchResults", undefined );
  }
});

// Recursive merge of two objects. objA will be modified to contain all of the attributes of objB
// we are only considerate of sub objects and arrays will not be merged. Elements from objB will take
// priority when doing the merge
deepMerge = function( objA, objB ) {
  for( var p in objB ) {
    if( objB.hasOwnProperty(p) ) {
      if( objA.hasOwnProperty(p) && typeof objA[p] === "object" && typeof objB[p] === "object" ) {
        deepMerge( objA[p], objB[p] );
      } else {
        objA[p] = objB[p];
      }
    }
  }
}
