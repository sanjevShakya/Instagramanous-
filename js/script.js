;(function() {
	//image height and width 4:3 ratio
	var IMAGE_WIDTH = 800;
	var IMAGE_HEIGHT = 600;
	var OFFSET = 1;
	var CANVAS_WIDTH = parseInt(0.7 * width()); // 70% of window screen
	var CANVAS_HEIGHT = parseInt(height()) - OFFSET;

	

	var file = document.getElementById('getFile');
	file.addEventListener("change",fileSelectHandler, false);

	var canvasInstance = InstaUi.getInstance();

	var brightness = Brightness.getInstance();
	brightness.init();

	var contrast = Contrast.getInstance();
	contrast.init();

	var saturation = Saturation.getInstance();
	saturation.init();

	var gamma = Gamma.getInstance();
	gamma.init();

	var temperature = Temperature.getInstance();
	temperature.init();

	var tint = Tint.getInstance();
	tint.init();

	var vibrance = Vibrance.getInstance();
	vibrance.init();

	var sepia = Sepia.getInstance();
	sepia.init();

	var decolorize = Decolorize.getInstance();
	decolorize.init();

	var alpha = Alpha.getInstance();
	alpha.init();


	function fileSelectHandler(event) {
		if(file) {
			setTimeout(function(){
				handleFile(event.target.files[0]);	
			},200)
						
		
			//setInterval(mainApp, 500);
			setTimeout(function(){
				mainApp();
			},3000);
			

		}
	}

	var mainApp = function() {		
		var context = canvasInstance.getContext();
		var imageData = canvasInstance.getImageData();
		var data = imageData.data;
		var copyData = imageData.data.slice();
		canvasInstance.setCopyData(copyData);
		
		brightness.setBrightness(canvasInstance);
		contrast.setContrast(canvasInstance);
		gamma.setGamma(canvasInstance);
		saturation.setSaturation(canvasInstance);
		temperature.setTemperature(canvasInstance);
		tint.setTint(canvasInstance);
		vibrance.setVibrance(canvasInstance);
		sepia.setSepia(canvasInstance);
		decolorize.setDecolor(canvasInstance);
		alpha.setAlpha(canvasInstance);
		//context.putImageData(imageData, 0, 0);
	
	}

	var handleFile = function(file) {
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
				console.log("height",canvasHeight);
				console.log("width",canvasWidth);
				instaUi.setWidth(canvasWidth);
				instaUi.setHeight(canvasHeight);
				context.drawImage(
					img, 0, 0, width, height, 0, 0, canvasWidth, canvasHeight);
			});
		});
		if(file){
			fr.readAsDataURL(file);
		}
		
	}

	var createFilters = function() {
		var filterInstance = Filter.getInstance();
		filterInstance.createFilters();
		console.log(filterInstance);
	}

	function width(){
   		return window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;
	}

	function height(){
	   return window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight;
	}

	createFilters();

})();