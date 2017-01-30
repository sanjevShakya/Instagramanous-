;(function() {
  //image height and width 4:3 ratio
  var col2left = document.getElementsByClassName('col-2-left')[0];
  var OFFSET = 5;
  var MAX_CANVAS_HEIGHT = parseInt(height()) - OFFSET;

  var canvasInstance = InstaUi.getInstance();
  var context;

  var downloadBtn = document.getElementById("downloadFile");
  downloadBtn.addEventListener('click', download, false);

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


  function fileSelectHandler(event) {
    if(file) {
      setTimeout(function(){    
        if(counter >=1) {
          context = canvasInstance.getContext();
          context.clearRect(0, 0, canvasInstance.getWidth(),canvasInstance.getHeight());
          instaUi.setWidth(50);
          instaUi.setHeight(50);
          console.log("cleared Canvas");
        }
        mainApp.handleFile(event.target.files[0]);  
        counter++;
        loader.style.display = "block";
      },200)
      //setInterval(mainApp, 500);
      setTimeout(function(){
        loader.style.display = "none";
        mainApp.startProgram();

      },2000);
    }
  }

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
    }
    
  }

  function download() {
    var canvas = canvasInstance.getCanvas();
    var filename = "test.jpg";
    if(canvas != null) {
      var dt = canvas.toDataURL('image/jpeg');
      this.href = dt; 
      this.download = filename;   
    }

  }

  function width() {
      return window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;
  }

  function height(){
     return window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight;
  }

  // var imageRotation = (function() {

  //   var canvas = canvasInstance.getCanvas();
  //   var context = canvasInstance.getContext();
  //   var imageHeight = canvasInstance.getHeight();
  //   var imageWidth = canvasInstance.getWidth();
  //   var size = {
  //       width: imageWidth,
  //       height: imageHeight
  //   };
  //   var rotation = 0;
  //   var degToRadian = Math.PI / 180;
  //   var image = new Image();
  //   var url = canvas.toDataURL('image/jpeg');
  //   image.src = url;
  //   image.addEventListener('load',function() {
  //     imageHeight = image.height;
  //     imageWidth = image.width;
  //     size = {
  //       width: imageWidth,
  //       height: imageHeight
  //     };
  //     rotate();
  //   });

  //   function rotate() {
  //     canvasInstance.setWidth(size.width);
  //     canvasInstance.setHeight(size.height);

  //     //center point of the canvas 
  //     var cx = canvas.width/2 ;
  //     var cy = canvas.height/2;
  //     context.clearRect(0, 0, canvas.width, canvas.height);
  //     context.translate(cx, cy);
  //     context.rotate(rotation * degToRadian);
  //     context.drawImage(image, -imageWidth/2, -imageHeight/2);  
  //     updateCopyImage(); 
  //   }

  //   document.getElementById('clockwise').addEventListener('click',rotateClock,false);
  //   document.getElementById('antiClockwise').addEventListener('click', rotateAntiClock, false);

  //   function rotateClock() {
  //     rotation += 90;
  //     newSize(imageWidth, imageHeight, rotation);
  //     rotate();
  //   }

  //   function rotateAntiClock() {
  //     rotation -= 90;
  //     newSize(imageWidth, imageHeight, rotation);
  //     rotate();
  //   }

  //   function updateCopyImage() {
  //     context = canvasInstance.getContext();
  //     var imageData = canvasInstance.getImageData();
  //     var filterData = canvasInstance.getFilterData();
  //     var copyData = imageData.data.slice();
  //     canvasInstance.setCopyData(copyData);
  //     canvasInstance.setFilterData(copyData);
  //   }

  //   function restoreImageData (data, copyData) {
  //     for(var i =0; i < data.length; i+=4){
  //       data[i] = copyData[i];
  //       data[i+1] = copyData[i+1];
  //       data[i+2] = copyData[i+2];
  //     }
  //     return data;
  //   }


  //   function newSize(w, h, a) {
  //     var rads = a * Math.PI / 180;
  //     var c = Math.cos(rads);
  //     var s = Math.sin(rads);
  //     if (s < 0) {
  //         s = -s;
  //     }
  //     if (c < 0) {
  //         c = -c;
  //     }
  //     size.width = h * s + w * c;
  //     size.height = h * c + w * s;
  //   }   
  // });

})();