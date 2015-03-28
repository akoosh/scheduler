// Favorite page helpers
// 3/4/2015
// Arthur Wuterich

Template.favoritePage.events( {

    "click .loadFavoriteSchedule" : function(e,t) {
      Session.set( "Scheduler.currentFavoriteScheduleId", this._id );
      Scheduler.Schedules.generateSchedules( this.classes );
      Scheduler.Schedules.renderSchedule();
    },

    "click .editFavoriteSchedule" : function(e,t) {
      Scheduler.qTipHelper.clearTips();
      Session.set( "Scheduler.slotSelected", 0 );
      Session.set( "slots", this.slots );
      Session.set( "Scheduler.currentPage", "searchPage" );
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
      Session.set( "Scheduler.currentFavoriteScheduleId", undefined );
      Session.set( "Scheduler.currentPage", "searchPage" );
    },

});

Template.favoritePage.helpers({
  "hasSchedule" : function() {
    var result = Session.get( "Scheduler.currentFavoriteScheduleId" );

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
