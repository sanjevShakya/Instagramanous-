;(function() {
	//image height and width 4:3 ratio
	var OFFSET = 1;
	var CANVAS_WIDTH = parseInt(0.7 * width()); // 70% of window screen
	var CANVAS_HEIGHT = parseInt(height()) - OFFSET;

	var file = document.getElementById('getFile');
	file.addEventListener("change",fileSelectHandler, false);
	var mainApp;
	var counter = 0;

	var filterInstance = Filter.getInstance();
	filterInstance.createFilters();

	function fileSelectHandler(event) {
		if(file) {
			setTimeout(function(){
				mainApp = new MainApp();
				mainApp.handleFile(event.target.files[0]);	
				counter++;
			},200)
			//setInterval(mainApp, 500);
			setTimeout(function(){
				mainApp.init();

				mainApp.startProgram();
			},500);
		}
	}

	var dropTarget = function(element) {
		var ELEMENT = element;
		var dropCallbacks = [];

		var dragEventHandler = function(event) {
			Util.addClass(ELEMENT, 'drag-active');
			event.preventDefault();
		};

		var dragOverHandler = function(event) {
			event.preventDefault();
		};

		var dragLeaveHandler = function(event) {
			Util.removeClass(ELEMENT,'drag-active');
		};

		var dropHandler = function(event) {
			event.preventDefault();
			Util.removeClass(ELEMENT,'drag-active');

			if(event.dataTransfer.files.length === 0) {
				return;
			}

			var file = event.dataTransfer.files[0];
			for(var callback of dropCallbacks) {
				if(typeof callback === "function") {
					callback(file);
				}
			}
		};

		this.addDropCallBack = function(callback) {
			if(typeof callback === "function") {
				dropCallbacks.push(callback);
			}
		};
		ELEMENT.addEventListener('dragenter', dragEnterHandler);
		ELEMENT.addEventListener('dragover', dragOverHandler);
		ELEMENT.addEventListener('dragleave', dragLeaveHandler)
		ELEMENT.addEventListener('drop', dropHandler);
		this.element = ELEMENT;
	};

	function MainApp() {

		var brightness = Brightness.getInstance();
		
		var contrast = Contrast.getInstance();
	
		var saturation = Saturation.getInstance();	

		var gamma = Gamma.getInstance();

		var temperature = Temperature.getInstance();	

		var tint = Tint.getInstance();
		
		var vibrance = Vibrance.getInstance();
		
		var sepia = Sepia.getInstance();	

		var decolorize = Decolorize.getInstance();

		

		var canvasInstance = InstaUi.getInstance();
		
		
		this.init = function() {
			brightness.init();
			contrast.init();
			saturation.init();
			gamma.init();
			temperature.init();
			tint.init();
			vibrance.init();
			sepia.init();
			decolorize.init();
		}
		

		this.startProgram = function() {	
			var context = canvasInstance.getContext();
			var imageData = canvasInstance.getImageData();
			var data = imageData.data;
			var copyData = imageData.data.slice();
			canvasInstance.setCopyData(copyData);
			canvasInstance.setFilterData(copyData);
			brightness.setBrightness(canvasInstance);
			contrast.setContrast(canvasInstance);
			gamma.setGamma(canvasInstance);
			saturation.setSaturation(canvasInstance);
			temperature.setTemperature(canvasInstance);
			tint.setTint(canvasInstance);
			vibrance.setVibrance(canvasInstance);
			sepia.setSepia(canvasInstance);
			decolorize.setDecolor(canvasInstance);
		}

		this.handleFile = function(file) {
			var fr = new FileReader();
			var instaUi = InstaUi.getInstance();
			var context = instaUi.getContext();

			fr.addEventListener('load',function(event){
				var url = event.target.result;
				var img = new Image();
				img.src = url;
				
				img.addEventListener('load', function(event){
					var width = img.width;
					var height = img.height;
					var aspectRatio = width/height;
					var canvasHeight = CANVAS_HEIGHT;
					var canvasWidth = parseInt(aspectRatio * canvasHeight);
					instaUi.setWidth(canvasWidth);
					instaUi.setHeight(canvasHeight);
					context.clearRect(0, 0, canvasWidth,canvasHeight);
					context.drawImage(
						img, 0, 0, width, height, 0, 0, canvasWidth, canvasHeight);
				});
			});
			if(file){
				fr.readAsDataURL(file);
			}
		}
		
	}

	function width() {
   		return window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;
	}

	function height(){
	   return window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight;
	}

})();