Template.schedule_page.helpers( {
  "var" : function(name) {
    var result = Session.get( name );
    if( Scheduler.Schedules.bucketIterator == null ) {
      result = 0;
    }

    return result;
  },

});
