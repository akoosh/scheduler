Template.searchBar.events({
  "keyup #query": function() {
      // Clear timout if there is a pending query
      Template.searchPage.searchTimeoutHandler;
      clearTimeout( Template.searchPage.searchTimeoutHandler );

      Template.searchPage.searchTimeoutHandler = setTimeout( function() {

          var input = $("#query").val();

          Meteor.call('coursesForQuery', input, function(err, results) {
              if (err === undefined) {
                $(".searchLayout").animate({ scrollTop: 0 }, "fast");
                Session.set( "Scheduler.searchResults", results );

                var renderOptions = Session.get( "Scheduler.searchRenderOptions" );

                // Reset the search view render options
                if( renderOptions ) {
                  renderOptions.max = 10;
                  renderOptions.courses = {};
                  Session.set( "Scheduler.searchRenderOptions", renderOptions );
                }
              }
          });

      }, 200 );

  },
});

