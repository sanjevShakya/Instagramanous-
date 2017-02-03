/**
* Utitlity function
*/
var Util = (function() {
  /**
  * @method getElement
  * @param {String} classname
  * @return {Object} 
  */
  var getElement = function(classname){
    return document.getElementsByClassName(classname)[0];
  }

  /**
  * @method getStyle 
  * @param {Object} element 
  * @param {String} style
  */
  var getStyle = function(element, style) {
    return parseInt(getComputedStyle(element).getPropertyValue(style));
  }

  /**
  * Truncate value greater than 255 to 255 and less than 0 to 0
  * @method truncate 
  * @param {Number} value;
  */
  var truncate = function(value) {
    if(value < 0) return 0;
    if(value > 255) return 255;
    return value;
  }

    /**
  * @method width
  * @return {number} - visible window width
  */
  var getDocumentWidth = function() {
      return window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;
  }

  /**
  * @method height
  * @return {number} - visible height of window
  */
  var getDocumentHeight = function(){
     return window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight;
  }

  return {
    getElement : getElement,
    getStyle : getStyle,
    truncate : truncate,
    getDocumentWidth : getDocumentWidth,
    getDocumentHeight, getDocumentHeight
  }
})();       
