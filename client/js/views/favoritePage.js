// Favorite page helpers
// 3/4/2015
// Arthur Wuterich

Template.favoritePage.events( {

    "click .loadFavoriteSchedule" : function(e,t) {
      Session.set( "currentFavoriteSchedule", this._id );
      Scheduler.Schedules.generateSchedules( this.classes );
      Scheduler.Schedules.renderSchedule();
    },

    "click .editFavoriteSchedule" : function(e,t) {
      Scheduler.qTipHelper.clearTips();
      Session.set( "slotSelected", 0 );
      Session.set( "slots", this.slots );
      Session.set( "current_page", "searchPage" );
    },

    "click .renameFavoriteSchedule" : function(e,t) {
      var newName = prompt( "Please enter new name", this.name );
      Meteor.call( "updateFavoriteName", this._id, newName );
    },

    "click .deleteFavoriteSchedule" : function(e,t) {
      Meteor.call( "deleteFavorite", this._id );
    },

    "click .returnToSearch" : function(e,t) {
      Scheduler.qTipHelper.clearTips();
      Session.set( "currentFavoriteSchedule", undefined );
      Session.set( "current_page", "searchPage" );
    },

});

Template.favoritePage.helpers({
  "hasSchedule" : function() {
    var result = Session.get( "currentFavoriteSchedule" );

    return result;
  }
});

Template.favoriteLoader.helpers( {
  favoriteSchedules : function() {
    var results = UserFavoriteSchedules.find({}).fetch();
    return results;
  }
});

Template.favoritePageControls.rendered = function() {
  Scheduler.qTipHelper.updateTips( "#favoritePageControls button" );
}

Template.favoriteSchedule.rendered = function() {
  Scheduler.qTipHelper.updateTips( ".favoriteScheduleEntry button" );
}
