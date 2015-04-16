Meteor.startup( function() {
  Scheduler.infoPanel = {
    messages : {
      0 : "Initial message",
      1 : "Further message",
      2 : "Final message"
    },

    isValid : function(state) {
      return state <= 2;
    },

    nextState : function() {
      var state = Session.get("infoPanelState");

      state++;

      Session.set("infoPanelState", state);
    }
  }

  Template.infoPanel.helpers( {
    // 
    isVisible : function() {
      var state = Session.get("infoPanelState");
      return Scheduler.infoPanel.isValid( state );
    },

    // 
    message : function() {
      var state = Session.get("infoPanelState");

      return Scheduler.infoPanel.messages[state];
    }

  });
});
