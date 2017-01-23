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

		return {
			getElement : getElement,
			getStyle : getStyle
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
	

	var instaUi = (function() {
		var instance;
		function instaUi() {
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
					instance = new instaUi();
				}

				return instance;

			}
		}
	})();

	var handleFile = function(file) {
		var fr = new FileReader();
		var context = instaUi.getInstance().getContext();
		console.log('context',context);
		fr.addEventListener('load',function(event){
			var imageData = ImageData.getInstance();
			var url = event.target.result;
			var img = new Image();
			img.src = url;
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

	var brightness = document.getElementById('brightness');
	brightness.oninput = function(e) {
		console.log(brightness.value);
	}

	console.log(brightness.value);

	
	createFilters();
	addImage();

})();