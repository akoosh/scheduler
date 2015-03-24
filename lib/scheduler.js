// SSU Scheduler: Init objects in application
// 02/21/2014
// ZT & AW

Scheduler = {}

Meteor.startup(function () {
  process.env.JASMINE_CLIENT_UNIT = 0;
});

// Global rendering options
Scheduler.render = {
  qTipClasses : "qtip-bootstrap qtip-shadow"
}
