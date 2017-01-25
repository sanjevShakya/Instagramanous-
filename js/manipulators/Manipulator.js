
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
				var copyData = canvasInstance.getCopyData();
				var context = canvasInstance.getContext();
				var imageData = canvasInstance.getImageData();
				var data = imageData.data; //original data
				restoreImageData(data,copyData);
				console.log('on change', e.target.value);
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
			contrast.setMaxValue('25');
			contrast.setMinValue('-25');
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
			gamma.setMaxValue('3');
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

			temperatureSlider.onchange = function() {
				var copyData = canvasInstance.getCopyData();
				var context = canvasInstance.getContext();
				var imageData = canvasInstance.getImageData();
				var data = imageData.data; //original data
				restoreImageData(data,copyData);
				console.log('on change', e.target.value);
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
			tint.setMaxValue('40');
			tint.setMinValue('-40');
			tint.setValue('0');
			tint.setLabel('Tint');
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
				console.log('on change', e.target.value);
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