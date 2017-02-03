;(function() {

  var mainApp = MainApp.getInstance();
  mainApp.init();

  var canvasInstance = InstaUi.getInstance();
  // input type file button handler
  var file = document.getElementById('getFile');
  file.addEventListener("change",fileSelectHandler, false);

  var downloadDiv = document.getElementsByClassName("download-button")[0];
  downloadDiv.style.display = "none";
  
  var downloadBtn = document.getElementById("downloadFile");
  downloadBtn.addEventListener('click', download, false);

  var loader = document.getElementById('loader');
  loader.style.display = "none";

  var counter = 0;
  
  var filterInstance = Filter.getInstance();
  filterInstance.setTitle();
  filterInstance.createFilters();

  var cameraInstance = Camera.getInstance();
  cameraInstance.init();
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
        //extract file name from loaded file
        filename = event.target.files[0].name.split(".")[0];
        mainApp.resetSliders();
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