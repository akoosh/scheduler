
Storage = function( userId ) {
  this.values = {};
  this.keys = {}
  this.length = 0;
  this.userId = userId; 
  this.updateHandle = 0;
  this.updateCallback = null;
}

Storage.prototype.loadUserData = function(userId) {
  if( userId ) {
    this.userId = userId;
    this.loadFromCollection();
  }
}

Storage.prototype.loadFromCollection = function() {
  var outerThis = this;
  Meteor.call( "loadUserData", this.userId, function( err, data ) {
    outerThis.fromString( data );
    if( typeof outerThis.updateCallback === "function" ) {
      outerThis.updateCallback();
    }
  });
}

Storage.prototype.saveToCollection = function() {
  Meteor.call( "saveUserData", this.userId, this.toString() );
}

Storage.prototype.getItem = function( key ) {
  return this.values[key];
}

Storage.prototype.setItem = function( key, value ) {
  if( this.keys[key] === undefined ) {
    this.keys[key] = true;
    this.length++;
  }

  this.values[key] = value;

  // Wrap the automatic saving in a timeout to
  // allow caching save requests
  clearTimeout( this.updateHandle );
  var outerThis = this;
  this.updateHandle = setTimeout( function() {
    outerThis.saveToCollection();
  }, 50);
}

Storage.prototype.toString = function() {
  return JSON.stringify( { keys : this.keys, values: this.values, length:this.length } );
}

Storage.prototype.copyToLocalStorage = function() {
  if( localStorage ) {
    for( key in this.keys ) {
      if( this.keys[key] ) {
        localStorage.setItem( key, this.values[key] );
      }
    }
  }
}

Storage.prototype.fromString = function( raw ) {
  if( raw ) {
    var store = JSON.parse( raw );

    if( store.keys !== undefined && store.values !== undefined && store.length !== undefined ) {
      this.keys = store.keys;
      this.values = store.values;
      this.length = store.length;
    } 
  }
}
