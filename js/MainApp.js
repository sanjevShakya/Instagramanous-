var MainApp = (function() {
  var instance; 

  function MainApp() {
    var context;

    var canvasInstance = InstaUi.getInstance();

    var OFFSET = 5;
    // maximum height of canvas is visible portion of screen
    var MAX_CANVAS_HEIGHT = parseInt(Util.getDocumentHeight()) - OFFSET;
    
    var col2left = document.getElementsByClassName('col-2-left')[0];

    var brightness = Brightness.getInstance();
    
    var contrast = Contrast.getInstance();
  
    var saturation = Saturation.getInstance();  

    var gamma = Gamma.getInstance();

    var temperature = Temperature.getInstance();  

    var tint = Tint.getInstance();
    
    var vibrance = Vibrance.getInstance();
    
    var sepia = Sepia.getInstance();  

    var decolorize = Decolorize.getInstance();

    var threshold = Threshold.getInstance();

    var filterInstance = Filter.getInstance();

    var that = this;

    /**
    * Call initial values of all sliders
    */
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
      threshold.init();
    }
    
    /**
    * Makes a copy of imageData and then instantiate all the sliders,
    * and rotation function
    * @method startProgram 
    */
    this.startProgram = function() {  
      context = canvasInstance.getContext();
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
      threshold.setThreshold(canvasInstance)
      Paint.getInstance().init();
      Rotation.getInstance().init();
    }

    /**
    * Create a new image file from previously loaded image and
    * preserve the aspect ratio of the image and draw the canvas 
    * according to the image width and height
    * @method handleFile
    * @param {Object} file 
    */
    this.handleFile = function(file) {
      var fr = new FileReader();
      context = canvasInstance.getContext();

      fr.addEventListener('load',function(event){
        var url = event.target.result;
        img = new Image();
        img.src = url;
        that.handleImage(img, context);
        
      });
      if(file){
        fr.readAsDataURL(file);
      }
      // After the image is loaded the main app is started
    }

    this.handleImage = function(image, context) {
      image.addEventListener('load', function(event){
        var width = image.width;
        var height = image.height;
        var aspectRatio = width/height;
        var canvasWidth = parseInt(getComputedStyle(col2left).getPropertyValue('width')) - OFFSET;
        var canvasHeight = parseInt(canvasWidth/aspectRatio);
        if(canvasHeight > MAX_CANVAS_HEIGHT) {
          canvasHeight = MAX_CANVAS_HEIGHT;
          canvasWidth = parseInt(aspectRatio * canvasHeight);
        }
        // context.clearRect(0, 0, canvasWidth, canvasHeight);
        canvasInstance.setWidth(50);
        canvasInstance.setHeight(50);
        context.drawImage(image, 0,0,width,height,0,0,50,50);
        var thumbnail = context.getImageData(0,0,50,50);
        context.clearRect(0, 0, 50, 50);
        canvasInstance.setThumbnail(thumbnail);
        filterInstance.setFilterThumbnail();
        canvasInstance.setWidth(canvasWidth);
        canvasInstance.setHeight(canvasHeight);     
        context.drawImage(image, 0, 0, width, height, 0, 0, canvasWidth, canvasHeight);
        document.getElementsByClassName('download-button')[0].style.display ="block";
      });
    }

    this.resetSliders = function() {
      brightness.resetSlider();
      contrast.resetSlider();
      saturation.resetSlider();
      gamma.resetSlider();
      temperature.resetSlider();
      tint.resetSlider();
      vibrance.resetSlider();
      sepia.resetSlider();
      decolorize.resetSlider();
      threshold.resetSlider();
      var numbers = document.getElementsByClassName('number');
      for(var i=0; i < numbers.length; i++) {
        numbers[i].innerHTML = "" ;
      }
    }


  }

  return {
    getInstance: function(){
      if(instance == null) {
        instance = new MainApp();
      }
      return instance;
    }
  }
})();