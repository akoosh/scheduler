// qTip: Helper methods for interacting with the qtip plugin

Meteor.startup( function() {

  Scheduler.qTip = {
    // qTip styles for application
    styles: {
      defaultStyle : {
        classes: "qtip-bootstrap qtip-shadow"
      }
    },

    // Timeout handles for the update functions
    updateHandles : {},

    // Updates elements in the dom after a delay ( to allow batching multiple update calls ). 
    updateTips : function( selector, opt ) {

      clearTimeout( this.updateHandles[selector] );
      this.updateHandles[selector] = setTimeout( function() {

      var options = {
        style : Scheduler.qTip.styles.defaultStyle,
        content : {},
        show : {
          solo : true
        },
        position : {
          target : "mouse",
          adjust : {
            x : 5,
            y : 5
          }
        }
      };

      // Copy the options from the opt object into the qTip options object
      deepMerge( options, opt );

      $(selector).each( function(index, obj) {
        obj = $(obj);
        var description = obj.attr("description"), title = obj.attr("title");
        options.content = {};

        // If both description and title are available for the element create a qTip with a title and description; else we only want the title
        if( description !== undefined && description != "" ) {
          options.content.title = title;
          options.content.text = description;
        } else if ( title !== undefined && title != "" ) {
          options.content.text = title;
        } else {
          //console.log( "Attempted to create qTip for element with inproper tags or null length fields" );
        }

        // Only setup a qTip if we have content
        if( Object.keys(options.content).length !== 0 ) {  
          obj.qtip( options );
        }
      });
    }, 50 );
    },

    clearTips : function() {
      $(".qtip").qtip("destroy");
    },

    hideTips: function() {
      $(".qtip").hide();
    }
  }
});
