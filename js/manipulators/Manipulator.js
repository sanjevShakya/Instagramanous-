/**
* Used to create a div element with label, slider and span for displaying values
* Acts as a generic class for multiple inheritance for other classes like Brightness, Contrast, etc
*/
var Manipulator = (function() {
  var instance;
  function Manipulator() {
    var editBox = document.getElementsByClassName('edit-box-container')[0];
    this.element
    this.slider;
    this.sliderValue;
    this.labelElem;
    this.type;
    this.id;
    this.name = "points";
    this.min;
    this.max;

    this.init = function() {
      this.labelElem = document.createElement('label');
      this.slider = document.createElement('input');
      this.element = document.createElement('div');
      this.element.setAttribute('class','manipulator clearfix')
      this.slider.setAttribute('autocomplete','off');
      this.slider.setAttribute('value', '0');
      this.sliderValue = document.createElement('span');
      this.sliderValue.setAttribute('class','number');
      this.slider.disabled = true;
    }

    this.setTitle = function(title){
      editBox.innerHTML = "<h2>Edit</h2>";
    }

    this.enableSlider = function() {
      this.slider.disabled = false;
    }

    this.setId = function(_id) {
      this.id = _id;
      this.slider.setAttribute('id',_id);
    }

    this.setType = function(_type) {
      this.type = _type;
      this.slider.setAttribute('type',_type);
    }

    this.setMaxValue = function(_maxValue){
      this.max = _maxValue;
      this.slider.setAttribute('max',_maxValue);
    }

    this.setValue = function(_value) {
      this.slider.setAttribute('value',_value);
    }

    this.setMinValue = function(_minValue) {
      this.min = _minValue;
      this.slider.setAttribute('min',_minValue);
    }

    this.setLabel = function(_label) {
      this.labelElem.innerHTML = _label;
    }

    this.setStep = function(_step) {
      this.slider.setAttribute('step',_step);
    }

    this.append = function() {
      this.element.appendChild(this.labelElem);
      this.element.appendChild(this.slider);
      this.element.appendChild(this.sliderValue);
      editBox.appendChild(this.element);
    }

    this.setSliderValue = function(value) {
      this.sliderValue.innerHTML = value;
    }

    this.getSlider = function() {
      return this.slider;
    }

  }

  return {
    getInstance: function() {
      return new Manipulator();
    }
  }
})();

var Brightness = (function() {
  var instance;
  function Brightness() {
    var brightness = Manipulator.getInstance();
    brightness.init();
    brightness.append();

    this.init = function() {
      brightness.setId('brightnessSlider');
      brightness.setType('range');
      brightness.setMaxValue('100');
      brightness.setMinValue('-100');
      brightness.setValue('0');
      brightness.setLabel('Brightness');
    }

    this.resetSlider = function() {
      document.getElementById('brightnessSlider').value = "0";
    }

    this.setBrightness = function(canvasInstance) {
      brightness.enableSlider();
      var brightnessSlider = document.getElementById('brightnessSlider');
      brightnessSlider.addEventListener('input', showBrightness,false);
      brightnessSlider.addEventListener('change', changeBrightness,false);

      function showBrightness(e) {
        var sliderValue = parseInt(e.target.value);
        brightness.setSliderValue(sliderValue);
        var filterData = canvasInstance.getFilterData();
        var context = canvasInstance.getContext();
        var imageData = canvasInstance.getImageData();
        var data = imageData.data; //original data
        restoreImageData(data,filterData);  
        data = brightnessManipulation(sliderValue, data);
        context.putImageData(imageData, 0, 0);
        restoreImageData(data, filterData);
      }

      function changeBrightness(e) {
        var filterData = canvasInstance.getFilterData();
        var context = canvasInstance.getContext();
        var imageData = canvasInstance.getImageData();
        var data = imageData.data; //original data
        restoreImageData(data,filterData);
        var sliderValue = parseInt(e.target.value);
        data = brightnessManipulation(sliderValue, data);
        context.putImageData(imageData, 0, 0);
        canvasInstance.setFilterData(data.slice());
      }

    }

    var restoreImageData = function(data, copyData) {
      for(var i =0; i < data.length; i+=4){
        data[i] = copyData[i];
        data[i+1] = copyData[i+1];
        data[i+2] = copyData[i+2];
      }
    }

    var brightnessManipulation = function(s, data) {
      var maxValue = 255;
      var minValue= 0;
      for(var i=0; i< data.length; i+=4) {
        data[i] = (data[i] + s)//R
        data[i+1] =(data[i+1] + s) //G
        data[i+2] =(data[i+2] + s)//B
        
        if(data[i] > maxValue) data[i] = maxValue;
        if(data[i+1] > maxValue) data[i+1] = maxValue;
        if(data[i+2] > maxValue) data[i+2] = maxValue;
        if(data[i] < minValue) data[i] = minValue;
        if(data[i+1] < minValue) data[i+1] = minValue;
        if(data[i+2] < minValue) data[i+2] = minValue;
      }
      return data;
    } 

  }
  return {

    getInstance: function() {
      if(instance == null) {
        instance = new Brightness();
      }
      return instance;
    }
  }
})();

var Contrast = (function() {
  var instance;
  function Contrast() {
    var contrast = Manipulator.getInstance();
    contrast.init();
    contrast.append();

    this.init = function() {
      contrast.setId('contrastSlider');
      contrast.setType('range');
      contrast.setMaxValue('50');
      contrast.setMinValue('-50');
      contrast.setValue('0');
      contrast.setLabel('Contrast');   
    }

    this.resetSlider = function() {
      document.getElementById('contrastSlider').value = "0";
    }

    this.setContrast = function(canvasInstance) {
      contrast.enableSlider();
      //copy of imagedata
      var contrastSlider = document.getElementById('contrastSlider');
      contrastSlider.addEventListener('input', showContrast,false);
      contrastSlider.addEventListener('change', changeContrast,false);
      function showContrast(e) {
        var sliderValue = parseInt(e.target.value);
        contrast.setSliderValue(sliderValue);
        var filterData = canvasInstance.getFilterData();    
        var context = canvasInstance.getContext();
        var imageData = canvasInstance.getImageData();
        var data = imageData.data; //original data
        restoreImageData(data,filterData);  
        data = contrastManipulation(sliderValue, data);
        context.putImageData(imageData, 0, 0);
        restoreImageData(data, filterData);
      }

      function changeContrast(e) {
        var filterData = canvasInstance.getFilterData(); 
        var context = canvasInstance.getContext();
        var imageData = canvasInstance.getImageData();
        var data = imageData.data; //original data
        restoreImageData(data,filterData);
        var sliderValue = parseInt(e.target.value);
        data = contrastManipulation(sliderValue, data);
        context.putImageData(imageData, 0, 0);
        canvasInstance.setFilterData(data.slice());
      }
    }

    var restoreImageData = function(data, copyData) {
      for(var i =0; i < data.length; i+=4){
        data[i] = copyData[i];
        data[i+1] = copyData[i+1];
        data[i+2] = copyData[i+2];
      }
    }

    var contrastManipulation = function(s, data) {
      var maxValue = 255;
      var minValue= 0;
      var midValue = 128;
      var factor = (259 * (s + 255)) / (255 * (259 - s))
      for(var i=0; i< data.length; i+=4) {      
        data[i] = (factor * (data[i] - midValue) + midValue)//R
        data[i+1] =(factor *(data[i+1] - midValue) + midValue) //G
        data[i+2] =(factor *(data[i+2] - midValue) + midValue)//B
        if(data[i] > maxValue) data[i] = maxValue;
        if(data[i+1] > maxValue) data[i+1] = maxValue;
        if(data[i+2] > maxValue) data[i+2] = maxValue;
        if(data[i] < minValue) data[i] = minValue;
        if(data[i+1] < minValue) data[i+1] = minValue;
        if(data[i+2] < minValue) data[i+2] = minValue;
      }
      return data;
    }

  }
  return {

    getInstance: function() {
      if(instance == null) {
        instance = new Contrast();
      }
      return instance;
    }
  }
})();

var Gamma = (function() {
  var instance;
  function Gamma() {
    var gamma = Manipulator.getInstance();
    gamma.init();
    gamma.append();

    this.init = function() {
      gamma.setId('gammaSlider');
      gamma.setType('range');
      gamma.setMaxValue('200');
      gamma.setMinValue('0');
      gamma.setValue('100');
      gamma.setLabel('Gamma');
    }

    this.resetSlider = function() {
      document.getElementById('gammaSlider').value = "100";
    }

    this.setGamma = function(canvasInstance) {
      gamma.enableSlider();
      var gammaSlider = document.getElementById('gammaSlider');
      gammaSlider.addEventListener('input', showGamma,false);
      gammaSlider.addEventListener('change', changeGamma,false);

      function showGamma(e) {
        var sliderValue = parseFloat(e.target.value);
        gamma.setSliderValue(sliderValue);
        var filterData = canvasInstance.getFilterData();
        var context = canvasInstance.getContext();
        var imageData = canvasInstance.getImageData();
        var data = imageData.data; //original data
        restoreImageData(data,filterData);      
        data = gammaManipulation(sliderValue, data);
        context.putImageData(imageData, 0, 0);
        restoreImageData(data, filterData);
      }

      function changeGamma(e) {
        var filterData = canvasInstance.getFilterData();
        var context = canvasInstance.getContext();
        var imageData = canvasInstance.getImageData();
        var data = imageData.data; //original data

        restoreImageData(data,filterData);
        var sliderValue = parseFloat(e.target.value);
        data = gammaManipulation(sliderValue, data);
        context.putImageData(imageData, 0, 0);
        canvasInstance.setFilterData(data.slice());
      }

    }

    var restoreImageData = function(data, copyData) {
      for(var i =0; i < data.length; i+=4){
        data[i] = copyData[i];
        data[i+1] = copyData[i+1];
        data[i+2] = copyData[i+2];
      }
    }

    var gammaManipulation = function(s, data) {
        var correctionFactor = Math.round((100/s) * 10) / 10;
        for(var i=0; i< data.length; i+=4) {      
          data[i] = 255 * (Math.pow((data[i] / 255), correctionFactor))//R
          data[i+1] = 255 * (Math.pow((data[i+1] / 255), correctionFactor)) //G
          data[i+2] = 255 * (Math.pow((data[i+2] / 255), correctionFactor))//B
        }
        return data;
    }
  }
  return {

    getInstance: function() {
      if(instance == null) {
        instance = new Gamma();
      }
      return instance;
    }
  }
})();

var Saturation = (function() {
  var instance;
  function Saturation() {
    var saturation = Manipulator.getInstance();
    saturation.init();
    saturation.append();
    this.init = function() {   
      saturation.setId('saturationSlider');
      saturation.setType('range');
      saturation.setMaxValue('2');
      saturation.setMinValue('0');
      saturation.setValue('1');
      saturation.setStep('0.01');
      saturation.setLabel('Saturation');
      
    }

    this.resetSlider = function() {
      document.getElementById('saturationSlider').value = "1";
    }

    this.setSaturation = function(canvasInstance) {
      saturation.enableSlider();
      var saturationSlider = document.getElementById('saturationSlider');
      saturationSlider.addEventListener('input', showSaturation, false);
      saturationSlider.addEventListener('change', changeSaturation, false);
      function showSaturation(e) {
        var sliderValue = parseFloat(e.target.value);
        saturation.setSliderValue(sliderValue); 
        var filterData = canvasInstance.getFilterData();      
        var context = canvasInstance.getContext();
        var imageData = canvasInstance.getImageData();
        var data = imageData.data; //original data
        restoreImageData(data,filterData);       
        data = saturationManipulation(sliderValue, data);
        context.putImageData(imageData, 0, 0);
        restoreImageData(data, filterData);
      }

      function changeSaturation(e) {
        var filterData = canvasInstance.getFilterData(); 
        var context = canvasInstance.getContext();
        var imageData = canvasInstance.getImageData();
        var data = imageData.data; //original data
        restoreImageData(data,filterData);
        var sliderValue = parseFloat(e.target.value);
        data = saturationManipulation(sliderValue, data);
        context.putImageData(imageData, 0, 0);
        canvasInstance.setFilterData(data.slice());
      }
    }

    var restoreImageData = function(data, copyData) {
      for(var i =0; i < data.length; i+=4){
        data[i] = copyData[i];
        data[i+1] = copyData[i+1];
        data[i+2] = copyData[i+2];
      }
    }

    var saturationManipulation = function(s, data) {
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
  }
  return {

    getInstance: function() {
      if(instance == null) {
        instance = new Saturation();
      }
      return instance;
    }
  }
})();

var Temperature = (function() {
  var instance;
  function Temperature() {
    var temperature = Manipulator.getInstance();
    temperature.init();
    temperature.append();
    this.init = function() {
      
      temperature.setId('temperatureSlider');
      temperature.setType('range');
      temperature.setMaxValue('50');
      temperature.setMinValue('-50');
      temperature.setValue('0');
      temperature.setLabel('Temperature');
    }

    this.resetSlider = function() {
      document.getElementById('temperatureSlider').value = "0";
    }

    this.setTemperature = function(canvasInstance) {
      var temperatureSlider = document.getElementById('temperatureSlider');
      temperature.enableSlider();
      temperatureSlider.addEventListener('input', showTemperature, false);
      temperatureSlider.addEventListener('change', changeTemperature, false);
      
      function showTemperature(e) {
        var sliderValue = parseInt(e.target.value);
        temperature.setSliderValue(sliderValue);
        //var copyData = canvasInstance.getCopyData();
        var filterData = canvasInstance.getFilterData();
        var context = canvasInstance.getContext();
        var imageData = canvasInstance.getImageData();
        var data = imageData.data; //original data
        restoreImageData(data,filterData);
        data = temperatureManipulation(sliderValue, data);
        context.putImageData(imageData, 0, 0);
        restoreImageData(data, filterData);
      }

      function changeTemperature(e) {
        var filterData = canvasInstance.getFilterData();
        var context = canvasInstance.getContext();
        var imageData = canvasInstance.getImageData();
        var data = imageData.data; //original data
        restoreImageData(data,filterData);
        var sliderValue = parseInt(e.target.value);
        data = temperatureManipulation(sliderValue, data);
        context.putImageData(imageData, 0, 0);
        canvasInstance.setFilterData(data.slice());
      }
    }

    var restoreImageData = function(data, copyData) {
      for(var i =0; i < data.length; i+=4){
        data[i] = copyData[i];
        data[i+1] = copyData[i+1];
        data[i+2] = copyData[i+2];
      }
    }

    var temperatureManipulation = function(s, data) {
      for(var i=0; i< data.length; i+=4) {
        data[i] =(data[i] + s)//R
        //_data[i+1] = //G
        data[i+2] =(data[i+2] - s)//B

        if(data[i] > 255) data[i] = 255;
        if(data[i+2] > 255) data[i+2] = 255;
        if(data[i] < 0) data[i] = 0;
        if(data[i+2] < 0) data[i+2] = 0;
      }
      return data;
    }
  }
  return {

    getInstance: function() {
      if(instance == null) {
        instance = new Temperature();
      }
      return instance;
    }
  }
})();

var Tint = (function() {
  var instance;
  function Tint() {
    var tint = Manipulator.getInstance();
    tint.init();
    tint.append();
    this.init = function() {
      
      tint.setId('tintSlider');
      tint.setType('range');
      tint.setMaxValue('50');
      tint.setMinValue('-50');
      tint.setValue('0');
      tint.setLabel('Color Tint');
      
    }

    this.resetSlider = function() {
      document.getElementById('tintSlider').value = "0";
    }

    this.setTint = function(canvasInstance) {
      var tintSlider = document.getElementById('tintSlider');
      tint.enableSlider();
      tintSlider.addEventListener('input', showTint, false);
      tintSlider.addEventListener('change', changeTint, false);
      
      function showTint(e) {
        var sliderValue = parseInt(e.target.value);
        tint.setSliderValue(sliderValue);
        var filterData = canvasInstance.getFilterData();
        var context = canvasInstance.getContext();
        var imageData = canvasInstance.getImageData();
        var data = imageData.data; //original data
        restoreImageData(data,filterData);
        data = tintManipulation(sliderValue, data);
        context.putImageData(imageData, 0, 0);
        restoreImageData(data, filterData);
      }

      function changeTint(e) {
        var sliderValue = parseInt(e.target.value);
        var filterData = canvasInstance.getFilterData();
        var context = canvasInstance.getContext();
        var imageData = canvasInstance.getImageData();
        var data = imageData.data; //original data
        restoreImageData(data,filterData); 
        data = tintManipulation(sliderValue, data);
        context.putImageData(imageData, 0, 0);
        canvasInstance.setFilterData(data.slice());
      }
    }

    var restoreImageData = function(data, copyData) {
      for(var i =0; i < data.length; i+=4){
        data[i] = copyData[i];
        data[i+1] = copyData[i+1];
        data[i+2] = copyData[i+2];
      }
    }

    var tintManipulation = function(s, data) {
      for(var i=0; i< data.length; i+=4) {
        data[i] = data[i]//R
        data[i+1] = (data[i+1] + s) //G
        data[i+2] =data[i+2]//B
        if(data[i+1] > 255) data[i+1] = 255;
        if(data[i+1] < 0) data[i+1] = 0;
      }
      return data;
    }
  }
  return {

    getInstance: function() {
      if(instance == null) {
        instance = new Tint();
      }
      return instance;
    }
  }
})();

var Vibrance = (function() {
  var instance;
  function Vibrance() {
    var vibrance = Manipulator.getInstance();
    vibrance.init();
    vibrance.append();
    this.init = function() {
      
      vibrance.setId('vibranceSlider');
      vibrance.setType('range');
      vibrance.setMaxValue('200');
      vibrance.setMinValue('-200');
      vibrance.setValue('0');
      vibrance.setLabel('Vibrance');
      
    }

    this.resetSlider = function() {
      document.getElementById('vibranceSlider').value = "0";
    }

    this.setVibrance = function(canvasInstance) {
      var vibranceSlider = document.getElementById('vibranceSlider');
      vibrance.enableSlider();
      vibranceSlider.addEventListener('input', showVibrance, false);
      vibranceSlider.addEventListener('change', changeVibrance, false);

      function showVibrance(e) {
        var sliderValue = parseInt(e.target.value);
        vibrance.setSliderValue(sliderValue);
        var filterData = canvasInstance.getFilterData();
        var context = canvasInstance.getContext();
        var imageData = canvasInstance.getImageData();
        var data = imageData.data; //original data
        restoreImageData(data,filterData);      
        data = vibranceManipulation(sliderValue, data);
        context.putImageData(imageData, 0, 0);
        restoreImageData(data, filterData);
      }

      function changeVibrance(e) {
        var filterData = canvasInstance.getFilterData();
        var context = canvasInstance.getContext();
        var imageData = canvasInstance.getImageData();
        var data = imageData.data; //original data
        restoreImageData(data,filterData);
        var sliderValue = parseInt(e.target.value);
        data = vibranceManipulation(sliderValue, data);
        context.putImageData(imageData, 0, 0);
        canvasInstance.setFilterData(data.slice());
      }
    }

    var restoreImageData = function(data, copyData) {
      for(var i =0; i < data.length; i+=4){
        data[i] = copyData[i];
        data[i+1] = copyData[i+1];
        data[i+2] = copyData[i+2];
      }
    }

    var vibranceManipulation = function(s, data) {
      for(var i = 0; i < data.length; i+=4) {
        var r = data[i];
        var g = data[i+1];
        var b = data[i+2];
        var max = Math.max(r, g, b);
        var avg = (r + g + b) / 3;
        var amt = ((Math.abs(max - avg) * 2 / 255) * s) / 100;
        if (r < max) data[i] = r + (max - data[i]) * amt;
        if (g < max) data[i+1] = g + (max - data[i+1]) * amt;
        if (b < max) data[i+2] = b + (max - data[i+2]) * amt;
      }
      return data;
    }
  }
  return {

    getInstance: function() {
      if(instance == null) {
        instance = new Vibrance();
      }
      return instance;
    }
  }
})();

var Sepia = (function() {
  var instance;
  function Sepia() {
    var sepia = Manipulator.getInstance();
    sepia.init();
    sepia.append();
    this.init = function() {
      sepia.setId('sepiaSlider');
      sepia.setType('range');
      sepia.setMaxValue('10');
      sepia.setMinValue('-10');
      sepia.setValue('0');
      sepia.setStep('0.01');
      sepia.setLabel('Sepia');
      
    }

    this.resetSlider = function() {
      document.getElementById('sepiaSlider').value = "0";
    }

    this.setSepia = function(canvasInstance) {
      var sepiaSlider = document.getElementById('sepiaSlider');
      sepia.enableSlider();
      sepiaSlider.addEventListener('input', showSepia, false);
      sepiaSlider.addEventListener('change', changeSepia, false);

      function showSepia(e) {
        var sliderValue = parseFloat(e.target.value);
        sepia.setSliderValue(sliderValue);
        var filterData = canvasInstance.getFilterData();
        var context = canvasInstance.getContext();
        var imageData = canvasInstance.getImageData();
        var data = imageData.data; //original data
        restoreImageData(data,filterData);     
        data = sepiaManipulation(sliderValue, data);
        context.putImageData(imageData, 0, 0);
        restoreImageData(data, filterData);
      }

      function changeSepia(e) {
        //var copyData = canvasInstance.getCopyData();
        var filterData = canvasInstance.getFilterData();
        var context = canvasInstance.getContext();
        var imageData = canvasInstance.getImageData();
        var data = imageData.data; //original data
        restoreImageData(data,filterData);
        var sliderValue = parseFloat(e.target.value);
        data = sepiaManipulation(sliderValue, data);
        context.putImageData(imageData, 0, 0);
        canvasInstance.setFilterData(data.slice());
      }
    }

    var restoreImageData = function(data, copyData) {
      for(var i =0; i < data.length; i+=4){
        data[i] = copyData[i];
        data[i+1] = copyData[i+1];
        data[i+2] = copyData[i+2];
      }
    }

    var sepiaManipulation = function(s, data) {
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
  }
  return {

    getInstance: function() {
      if(instance == null) {
        instance = new Sepia();
      }
      return instance;
    }
  }
})();

var Decolorize = (function() {
  var instance;
  function Decolorize() {
    var decolorize = Manipulator.getInstance();
    decolorize.init();
    decolorize.append();
    this.init = function() {
      decolorize.setId('decolorizeSlider');
      decolorize.setType('range');
      decolorize.setMaxValue('255');
      decolorize.setMinValue('0');
      decolorize.setValue('0');
      decolorize.setLabel('Decolorize');
    }

    this.resetSlider = function() {
      document.getElementById('decolorizeSlider').value = "0";
    }

    this.setDecolor = function(canvasInstance) {
      var decolorizeSlider = document.getElementById('decolorizeSlider');
      decolorize.enableSlider();
      decolorizeSlider.addEventListener('input', showDecolorize, false);
      decolorizeSlider.addEventListener('change', changeDecolorize, false);

      function showDecolorize(e) {
        var sliderValue = parseInt(e.target.value);
        decolorize.setSliderValue(sliderValue);
        //var copyData = canvasInstance.getCopyData();
        var filterData = canvasInstance.getFilterData();
        var context = canvasInstance.getContext();
        var imageData = canvasInstance.getImageData();
        var data = imageData.data; //original data
        restoreImageData(data,filterData);
        data = decolorizeManipulation(sliderValue, data);
        context.putImageData(imageData, 0, 0);
        restoreImageData(data, filterData);
      }

      function changeDecolorize(e) {
        //var copyData = canvasInstance.getCopyData();
        var filterData = canvasInstance.getFilterData();
        var context = canvasInstance.getContext();
        var imageData = canvasInstance.getImageData();
        var data = imageData.data; //original data
        restoreImageData(data,filterData);
        var sliderValue = parseInt(e.target.value);
        data = decolorizeManipulation(sliderValue, data);
        context.putImageData(imageData, 0, 0);
        canvasInstance.setFilterData(data.slice());
      }
    }

    var restoreImageData = function(data, copyData) {
      for(var i =0; i < data.length; i+=4){
        data[i] = copyData[i];
        data[i+1] = copyData[i+1];
        data[i+2] = copyData[i+2];
      }
    }

    var decolorizeManipulation = function(s, data) {
      s = s * 2.55;
      var sbar = 255 - s;
      for(var i = 0; i < data.length; i+=4) {
        var r = data[i];
        var g = data[i+1];
        var b = data[i+2];  
        if(r > sbar) {
          r = 255;
        } else if (r <= s){
          r = 0;
        }

        if(g > sbar) {
          g = 255;
        } else if(g <= s){
          g = 0;
        }

        if(b > sbar) {
          b = 255;
        } else if(b <= s) {
          b = 0;
        }
        data[i] = r;
        data[i+1] = g;
        data[i+2] = b;
      }
      return data;
    }

  }
  return {

    getInstance: function() {
      if(instance == null) {
        instance = new Decolorize();
      }
      return instance;
    }
  }
})();

var Threshold = (function() {
  var instance;
  function Threshold() {
    var threshold = Manipulator.getInstance();
    threshold.init();
    threshold.append();
    this.init = function() {
      threshold.setId('thresholdSlider');
      threshold.setType('range');
      threshold.setMaxValue('255');
      threshold.setMinValue('0');
      threshold.setValue('128');
      threshold.setLabel('Threshold');
    }

    this.resetSlider = function() {
      document.getElementById('thresholdSlider').value = "128";
    }

    this.setThreshold = function(canvasInstance) {
      var thresholdSlider = document.getElementById('thresholdSlider');
      threshold.enableSlider();
      thresholdSlider.addEventListener('input', showThreshold, false);
      thresholdSlider.addEventListener('change', changeThreshold, false);

      function showThreshold(e) {
        var sliderValue = parseInt(e.target.value);
        threshold.setSliderValue(sliderValue);
        //var copyData = canvasInstance.getCopyData();
        var filterData = canvasInstance.getFilterData();
        var context = canvasInstance.getContext();
        var imageData = canvasInstance.getImageData();
        var data = imageData.data; //original data
        restoreImageData(data,filterData);
        data = thresholdManipulation(sliderValue, data);
        context.putImageData(imageData, 0, 0);
        restoreImageData(data, filterData);
      }

      function changeThreshold(e) {
        //var copyData = canvasInstance.getCopyData();
        var filterData = canvasInstance.getFilterData();
        var context = canvasInstance.getContext();
        var imageData = canvasInstance.getImageData();
        var data = imageData.data; //original data
        restoreImageData(data,filterData);
        var sliderValue = parseInt(e.target.value);
        data = thresholdManipulation(sliderValue, data);
        context.putImageData(imageData, 0, 0);
        canvasInstance.setFilterData(data.slice());
      }
    }

    var restoreImageData = function(data, copyData) {
      for(var i =0; i < data.length; i+=4){
        data[i] = copyData[i];
        data[i+1] = copyData[i+1];
        data[i+2] = copyData[i+2];
      }
    }

    var thresholdManipulation = function(s, data) {
      var thres = s;
      var redV = 0.2126;
      var greenV = 0.7152;
      var blueV = 0.0722;
      for (var i=0; i< data.length; i+=4) {
        var v = (redV * data[i]  + greenV * data[i+1] + blueV * data[i+2] >= thres) ? 255 : 0;
        data[i] = data[i+1] = data[i+2] = v;
      }
      return data;
    }

  }
  return {

    getInstance: function() {
      if(instance == null) {
        instance = new Threshold();
      }
      return instance;
    }
  }
})();
