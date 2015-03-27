// Main meteor server functions
Meteor.startup(function () {
    process.env.JASMINE_CLIENT_UNIT = 0;
    Meteor.methods({
        coursesForQuery: function(query) {
            return QueryProcessing.coursesForString(query);
        },

        classesForNumber: function(c) {
          return Classes.classForNumber( c );
        },

        userHasAccess : function(accessKey) {
          var result = false;

          if( accessKey ) {
            result = AccessChecker.hasAccess( accessKey );
          }

          return result;
        },

        loadUserData : function( accessKey ) {
          var data = UserData.find( { id : accessKey } ).fetch();
          if( data.length ) {
            return data[0].data;
          }
        },

        saveUserData : function( accessKey, data ) {
          var save = { 
            id : accessKey, 
            data : data
          };

          var databaseEntry = UserData.find( { id : save.id } ).fetch();

          if( databaseEntry.length ) {
            UserData.update( { _id : databaseEntry[0]._id }, save );
          } else {
            UserData.insert( save );
          }

        }
    });
});
