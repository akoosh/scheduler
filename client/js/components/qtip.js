// qTipHelper: Helper methods for interacting with the qtip plugin

Scheduler.qTipHelper = {
  // qTip styles for application
  styles: {
    defaultStyle : {
      classes: "qtip-bootstrap qtip-shadow"
    }
  },

  // Timeout handles for the update functions
  updateHandles : {},

  // Updates elements in the dom after a delay ( to allow batching multiple update calls ). 
  updateTips : function( selector, style ) {

    clearTimeout( this.updateHandles[selector] );
    this.updateHandles[selector] = setTimeout( function() {

    if( style === undefined ) {
      style = Scheduler.qTipHelper.styles.defaultStyle;
    }

    $(selector).each( function(index, obj) {
      obj = $(obj);
      var content = {}, description = obj.attr("description"), title = obj.attr("title");

      // If both description and title are available for the element create a qTip with a title and description; else we only want the title
      if( description !== undefined && description != "" ) {
        content.title = title;
        content.text = description;
      } else if ( title !== undefined && title != "" ) {
        content.text = title;
      } else {
        //console.log( "Attempted to create qTip for element with inproper tags or null length fields" );
      }

      // Only setup a qTip if we have content
      if( Object.keys(content).length !== 0 ) {  
        obj.qtip({
          content : content,
          style : style,
          show : {
            solo : true
          },
          position: {
            target: 'mouse', // Track the mouse as the positioning target
            adjust: { x: 5, y: 5 } // Offset it slightly from under the mouse
          }
        });
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
