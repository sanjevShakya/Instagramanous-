var FilterMap = (function(){
	var instance; 
	function FilterMap() {
		var myFilterMap = new Map();
		myFilterMap.set(0, grayScale);
		myFilterMap.set(1, threshold);

		this.getMyFilterMap = function() {
			return myFilterMap;
		}

		this.setFilterMap = function(key, value) {
			myFilterMap.set(key, value);
		}
	}

	return {
		getInstance: function() {
			if(instance == null) {
				return new FilterMap();
			}
			return instance;
		}
	}
})();

var restore = function(_previousdata, _originaldata){
	for(var i = 0; i < _previousdata.length; i+=4) {
		_previousdata[i] = _originaldata[i];
		_previousdata[i+1] = _originaldata[i+1];
		_previousdata[i+2] = _originaldata[i+2];
	}
	return _previousdata;
}


var grayScale = function(canvasInstance) {
	var imageData = canvasInstance.getImageData();
	var context = canvasInstance.getContext();
	var copyData = canvasInstance.getCopyData();
	var data = imageData.data; //original data
	restore(data, copyData);
	for (var i = 0; i < data.length; i += 4) {
      var avg = (data[i] + data[i +1] + data[i +2]) / 3;
      data[i]     = avg; // red
      data[i + 1] = avg; // green
      data[i + 2] = avg; // blue
    }
    context.putImageData(imageData, 0, 0);
};

var threshold = function(canvasInstance) {
	var imageData = canvasInstance.getImageData();
	var context = canvasInstance.getContext();
	var data = imageData.data;
	var copyData = canvasInstance.getCopyData();
	restore(data, copyData);
  	var thres = 100;
  	for (var i=0; i< data.length; i+=4) {
		var r = data[i];
		var g = data[i+1];
		var b = data[i+2];
		var v = (0.2126*r + 0.7152*g + 0.0722*b >= thres) ? 255 : 0;
		data[i] = data[i+1] = data[i+2] = v
  	}
 	context.putImageData(imageData, 0, 0);
}

