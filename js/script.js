;(function() {
  //image height and width 4:3 ratio
  var col2left = document.getElementsByClassName('col-2-left')[0];
  // 5 pixel offset from bottom
  var OFFSET = 5;
  // maximum height of canvas is visible portion of screen
  var MAX_CANVAS_HEIGHT = parseInt(height()) - OFFSET;

  var canvasInstance = InstaUi.getInstance();
  var context;

  var downloadDiv = document.getElementsByClassName("download-button")[0];
  downloadDiv.style.display = "none";
  
  var downloadBtn = document.getElementById("downloadFile");
  downloadBtn.addEventListener('click', download, false);

  // input type file button handler
  var file = document.getElementById('getFile');
  file.addEventListener("change",fileSelectHandler, false);

  var mainApp = new MainApp();
  mainApp.init();

  var loader = document.getElementById('loader');
  loader.style.display = "none";

  var counter = 0;
  var instaUi = InstaUi.getInstance();

  var filterInstance = Filter.getInstance();
  filterInstance.setTitle();
  filterInstance.createFilters();

  var cameraInstance = Camera.getInstance();
  cameraInstance.init();
  cameraInstance.setCameraDimen(height(), width());
  cameraInstance.append();
  // For unique file names
  var filename;

  /**
  * Image file select handler
  * @method fileSelectHandler 
  */
  function fileSelectHandler(event) {
    if(file) {
      setTimeout(function(){    
        if(counter >=1) {
          context = canvasInstance.getContext();
          context.clearRect(0, 0, canvasInstance.getWidth(),canvasInstance.getHeight());
          //used for extracting thumbnail when 2nd file is chosen
          instaUi.setWidth(50);
          instaUi.setHeight(50);
        }
        //extract file name from loaded file
        filename = event.target.files[0].name.split(".")[0];
        mainApp.handleFile(event.target.files[0]);  
        counter++;
        loader.style.display = "block";
      },200)
      //setInterval(mainApp, 500);
      setTimeout(function(){
        loader.style.display = "none";
        mainApp.startProgram();
        downloadDiv.style.display ="block";
      },2000);
    }
  }

  /**
  * 
  */
  function MainApp() {

    var editBox = document.getElementsByClassName('edit-box-container')[0];
    editBox.innerHTML = "<h2>Edit</h2>";

    var brightness = Brightness.getInstance();
    
    var contrast = Contrast.getInstance();
  
    var saturation = Saturation.getInstance();  

    var gamma = Gamma.getInstance();

    var temperature = Temperature.getInstance();  

    var tint = Tint.getInstance();
    
    var vibrance = Vibrance.getInstance();
    
    var sepia = Sepia.getInstance();  

    var decolorize = Decolorize.getInstance();
    
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
      context = instaUi.getContext();

      fr.addEventListener('load',function(event){
        var url = event.target.result;
        img = new Image();
        img.src = url;
        
        img.addEventListener('load', function(event){
          var width = img.width;
          var height = img.height;
          var aspectRatio = width/height;
          var canvasWidth = parseInt(getComputedStyle(col2left).getPropertyValue('width')) - OFFSET;
          var canvasHeight = parseInt(canvasWidth/aspectRatio);
          if(canvasHeight > MAX_CANVAS_HEIGHT) {
            canvasHeight = MAX_CANVAS_HEIGHT;
            canvasWidth = parseInt(aspectRatio * canvasHeight);
          }
          //context.clearRect(0, 0, canvasWidth,canvasHeight);
          context.drawImage(img, 0,0,width,height,0,0,50,50);
          var thumbnail = context.getImageData(0,0,50,50);
          canvasInstance.setThumbnail(thumbnail);
          filterInstance.setFilterThumbnail();
          instaUi.setWidth(canvasWidth);
          instaUi.setHeight(canvasHeight);     
          context.drawImage(
            img, 0, 0, width, height, 0, 0, canvasWidth, canvasHeight);
          
        });
      });
      if(file){
        fr.readAsDataURL(file);
      }
      // After the image is loaded the main app is started
    }
  }

  /**
  * Convert canvas image to jpg file by dataURL
  * use previous filename with app name and make a jpg file
  * @method download - Handler for download button cicked
  */
  function download() {
    var canvas = canvasInstance.getCanvas();
    var tempFilename = filename + "-instagramanous.jpg";
    if(canvas != null) {
      var dt = canvas.toDataURL('image/jpeg');
      this.href = dt; 
      this.download = tempFilename;   
    }
  }

  /**
  * @method width
  * @return {number} - visible window width
  */
  function width() {
      return window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;
  }

  /**
  * @method height
  * @return {number} - visible height of window
  */
  function height(){
     return window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight;
  }

})();