// SSU_Scheduler routing
// ZT & AW
// 10/21/2014

Router.map(function () {
  

  // Schedule page
  this.route('schedulePage', {
    path: '/schedules',
  });

  // Query page
  this.route('queryPage', {
    path: "/query",             // Match anything not matched
  });

  // Session based page location
  this.route('pageLoader', {
    path: /\/.*/,             // Match anything not matched
  });
});
