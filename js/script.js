;(function() {
	//image height and width 4:3 ratio
	var IMAGE_WIDTH = 800;
	var IMAGE_HEIGHT = 600;

	var file = document.getElementById('getFile');
	file.addEventListener("change",fileSelectHandler, false);
	
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


	function fileSelectHandler(event) {
		if(file) {
			handleFile(event.target.files[0]);				
		
			//setInterval(mainApp, 500);
			setTimeout(function(){
				mainApp();
			},1000);
			

		}
	}

	var mainApp = function() {
		var canvasInstance = InstaUi.getInstance();
		var context = canvasInstance.getContext();
		var imageData = canvasInstance.getImageData();;
		var data = imageData.data;
		var copyData = imageData.data.slice();
		canvasInstance.setCopyData(copyData);
		brightness.setBrightness(canvasInstance);
		contrast.setContrast(canvasInstance);
		gamma.setGamma(canvasInstance);
		saturation.setSaturation(canvasInstance);
		temperature.setTemperature(canvasInstance);
		tint.setTint(canvasInstance);
		createFilters();
	
		//context.putImageData(imageData, 0, 0);
	
	}

	var handleFile = function(file) {
		var fr = new FileReader();
		var context = InstaUi.getInstance().getContext();
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
			imageData.setImageHeight(IMAGE_HEIGHT);
			imageData.setImageWidth(aspectRatio * IMAGE_HEIGHT);
			var dx = (manipulationWidth - (aspectRatio * IMAGE_HEIGHT))/2;
			img.addEventListener('load', function(event){
				context.drawImage(
					img, 0, 0, width, height, 0, 0, aspectRatio * IMAGE_HEIGHT, IMAGE_HEIGHT);
			});
		});
		if(file){
			fr.readAsDataURL(file);
		}
		
	}



	var createFilters = function() {
		for(var i =0; i < 9 ; i++) {
			var filter = Filter.getInstance();
			filter.init();
			filter.setId(i);
			filter.append();
		}
	}




	
	
	

})();