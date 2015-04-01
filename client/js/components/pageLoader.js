// pageLoader.js: Helpers and events for the page loader wrapper template
// PageLoader template allows us to change and template without a page refresh
// Arthur Wuterich

Meteor.startup( function() {


  Scheduler.PageLoader = {
    validPages : [],
    loadPage : function( page ) {
      
      if( _.contains( this.validPages, page ) ) {

        location.hash = page;
        Scheduler.qTip.clearTips();
        Session.set( "Scheduler.currentPage", page );
      }
    }
  }


  // Setup hash navigation function
  $(window).on( "popstate", function(){ 
    var dest = location.hash.substr(1);
    if( Template[dest] !== undefined ) {
      Scheduler.PageLoader.loadPage( dest );
    }
  });
});

Template.pageLoader.helpers( {
  // Attempts to load the template provided by its name
  loadPage : function() {
    var page = Session.get("Scheduler.currentPage"),
        result = { template : Template["loginPage"] };

    if( Template[page] !== undefined ) {
      result.template = Template[page];
    }

    return result;
  },

  hasCourseData : function() {
    return CoursesModel.findOne();
  }

});

Template.pageLoader.events( {
});

Template.pageLoader.rendered = function() {
}
