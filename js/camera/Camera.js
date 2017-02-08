/**
* Camera class for creating a video element and then adding touch and keypress event
* to capture frame and put the frame onto canvas 
*/
var Camera = (function() {
  var instance;
  function Camera() {
    var OFFSET = 5;
    var mainContainer = document.getElementsByClassName('main-container')[0];
    var cameraHolder;
    var camera;
    var localstream;
    var canvasInstance = InstaUi.getInstance();
    var col2left = document.getElementsByClassName('col-2-left')[0];
    var aspectRatio = (960/720);
    var cameraWidth = parseInt(getComputedStyle(col2left).getPropertyValue('width')) - OFFSET;
    var cameraHeight = cameraWidth / aspectRatio;
    this.element;
    this.camera;
    this.cameraBtn;
    
    /**
    * Create a containter for video, button elements and set
    * necesary attributes
    */
    this.init = function() {
      this.element = document.createElement('div');
      this.camera = document.createElement('video');
      this.cameraBtn = document.createElement('div');
      this.element.setAttribute('id','cameraHolder');
      this.cameraBtn.setAttribute('id','cameraBtn');
      this.cameraBtn.innerHTML = "<span><i class='fa fa-camera'></i></span>";
      this.camera.setAttribute('id','camera');
      this.cameraBtn.addEventListener('click', openCamera, false);
      this.camera.setAttribute('height', cameraHeight);
      this.camera.setAttribute('width', cameraWidth);
      this.camera.style.display = "none";
    }
    
    /**
    * Append elements to the DOM
    */
    this.append = function() {
      this.element.append(this.camera);
      this.element.append(this.cameraBtn);
      mainContainer.append(this.element);
    }

    /**
    * Event listener for starting video streaming and add two event listener 
    * in order to capture frame
    */
    function openCamera() {
      canvasInstance.setHeight(cameraHeight);
      canvasInstance.setWidth(cameraWidth);

      camera = document.getElementById('camera');
      camera.style.display = "block";
      if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({video : true }).then(function(stream){
          localstream = stream;
          camera.src = window.URL.createObjectURL(localstream);
          camera.play();

          document.addEventListener('keydown', cameraClicked, false);
          document.addEventListener('touchstart', touchEventHandler, false);
        });
      }
      
    }

    function touchEventHandler(e) {
      clickPicture();
    }

    function cameraClicked(e) {  
      if(e.keyCode == 32) {
       clickPicture();
      }
    }

    /**
    * Get the frame from video element and then make an image from it 
    * and run the image through mainApp for generting thumbnails and 
    * start the mainApp
    */
    var clickPicture = function() {
      var canvas = canvasInstance.getCanvas();
      camera = document.getElementById('camera');
      var mainApp = MainApp.getInstance();
      cameraHolder = document.getElementById('cameraHolder');
      context = canvasInstance.getContext();
      context.drawImage(camera, 0, 0, cameraWidth, cameraHeight);
      //make image file 
      var image = new Image(cameraWidth, cameraHeight);
      var url = canvas.toDataURL('image/jpeg');
      image.src = url;
      mainApp.handleImage(image, context);
      //make image file 
      context.clearRect(0, 0, cameraWidth, cameraHeight);
      canvasInstance.setHeight(50);
      canvasInstance.setWidth(50);
      camera.pause();
      camera.src="";
      localstream.getTracks()[0].stop();
      camera.setAttribute('disabled','true');
      camera.style.display = "none"; 
      camera.setAttribute('height','0');
      camera.setAttribute('width','0');
      setTimeout(function(){
        mainApp.startProgram();
      },1000);
    }
  }
  return {
    getInstance: function() {
    if(instance == null) {
      return new Camera();
    }
    return instance;
    }
  }
})();