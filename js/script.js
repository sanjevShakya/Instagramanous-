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
			setTimeout(function(){

				brightness.setBrightness(InstaUi.getInstance());
				contrast.setContrast(InstaUi.getInstance());
				gamma.setGamma(InstaUi.getInstance());
				saturation.setSaturation(InstaUi.getInstance());
				temperature.setTemperature(InstaUi.getInstance());
				tint.setTint(InstaUi.getInstance());
			},2000);

		}
	}

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
		for(var i =1; i <= 9 ; i++) {
			Filter.getInstance();
		}
	}


createFilters();
	
	

})();