
Template.ssuGatePage.events( {
  "click .accessAttempt" : function(e,t) {
    var accessKey = $(".access-key").val();

    if( accessKey && accessKey != "" ) {
      Meteor.call('userHasAccess', accessKey, function(err, result) {
        if (err === undefined && result ) {
          // Store the access time to allow caching valid access
          localStorage.setItem("_user_access_token", new Date().getTime() );
          Session.set( "current_page", "searchPage" );
        }
      });
      
    }
  }
});

Template.ssuGatePage.helpers({
});

Template.ssuGatePage.rendered = function() {
}
