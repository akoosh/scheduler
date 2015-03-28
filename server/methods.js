
Meteor.startup( function() {
  Meteor.methods({
      coursesForQuery: function(query) {
          return QueryProcessing.coursesForString(query);
      },

      saveFavorite : function( favorite ) {
        if( this.userId && favorite ) {
          var favoriteSchedule = {
            createdBy : this.userId,
            name      : favorite.name,
            classes   : favorite.classes,
            slots     : favorite.slots
          };

          UserFavoriteSchedules.insert( favoriteSchedule );
        }
      },

      saveSchedule : function( schedule ) {
        result = undefined;

        if( this.userId && schedule ) {
          var schedule = {
            createdBy : this.userId,
            name      : schedule.name,
            classes   : schedule.classes
          };

          result =  ScheduleModel.insert( schedule );
          
        }

        return result;
      },

      updateFavoriteName : function( favoriteId, newName ) {
        if( this.userId && favoriteId && newName ) {
          UserFavoriteSchedules.update( favoriteId, { $set : { name : newName } } );
        }
      },

      deleteFavorite : function( favoriteId ) {
        if( this.userId && favoriteId ) {
          UserFavoriteSchedules.remove( favoriteId );
        }
      }
  });
});
