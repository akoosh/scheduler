// SSU_Scheduler routing
// ZT & AW
// 10/21/2014

Router.map(function () {
  
  // Session based page location
  this.route('pageLoader', {
    path: '/session' 
  });

  // Schedules
  this.route('schedulePage', {
    path: '/schedules' 
  });

  // Home page
  this.route('queryPage', {
    path: /\/.*/,             // Match anything not matched
  });
});
