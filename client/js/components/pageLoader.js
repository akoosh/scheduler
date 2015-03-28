// pageLoader.js: Helpers and events for the page loader wrapper template
// PageLoader template allows us to change and template without a page refresh
// Arthur Wuterich

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
