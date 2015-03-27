
Template.ssuGatePage.events( {
  "click .accessAttempt" : function(e,t) {
    var accessKey = $(".access-key").val();

    if( accessKey && accessKey != "" ) {
      Meteor.call('userHasAccess', accessKey, function(err, result) {
          if (err === undefined) {
            if( result ) {
              Session.set( "current_page", "searchPage" );
            } else {
            }
          } else {
            console.log( err );
          }
      });
      
    }
  }
});

Template.ssuGatePage.helpers({
});

Template.ssuGatePage.rendered = function() {
}
