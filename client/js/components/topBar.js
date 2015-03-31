
Template.topBar.helpers({
});

Template.navigationControls.helpers({
  numFavorites : function() {
    var result = "",
        numberFavoriteSchedules = UserFavoriteSchedules.find({}).count();
    
    if( numberFavoriteSchedules ) {
      result = "("+numberFavoriteSchedules+")";
    }

    return result;
  }
});


Template.topBar.events({
  "click .navLink.search" : function(e,t) {
    e.preventDefault();
    Scheduler.PageLoader.loadPage( "searchPage" );
  },

  "click .navLink.favorites" : function(e,t) {
    e.preventDefault();
    Session.set( "Scheduler.currentFavoriteScheduleId", undefined );
    Scheduler.PageLoader.loadPage( "favoritePage" );
  }
});

Template.topBar.rendered = function(){
}





