// pageLoader.js: Helpers and events for the page loader wrapper template
// PageLoader template allows us to change and template without a page refresh
// Arthur Wuterich

Meteor.startup( function() {

  Scheduler.PageLoader = {
    loadPage : function( page ) {

      Scheduler.qTipHelper.clearTips();
      Session.set( "Scheduler.currentPage", page );

    }
  }
});

Template.pageLoader.helpers( {
  // Attempts to load the template provided by its name
  loadPage : function() {
    var page = Session.get("Scheduler.currentPage");

    return { template: Template[page] };
  },

  hasCourseData : function() {
    return CoursesModel.findOne();
  }

});

Template.pageLoader.events( {
});
