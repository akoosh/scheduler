Template.pageLoader.helpers( {
  "loadPage" : function(name) {
    var page = Session.get("current_page");
    if( typeof page === "undefined" ) {
      page = "query_page";
      Session.set( "current_page", page );
    }

    return { template: Template[page] };
  },
});

Template.pageLoader.events( {
  "mouseup #schedule_transition" : function() {
    Session.set( "current_page", "schedule_page" );
  },
});
