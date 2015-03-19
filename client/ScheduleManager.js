// SchedulerManager
// Stores and retreives schedule information from a unified storage location
// Arthur Wuterich
// 10/22/2014

Scheduler.ScheduleManager = {
  tmpToken : "tmp_classes",
  schedulesKey : "saved_schedules",
  favoriteKey: "__schedule_manager_favorite_schedules",
  prefix : "_schedule_manager_",
  schedules : null,
  self: null,

  "cacheSchedules" : function () {
    if( Scheduler.SchedulerManager.schedules == null ) {
      
    }
  },
    
  // Returns the object saved with scheduler manager
  //  [token]: If not defined will assume to be the tmp token
  "get" : function( token ) {
    if( typeof token === "undefined" ) {
      token = Scheduler.ScheduleManager.tmpToken
    }

    var result = null;
    var raw = localStorage.getItem( Scheduler.ScheduleManager.prefix + token );

    if( raw != null ) {
      result = JSON.parse ( raw );
    }

    return result; 
  },

  // Sets courses for the token provided
  //  [token]: If not defined will assume to be the tmp token
  "set" : function( courses, token ) {
    if( typeof token === "undefined" ) {
      token = Scheduler.ScheduleManager.tmpToken;
    }

    localStorage.setItem( Scheduler.ScheduleManager.prefix + token, JSON.stringify( courses ) );

  },

  // Returns a listing of the schedules stored with the manager
  "list" : function() {
    var result = [];

    for( k in localStorage ) {
      if( k.indexOf( Scheduler.ScheduleManager.prefix ) == 0 ) {
        result.push( {
          "key"  : k.substr(Scheduler.ScheduleManager.prefix.length),
          "name"  : k.substr(Scheduler.ScheduleManager.prefix.length)
        });
      }
    }

    return result;

  },

  // Will take in an array of course identifers ( EX: [2846,1977,1677,1197] ) and save the schedule for future reference
  "saveFavorite" : function(classes) {
    // Get the raw value of the favorites array
    var favorites = localStorage.getItem( Scheduler.ScheduleManager.favoriteKey );
    if( favorites != null ) {
      favorites = JSON.parse( favorites );
    } else {
      favorites = [];
    }

    favorites.push( classes );

    localStorage.setItem( Scheduler.ScheduleManager.favoriteKey, JSON.stringify( favorites ) );
  },

  // Will take in an array of course identifers ( EX: [2846,1977,1677,1197] ) and remove this array from the
  // stored favorites
  "removeFavorite" : function(classes) {
    // Get the raw value of the favorites array
    var favorites = localStorage.getItem( Scheduler.ScheduleManager.favoriteKey );

    // Only perform changes if the favorites array is defined
    if( favorites != null ) {
      favorites = JSON.parse( favorites );
      
      // Find the schedule that matches
      for( var s in favorites ) {
        var found = true;
        for( var c in favorites[s] ) {
          if( favorites[s][c] != classes[c] ) {
            found = false;
            break;
          }
        }

        // Remove the element
        if( found ) {
          favorites.splice( s, 1 ); 
          localStorage.setItem( Scheduler.ScheduleManager.favoriteKey, JSON.stringify( favorites ) );
          break;
        }
      }
    }
  },

  // Returns a listing of the schedules stored with the manager
  "listFavorites" : function() {
    var results = [];
    var favorites = localStorage.getItem( Scheduler.ScheduleManager.favoriteKey );
    if( favorites != null ) {
      favorites = JSON.parse( favorites );
      results = favorites;
    }

    return results;
  },
};











