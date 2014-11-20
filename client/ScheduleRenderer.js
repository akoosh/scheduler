// Schedule Renderer: Responsible for drawing to a canvas object

ScheduleRenderer = function( canvas ) {
  this.dayToInt = {
    "M"  : 1,
    "T"  : 2,
    "W"  : 3,
    "TH" : 4,
    "F"  : 5,
    "S"  : 6,
  };

  this.backgroundImage = "schedule.200.500.png";
  this.columnWidth = 50;
  this.columnPadding = 3;

  this.blockWidth = 44;

  // If the canvas could not be located then return null
  this.canvas = $(canvas);
  if ( this.canvas.length == 0 ) {
    return null;
  }
}

// Returns day offsets
ScheduleRenderer.prototype.dayToX = function( day ) {
  var result = this.dayToInt[day];
  if( typeof result === "undefined" ) {
    result = 1;
  }
  return this.columnWidth * result + this.columnPadding;
};

// Returns the starting position for a day block based on the size of the canvas
ScheduleRenderer.prototype.startToY = function( val ) {
  return Math.floor( val * this.canvas.height() );
};

// Returns the size of an element based on the canvas size and length of the day
ScheduleRenderer.prototype.rangeToSize = function( begin, end ) {
  return Math.floor( (end-begin)*this.canvas.height() );
};

// Returns a rectangle object for drawing through jCanvas
ScheduleRenderer.prototype.generateRect = function( x, y, width, height, info ) {
      return {
      "layer"         : true,
      "group"         : ["days"],

      "x"             : x, 
      "y"             : y,
      "width"         : width,
      "height"        : height,
      "fromCenter"    : false,

      "fillStyle"     : '#8891FF',
      "cornerRadius"  : 2,
      "strokeStyle"   : '#000',
      "strokeWidth"   : 2,

      "data"          : {
        "id": info.id,
        "info" : info
      },
    };
};

ScheduleRenderer.prototype.generateText = function( x, y, text ) {
  return {
    "layer"       : true,
    "group"       : ["text"],

    "x"           : x, 
    "y"           : y,
    "fromCenter"  : false,

    "text"        : text,
    "fontSize"    : 10,
    "fillStyle"   : "#000",
    "strokeStyle" : "#AAA",
    "strokeWidth" : 0,
    "fontFamily"  : 'Arial, sans-serif',
  };
};

ScheduleRenderer.prototype.drawBackground = function() {
  // REFACTOR
  var hasDrawn = false;

  // Draw BG image
  this.canvas.drawImage({
    "layer": true,
    "source": "/image/" + this.backgroundImage,
    "fromCenter": false,
    "index": 0,
    "load": function() {
      if( !hasDrawn ) {
        hasDrawn = true;
        $(this).drawLayers();
      }
    },
  });
}

ScheduleRenderer.prototype.drawPacket = function( packet ) {
  // Draw each time block
  for( block in packet.time_blocks ) {
    block = packet.time_blocks[block];
    
    // Draw the block
    this.drawRect( block, packet );
    this.drawText( block, packet );
  }
}

ScheduleRenderer.prototype.drawRect = function( block, packet ) {
  this.canvas.drawRect( 
    this.generateRect(
      this.dayToX( block.day ),
      this.startToY( block.start ),
      this.blockWidth,
      this.rangeToSize( block.start, block.end ),
      packet.info
    )
  );
}
ScheduleRenderer.prototype.drawText = function( block, packet ) {
    // Draw the text
    this.canvas.drawText( 
      this.generateText( 
        this.dayToX( block.day ),
        this.startToY( block.start ),
        packet.info.subject
      )
    );
}


ScheduleRenderer.prototype.drawPackets = function( packets ) {
  // For each packet draw the time blocks
  for( packet in packets ) {
    this.drawPacket( packets[packet] );
  }
}

ScheduleRenderer.prototype.clear = function() {
  // Prepare to draw the schedule
  this.canvas.clearCanvas();
  this.canvas.removeLayers();
}




// EOF
