BucketIterator = function( buckets ) {
  this.setBuckets( buckets );
  this.reset();

  while( !this.isValid() ) {
    this.inc();
    if( this.position == 1 ) {
      break;
    }
  }

}

BucketIterator.prototype.setBuckets = function( buckets ) {
  this.buckets = buckets;
  this.size = 1;
  this.valid = {};

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

BucketIterator.prototype.courseOverlap = function(courses) {
  var days = {};

  var renderPackets = Scheduler.Schedules.generateRenderPackage( courses );

  for( packet in renderPackets ) {
    packet = renderPackets[packet];
    for( block in packet.time_blocks ) {
      block = packet.time_blocks[block];
      if( typeof days[block.day] === "undefined" ) {
        days[block.day] = [ block ];
      } else {
        days[block.day].push( block );
      }
    }
  }

  for( day in days ) {
    day = days[day];
    if( day.length == 1 ) {
      continue;
    }
    for( a in day ) {
      for( b in day ) {
        if( a==b ){ continue; }
        if( 
          ( day[a].start < day[b].end && day[a].end > day[b].start ) || 
          ( day[a].end > day[b].start && day[a].start < day[b].end ) ) {
          return true;
        }
      }
    }
  }

  return false;
}

BucketIterator.prototype.isValid = function(pos) {
  if( typeof pos === "undefined" ) {
    pos = this.position;
  }

  if( typeof this.valid[pos] === "undefined" ) {
    // Check for overlap
    if( this.courseOverlap( this.getSchedule() ) ){
      this.valid[pos] = result = false;
    } else {
      this.valid[pos] = result = true;
    }
  }

  return this.valid[pos];
}

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
