// Favorite page helpers
// 3/4/2015
// Arthur Wuterich

Template.favoritePage.events( {

    "click .loadFavoriteSchedule" : function(e,t) {
      Session.set( "currentFavoriteSchedule", this );
      Scheduler.Schedules.generateSchedules( this.classes );
    },

    "click .editFavoriteSchedule" : function(e,t) {
      Scheduler.qTipHelper.clearTips();
      Session.set( "slotSelected", 0 );
      Session.set( "slots", this.slots );
      Session.set( "current_page", "searchPage" );
    },

    "click .renameFavoriteSchedule" : function(e,t) {
      
      var newName = prompt( "Please enter new name", this.name );
      Scheduler.ScheduleManager.removeFavorite( this.name );
      Scheduler.ScheduleManager.setFavorite( newName, this.classes, this.slots );
      Session.set("favoriteSchedules", Scheduler.ScheduleManager.getAllFavorites() );
    },

    "click .deleteFavoriteSchedule" : function(e,t) {
      
      Scheduler.ScheduleManager.removeFavorite( this.name );
      Session.set("favoriteSchedules", Scheduler.ScheduleManager.getAllFavorites() );
    },

    "click .returnToSearch" : function(e,t) {
      Scheduler.qTipHelper.clearTips();
      Session.set( "current_page", "searchPage" );
    },

});

Template.favoritePage.helpers({
  "hasSchedule" : function() {
    var result = Session.get("currentFavoriteSchedule") != undefined;
    return result;
  }
});

Template.favoriteLoader.helpers( {
  favoriteSchedules : function() {
    return Session.get("favoriteSchedules");
  }
});

Template.favoritePage.rendered = function() {
  Session.set("favoriteSchedules", Scheduler.ScheduleManager.getAllFavorites() );
}

Template.favoriteScheduleView.rendered = function() {
  var favoriteSchedule = Session.get( "currentFavoriteSchedule" );

  if( favoriteSchedule ) {
    Scheduler.Schedules.generateSchedules( favoriteSchedule.classes );
  }
}

Template.favoritePageControls.rendered = function() {
  Scheduler.qTipHelper.updateTips( "#favoritePageControls button" );
}

Template.favoriteSchedule.rendered = function() {
  Scheduler.qTipHelper.updateTips( ".favoriteScheduleEntry button" );
}
