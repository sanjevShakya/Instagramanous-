;(function() {
	//image height and width 4:3 ratio
	var IMAGE_WIDTH = 800;
	var IMAGE_HEIGHT = 600;

	var Util = (function() {
		
		var getElement = function(classname){
			return document.getElementsByClassName(classname)[0];
		}

		var getStyle = function(element, style) {
			return parseInt(getComputedStyle(element).getPropertyValue(style));
		}

		var truncate = function(value) {
			if(value < 0) {
				value = 0;
			}

			if(value > 255) {
				value = 255
			}

			return value;
		}

		return {
			getElement : getElement,
			getStyle : getStyle,
			truncate : truncate
		}

	})();

	var View  = (function() {
		function View() {
			this.getMainWrapper = function() {
				var element = document.getElementByClassName('main-wrapper')[0];
				return element;
			}

			this.create = function(elementName) {
				var element = document.createElement(elementName);
				return element;
			}

			this.addClass = function(element, className) {
				element.className = className;
			}

			this.append = function(parentElement , childElement) {
				parentElement.appendChild(childElement);
			}

			return {
				getInstance: function() {
					if(instance == null) {
						instance = new View();
					}

					return instance;
				}
			}
		}
	}());

	var ImageData = (function() {
		var instance;
		function ImageData() {
			var imageWidth;
			var imageHeight;
			var image;
			this.getImage = function() {
				return image;
			}

			this.setImage = function(_image) {
				image = _image;
			}

			this.getImageWidth = function() {
				return imageWidth;
			}

			this.getImageHeight = function() {
				return imageHeight;
			}

			this.setImageWidth = function(width) {
				imageWidth = width;
			}

			this.setImageHeight = function(height) {
				imageHeight = height;
			}
		}

		return {
			getInstance : function(){
				if(instance == null) {
					instance = new ImageData();
				}
				return instance;
			}
		}
	})();
	

	var InstaUi = (function() {
		var instance;
		function InstaUi() {
			var canvas = document.getElementById('instaUI');
			var ctx = canvas.getContext('2d');
			var that = this;

			this.setWidth = function(width) {
				canvas.width = width;
			} 

			this.setHeight = function(height) {
				canvas.height = height;
			}

			this.getWidth= function() {
				return canvas.width;
			}

			this.getHeight = function() {
				return canvas.height;
			}

			this.getCanvas = function() {
				return canvas;
			}

			this.getContext = function() {
				return ctx;
			}
		}

		return {
			getInstance: function() {
				if(instance == null) {
					instance = new InstaUi();
				}

				return instance;

			}
		}
	})();

	var handleFile = function(file) {
		var fr = new FileReader();
		var context = InstaUi.getInstance().getContext();
		console.log('context',context);
		fr.addEventListener('load',function(event){
			var imageData = ImageData.getInstance();
			var url = event.target.result;
			var img = new Image();
			img.src = url;
			imageData.setImage(img);
			var width = img.width;
			var height = img.height;
			var aspectRatio = width/height;
			var manipulationWidth = Util.getStyle(Util.getElement('col-2-left'),'width');
			console.log('manipulationWidth',manipulationWidth);
			imageData.setImageHeight(IMAGE_HEIGHT);
			imageData.setImageWidth(aspectRatio * IMAGE_HEIGHT);
			var dx = (manipulationWidth - (aspectRatio * IMAGE_HEIGHT))/2;
			img.addEventListener('load', function(event){
				context.drawImage(
					img, 0, 0, width, height, dx, 0, aspectRatio * IMAGE_HEIGHT, IMAGE_HEIGHT);
			});
		});
		if(file){
			fr.readAsDataURL(file);
		}
		
	}

	var addImage = function() {
		var file = document.querySelector('input[type=file]').files[0];
		var element = document.getElementsByClassName('col-2-left')[0];
		if(file) {
			handleFile(file);	
		}
	}

	var Filters = (function() {
		var instance;

		function Filter() {
			var editPanel = document.getElementsByClassName('col-2-right')[0];
	
			this.element;

			this.init = function() {
				this.element = document.createElement('div');
				this.element.setAttribute('class','filter');
				editPanel.appendChild(this.element);
			}
		}
		return {
			getInstance: function() {
				return new Filter().init();
			}
		}
	})();

	var createFilters = function() {
		for(var i =1; i <= 9 ; i++) {
			Filters.getInstance();
		}
	}

	var brightnessTest = function() {
		var brightness = document.getElementById('brightness');
		var image = ImageData.getInstance().getImage();
		var canvasInstance = InstaUi.getInstance();
		var canvas = canvasInstance.getCanvas(); 
		var context = canvasInstance.getContext();
		var imageData = context.getImageData(0, 0, canvasInstance.getWidth(), canvasInstance.getHeight());
		var originalData = imageData.data.slice();
		var data = imageData.data;
		//image.style.display = 'none';
		var previousValue =0;
		brightness.oninput = function(e) {
			var currentValue = brightness.value;
			var step = 0;
			if(currentValue >= 0 && previousValue < currentValue) {
				step = step + (currentValue - previousValue);
				step *= 1;
			}  
			if(previousValue >= currentValue) {
				step = step + (previousValue - currentValue);
				step *= -1;
			}
			previousValue = currentValue;
			console.log("step",step);
			for(var i=0; i< data.length; i+=4) {
				// data[i] = Util.truncate(data[i] + brightnessValue)//R
				// data[i+1] = Util.truncate(data[i+1] + brightnessValue) //G
				// data[i+2] = Util.truncate(data[i+2] + brightnessValue)//B
				data[i] = Util.truncate(data[i] + step)//R
				data[i+1] =Util.truncate(data[i+1] + step) //G
				data[i+2] =Util.truncate(data[i+2] + step)//B
			}
			 context.putImageData(imageData, 0, 0);
		}

		// var brightnessValue = 100;
			
		// 	for(var i=0; i< data.length; i+=4) {
		// 		data[i] = Util.truncate(data[i] + brightnessValue)//R
		// 		data[i+1] = Util.truncate(data[i+1] + brightnessValue) //G
		// 		data[i+2] = Util.truncate(data[i+2] + brightnessValue)//B
		// 	}
		// context.putImageData(imageData, 0, 0);

		// console.log(brightness.value);

	}

	var shadowTest = function() {
		var shadow = document.getElementById('shadow');
		var image = ImageData.getInstance().getImage();
		var canvasInstance = InstaUi.getInstance();
		var canvas = canvasInstance.getCanvas(); 
		var context = canvasInstance.getContext();
		var imageData = context.getImageData(0, 0, canvasInstance.getWidth(), canvasInstance.getHeight());
		var originalData = imageData.data.slice();
		var data = imageData.data;
		//image.style.display = 'none';
		var previousValue =0;
		shadow.oninput = function(e) {
			var currentValue = shadow.value;
			console.log('shadow value',currentValue);
			var step = 0;
			var slideLeft = false;
			console.log("previousValue",previousValue);
			console.log("currentValue",currentValue);

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
			console.log('slideLeft',slideLeft);

			// if(slideLeft) {
			// 	step = step + (currentValue - previousValue);
			// 	step *= 1;
			// }

			// if(!slideLeft) {
			// 	step = step + (Math.abs(previousValue) - Math.abs(currentValue));
			// 	step *= -1
			// }


			// if(currentValue >= 0 && previousValue < currentValue) {
			// 	step = step + (currentValue - previousValue);
			// 	step *= 1;
			// 	slideLeft = true;
			// }  
			// if(previousValue >= currentValue) {
			// 	step = step + (previousValue - currentValue);
			// 	step *= -1;
			// }
			
			for(var i=0; i< data.length; i+=4) {
				// data[i] = Util.truncate(data[i] + brightnessValue)//R
				// data[i+1] = Util.truncate(data[i+1] + brightnessValue) //G
				// data[i+2] = Util.truncate(data[i+2] + brightnessValue)//B
				data[i] = Util.truncate(data[i] + step)//R
				data[i+1] =Util.truncate(data[i+1] + step) //G
				data[i+2] =Util.truncate(data[i+2] + step)//B
			}
			 context.putImageData(imageData, 0, 0);
		}
	}

	

	
	createFilters();
	addImage();
	setTimeout(function(){
		brightnessTest();
		shadowTest();
	},1000);
	

})();