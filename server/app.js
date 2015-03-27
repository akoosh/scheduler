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
        }
    });
});
