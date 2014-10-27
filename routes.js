// SSU_Scheduler routing
// ZT & AW
// 10/21/2014

Router.map(function () {
  
  // Session based page location
  this.route('page_loader', {
    path: '/session' 
  });

  // Schedules
  this.route('schedule_page', {
    path: '/schedules' 
  });

  // Home page
  this.route('query_page', {
    path: "/*",             // Match anything not matched
  });
});
