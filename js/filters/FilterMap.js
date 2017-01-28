var FilterMap = (function(){
	var instance; 
	function FilterMap() {
		var myFilterMap = new Map();
		myFilterMap.set(0, normal);
		myFilterMap.set(1, clarendon);
		myFilterMap.set(2, gingham);
		myFilterMap.set(3, moon);
		myFilterMap.set(4, lark);
		myFilterMap.set(5, lipstick);
		myFilterMap.set(6, colorize);
		myFilterMap.set(7, reyes);
		myFilterMap.set(8, juno);
		myFilterMap.set(9, slumber);
		myFilterMap.set(10, grayScale);
		myFilterMap.set(11, threshold);
		myFilterMap.set(12, blur);
		myFilterMap.set(13, sharpenFilter);
		myFilterMap.set(14, usmFilter);

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

var restore = function(previousdata, originaldata){
	for(var i = 0; i < previousdata.length; i+=4) {
		previousdata[i] = originaldata[i];
		previousdata[i+1] = originaldata[i+1];
		previousdata[i+2] = originaldata[i+2];
	}
	return previousdata;
}

var definedColors = [[0,0,0],[255,0,0],[0,128,0],[255,255,0],[0,0,255],[255,255,255]];
//gives a nearest color based on ecludean distance
var findNearest = function(r,g,b) {
	var eDists = [];	
	for(var i =0; i < definedColors.length; i++) {
		var j =0;
		var m = definedColors[i][j];
		var n = definedColors[i][j+1];
		var o = definedColors[i][j+2];
		m = (m - r) * (m - r);
		n = (n - g) * (n - g);
		o = (o - b) * (o - b); 
		var eDist = Math.sqrt(m + n + o);
		eDists.push(eDist);
		
	}
	var maxValue = Math.max(...eDists);
	var position = eDists.indexOf(maxValue);
	return definedColors[position];
}

var reduceColors = function(data) {
	for(var i =0; i < data.length; i+=4) {
		var position =0;
		var r = data[i];
		var g = data[i+1];
		var b = data[i+2];
		var color = findNearest(r,g,b);
		data[i] = color[position];
		data[i+1] = color[position+1];
		data[i+2] = color[position+2];
	}
	return data;
}

var brightness = function(s, data) {
	for(var i=0; i< data.length; i+=4) {
		data[i] = Util.truncate(data[i] + s);//R
		data[i+1] =Util.truncate(data[i+1] + s); //G
		data[i+2] =Util.truncate(data[i+2] + s);//B
	}
	return data;
}

var brightnessExpRed = function(s, data) {
	for(var i=0; i< data.length; i+=4) {
		data[i] = data[i];//R
		data[i+1] =Util.truncate(data[i+1] + s); //G
		data[i+2] =Util.truncate(data[i+2] + s);//B
	}
	return data;
}

var contrast = function(s, data) {
	var factor = (259 * (s + 255)) / (255 * (259 - s));
	for(var i=0; i< data.length; i+=4) {			
		data[i] = Util.truncate(factor * (data[i] - 128) + 128);//R
		data[i+1] =Util.truncate(factor *(data[i+1] - 128) + 128); //G
		data[i+2] =Util.truncate(factor *(data[i+2] -128) + 128);//B
	}
	return data;
}

var gamma = function(s, data) {
	var correctionFactor = 1 / s;
	for(var i=0; i< data.length; i+=4) {			
		data[i] = 255 * (Math.pow((data[i] / 255), correctionFactor));//R
		data[i+1] = 255 * (Math.pow((data[i+1] / 255), correctionFactor)); //G
		data[i+2] = 255 * (Math.pow((data[i+2] / 255), correctionFactor));//B
	}
	return data;
}

var temperature = function(s, data) {
	for(var i=0; i< data.length; i+=4) {
		data[i] = Util.truncate(data[i] + s)//R
		//data[i+1] = //G
		data[i+2] =Util.truncate(data[i+2] - s)//B
	}
	return data;
}

var saturation = function(s, data) {
	var RW = 0.299;
	var RG = 0.587;
	var RB = 0.114;
	var sBar = parseFloat(1 - s);					
	var a =  sBar * RW + s;
	var b =  sBar * RW;
	var c =  sBar * RW;
	var d =  sBar * RG;
	var e = sBar * RG + s;
	var f = sBar * RG;
	var g = sBar * RB;
	var h = sBar * RB;
	var itemp = sBar * RB + s;
	for(var i=0; i< data.length; i+=4) {
		var tempRed = data[i];
		var tempGreen = data[i+1];
		var tempBlue = data[i+2];
		data[i] = a * tempRed + d * tempGreen + g * tempBlue//R
		data[i+1] = b * tempRed + e * tempGreen + h * tempBlue//G
		data[i+2] = c * tempRed + f * tempGreen + itemp * tempBlue//B
	}
	return data;
}

var lipstickManipulation = function(data) {
	for(var i = 0; i < data.length; i+=4) {
		var avg = (data[i] + data[i +1] + data[i +2]) / 3;
		if(data[i] < (data[i+1] * 2) || data[i] < (data[i+2] * 2)) {
			data[i]     = avg; // red
			data[i + 1] = avg; // green
			data[i + 2] = avg; // blue	
		} 
	}
	return data;
}

var tint = function(s, data) {
	for(var i=0; i< data.length; i+=4) {
		data[i] = data[i]//R
		data[i+1] = Util.truncate(data[i+1] + s) //G
		data[i+2] =data[i+2]//B
	}
	return data;
}

var vibrance = function(s, data) {
	for(var i = 0; i < data.length; i+=4) {
		var r = data[i];
		var g = data[i+1];
		var b = data[i+2];
		var max = Math.max(r, g, b);
		var avg = (r + g + b) / 3;
		var amt = ((Math.abs(max - avg) * 2 / 255) * s) / 100;
		if (r < max) r = r + (max - data[i]) * amt;
		if (g < max) g = g + (max - data[i+1]) * amt;
		if (b < max) b = b + (max - data[i+2]) * amt;
		data[i] = r;
		data[i+1] = g;
		data[i+2] = b;
	}
	return data;
}

var seipa = function(s, data) {
	for(var i = 0; i < data.length; i+=4) {
		var r = data[i];
		var g = data[i+1];
		var b = data[i+2];
		data[i] = Util.truncate((r * (1 - (0.607 * s))) + (g * (0.769 * s)) + (b * (0.189 * s)));
		data[i+1] = Util.truncate((r * (0.349 * s)) + (g * (1 - (0.314 * s))) + (b * (0.168 * s)));
		data[i+2] = Util.truncate((r * (0.272 * s)) + (g * (0.534 * s)) + (b * (1- (0.869 * s))));		
	}
	return data;
}

var grayScaleManiputlation = function(data) {
	for (var i = 0; i < data.length; i += 4) {
      var avg = (data[i] + data[i +1] + data[i +2]) / 3;
      data[i]     = avg; // red
      data[i + 1] = avg; // green
      data[i + 2] = avg; // blue
    }
    return data;
}

var thresholdManipulation = function(data) {
	var thres = 100;
  	for (var i=0; i< data.length; i+=4) {
		var r = data[i];
		var g = data[i+1];
		var b = data[i+2];
		var v = (0.2126*r + 0.7152*g + 0.0722*b >= thres) ? 255 : 0;
		data[i] = data[i+1] = data[i+2] = v
  	}
  	return data;
}

var convolute = function(data,width, height, weights, opaque) {

	var weightLength = Math.round(Math.sqrt(weights.length));
	var halfSide = Math.floor(weightLength/2);
	var sw = width;
	var sh = height;
	// pad output by the convolution matrix
	var w = width;
	var h = height;
	var tempData = data.slice();
	// go through the destination image pixels
	var alphaFac = opaque ? 1 : 0;
	for (var y=0; y<h; y++) {
		for (var x=0; x<w; x++) {
			var sy = y;
			var sx = x;
			var dstOff = (y*w+x)*4;
			// calculate the weighed sum of the source image pixels that
			// fall under the convolution matrix
			var r=0, g=0, b=0, a=0;
			for (var cy=0; cy<weightLength; cy++) {
				for (var cx=0; cx<weightLength; cx++) {
					var scy = sy + cy - halfSide;
					var scx = sx + cx - halfSide;
					if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
						var srcOff = (scy*sw+scx)*4;
						var wt = weights[cy*weightLength+cx];
						r += data[srcOff] * wt;
						g += data[srcOff+1] * wt;
						b += data[srcOff+2] * wt;
						a += data[srcOff+3] * wt;
					}
				}
			}
			data[dstOff] = r;
			data[dstOff+1] = g;
			data[dstOff+2] = b;
			data[dstOff+3] = a + alphaFac*(255-a);
		}
	}
	return data;
};
 //Filters

var grayScale = function(canvasInstance) {
	var imageData = canvasInstance.getImageData();
	var context = canvasInstance.getContext();
	var data = imageData.data;
	var copyData = canvasInstance.getCopyData();
	restore(data, copyData);

	var tempData = grayScaleManiputlation(data);
	canvasInstance.setFilterData(tempData);
	restore(data, tempData);
	context.putImageData(imageData, 0, 0);
}

var threshold = function(canvasInstance) {
	var imageData = canvasInstance.getImageData();
	var context = canvasInstance.getContext();
	var data = imageData.data;
	var copyData = canvasInstance.getCopyData();
	restore(data, copyData);
	var tempData = thresholdManipulation(data);
	canvasInstance.setFilterData(tempData);
	restore(data, tempData);
	context.putImageData(imageData, 0, 0);
}

var blur = function(canvasInstance) {
	var imageData = canvasInstance.getImageData();
	var context = canvasInstance.getContext();
	var data = imageData.data;
	var width = imageData.width;
	var height = imageData.height;
	var copyData = canvasInstance.getCopyData();
	restore(data, copyData);
	var tempData = convolute(data,width,height,
				[ 1/9, 1/9,  1/9,
    			 1/9,  1/9, 1/9,
    			 1/9, 1/9,  1/9 ], true);
	restore(data, tempData);
	canvasInstance.setFilterData(tempData);
	context.putImageData(imageData, 0, 0);
}

var sharpenFilter = function(canvasInstance) {
	var imageData = canvasInstance.getImageData();
	var context = canvasInstance.getContext();
	var data = imageData.data;
	var width = imageData.width;
	var height = imageData.height;
	var copyData = canvasInstance.getCopyData();
	restore(data, copyData);
	var tempData = convolute(data,width,height,
				[ 0, -1,  0,
    			  -1, 5, -1,
    			  0, -1,  0 ], true);
	canvasInstance.setFilterData(tempData);
	restore(data, tempData);
	context.putImageData(imageData, 0, 0);
}

var usmFilter = function(canvasInstance) { //unsharp masking
	var imageData = canvasInstance.getImageData();
	var context = canvasInstance.getContext();
	var data = imageData.data;
	var width = imageData.width;
	var height = imageData.height;
	var copyData = canvasInstance.getCopyData();
	restore(data,copyData); 
	console.log("filter1 executed");
	var tempData = convolute(data,width,height,
				[ -1/256, -2/256, -6/256, -4/256, -1/256,
    			  -4/256, -16/256, -24/256, -16/256, -4/256,
    			  -6/256, -24/256,  476/256, -24/256, -6/256, 
    			  -4/256, -16/256, -24/256, -16/256, -4/256,
    			  -1/256, -4/256, -6/256, -4/256, -1/256], true);
	canvasInstance.setFilterData(tempData);
	restore(data, tempData);
	context.putImageData(imageData, 0, 0);
}

var normal = function(canvasInstance) {
	var imageData = canvasInstance.getImageData();
	var context = canvasInstance.getContext();
	var data = imageData.data;
	var copyData = canvasInstance.getCopyData();
	restore(data, copyData);
	canvasInstance.setFilterData(copyData);
	//clarendon algorithm brightness 10 temp 10 contrast 10 
	context.putImageData(imageData, 0, 0);
}

var clarendon = function(canvasInstance) {
	var imageData = canvasInstance.getImageData();
	var context = canvasInstance.getContext();
	var data = imageData.data;
	var copyData = canvasInstance.getCopyData();
	restore(data, copyData);
	//clarendon algorithm brightness 10 temp 10 contrast 10 
	var tempData = brightness(37, data);
	tempData = contrast(28, tempData);
	tempData = saturation(1.25, tempData);
	canvasInstance.setFilterData(tempData);
	restore(data, tempData);
	context.putImageData(imageData, 0, 0);
}

var gingham = function(canvasInstance) {
	var imageData = canvasInstance.getImageData();
	var context = canvasInstance.getContext();
	var data = imageData.data;
	var copyData = canvasInstance.getCopyData();
	restore(data, copyData);
	//clarendon algorithm brightness 10 temp 10 contrast 10 
	var tempData = brightness(38, data);
	tempData = contrast(-38, tempData);
	tempData = saturation(1.37, tempData);
	tempData = gamma(0.96, tempData);
	canvasInstance.setFilterData(tempData);
	restore(data, tempData);
	context.putImageData(imageData, 0, 0);
}

var moon = function(canvasInstance) {
	var imageData = canvasInstance.getImageData();
	var context = canvasInstance.getContext();
	var data = imageData.data;
	var copyData = canvasInstance.getCopyData();
	restore(data, copyData);
	//moon values 
	var tempData = brightness(67, data);
	tempData = saturation(0, tempData);
	canvasInstance.setFilterData(tempData);
	restore(data, tempData);
	context.putImageData(imageData, 0, 0);
}

var lark = function(canvasInstance) {
	var imageData = canvasInstance.getImageData();
	var context = canvasInstance.getContext();
	var data = imageData.data;
	var copyData = canvasInstance.getCopyData();
	restore(data, copyData);
	//lark values
	var tempData = brightness(45, data);
	tempData = contrast(17, tempData);
	tempData = saturation(1.34, tempData);
	tempData = gamma(0.57, tempData);
	canvasInstance.setFilterData(tempData);
	restore(data, tempData);
	context.putImageData(imageData,0,0);
}

var lipstick = function(canvasInstance) {
	var imageData = canvasInstance.getImageData();
	var context = canvasInstance.getContext();
	var data = imageData.data;
	var copyData = canvasInstance.getCopyData();
	restore(data, copyData);
	var tempData = lipstickManipulation(data);
	canvasInstance.setFilterData(tempData);
	restore(data, tempData);
	context.putImageData(imageData,0,0);
}

var colorize = function(canvasInstance) {
	var imageData = canvasInstance.getImageData();
	var context = canvasInstance.getContext();
	var data = imageData.data;
	var copyData = canvasInstance.getCopyData();
	restore(data, copyData);
	//lark values
	var tempData = reduceColors(data);
	canvasInstance.setFilterData(tempData);
	restore(data, tempData);
	context.putImageData(imageData,0,0);
}

var reyes = function(canvasInstance) {
	var imageData = canvasInstance.getImageData();
	var context = canvasInstance.getContext();
	var data = imageData.data;
	var copyData = canvasInstance.getCopyData();
	restore(data, copyData);
	//lark values
	var tempData = brightness(21, data);
	tempData = gamma(2, tempData);
	tempData = seipa(0.21, tempData);
	canvasInstance.setFilterData(tempData);
	restore(data, tempData);
	context.putImageData(imageData,0,0);
}

var juno = function(canvasInstance) {
	var imageData = canvasInstance.getImageData();
	var context = canvasInstance.getContext();
	var data = imageData.data;
	var copyData = canvasInstance.getCopyData();
	restore(data, copyData);
	//lark values
	var tempData = vibrance(-64, data);
	tempData = gamma(1.92, tempData);
	tempData = tint(18, tempData);
	canvasInstance.setFilterData(tempData);
	restore(data, tempData);
	context.putImageData(imageData,0,0);
}

var slumber = function(canvasInstance) {
	var imageData = canvasInstance.getImageData();
	var context = canvasInstance.getContext();
	var data = imageData.data;
	var copyData = canvasInstance.getCopyData();
	restore(data, copyData);
	//lark values
	var tempData = vibrance(-10, data);
	tempData = gamma(1.25, tempData);
	tempData = tint(21, tempData);
	tempData = seipa(0.09, tempData);
	tempData = contrast(33, tempData);
	canvasInstance.setFilterData(tempData);
	restore(data, tempData);

	context.putImageData(imageData,0,0);
}