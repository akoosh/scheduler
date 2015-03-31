// Full Calendar helper

Meteor.startup( function() {

  Scheduler.fullCalendar = {
    render : function( selector, opt ) {
      if( selector ) {

        var options = {
          defaultView   : "agendaWeek",
          titleFormat   : "",
          header        : false,
          allDaySlot    : false,
          height        : "auto",
          columnFormat  : "dddd",
          eventRender: function(event, element) {
              element.qtip({
                content: {
                  text: event.description,
                  title: event.title + " " + event.code
                },
                style : Scheduler.qTip.styles.defaultStyle,
                show : {
                  solo : true
                },
                position: {
                  target: 'mouse', // Track the mouse as the positioning target
                  adjust: { x: 5, y: 5 } // Offset it slightly from under the mouse
                }
              });
          }
        };

        deepMerge( options, opt );


        $(selector).fullCalendar( "destroy" );
        $(selector).fullCalendar( options );
      }
    }
  }
});
