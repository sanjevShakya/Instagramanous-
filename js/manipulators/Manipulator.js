
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

		this.setMinValue = function(_minValue) {
			this.min = _minValue;
			this.slider.setAttribute('min',_minValue);
		}

		this.setLabel = function(_label) {
			console.log("label set to ",_label);
			this.labelElem.innerHTML = _label;
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
			console.log('insde brightness');
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
				instance = new Contrast();
			}
			return instance;
		}
	}
})();
