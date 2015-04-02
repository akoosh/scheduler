Template.favoriteTable.events({
    "click .loadFavoriteSchedule" : function(e,t) {
      Session.set( "Scheduler.currentFavoriteScheduleId", this._id );
      Scheduler.Schedules.generateSchedules( this.classes );
      Scheduler.Schedules.renderSchedule();
    },

    "click .editFavoriteSchedule" : function(e,t) {
      Session.set( "Scheduler.slotSelected", 0 );
      Session.set( "Scheduler.slots", this.slots );
      Scheduler.PageLoader.loadPage( "search" );
    },

    "click .renameFavoriteSchedule" : function(e,t) {
      var newName = prompt( "Please enter new name", this.name );
      Meteor.call( "updateFavoriteName", this._id, newName );
    },

    "click .deleteFavoriteSchedule" : function(e,t) {
      Meteor.call( "deleteFavorite", this._id );
    }
});

Template.favoriteTable.rendered = function() {
  Scheduler.qTip.updateTips( ".favoriteScheduleEntry button" );
}
