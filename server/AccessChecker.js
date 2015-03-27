
Meteor.startup( function() {
  if( Meteor.isServer ) {
    AccessChecker = {
      hasAccess : function( accessKey ) {

        // Check with the collection that a student object has a valid key
        return Students.find( { "id" : CryptoJS.MD5(accessKey).toString() } ).count() == 1;
      }
    }
  }
});
