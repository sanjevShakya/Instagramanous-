
var Manipulator = (function() {
	var instance;
	function Manipulator() {
		var editBox = document.getElementsByClassName('edit-box-container')[0];
		this.element
		this.slider;
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
			this.element.setAttribute('class','manipulator')
			this.slider.setAttribute('autocomplete','off');
			this.slider.setAttribute('value', '0');
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
			editBox.appendChild(this.element);
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

		this.init = function() {
			brightness.init();
			brightness.setId('brightnessSlider');
			brightness.setType('range');
			brightness.setMaxValue('25');
			brightness.setMinValue('-25');
			brightness.setLabel('Brightness');
			brightness.append();
		}

		this.setBrightness = function(canvasInstance) {
			var context = canvasInstance.getContext();
			var previousValue = 0;
			var brightnessSlider = document.getElementById('brightnessSlider');
			var imageData = context.getImageData(0, 0, canvasInstance.getWidth(), canvasInstance.getHeight());
			var data = imageData.data;
			brightnessSlider.oninput = function(e) {
				var currentValue = brightnessSlider.value;
				var step = 0;
				var slideLeft = false;
				if(currentValue >= 0 && previousValue >= currentValue) {
					slideLeft = true;
				}else if(currentValue < 0 && previousValue <= currentValue) {
					slideLeft = true;
				}else {
					slideLeft = false;
				}
				if(slideLeft) {
					step = step + (currentValue - previousValue);
					step *=1;
				}
				if(!slideLeft) {
					step = step + (previousValue - currentValue);
					step *=-1;
				}	
				previousValue = currentValue;
				// brightness change algorithm
				for(var i=0; i< data.length; i+=4) {
					data[i] = Util.truncate(data[i] + step)//R
					data[i+1] =Util.truncate(data[i+1] + step) //G
					data[i+2] =Util.truncate(data[i+2] + step)//B
				}
				context.putImageData(imageData, 0, 0);
			}
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
		
		this.init = function() {
			contrast.init();
			contrast.setId('contrastSlider');
			contrast.setType('range');
			contrast.setMaxValue('25');
			contrast.setMinValue('-25');
			contrast.setLabel('Contrast');
			contrast.append();
		}

		this.setContrast = function(canvasInstance) {
			var context = canvasInstance.getContext();
			var previousValue = 0;
			var contrastSlider = document.getElementById('contrastSlider');
			var imageData = context.getImageData(0, 0, canvasInstance.getWidth(), canvasInstance.getHeight());
			var data = imageData.data;
			contrastSlider.oninput = function(e) {
				var currentValue = contrastSlider.value;
				var step = 0;
				var slideLeft = false;
				if(currentValue >= 0 && previousValue >= currentValue) {
					slideLeft = true;
				}else if(currentValue < 0 && previousValue <= currentValue) {
					slideLeft = true;
				}else {
					slideLeft = false;
				}
				if(slideLeft) {
					step = step + (currentValue - previousValue);
					step *=1;
				}
				if(!slideLeft) {
					step = step + (previousValue - currentValue);
					step *=-1;
				}	
				previousValue = currentValue;
				// brightness change algorithm
				var factor = getCorrectionFactor(step);
				for(var i=0; i< data.length; i+=4) {
					
					data[i] = Util.truncate(factor * (data[i] - 128) + 128)//R
					data[i+1] =Util.truncate(factor *(data[i+1] - 128) + 128) //G
					data[i+2] =Util.truncate(factor *(data[i+2] -128) + 128)//B
				}
				context.putImageData(imageData, 0, 0);
			}
		}

		var getCorrectionFactor = function(value) {
			return ((259 * (value + 255)) / (255 * (259 - value)))
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
		
		this.init = function() {
			gamma.init();
			gamma.setId('gammaSlider');
			gamma.setType('range');
			gamma.setMaxValue('3');
			gamma.setMinValue('0.01');
			gamma.setValue('1');
			gamma.setStep('0.01');
			gamma.setLabel('Gamma');
			gamma.append();
		}

		this.setGamma = function(canvasInstance) {
			var context = canvasInstance.getContext();
			var contrastSlider = document.getElementById('gammaSlider');
			var imageData = context.getImageData(0, 0, canvasInstance.getWidth(), canvasInstance.getHeight());
			var data = imageData.data;
			var copyData = imageData.data.slice();
			
			gammaSlider.oninput = function(e) {
				var sliderValue = parseFloat(e.target.value);
				var temp = gammaManipulation(sliderValue, data);
				restoreImageData(data, temp);
				context.putImageData(imageData, 0, 0);
				restoreImageData(data,copyData);
			}
		}

		var restoreImageData = function(data, copyData) {
			for(var i =0; i < data.length; i+=4){
				data[i] = copyData[i];
				data[i+1] = copyData[i+1];
				data[i+2] = copyData[i+2];
			}
		}

		var gammaManipulation = function(s, _data) {
				var correctionFactor = getCorrectionFactor(s);
				for(var i=0; i< _data.length; i+=4) {			
					_data[i] = 255 * (Math.pow((_data[i] / 255), correctionFactor))//R
					_data[i+1] = 255 * (Math.pow((_data[i+1] / 255), correctionFactor)) //G
					_data[i+2] = 255 * (Math.pow((_data[i+2] / 255), correctionFactor))//B
				}
				return _data
		}


		var getCorrectionFactor = function(value) {
			return (1 / value);
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

// var Saturation = (function() {
// 	var instance;
// 	function Saturation() {
// 		var saturation = Manipulator.getInstance();
		
// 		this.init = function() {
// 			saturation.init();
// 			saturation.setId('saturationSlider');
// 			saturation.setType('range');
// 			saturation.setMaxValue('1.5');
// 			saturation.setMinValue('1');
// 			saturation.setValue('1');
// 			saturation.setStep('0.01');
// 			saturation.setLabel('Saturation');
// 			saturation.append();
// 		}

// 		this.setSaturation = function(canvasInstance) {
// 			var context = canvasInstance.getContext();
// 			var contrastSlider = document.getElementById('saturationSlider');
// 			var imageData = context.getImageData(0, 0, canvasInstance.getWidth(), canvasInstance.getHeight());
// 			var data = imageData.data;
// 			var copyData = imageData.data.slice();
// 			var copiedImageData = {};
// 			//saturation constants 
// 			var totalRange = 2;
// 			var previousValue=1;
// 			saturationSlider.oninput = function(e) {
// 				var slideLeft = false;
// 				var currentValue;
				
// 				var s = parseFloat(e.target.value);
// 				var currentValue = parseFloat(e.target.value);
// 				if(s >= 1 && previousValue < currentValue) {
// 					slideLeft = true;
// 				}else {
// 					slideLeft = false;
// 				}

// 				if(slideLeft) {
// 					copiedImageData[s] = copyData;
//  					saturationManipulation(s, data);
//  					copyData = imageData.data.slice();
// 				}

// 				if(!slideLeft) {
// 					restoreImageData(data, copiedImageData[s]);
// 				}

// 				previousValue = currentValue;
// 				context.putImageData(imageData, 0, 0);
// 			}
// 		}

// 		var restoreImageData = function(data, copyData) {
// 			console.log('inside restore image');
// 			for(var i =0; i < data.length; i+=4){
// 				data[i] = copyData[i];
// 				data[i+1] = copyData[i+1];
// 				data[i+2] = copyData[i+2];
// 			}
// 		}

// 		var saturationManipulation = function(s,data) {
// 			var RW = 0.299;
// 			var RG = 0.587;
// 			var RB = 0.114;
// 			var sBar = parseFloat(1 - s);					
// 			var a =  sBar * RW + s;
// 			var b =  sBar * RW;
// 			var c =  sBar * RW;
// 			var d =  sBar * RG;
// 			var e = sBar * RG + s;
// 			var f = sBar * RG;
// 			var g = sBar * RB;
// 			var h = sBar * RB;
// 			var itemp = sBar * RB + s;
// 			for(var i=0; i< data.length; i+=4) {
// 				var tempRed = data[i];
// 				var tempGreen = data[i+1];
// 				var tempBlue = data[i+2];
// 				data[i] = a * tempRed + d * tempGreen + g * tempBlue//R
// 				data[i+1] = b * tempRed + e * tempGreen + h * tempBlue//G
// 				data[i+2] = c * tempRed + f * tempGreen + itemp * tempBlue//B
// 			}
// 		}
// 	}
// 	return {

// 		getInstance: function() {
// 			if(instance == null) {
// 				instance = new Saturation();
// 			}
// 			return instance;
// 		}
// 	}
// })();

var Saturation = (function() {
	var instance;
	function Saturation() {
		var saturation = Manipulator.getInstance();
		
		this.init = function() {
			saturation.init();
			saturation.setId('saturationSlider');
			saturation.setType('range');
			saturation.setMaxValue('2');
			saturation.setMinValue('0');
			saturation.setValue('1');
			saturation.setStep('0.01');
			saturation.setLabel('Saturation');
			saturation.append();
		}

		this.setSaturation = function(canvasInstance) {
			var context = canvasInstance.getContext();
			var contrastSlider = document.getElementById('saturationSlider');
			var imageData = context.getImageData(0, 0, canvasInstance.getWidth(), canvasInstance.getHeight());
			var data = imageData.data;
			var copyData = imageData.data.slice();
			
			//saturation constants 
			var previousValue=1;
			saturationSlider.oninput = function(e) {
				var sliderValue = parseFloat(e.target.value);
				var temp = saturationManipulation(sliderValue, data);
				restoreImageData(data, temp);
				context.putImageData(imageData, 0, 0);
				restoreImageData(data,copyData);
			}
		}

		var restoreImageData = function(data, copyData) {
			for(var i =0; i < data.length; i+=4){
				data[i] = copyData[i];
				data[i+1] = copyData[i+1];
				data[i+2] = copyData[i+2];
			}
		}

		var saturationManipulation = function(s, _data) {
			console.log('saturation manipulator');
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
			for(var i=0; i< _data.length; i+=4) {
				var tempRed = _data[i];
				var tempGreen = _data[i+1];
				var tempBlue = _data[i+2];
				_data[i] = a * tempRed + d * tempGreen + g * tempBlue//R
				_data[i+1] = b * tempRed + e * tempGreen + h * tempBlue//G
				_data[i+2] = c * tempRed + f * tempGreen + itemp * tempBlue//B
			}
			return _data;
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
		
		this.init = function() {
			temperature.init();
			temperature.setId('temperatureSlider');
			temperature.setType('range');
			temperature.setMaxValue('40');
			temperature.setMinValue('-40');
			temperature.setValue('0');
			temperature.setLabel('Temperature');
			temperature.append();
		}

		this.setTemperature = function(canvasInstance) {
			var context = canvasInstance.getContext();
			var temperatureSlider = document.getElementById('temperatureSlider');
			var imageData = context.getImageData(0, 0, canvasInstance.getWidth(), canvasInstance.getHeight());
			var data = imageData.data;
			var copyData = imageData.data.slice();
			
			temperatureSlider.oninput = function(e) {
				var sliderValue = parseFloat(e.target.value);
				var temp = temperatureManipulation(sliderValue, data);
				restoreImageData(data, temp);
				context.putImageData(imageData, 0, 0);
				restoreImageData(data,copyData);
			}
		}

		var restoreImageData = function(data, copyData) {
			for(var i =0; i < data.length; i+=4){
				data[i] = copyData[i];
				data[i+1] = copyData[i+1];
				data[i+2] = copyData[i+2];
			}
		}

		var temperatureManipulation = function(s, _data) {
			for(var i=0; i< _data.length; i+=4) {
				_data[i] = Util.truncate(_data[i] + s)//R
				//_data[i+1] = //G
				_data[i+2] =Util.truncate(_data[i+2] - s)//B
			}
			return _data;
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
		
		this.init = function() {
			tint.init();
			tint.setId('tintSlider');
			tint.setType('range');
			tint.setMaxValue('40');
			tint.setMinValue('-40');
			tint.setValue('0');
			tint.setLabel('Tint');
			tint.append();
		}

		this.setTint = function(canvasInstance) {
			var context = canvasInstance.getContext();
			var tintSlider = document.getElementById('tintSlider');
			var imageData = context.getImageData(0, 0, canvasInstance.getWidth(), canvasInstance.getHeight());
			var data = imageData.data;
			var copyData = imageData.data.slice();
			
			tintSlider.oninput = function(e) {
				var sliderValue = parseFloat(e.target.value);
				var temp = tintManipulation(sliderValue, data);
				restoreImageData(data, temp);
				context.putImageData(imageData, 0, 0);
				restoreImageData(data,copyData);
			}
		}

		var restoreImageData = function(data, copyData) {
			for(var i =0; i < data.length; i+=4){
				data[i] = copyData[i];
				data[i+1] = copyData[i+1];
				data[i+2] = copyData[i+2];
			}
		}

		var tintManipulation = function(s, _data) {
			for(var i=0; i< _data.length; i+=4) {
				_data[i] = _data[i]//R
				_data[i+1] = Util.truncate(_data[i] + s) //G
				_data[i+2] =_data[i+2]//B
			}
			return _data;
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