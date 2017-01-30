var Rotation = (function() {
  var instance;
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
      container.appendChild(this.rightBtn);image.src = url;

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

    function rotateClock() {
      rotation += 90;
      newSize(imageWidth, imageHeight, rotation);
      rotate();
    }

    function rotateAntiClock() {
      rotation -= 90;
      newSize(imageWidth, imageHeight, rotation);
      rotate();
    }

    var rotate = function() {
      canvasInstance.setWidth(size.width);
      canvasInstance.setHeight(size.height);

      //center point of the canvas 
      var cx = canvas.width/2 ;
      var cy = canvas.height/2;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.translate(cx, cy);
      context.rotate(rotation * degToRadian);
      context.drawImage(image, -imageWidth/2, -imageHeight/2);  
      updateCopyImage(); 
    }

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

    var updateCopyImage= function() {
      context = canvasInstance.getContext();
      var imageData = canvasInstance.getImageData();
      var filterData = canvasInstance.getFilterData();
      var copyData = imageData.data.slice();
      canvasInstance.setCopyData(copyData);
      canvasInstance.setFilterData(copyData);
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