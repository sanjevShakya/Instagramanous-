/**
  * @method FilterMap
  * @return {FilterMap} instance
*/
var FilterMap = (function(){
  var instance; 

  /**
   * Repository for mapping id to respective filter function
  */
  function FilterMap() {
    var myFilterMap = new Map();
    myFilterMap.set(0, normal);
    myFilterMap.set(1, clarendon);
    myFilterMap.set(2, gingham);
    myFilterMap.set(3, moon);
    myFilterMap.set(4, lark);
    myFilterMap.set(5, lipstick);
    myFilterMap.set(6, ashby);
    myFilterMap.set(7, reyes);
    myFilterMap.set(8, juno);
    myFilterMap.set(9, slumber);
    myFilterMap.set(10, grayScale);
    myFilterMap.set(11, threshold);
    myFilterMap.set(12, blur);
    myFilterMap.set(13, sharpenFilter);
    myFilterMap.set(14, usmFilter);
    myFilterMap.set(15, xproII);
    myFilterMap.set(16, sierra);
    myFilterMap.set(17, inkwell);
    myFilterMap.set(18, filter1997);
    myFilterMap.set(19, colorize);

    /**
    * Get defined filter map 
    * @return {Map} myFilterMap
    */
    this.getMyFilterMap = function() {
      return myFilterMap;
    }

    /**
    * Set myFilterMap with key and value
    */
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

/**
  * array of color defined in r,g,b 
*/
var definedColors = [[0,0,0],[255,0,0],[0,128,0],[255,255,0],[0,0,255],[255,255,255]];

/** 
  * Find the nearest color from the definedColors array 
  * find out the ecludean distance between the given rgb color with 
  * the available definedColor and return the color from definedColor 
  * @method findNearest
  * @param {number} r 
  * @param {number} g
  * @param {number} b
*/
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

/**
  * Reduce a pixels color to nearest color and replace it
  * @method reduceColor 
  * @param {Uint8Array} data - Imagedata
  * @param {Uint8Array} data - Manipulated Data
*/
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

/**
  * Adjust brightness of the image by linearly increasing by a certain value
  * @method brightness 
  * @param {number} s - specified value
  * @param {Uint8Array} data - Imagedata
  * @param {Uint8Array} data - Manipulated Data
*/
var brightness = function(s, data) {
  var maxValue = 255;
  var minValue = 0;
  for(var i=0; i< data.length; i+=4) {
    data[i] = data[i] + s;//R
    data[i+1] = data[i+1] + s; //G
    data[i+2] =data[i+2] + s;//B
    if(data[i] > maxValue) data[i] = maxValue;
    if(data[i+1] > maxValue) data[i+1] = maxValue;
    if(data[i+2] > maxValue) data[i+2] = maxValue;
    if(data[i] < minValue) data[i] = minValue;
    if(data[i+1] < minValue) data[i+1] = minValue;
    if(data[i+2] < minValue) data[i+2] = minValue;
  }
  return data;
}


/**
  * Adjust contrast of the image based on a correction factor 
  * @method contrast 
  * @param {number} s - specified value
  * @param {Uint8Array} data - Imagedata
  * @param {Uint8Array} data - Manipulated Data
*/
var contrast = function(s, data) {
  var maxValue = 255;
  var minValue = 0;
  var factor = (259 * (s + 255)) / (255 * (259 - s));
  for(var i=0; i< data.length; i+=4) {      
    data[i] =(factor * (data[i] - 128) + 128);//R
    data[i+1] =(factor *(data[i+1] - 128) + 128); //G
    data[i+2] =(factor *(data[i+2] -128) + 128);//B
    if(data[i] > maxValue) data[i] = maxValue;
    if(data[i+1] > maxValue) data[i+1] = maxValue;
    if(data[i+2] > maxValue) data[i+2] = maxValue;
    if(data[i] < minValue) data[i] = minValue;
    if(data[i+1] < minValue) data[i+1] = minValue;
    if(data[i+2] < minValue) data[i+2] = minValue;
  }
  return data;
}

/** 
  * Ajust the intensity of the image based on the correction factor 
  * correction factor is given by gamma the input value is raised to 
  * the power of the inverse of gamma
  * @method gamma
  * @param {number} s - specified value
  * @param {Uint8array} data - Imagedata
  * @return {Uint8array} data - Manipulated Data 
*/
var gamma = function(s, data) {
  var correctionFactor = 1 / s;
  for(var i=0; i< data.length; i+=4) {      
    data[i] = 255 * (Math.pow((data[i] / 255), correctionFactor));//R
    data[i+1] = 255 * (Math.pow((data[i+1] / 255), correctionFactor)); //G
    data[i+2] = 255 * (Math.pow((data[i+2] / 255), correctionFactor));//B
  }
  return data;
}

/** 
  * Change the red and blue component according to specified value
  * @param {number} s - specified value
  * @param {Uint8array} data - Imagedata
  * @return {Uint8array} data - Manipulated Data 
*/
var temperature = function(s, data) {
  for(var i=0; i< data.length; i+=4) {
    data[i] = Util.truncate(data[i] + s)//R
    //data[i+1] = //G
    data[i+2] =Util.truncate(data[i+2] - s)//B
  }
  return data;
}

/**
* Saturate the color channel base on the Illuminace model Y 
* @method lipstickManipulation
* @param {Uint8array} data - Imagedata
* @return {Uint8array} data - Manipulated data
*/
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

/**
* Grayscale all pixel value and leave except the red channel
* @method lipstickManipulation
* @param {Uint8array} data - Imagedata
* @return {Uint8array} data - Manipulated data
*/
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

/** 
* change the green channel of RGB spatial image by certain linnear factor 
* @method tint
* @param {number} s - Specified value 
* @param {Uint8array} data - Image data
* @return {Uint8array} data - Manipulated data
*/
var tint = function(s, data) {
  for(var i=0; i< data.length; i+=4) {
    data[i] = data[i]//R
    data[i+1] = data[i+1] + s //G
    data[i+2] =data[i+2]//B
    if(data[i+1] > 255) data[i+1] = 255;
    if(data[i+1] < 0) data[i+1] = 0;
  }
  return data;
}

/**
* vibrance 
* similar to saturation but will leave already saturated colors alone
* prevents over saturation of the image
* @param {number} s - Specified value for vibrance
* @param {Uint8array} data - Image data
* @return {Uint8array} data - Manipulated image data
*/
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

/**
* seipa 
* All three channels have special conversion factor by which seipa 
* filter can be achieved 
* @param {number} s - specified value of seipa 
* @param {Uint8array} data - Image data
* @param {Uint8array} data - Manipulated image data 
*/
var seipa = function(s, data) {
  for(var i = 0; i < data.length; i+=4) {
    var r = data[i];
    var g = data[i+1];
    var b = data[i+2];
    data[i] = ((r * (1 - (0.607 * s))) + (g * (0.769 * s)) + (b * (0.189 * s)));
    data[i+1] = ((r * (0.349 * s)) + (g * (1 - (0.314 * s))) + (b * (0.168 * s)));
    data[i+2] = ((r * (0.272 * s)) + (g * (0.534 * s)) + (b * (1- (0.869 * s))));
    if(data[i] > 255) data[i] = 255;
    if(data[i+1] > 255) data[i+1] = 255;
    if(data[i+2] > 255) data[i+2] = 255;
    if(data[i] < 0) data[i] = 0;
    if(data[i+1] < 0) data[i+1] = 0;
    if(data[i+2] < 0) data[i+2] = 0;    
  }
  return data;
}

/**
* grayScaleManipulation 
* Calculate average of R, G, B component of a pixel and replace 
* all components by average
* @param {Uint8array} data - Image data
* @param {Uint8array} data - Manipulated image data;
*/
var grayScaleManiputlation = function(data) {
  for (var i = 0; i < data.length; i += 4) {
      var avg = (data[i] + data[i +1] + data[i +2]) / 3;
      data[i]     = avg; // red
      data[i + 1] = avg; // green
      data[i + 2] = avg; // blue
    }
    return data;
}

/**
 * thresholdManipulation
 * Replace each pixel in an image with a black pixel if the intensity of 
 * a grayscaled image is less than specified threshold constant.
 * @param {Uint8array} data- Image data
 * @return {Uint8array} data - Manipulated image data
*/
var thresholdManipulation = function(data) {
  var thres = 100;
  var redV = 0.2126;
  var greenV = 0.7152;
  var blueV = 0.0722;
  for (var i=0; i< data.length; i+=4) {
    var v = (redV * data[i]  + greenV * data[i+1] + blueV * data[i+2] >= thres) ? 255 : 0;
    data[i] = data[i+1] = data[i+2] = v
  }
  return data;
}

/**
 * Convolution 
 * Also know as Kernel Image processing, process of adding each element
 * of the image to its local neighbour. The function takes in a kernel matrix(weights)
 * and other image. Then the process of flipping both the rows and columns of the kernel 
 * and then applying normal matrix multiplication to similar entries and summing them.
 * @param {Uint8array} data - image data on which filter applied
 * @param {number} width - image width
 * @param {number} height - image height
 * @param {array} weights - kernel matrix
 * @param {bool} opaque
 * @return {Uint8array} data - convolution applied image data
 */
var convolute = function(data,width, height, weights, opaque) {
  //length of the weight array
  var weightLength = Math.round(Math.sqrt(weights.length));
  var halfSide = Math.floor(weightLength/2);
  // sw witdth of the image
  var sw = width;
  // sh height of the image
  var sh = height;
  // pad output by the convolution matrix
  var w = width;
  var h = height;
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


/**
 * Filter effect grayscale
 * Applies grayScaleManipulation to image data
 * @param {Uint8array} data - image data on which filter applied
 * @return {Uint8array} tempData - applied filter effects
 */
var grayScale = function(data) {
  return grayScaleManiputlation(data);
}

/**
 * Filter effect threshhold
 * Applies theresholdmanipulation to image data
 * @param {Uint8array} data - image data on which filter applied
 * @return {Uint8array} tempData - applied filter effects
 */
var threshold = function(data) {
  return thresholdManipulation(data);
}

/**
 * Filter effect blur
 * Applies convolution of a specified array to image data 
 * @param {Uint8array} data - image data on which filter applied
 * @param {width} - image width
 * @param {height} - image height
 * @return {Uint8array} tempData - applied filter effects
 */
var blur = function(data,width,height) {
  var tempData = convolute(data,width,height,
        [ 1/9, 1/9,  1/9,
           1/9,  1/9, 1/9,
           1/9, 1/9,  1/9 ], true);
  return tempData;
}

/**
 * Filter effect sharpenFilter
 * Applies convolution of a specified array to image data 
 * @param {Uint8array} data - image data on which filter applied
 * @param {width} - image width
 * @param {height} - image height
 * @return {Uint8array} tempData - applied filter effects
 */
var sharpenFilter = function(data,width,height) {
  var tempData = convolute(data,width,height,
        [ 0, -1,  0,
            -1, 5, -1,
            0, -1,  0 ], true);
  return tempData;
}

/**
 * Filter effect usmFilter
 * Applies convolution of a specified array to image data 
 * @param {Uint8array} data - image data on which filter applied
 * @param {width} - image width
 * @param {height} - image height
 * @return {Uint8array} tempData - applied filter effects
 */
var usmFilter = function(data, width, height) { //unsharp masking
  var tempData = convolute(data,width,height,
        [ -1/256, -2/256, -6/256, -4/256, -1/256,
            -4/256, -16/256, -24/256, -16/256, -4/256,
            -6/256, -24/256,  476/256, -24/256, -6/256, 
            -4/256, -16/256, -24/256, -16/256, -4/256,
            -1/256, -4/256, -6/256, -4/256, -1/256], true);
  return tempData;
}

var normal = function(data) {
  return data;
}

/**
 * Filter effect clarendon
 * @param {Uint8array} data - image data on which filter applied
 * @return {Uint8array} tempData - applied filter effects
 */
var clarendon = function(data) {
  return saturation(1.25, contrast(28, brightness(37, data)));
}

/**
 * Filter effect gingham
 * @param {Uint8array} data - image data on which filter applied
 * @return {Uint8array} tempData - applied filter effects
 */
var gingham = function(data) {
  return gamma(0.96, saturation(1.37, contrast(-38, brightness(38, data))));
}

/**
 * Filter effect moon
 * @param {Uint8array} data - image data on which filter applied
 * @return {Uint8array} tempData - applied filter effects
 */
var moon = function(data) {
  return saturation(0, brightness(67, data));

}

/**
 * Filter effect lark
 * @param {Uint8array} data - image data on which filter applied
 * @return {Uint8array} tempData - applied filter effects
 */
var lark = function(data) {
  return gamma(0.57, saturation(1.34, contrast(17, brightness(45, data))));
}

/**
 * Filter effect lipstick
 * @param {Uint8array} data - image data on which filter applied
 * @return {Uint8array} tempData - applied filter effects
 */
var lipstick = function(data) {
  return lipstickManipulation(data);
}

/**
 * Filter effect colorize
 * @param {Uint8array} data - image data on which filter applied
 * @return {Uint8array} tempData - applied filter effects
 */
var colorize = function(data) {
  return reduceColors(data);
}

/**
 * Filter effect reyes
 * @param {Uint8array} data - image data on which filter applied
 * @return {Uint8array} tempData - applied filter effects
 */
var reyes = function(data) {
  return seipa(0.21, gamma(2, brightness(21, data)));
}

/**
 * Filter effect juno
 * @param {Uint8array} data - image data on which filter applied
 * @return {Uint8array} tempData - applied filter effects
 */
var juno = function(data) {
  return tint(18, gamma(1.92, vibrance(-64, data)));
}

/**
 * Filter effect slumber
 * @param {Uint8array} data - image data on which filter applied
 * @return {Uint8array} tempData - applied filter effects
 */
var slumber = function(data) {
  return contrast(33, seipa(0.09, tint(21, gamma(1.25, vibrance(-10, data)))));
}

/**
 * Filter effect xproII
 * @param {Uint8array} data - image data on which filter applied
 * @return {Uint8array} tempData - applied filter effects
 */
var xproII = function(data) {
  return vibrance(-45, tint(10, contrast(50, brightness(10, data))));
}

/**
 * Filter effect sierra
 * @param {Uint8array} data - image data on which filter applied
 * @return {Uint8array} tempData - applied filter effects
 */
var sierra = function(data) {
  return vibrance(-40, gamma(1.29, saturation(1.11, contrast(-32, brightness(15, data)))));
}

/**
 * Filter effect inkwell
 * @param {Uint8array} data - image data on which filter applied
 * @return {Uint8array} tempData - applied filter effects
 */
var inkwell = function(data) {
  return saturation(0, brightness(4, contrast(48, vibrance(74, data))));
}

/**
 * Filter effect filter1997
 * @param {Uint8array} data - image data on which filter applied
 * @return {Uint8array} tempData - applied filter effects
 */
var filter1997 = function(data) {
  return tint(-38, gamma(1.24, contrast(13, brightness(28, data))));
}

/**
 * Filter effect ashby
 * @param {Uint8array} data - image data on which filter applied
 * @return {Uint8array} tempData - applied filter effects
 */
var ashby = function(data) {
  return vibrance(4, gamma(2, saturation(1.37, brightness(11, data))));
}