Template.capacityMeter.helpers( {
  seats : function() {
    var result = "~/~";

    if( this.value && this.capacity && this.value <= this.capacity && this.capacity != 0 ) {
      if( this.value == this.capacity ) {
        result = "full";
      } else {
        result = this.value + "/" + this.capacity;
      }
    } 

    return result;
  },

  fullClass : function() {
    var result = "";

    if( this.value && this.capacity && this.value == this.capacity ) {
      result = "full";
    }

    return result;
  },

  fillPercent : function() {
    var fill = 0;
    

    if( this.value && this.capacity && this.value <= this.capacity && this.capacity != 0 ) {
      fill = parseInt(this.value)/parseInt(this.capacity);
    }

    return fill*100;
  }
});
