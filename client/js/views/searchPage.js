// Main.js
// events and helpers for queryDisplay and courseDisplay templates


Template.searchPage.events ( {
});

Template.searchPage.rendered = function() {

  var containerHeight = $(window).height();
  $( "#searchPageContainer, #pageLoader" ).css( "height", containerHeight );
  $( ".searchResults, .planLayout" ).css( "height", containerHeight-110 );

  Session.set( "Scheduler.searchResults", [] );
}













