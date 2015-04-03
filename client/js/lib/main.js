// Setup the global Scheduler object
// This is where we will store components for the scheduler application
Scheduler = { }

DEBUG = true;

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

// Main application startup
Meteor.startup( function() {
  Scheduler.PageLoader.validPages = [ "search", "schedule", "favorite", "about" ];
});

// Entry point for application
Session.set( "Scheduler.currentPage", "searchPage" );

// User login code
Tracker.autorun(function() {
  if ( Meteor.userId() ) {
    Session.set( "Scheduler.plan", undefined );
    Session.set( "Scheduler.searchResults", undefined );
  }
});

// User logout code and landing page code
Deps.autorun(function () {
    if(!Meteor.userId()) {
      // Logout code
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

// Window resize code
window.onresize = function() {
  if( Meteor.userId() ) {
    clearTimeout( window.onresize.timeoutHandle );
    window.onresize.timeoutHandle = setTimeout( function() {
      var containerHeight = $(window).height();
      $( "#searchPageContainer, #pageLoader" ).css( "height", containerHeight );
      $( ".searchResults, .planLayout" ).css( "height", containerHeight-110 );
    }, 50 );
  }
}
