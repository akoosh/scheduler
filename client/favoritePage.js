// Favorite page helpers
// 3/4/2015
// Arthur Wuterich

Template.favoritePage.events( {
    "click #next_favorite_schedule" : function(e,t) {
      var schedules = Session.get("favoriteSchedules");
      var index = Session.get( "favoritePosition" );
      var max = Session.get( "favoriteCount" );

      console.log( index, max );
      if ( index >= max-1 ) {
        index = 0;
      } else {
        index++;
      }


      console.log( index, max );
      Session.set( "favoritePosition", index );
      Session.set( "currentSchedule", index+1 );
      Scheduler.Schedules.generateSchedules( schedules[index] );
    }
});

Template.favoritePage.rendered = function() {
  var schedules = Session.get("favoriteSchedules");
  Session.set( "favoritePosition", 0 );
  Session.set( "favoriteCount", schedules.length );
  Scheduler.Schedules.generateSchedules( schedules[0] );
}
