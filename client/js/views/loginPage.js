Template.loginPage.rendered = function() {
  if( !Meteor.userId() ) {
    Accounts._loginButtonsSession.set('dropdownVisible', true);
    $("#login-sign-in-link").hide();
  }

  $( "#pageLoader" ).css( "height", 0 );
};
