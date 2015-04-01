// Favorite page helpers
// 3/4/2015
// Arthur Wuterich

Template.favoritePage.events( {
});

Template.favoritePage.helpers({
  "hasSchedule" : function() {
    var result = Session.get( "Scheduler.currentFavoriteScheduleId" );

    return result;
  }
});

Template.favoriteTable.helpers( {
  favoriteSchedules : function() {
    var results = UserFavoriteSchedules.find({}).fetch();
    return results;
  }
});

Template.favoritePageControls.rendered = function() {
  Scheduler.qTip.updateTips( "#favoritePageControls button" );
}

Template.favoritePage.rendered = function() {
  Session.set( "Scheduler.currentFavoriteScheduleId", undefined );
}
