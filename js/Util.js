var Util = (function() {
  var getElement = function(classname){
    return document.getElementsByClassName(classname)[0];
  }

  var getStyle = function(element, style) {
    return parseInt(getComputedStyle(element).getPropertyValue(style));
  }

  var truncate = function(value) {
    if(value < 0) {
      value = 0;
    }

    if(value > 255) {
      value = 255
    }

    return value;
  }

  return {
    getElement : getElement,
    getStyle : getStyle,
    truncate : truncate
  }
})();       
