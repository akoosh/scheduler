// qTipHelper: Helper methods for interacting with the qtip plugin

Scheduler.qTipHelper = {
  // Timeout handles for the update functions
  updateHandles : {},

  // Updates elements in the dom after a delay ( to allow batching multiple update calls ). 
  updateTips : function( selector, style ) {

    clearTimeout( Scheduler.qTipHelper.updateHandles[selector] );
    Scheduler.qTipHelper.updateHandles[selector] = setTimeout( function() {
    $(selector).each( function(index, obj) {
      obj = $(obj);
      var content = {}, description = obj.attr("description"), title = obj.attr("title");

      // If both description and title are available for the element create a qTip with a title and description; else we only want the title
      if( description !== undefined ) {
        content.title = title;
        content.text = description;
      } else if ( title !== undefined ) {
        content.text = title;
      } else {
        console.log( "Nope!" );
      }

      // Only setup a qTip if we have content
      if( Object.keys(content).length !== 0 ) {  
        obj.qtip({
          content : content,
          style : style,
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