// SchedulerManager
// Stores and retreives schedule information from a unified storage location
// Arthur Wuterich
// 10/22/2014

Scheduler.ScheduleManager = {
  tmpToken : "tmp_classes",
  schedulesKey : "saved_schedules",
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
    var raw = localStorage.getItem( token );

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

    localStorage.setItem( token, JSON.stringify( courses ) );
  },
};

Scheduler.ScheduleManager.set( [ [ 2846, 2676, 2678 ], [ 1977, 1799 ], [ 1397, 1677 ], [ 1197, 3735, 1637 ] ], "mock" );

// EOF
