// pageLoader.js: Helpers and events for the page loader wrapper template
// PageLoader template allows us to change and template without a page refresh
// Arthur Wuterich

Meteor.startup( function() {

  // Entry point for application
  Session.set( "Scheduler.currentPage", entryPage );


  Scheduler.PageLoader = {
    loadPage : function( page ) {
      Scheduler.qTipHelper.clearTips();
      Session.set( "Scheduler.currentPage", page );
    }
  }
});

Template.pageLoader.helpers( {
  // Attempts to load the template provided by its name
  "loadPage" : function(name) {
    var page = Session.get("Scheduler.currentPage");

    return { template: Template[page] };
  },

  hasCourseData : function() {
    return CoursesModel.findOne();
  }

});

Template.pageLoader.events( {
});
