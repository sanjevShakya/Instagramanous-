
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
			brightness.setMaxValue('100');
			brightness.setMinValue('-100');
			brightness.setLabel('Brightness');
			brightness.append();
		}

		this.setBrightness = function(canvasInstance) {
			var brightnessSlider = document.getElementById('brightnessSlider');
			
			 //copy of imagedata
			brightnessSlider.oninput = function(e) {
				var copyData = canvasInstance.getCopyData();
				var context = canvasInstance.getContext();
				var imageData = canvasInstance.getImageData();
				var data = imageData.data; //original data
				restoreImageData(data,copyData);
				var sliderValue = parseFloat(e.target.value);
				data = brightnessManipulation(sliderValue, data);
				context.putImageData(imageData, 0, 0);
				//canvasInstance.setContext(context);
				restoreImageData(data, copyData);
			}

			brightnessSlider.onchange = function(e) {
				console.log("brightness value", e.target.value);
				var copyData = canvasInstance.getCopyData();
				var context = canvasInstance.getContext();
				var imageData = canvasInstance.getImageData();
				var data = imageData.data; //original data
				restoreImageData(data,copyData);
				var sliderValue = parseFloat(e.target.value);
				data = brightnessManipulation(sliderValue, data);
				context.putImageData(imageData, 0, 0);
				canvasInstance.setCopyData(data.slice());
			}
		}

		var restoreImageData = function(_data, _copyData) {
			for(var i =0; i < _data.length; i+=4){
				_data[i] = _copyData[i];
				_data[i+1] = _copyData[i+1];
				_data[i+2] = _copyData[i+2];
			}
		}

		var brightnessManipulation = function(s, _data) {
			for(var i=0; i< _data.length; i+=4) {
				_data[i] = Util.truncate(_data[i] + s)//R
				_data[i+1] =Util.truncate(_data[i+1] + s) //G
				_data[i+2] =Util.truncate(_data[i+2] + s)//B
			}
			return _data;
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
			contrast.setMaxValue('50');
			contrast.setMinValue('-50');
			contrast.setLabel('Contrast');
			contrast.append();
		}

		this.setContrast = function(canvasInstance) {
			//copy of imagedata
			var contrastSlider = document.getElementById('contrastSlider');
			contrastSlider.oninput = function(e) {
				var copyData = canvasInstance.getCopyData(); 
				
				var context = canvasInstance.getContext();
				var imageData = canvasInstance.getImageData();
				var data = imageData.data; //original data

				restoreImageData(data,copyData);
				var sliderValue = parseFloat(e.target.value);
				data = contrastManipulation(sliderValue, data);
				context.putImageData(imageData, 0, 0);
				//canvasInstance.setContext(context);
				//canvasInstance.setCopyData(data.slice());
				restoreImageData(data, copyData);
			}

			contrastSlider.onchange = function(e) {
				console.log("contrast value", e.target.value);
				var copyData = canvasInstance.getCopyData(); 
				var context = canvasInstance.getContext();
				var imageData = canvasInstance.getImageData();
				var data = imageData.data; //original data
				restoreImageData(data,copyData);
				var sliderValue = parseFloat(e.target.value);
				data = contrastManipulation(sliderValue, data);
				context.putImageData(imageData, 0, 0);
				canvasInstance.setCopyData(data.slice());

			}
		}

		var restoreImageData = function(data, copyData) {
			for(var i =0; i < data.length; i+=4){
				data[i] = copyData[i];
				data[i+1] = copyData[i+1];
				data[i+2] = copyData[i+2];
			}
		}

		var contrastManipulation = function(s, _data) {
			var factor = getCorrectionFactor(s);
			for(var i=0; i< _data.length; i+=4) {			
				_data[i] = Util.truncate(factor * (_data[i] - 128) + 128)//R
				_data[i+1] =Util.truncate(factor *(_data[i+1] - 128) + 128) //G
				_data[i+2] =Util.truncate(factor *(_data[i+2] -128) + 128)//B
			}
			return _data;
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
			gamma.setMaxValue('2');
			gamma.setMinValue('0.01');
			gamma.setValue('1');
			gamma.setStep('0.01');
			gamma.setLabel('Gamma');
			gamma.append();
		}

		this.setGamma = function(canvasInstance) {
			var contrastSlider = document.getElementById('gammaSlider');
			//context.putImageData(imageData, 0, 0);
			gammaSlider.oninput = function(e) {
				var copyData = canvasInstance.getCopyData(); 
				
				var context = canvasInstance.getContext();
				var imageData = canvasInstance.getImageData();
				var data = imageData.data; //original data
				restoreImageData(data,copyData);
				var sliderValue = parseFloat(e.target.value);
				data = gammaManipulation(sliderValue, data);
				context.putImageData(imageData, 0, 0);
				restoreImageData(data, copyData);
			}

			gammaSlider.onchange = function(e) {
				console.log("gamma value", e.target.value);
				var copyData = canvasInstance.getCopyData(); 
				var context = canvasInstance.getContext();
				var imageData = canvasInstance.getImageData();
				var data = imageData.data; //original data

				restoreImageData(data,copyData);
				var sliderValue = parseFloat(e.target.value);
				data = gammaManipulation(sliderValue, data);
				context.putImageData(imageData, 0, 0);
				canvasInstance.setCopyData(data.slice());
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
			var saturationSlider = document.getElementById('saturationSlider');
			saturationSlider.oninput = function(e) {
				var copyData = canvasInstance.getCopyData(); 			
				var context = canvasInstance.getContext();
				var imageData = canvasInstance.getImageData();
				var data = imageData.data; //original data

				restoreImageData(data,copyData);
				var sliderValue = parseFloat(e.target.value);
				data = saturationManipulation(sliderValue, data);
				context.putImageData(imageData, 0, 0);
				restoreImageData(data, copyData);
			}

			saturationSlider.onchange = function(e) {
				console.log("saturation value", e.target.value);
				var copyData = canvasInstance.getCopyData(); 
				var context = canvasInstance.getContext();
				var imageData = canvasInstance.getImageData();
				var data = imageData.data; //original data

				restoreImageData(data,copyData);
				var sliderValue = parseFloat(e.target.value);
				data = saturationManipulation(sliderValue, data);
				context.putImageData(imageData, 0, 0);
				canvasInstance.setCopyData(data.slice());
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
			temperature.setMaxValue('50');
			temperature.setMinValue('-50');
			temperature.setValue('0');
			temperature.setLabel('Temperature');
			temperature.append();
		}

		this.setTemperature = function(canvasInstance) {
			var temperatureSlider = document.getElementById('temperatureSlider');
		
			temperatureSlider.oninput = function(e) {
				var copyData = canvasInstance.getCopyData();
				var context = canvasInstance.getContext();
				var imageData = canvasInstance.getImageData();
				var data = imageData.data; //original data
				restoreImageData(data,copyData);
				var sliderValue = parseFloat(e.target.value);
				data = temperatureManipulation(sliderValue, data);
				context.putImageData(imageData, 0, 0);
				restoreImageData(data, copyData);
			}

			temperatureSlider.onchange = function(e) {
				console.log("temperature value", e.target.value);
				var copyData = canvasInstance.getCopyData();
				var context = canvasInstance.getContext();
				var imageData = canvasInstance.getImageData();
				var data = imageData.data; //original data
				restoreImageData(data,copyData);
				var sliderValue = parseFloat(e.target.value);
				data = temperatureManipulation(sliderValue, data);
				context.putImageData(imageData, 0, 0);
				canvasInstance.setCopyData(data.slice());
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
			tint.setMaxValue('50');
			tint.setMinValue('-50');
			tint.setValue('0');
			tint.setLabel('Color Tint');
			tint.append();
		}

		this.setTint = function(canvasInstance) {
			var tintSlider = document.getElementById('tintSlider');
			
			tintSlider.oninput = function(e) {
				var copyData = canvasInstance.getCopyData();
				var context = canvasInstance.getContext();
				var imageData = canvasInstance.getImageData();
				var data = imageData.data; //original data
				restoreImageData(data,copyData);
				var sliderValue = parseFloat(e.target.value);
				data = tintManipulation(sliderValue, data);
				context.putImageData(imageData, 0, 0);
				restoreImageData(data, copyData);
			}

			tintSlider.onchange = function(e) {
				var copyData = canvasInstance.getCopyData();
				var context = canvasInstance.getContext();
				var imageData = canvasInstance.getImageData();
				var data = imageData.data; //original data
				restoreImageData(data,copyData);
				console.log('tint value', e.target.value);
				var sliderValue = parseFloat(e.target.value);
				data = tintManipulation(sliderValue, data);
				context.putImageData(imageData, 0, 0);
				canvasInstance.setCopyData(data.slice());
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
				data[i+1] = Util.truncate(data[i+1] + s) //G
				data[i+2] =data[i+2]//B
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
		
		this.init = function() {
			vibrance.init();
			vibrance.setId('vibranceSlider');
			vibrance.setType('range');
			vibrance.setMaxValue('200');
			vibrance.setMinValue('-200');
			vibrance.setValue('0');
			vibrance.setLabel('Vibrance');
			vibrance.append();
		}

		this.setVibrance = function(canvasInstance) {
			var vibranceSlider = document.getElementById('vibranceSlider');
			
			vibranceSlider.oninput = function(e) {
				var copyData = canvasInstance.getCopyData();
				var context = canvasInstance.getContext();
				var imageData = canvasInstance.getImageData();
				var data = imageData.data; //original data
				restoreImageData(data,copyData);
				var sliderValue = parseFloat(e.target.value);
				data = vibranceManipulation(sliderValue, data);
				context.putImageData(imageData, 0, 0);
				restoreImageData(data, copyData);
			}

			vibranceSlider.onchange = function(e) {
				var copyData = canvasInstance.getCopyData();
				var context = canvasInstance.getContext();
				var imageData = canvasInstance.getImageData();
				var data = imageData.data; //original data
				restoreImageData(data,copyData);
				console.log('vibrance value', e.target.value);
				var sliderValue = parseFloat(e.target.value);
				data = vibranceManipulation(sliderValue, data);
				context.putImageData(imageData, 0, 0);
				canvasInstance.setCopyData(data.slice());
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
				if (r < max) r = r + (max - data[i]) * amt;
				if (g < max) g = g + (max - data[i+1]) * amt;
				if (b < max) b = b + (max - data[i+2]) * amt;
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
		
		this.init = function() {
			sepia.init();
			sepia.setId('sepiaSlider');
			sepia.setType('range');
			sepia.setMaxValue('10');
			sepia.setMinValue('-10');
			sepia.setValue('0');
			sepia.setStep('0.01');
			sepia.setLabel('Sepia');
			sepia.append();
		}

		this.setSepia = function(canvasInstance) {
			var sepiaSlider = document.getElementById('sepiaSlider');
			
			sepiaSlider.oninput = function(e) {
				var copyData = canvasInstance.getCopyData();
				var context = canvasInstance.getContext();
				var imageData = canvasInstance.getImageData();
				var data = imageData.data; //original data
				restoreImageData(data,copyData);
				var sliderValue = parseFloat(e.target.value);
				data = sepiaManipulation(sliderValue, data);
				context.putImageData(imageData, 0, 0);
				restoreImageData(data, copyData);
			}

			sepiaSlider.onchange = function(e) {
				var copyData = canvasInstance.getCopyData();
				var context = canvasInstance.getContext();
				var imageData = canvasInstance.getImageData();
				var data = imageData.data; //original data
				restoreImageData(data,copyData);
				console.log('seipa', e.target.value);
				var sliderValue = parseFloat(e.target.value);
				data = sepiaManipulation(sliderValue, data);
				context.putImageData(imageData, 0, 0);
				canvasInstance.setCopyData(data.slice());
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
				data[i] = Util.truncate((r * (1 - (0.607 * s))) + (g * (0.769 * s)) + (b * (0.189 * s)));
				data[i+1] = Util.truncate((r * (0.349 * s)) + (g * (1 - (0.314 * s))) + (b * (0.168 * s)));
				data[i+2] = Util.truncate((r * (0.272 * s)) + (g * (0.534 * s)) + (b * (1- (0.869 * s))));		
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
		
		this.init = function() {
			decolorize.init();
			decolorize.setId('decolorizeSlider');
			decolorize.setType('range');
			decolorize.setMaxValue('255');
			decolorize.setMinValue('0');
			decolorize.setLabel('Decolorize');
			decolorize.append();
		}

		this.setDecolor = function(canvasInstance) {
			var decolorizeSlider = document.getElementById('decolorizeSlider');
			
			decolorizeSlider.oninput = function(e) {
				var copyData = canvasInstance.getCopyData();
				var context = canvasInstance.getContext();
				var imageData = canvasInstance.getImageData();
				var data = imageData.data; //original data
				restoreImageData(data,copyData);
				var sliderValue = parseFloat(e.target.value);
				data = decolorizeManipulation(sliderValue, data);
				context.putImageData(imageData, 0, 0);
				restoreImageData(data, copyData);
			}

			decolorizeSlider.onchange = function(e) {
				var copyData = canvasInstance.getCopyData();
				var context = canvasInstance.getContext();
				var imageData = canvasInstance.getImageData();
				var data = imageData.data; //original data
				restoreImageData(data,copyData);
				console.log('decolorize', e.target.value);
				var sliderValue = parseFloat(e.target.value);
				data = decolorizeManipulation(sliderValue, data);
				context.putImageData(imageData, 0, 0);
				canvasInstance.setCopyData(data.slice());
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

var Alpha = (function() {
	var instance;
	function Alpha() {
		var alpha = Manipulator.getInstance();
		
		this.init = function() {
			alpha.init();
			alpha.setId('alphaSlider');
			alpha.setType('range');
			alpha.setMaxValue('255');
			alpha.setMinValue('-255');
			alpha.setValue('0');
			alpha.setStep('0.01');
			alpha.setLabel('Alpha Value');
			alpha.append();
		}

		this.setAlpha = function(canvasInstance) {
			var alphaSlider = document.getElementById('alphaSlider');
			
			alphaSlider.oninput = function(e) {
				var copyData = canvasInstance.getCopyData();
				var context = canvasInstance.getContext();
				var imageData = canvasInstance.getImageData();
				var data = imageData.data; //original data
				restoreImageData(data,copyData);
				var sliderValue = parseFloat(e.target.value);
				data = alphaManipulation(imageData.height, imageData.width, data);
				context.putImageData(imageData, 0, 0);
				restoreImageData(data, copyData);
			}

			alphaSlider.onchange = function(e) {
				var copyData = canvasInstance.getCopyData();
				var context = canvasInstance.getContext();
				var imageData = canvasInstance.getImageData();
				var data = imageData.data; //original data
				restoreImageData(data,copyData);
				console.log('alpha', e.target.value);
				var sliderValue = parseFloat(e.target.value);
				data = alphaManipulation(imageData.height, imageData.width, data);
				context.putImageData(imageData, 0, 0);
				canvasInstance.setCopyData(data.slice());
			}
		}

		var restoreImageData = function(data, copyData) {
			for(var i =0; i < data.length; i+=4){
				data[i] = copyData[i];
				data[i+1] = copyData[i+1];
				data[i+2] = copyData[i+2];
			}
		}

		var alphaManipulation = function(height,width, data) {
			var count = 0;
			console.log(data);
			for(var i = 0; i < data.length; i+=4) {
				//i is the number of pixel 
				if(exponential(count) < width/2) {
					data[i+3] = 0; 
				}
				count++;
			}
			return data;
		}

		var exponential = function(x) {
			return 100 * Math.pow(x,5);
		}
	}
	return {

		getInstance: function() {
			if(instance == null) {
				instance = new Alpha();
			}
			return instance;
		}
	}
})();

