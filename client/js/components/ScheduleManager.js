// SchedulerManager
// Stores and retreives schedule information from a unified storage location
// Arthur Wuterich
// 10/22/2014

Meteor.startup( function() {

  Scheduler.ScheduleManager = {
    tmpToken : "tmp_classes",
    schedulesKey : "saved_schedules",
    favoriteKey: "__schedule_manager_favorite_schedules",
    prefix : "_schedule_manager_",
    storageObject : localStorage,
    schedules : null,

    "cacheSchedules" : function () {
      if( Scheduler.SchedulerManager.schedules == null ) {
        
      }
    },
      
    // Returns the object saved with scheduler manager
    //  [token]: If not defined will assume to be the tmp token
    "get" : function( token ) {
      if( typeof token === "undefined" ) {
        token = this.tmpToken
      }

      var result = null;
      var raw = localStorage.getItem( this.prefix + token );

      if( raw != null ) {
        result = JSON.parse ( raw );
      }

      return result; 
    },

    // Sets courses for the token provided
    //  [token]: If not defined will assume to be the tmp token
    "set" : function( courses, token ) {
      if( typeof token === "undefined" ) {
        token = this.tmpToken;
      }

      localStorage.setItem( this.prefix + token, JSON.stringify( courses ) );

    },

    // Returns a listing of the schedules stored with the manager
    "list" : function() {
      var result = [];

      for( k in localStorage ) {
        if( k.indexOf( this.prefix ) == 0 ) {
          result.push( {
            "key"  : k.substr(this.prefix.length),
            "name"  : k.substr(this.prefix.length)
          });
        }
      }

      return result;

    },

    // Will take in an array of course identifers ( EX: [2846,1977,1677,1197] ) and save the schedule for future reference
    "setFavorite" : function(name, classes, slots ) {
      // Get the raw value of the favorites array
      var favorites = localStorage.getItem( this.favoriteKey ),
          favoriteSchedule = {
            name : name,
            classes : classes,
            slots : slots
          };
      if( favorites != null ) {
        favorites = JSON.parse( favorites );
      } else {
        favorites = [];
      }

      favorites.push( favoriteSchedule );

      localStorage.setItem( this.favoriteKey, JSON.stringify( favorites ) );
    },

    // Will take in an array of course identifers ( EX: [2846,1977,1677,1197] ) and remove this array from the
    // stored favorites
    "removeFavorite" : function( name ) {
      // Get the raw value of the favorites array
      var favorites = localStorage.getItem( this.favoriteKey );

      // Only perform changes if the favorites array is defined
      if( favorites != null ) {
        favorites = JSON.parse( favorites );
        
        for( var favorite in favorites ) {
          if( favorites[favorite].name == name ) {
            favorites.splice( favorite, 1 );
            localStorage.setItem( this.favoriteKey, JSON.stringify( favorites ) );
            break;
          }
        }

      }
    },

    "getFavorite" : function( name ) {
      var favorites = this.getAllFavorites(),
          result = [];

      for( var favorite in favorites ) {
        if( favorites[favorite].name == name ) {
          result = favorites[favorite];
          break;
        }
      }

      return result;
    },

    "getAllFavorites" : function() {
      var result = [];

      if( localStorage ) {
        var favorites = localStorage.getItem( this.favoriteKey );

        if( favorites ) {
          result = JSON.parse( favorites );
        }
      }

      return result;
    },

    // Returns a listing of the schedules stored with the manager
    "listFavorites" : function() {
      var result = [];
      var favorites = localStorage.getItem( this.favoriteKey );
      if( favorites != null ) {
        favorites = JSON.parse( favorites );
        for( var favorite in favorites ) {
          result.push( favorites[favorite].name );
        }
      }

      return result;
    },
  };

});










