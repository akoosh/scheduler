BucketIterator = function( buckets ) {
  this.setBuckets( buckets );
  this.reset();
}

BucketIterator.prototype.setBuckets = function( buckets ) {
  this.buckets = buckets;
  this.size = 1;
  this.ignore = {};

  for( bucket in this.buckets ) {
    this.size *= this.buckets[bucket].length;
  }
}

BucketIterator.prototype.reset = function() {
  this.position = 1;
  this.bucketPositions = [];
  for( bucket in this.buckets ) {
    bucket = this.buckets[bucket]; 
    this.bucketPositions.push( [ 0 ] );
  }
}

// *** REFACTOR ***
BucketIterator.prototype.setPosition = function(pos) {
  if( pos < 1 || pos > this.size ) {
    return;
  }

  while( this.position != pos ) {
    this.inc();
  }
  
}

BucketIterator.prototype.isValid = function(pos) {
  if( typeof pos === "undefined" ) {
    pos = this.position;
  }

  if( typeof this.ignore[pos] !== "undefined" ) {
    return false;
  }

  // Check for overlap
  var courses = this.getSchedule()
  console.log( courses );
}

BucketIterator.prototype.inc = function(pos) {
  if( typeof pos === "undefined" ) {
    pos = this.buckets.length-1;
    this.position++;
  } else if( pos < 0 ) {
    this.reset();
    return;
  }
  this.bucketPositions[pos]++;

  if( this.bucketPositions[pos] >= this.buckets[pos].length ) {
    this.bucketPositions[pos] = 0;
    this.inc( pos-1 );
  }
}

BucketIterator.prototype.getCourseArray = function() {
  var result = [];

  for( bucket in this.buckets ) {
    result.push( this.buckets[bucket][this.bucketPositions[bucket]] );
  }

  return result;
}

BucketIterator.prototype.getSchedule = function() {
  var result = [];
  var classes = this.getCourseArray();

  for( number in classes) {
    number = classes[number];
    var c = Scheduler.Classes.classForNumber( number );

    if( c.classes != null ) {
      result.push( c );
    }
  }

  return result;
}