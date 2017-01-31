/**
* @return {InstaUi} instance - comprises of canvas, context, copyData stored for reference 
*/
var InstaUi = (function() {
  var instance;
  function InstaUi() {
    var canvas = document.getElementById('instaUI');
    var ctx = canvas.getContext('2d');
    var that = this;
    var copyData;
    var filterData;
    var thumbnail;

    this.setWidth = function(_width) {
      canvas.width = _width;
    } 

    this.setHeight = function(_height) {
      canvas.height = _height;
    }

    this.getWidth= function() {
      return canvas.width;
    }

    this.getHeight = function() {
      return canvas.height;
    }

    this.getCanvas = function() {
      return canvas;
    }

    this.getContext = function() {
      return ctx;
    }

    this.setContext = function(_context) {
      ctx = _context;
    }

    this.getImageData = function() {
      return ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    this.setCopyData = function(_copy) {
      copyData = _copy;
    }

    this.getCopyData = function() {
      return copyData;
    }

    this.setFilterData = function(_filterData) {
      filterData = _filterData;
    }

    this.getFilterData = function() {
      return filterData;
    }

    this.setThumbnail = function(_thumbnail) {
      thumbnail = _thumbnail;
    }

    this.getThumbnail = function() {
      return thumbnail;
    }
  }

  return {
    getInstance: function() {
      if(instance == null) {
        instance = new InstaUi();
      }

      return instance;

    }
  }
})();