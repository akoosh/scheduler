// SchedulerManager
// Stores and retreives schedule information from
// a unified storage location
// Arthur Wuterich
// 10/22/2014

Scheduler.SchedulerManager = {
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
      token = Scheduler.SchedulerManager.tmpToken
    }

    var result = null;
    var raw = localStorage.getItem( token );

    if( raw != null ) {
      raw = JSON.parse ( raw );
      result = [];
      
      for( number in raw ) {
        number = raw[number];
        var c = Scheduler.Classes.classForNumber( number );

        if( c != null ) {
          result.push( c );
        }
      }
    }

    return result; 
  },

  // Sets courses for the token provided
  //  [token]: If not defined will assume to be the tmp token
  set : function( courses, token ) {
    if( typeof token === "undefined" ) {
      token = Scheduler.SchedulerManager.tmpToken
    }

    localStorage.setItem( token, JSON.stringify( courses ) );
  },
};

// EOF
