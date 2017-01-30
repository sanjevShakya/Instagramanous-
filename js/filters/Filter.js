var filterNames = ["Normal","Clarendon","Gingham","Moon","Lark","Lipstick",
           "Colorize","Reyes","Juno","Slumber","Grayscale", "Threshold",
           "Blur", "Sharpen","Soft Sharpen","X-pro II","Sierra","Inkwell",
           "1997","Ashby"];

var Filter = (function() {
  var instance;

  function Filter() {
    var filterContainer = document.getElementsByClassName('filter-container')[0];
    this.element;
    this.id;

    this.init = function() {
      this.element = document.createElement('div');
      this.element.setAttribute('class','filter');
      this.element.addEventListener('click',filterEventHandler, false);
    }

    this.setTitle = function(){
      filterContainer.innerHTML = "<h2>Filters</h2>"
    }

    this.setId = function(_id) {
      this.id = _id;
      this.element.setAttribute('id',_id);
    }

    this.getId = function() {
      return id;
    }

    this.append = function() {
      filterContainer.appendChild(this.element);
    }

    this.setFilterName = function(_name) {
      this.element.innerHTML = _name;
    }

    this.setThumbnailImage = function(i, urlImage) {
      var elem = document.getElementById(i);
      elem.style.backgroundImage = "url("+urlImage+")";
    }

    this.createFilters = function() {
      for(var i =0; i < filterNames.length ; i++) {
        this.init();
        this.setId(i);
        this.setFilterName(filterNames[i]);
        this.append();
      }
    }

    this.setFilterThumbnail = function() {
      var filterMapInstance = FilterMap.getInstance();
      var canvasInstance = InstaUi.getInstance();
      var canvas = canvasInstance.getCanvas();
      var thumbnail = canvasInstance.getThumbnail();
      var context = canvasInstance.getContext();
      var data = thumbnail.data;
      var copyData = thumbnail.data.slice();
      var width = 50;
      var height = 50;
      
      for(var i =0; i < filterNames.length; i++) {
        restore(data,copyData);
        var map = filterMapInstance.getMyFilterMap();
        var tempData = map.get(i)(data, width, height);
        var imageData = new ImageData(tempData, 50, 50);
        context.putImageData(imageData, 0, 0);  
        var dt = canvas.toDataURL('image/jpeg');
        this.setThumbnailImage(i, dt);
      }
    }

    var restore = function(previousdata, originaldata){
      for(var i = 0; i < previousdata.length; i+=4) {
        previousdata[i] = originaldata[i];
        previousdata[i+1] = originaldata[i+1];
        previousdata[i+2] = originaldata[i+2];
      }
      return previousdata;
    }

    function filterEventHandler(e) {
      var filterMapInstance = FilterMap.getInstance();
      var canvasInstance = InstaUi.getInstance();
      var imageData = canvasInstance.getImageData();
      var context = canvasInstance.getContext();
      var data = imageData.data;
      var copyData = canvasInstance.getCopyData();
      restore(data, copyData);    
      var map = filterMapInstance.getMyFilterMap();
      var key = parseInt(e.target.id);
      
      var tempData = map.get(key)(data,imageData.width, imageData.height); //respective filter handled
      
      canvasInstance.setFilterData(tempData);
      restore(data, tempData);
      context.putImageData(imageData, 0, 0);
    }

  }
  return {
    getInstance: function() {
      if(instance == null){
        return new Filter();  
      }
      return instance;
    }
  }
  
})();

