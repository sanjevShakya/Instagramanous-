;(function() {
	//image height and width 4:3 ratio
	var IMAGE_WIDTH = 800;
	var IMAGE_HEIGHT = 600;

	var file = document.getElementById('getFile');
	file.addEventListener("change",fileSelectHandler, false);
	console.log(document.querySelector('input[type=file]').files[0]);
	var brightness = Brightness.getInstance();
	brightness.init();
	var contrast = Contrast.getInstance();
	contrast.init();

	function fileSelectHandler(event) {
		if(file) {
			handleFile(event.target.files[0]);				
			setTimeout(function(){
				brightnessTest();
				shadowTest();

				brightness.setBrightness(InstaUi.getInstance());
				contrast.setContrast(InstaUi.getInstance());
				
			},3000);

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



	var createFilters = function() {
		for(var i =1; i <= 9 ; i++) {
			Filter.getInstance();
		}
	}

	var brightnessTest = function() {
		var brightness = document.getElementById('brightness');
		var image = ImageData.getInstance().getImage();
		var canvasInstance = InstaUi.getInstance();
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
				data[i] = Util.truncate(data[i] + step)//R
				data[i+1] =Util.truncate(data[i+1] + step) //G
				data[i+2] =Util.truncate(data[i+2] + step)//B
			}
			 context.putImageData(imageData, 0, 0);
		}

	}

	var shadowTest = function() {
		var shadow = document.getElementById('shadow');
		//var image = ImageData.getInstance().getImage();
		var canvasInstance = InstaUi.getInstance();
		//var canvas = canvasInstance.getCanvas(); 
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
	
	

})();