
Template.ssuGatePage.events( {
  "click .accessAttempt" : function(e,t) {
    var accessKey = $(".access-key").val();

    if( accessKey && accessKey != "" ) {
      Meteor.call('userHasAccess', accessKey, function(err, result) {
        if (err === undefined && result ) {
          // Store the access time to allow caching valid access
          Scheduler.storageObject.setItem("_user_access_token", new Date().getTime() );
          Scheduler.storageObject.setItem("_user_access_id", accessKey );
          Session.set( "current_page", "searchPage" );
          Scheduler.userStorage.loadUserData( accessKey );
        }
      });
      
    }
  }
});

Template.ssuGatePage.helpers({
});

Template.ssuGatePage.rendered = function() {
}
