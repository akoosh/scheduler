// SchedulerManager
// Stores and retreives schedule information from a unified storage location
// Arthur Wuterich
// 10/22/2014

Scheduler.ScheduleManager = {
  tmpToken : "tmp_classes",
  schedulesKey : "saved_schedules",
  prefix : "schmgr_",
  schedules : null,

  cacheSchedules : function () {
    if( Scheduler.SchedulerManager.schedules == null ) {
      
    }
  },
    
  // Returns the object saved with scheduler manager
  //  [token]: If not defined will assume to be the tmp token
  get : function( token ) {
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
  set : function( courses, token ) {
    if( typeof token === "undefined" ) {
      token = Scheduler.ScheduleManager.tmpToken;
    }

    localStorage.setItem( Scheduler.ScheduleManager.prefix + token, JSON.stringify( courses ) );

    Session.set( "availableSchedules", Scheduler.ScheduleManager.list() );
  },

  list : function() {
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

  }
};

Scheduler.ScheduleManager.set( [ [ 2846, 2676, 2678 ], [ 1977, 1799 ], [ 1397, 1677 ], [ 1197, 3735, 1637 ] ], "mock" );

// EOF
