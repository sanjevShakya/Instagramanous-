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

    this.append = function() {
      this.element.append(this.camera);
      this.element.append(this.cameraBtn);
      mainContainer.append(this.element);
    }

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
        });
      }
      
    }

    function cameraClicked(e) {
      var canvas = canvasInstance.getCanvas();
      camera = document.getElementById('camera');
      var mainApp = MainApp.getInstance();
      cameraHolder = document.getElementById('cameraHolder');
      if(e.keyCode == 32) {
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