/**
* Names of predefined filters
*/
var filterNames = ["Normal","Clarendon","Gingham","Moon","Lark","Lipstick",
           "Ashby","Reyes","Juno","Slumber","Grayscale", "Threshold",
           "Blur", "Sharpen","Soft Sharpen","X-pro II","Sierra","Inkwell",
           "1997","Colorize"];

/**
* @return {Filter} instance - object of Filter 
*/
var Filter = (function() {
  var instance;

  /**
  * create filters from given filternames 
  * create a div, set class as filter and adds event listener to it
  * triggers the fillter effect event on basis of click event 
  * apply filter effect based on the filters id
  */
  function Filter() {
    var filterContainer = document.getElementsByClassName('filter-container')[0];
    var filterMapInstance = FilterMap.getInstance();
    var canvasInstance = InstaUi.getInstance();
    this.element;
    this.id;

    /**
    * Create a filter div and add class to it 
    * add eventlistener click to the div element
    */
    this.init = function() {
      this.element = document.createElement('div');
      this.element.setAttribute('class','filter');
      this.element.addEventListener('click',filterEventHandler, false);
    }

    /**
    * Set title of the filterContainer
    */
    this.setTitle = function(){
      //filterContainerWrapper.text = "Filters"
    }

    /**
    * Set Id to a div element
    */
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

    /**
    * Set thumbnail image as background of a particular div 
    * @params {number} i - Id of the filter element
    * @params {DOMString} urlImage - data URI to thumbnail image
    */
    this.setThumbnailImage = function(i, urlImage) {
      var elem = document.getElementById(i);
      elem.style.backgroundImage = "url("+urlImage+")";
    }

    /**
    * Creates predefined filters and set id to it
    * Append generated filters div to DOM
    */
    this.createFilters = function() {
      for(var i =0; i < filterNames.length ; i++) {
        this.init();
        this.setId(i);
        this.setFilterName(filterNames[i]);
        this.append();
      }
    }


    /**
    * Filters applied to the thumbnail image 
    * ImageData of processed thumbnail is then converted to DataUrl and send to set
    * backbround of the div element 
    */
    this.setFilterThumbnail = function() {
      var filterMapInstance = FilterMap.getInstance();
      var canvasInstance = InstaUi.getInstance();
      var canvas = canvasInstance.getCanvas();
      var thumbnail = canvasInstance.getThumbnail();
      var context = canvasInstance.getContext();
      var data = thumbnail.data;
      var copyData = thumbnail.data.slice();
      var width = 50; //Thumbnail width 50px
      var height = 50;  //Thumnail height 50px
      
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

    /**
    * Acquire the target id of the filter element, this id is used as key 
    * to get the respective filter and executed to get the filtered image.
    * Once filter is applied to teh data the image data is put to the canvas.
    * @method filterEventHandler 
    * @param e 
    */
    function filterEventHandler(e) {
      var copyData = canvasInstance.getCopyData();
      if (!copyData) {
        return alert("Please select an image first.");
      }
      var imageData = canvasInstance.getImageData();
      var context = canvasInstance.getContext();
      var data = imageData.data;
      restore(data, copyData);    
      var map = filterMapInstance.getMyFilterMap();
      var key = parseInt(e.target.id);
      
      var tempData = map.get(key)(data, imageData.width, imageData.height); //respective filter handled
      
      canvasInstance.setFilterData(tempData);
      restore(data, tempData);
      context.putImageData(imageData, 0, 0);
      MainApp.getInstance().resetSliders();
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

