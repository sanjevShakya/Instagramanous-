/**
* Singleton for Rotation class
* @return {Rotation} instance 
*/
var Rotation = (function() {
  var instance;

  /**
  * Creates left and right rotation buttons and append to the Dom
  * Adds event listener for these buttons
  * As image rotates the size of canvas is changed accordingly
  * New image is constructed by DataURL for rotation as rotation is possible to image only not imagedata
  */
  function Rotation() {
    var canvasInstance = InstaUi.getInstance();
    var canvas = canvasInstance.getCanvas();
    var context = canvasInstance.getContext();
    var imageHeight = canvasInstance.getHeight();
    var imageWidth = canvasInstance.getWidth();
    var size = {
        width: imageWidth,
        height: imageHeight
    };
    var rotation = 0;
    var degToRadian = Math.PI / 180;
    var image = new Image();
    var url = canvas.toDataURL('image/jpeg');
    var container = document.getElementsByClassName('main-container-wrapper')[0];
    this.leftBtn;
    this.rightBtn

    /**
    * Create leftBtn for leftRotation and viceversa
    * Add a icon through font-awesome class
    * Once image is loaded necessary variables are set
    */
    this.init = function() {
      this.leftBtn = document.createElement('div');
      this.leftBtn.setAttribute('class','btnRotation');
      this.leftBtn.setAttribute('id','leftBtn');
      this.rightBtn = document.createElement('div');
      this.rightBtn.setAttribute('class','btnRotation');
      this.rightBtn.setAttribute('id','rightBtn');
      this.leftBtn.innerHTML = "<span><i class='fa fa-rotate-left'></i></span>";
      this.rightBtn.innerHTML = "<span><i class='fa fa-rotate-right'></i></span>";
      this.leftBtn.addEventListener("click",rotateAntiClock,false);
      this.rightBtn.addEventListener("click", rotateClock, false);
      container.appendChild(this.leftBtn);
      container.appendChild(this.rightBtn);
      image.src = url;
      image.addEventListener('load',function() {
        imageHeight = image.height;
        imageWidth = image.width;
        size = {
          width: imageWidth,
          height: imageHeight
        };
        rotate();
      });
    }

    /**
    * leftBtn click handler for clockwise rotation
    */
    function rotateClock() {
      updateCopyImage(); 
      rotation += 90;
      newSize(imageWidth, imageHeight, rotation);
      rotate();
    }

    /**
    * rightBtn click handler for anticlockwise rotation
    */
    function rotateAntiClock() {
      updateCopyImage(); 
      rotation -= 90;
      newSize(imageWidth, imageHeight, rotation);
      rotate();
    }

    /**
    * rotate the image via certain rotation degree
    * for rotation the image is translated to center point of image 
    * then rotation is applied 
    * then image is drawn back through anti-translation
    */
    var rotate = function() {
      canvasInstance.setWidth(size.width); // set canvas width
      canvasInstance.setHeight(size.height); // set canvas height
      //center point of the canvas 
      var cx = canvas.width/2 ;
      var cy = canvas.height/2;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.translate(cx, cy);
      context.rotate(rotation * degToRadian);
      context.drawImage(image, -imageWidth/2, -imageHeight/2);  
      updateCopyImage(); 
    }

    /**
    * Calculates the new size of the canvas as the image rotates
    * @method newSize 
    * @param {number} w - imageWidth 
    * @param {number} h - imageheight
    * @param {number} a - angle of rotation
    */
    var newSize =function(w, h, a) {
      var rads = a * Math.PI / 180;
      var c = Math.cos(rads);
      var s = Math.sin(rads);
      if (s < 0) {
          s = -s;
      }
      if (c < 0) {
          c = -c;
      }
      size.width = h * s + w * c;
      size.height = h * c + w * s;
    }

    /**
    * Persist rotation in canvas
    * @method updateCopyImage 
    */
    var updateCopyImage= function() {
      var filterData = canvasInstance.getFilterData();
      var context = canvasInstance.getContext();
      var imageData = canvasInstance.getImageData();
      var data = imageData.data; //original data
      var copyData = imageData.data.slice();
      filterData = restoreImageData(data,filterData);
      canvasInstance.setFilterData(copyData); 
      canvasInstance.setCopyData(copyData); 
    }

    var restoreImageData = function(data, copyData) {
      for(var i =0; i < data.length; i+=4){
        data[i] = copyData[i];
        data[i+1] = copyData[i+1];
        data[i+2] = copyData[i+2];
      }
      return data;
    }
  }

  return{
    getInstance: function(){
      if(instance == null) {
        return new Rotation();
      }
      return instance;

    }
  }
})();