var Paint = (function() {
  var instance;
  function Paint() {
    var canvasInstance = InstaUi.getInstance();
    var context = canvasInstance.getContext();
    var canvas = document.getElementById('instaUI');  
    canvas.addEventListener('mousedown',getPosition, false);
    canvas.addEventListener('mousemove',moveMouseDraw, false);
    canvas.addEventListener('mouseup',stopPaint, false);
    canvas.addEventListener('mouseleave',stopPaintML,false);

    var paint;
    var clickX = [];
    var clickY = [];
    var clickDrag = [];

    function getPosition(e) {

      var mouseX = e.pageX - this.offsetLeft;
      var mouseY = e.pageY - this.offsetTop;      
      paint = true;
      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
      redraw();
    }

    function moveMouseDraw(e) {
      if(paint){
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw();
      }
    }

    function stopPaintML(e) {
      paint = false;
    }

    function stopPaint(e) {
      paint = false;
    }

    var addClick = function(x, y, dragging) {
      clickX.push(x);
      clickY.push(y);
      clickDrag.push(dragging);
    }

    var redraw = function(){
      context.strokeStyle = "#df4b26";
      context.lineJoin = "round";
      context.lineWidth = 5;
          
      for(var i=0; i < clickX.length; i++) {    
        context.beginPath();
        if(clickDrag[i] && i){
          context.moveTo(clickX[i-1], clickY[i-1]);
         }else{
           context.moveTo(clickX[i]-1, clickY[i]);
         }
         context.lineTo(clickX[i], clickY[i]);
         context.closePath();
         context.stroke();
      }
    }

  }
  return {
    getInstance: function() {
      if(instance == null) {
        instance = new Paint();
      }
      return instance;
    }
  }
})();