// Bucket Iterator
// Creates an iterator for iterating over buckets within a schedule
// This is needed because not all schedules are valid ( time conflicts, etc )

// Factory method for a BucketIterator
BucketIterator = function( buckets ) {
  this.setBuckets( buckets );
  this.reset();
  this.scheduleValidator = new ScheduleValidator([]);
  // Get the position to the first valid position
  while( !this.isValid() ) {
    this.inc();
    if( this.position == 1 ) {
      break;
    }
  }

}

// Returns if the iterator has any valid schedules
BucketIterator.prototype.hasValidSchedules = function() {
  var keys = _.keys( this.valid ),
      self = this;
  keys = _.reject( keys, function(ele){ return self.valid[ele]; } );
  return keys.length != this.size;
}

// Sets the buckets for iteration
//  -more of an internal function
BucketIterator.prototype.setBuckets = function( buckets ) {
  this.buckets = buckets;
  this.size = 1;
  this.valid = {};

  for( var bucket in this.buckets ) {
    // Force the element into an array if it is a flat value
    if( typeof this.buckets[bucket] !== "object" ) {
      this.buckets[bucket] = [this.buckets[bucket]];
    }
    this.size *= this.buckets[bucket].length;
  }
  
}

// Resets the iterator array and the position of iterator
BucketIterator.prototype.reset = function() {
  this.position = 1;
  this.bucketPositions = [];
  for( bucket in this.buckets ) {
    bucket = this.buckets[bucket]; 
    this.bucketPositions.push( [ 0 ] );
  }

}

BucketIterator.prototype.maxReset = function() {
  this.position = this.size-1;
  this.bucketPositions = [];
  for( bucket in this.buckets ) {
    bucket = this.buckets[bucket]; 
    this.bucketPositions.push( [ bucket.length-1 ] );
  }
}

// *** REFACTOR ***
// Sets the position of the iterator to the provided position
BucketIterator.prototype.setPosition = function(pos) {
  if( pos < 1 || pos > this.size ) {
    return;
  }

  while( this.position != pos ) {
    this.inc();
  }
  
}

// Returns true if the provided courses has overlap
BucketIterator.prototype.coursesAreValid = function(courses) {
    var result = this.scheduleValidator.scheduleIsValid(courses); 
    console.log("BucketIterator: scheduleIsValid: ", result);
    
    console.log("\n\n\n\n");
    return result;
}

// Returns the result of a position in the iterator being a valid schedule or not
//  this is to prevent checking the same schedule multiple times for being valid or not
BucketIterator.prototype.isValid = function(pos) {
  if( typeof pos === "undefined" ) {
    pos = this.position;
  }

  // Generate the valid check if not available in the valid array
  if( typeof this.valid[pos] === "undefined" ) {

    // Check schedule for overlap && against user-selected filters
    this.valid[pos] = this.coursesAreValid( this.getSchedule() );
  }

  return this.valid[pos];
}

// Recursive increment function
// This will modify the iterator arrays based on the size of the buckets
// EX: Buckets = [ [ c1, c2, c3 ], [ c4, c2 ], [ c5 ] ]
//     pos     = [ [ 0 ],          [ 1 ],      [ 0  ] ] => { c1, c2, c5 }
// A call to inc will alter the pos array to point to the next schedule
//     pos     = [ [ 1 ],          [ 0 ],      [ 0 ]  ] => { c2, c4, c5 }
BucketIterator.prototype.inc = function(pos) {
  if( this.buckets.length == 0 ) {
    return;
  }

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

BucketIterator.prototype.dec = function(pos) {
  if( this.buckets.length == 0 ) {
    return;
  }

  if( typeof pos === "undefined" ) {
    pos = this.buckets.length-1;
    this.position--;
  } else if( pos < 0 ) {
    this.maxReset();
    return;
  }

  this.bucketPositions[pos]--;

  if( this.bucketPositions[pos] < 0 ) {
    this.bucketPositions[pos] = this.buckets[pos].length-1;
    this.dec( pos-1 );
  }
}

// Returns an array of course identifiers
// EX: [2846, 1977, 1677, 1197]
BucketIterator.prototype.getCourseArray = function() {
  var result = [];

  for( bucket in this.buckets ) {
    result.push( this.buckets[bucket][this.bucketPositions[bucket]] );
  }

  return result;
}

// Returns an array of course objects from the database
BucketIterator.prototype.getSchedule = function() {
  var result = [];
  var classes = this.getCourseArray();

  for( number in classes ) {
    number = classes[number];
    var c = ClassesModel.findOne( { number : number } );

    // Make sure that the sections has some data for display
    if( c && c.meetings ) {
      result.push( c );
    }
  }

  return result;
}
