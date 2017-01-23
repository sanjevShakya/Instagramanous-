	var ImageData = (function() {
		var instance;
		function ImageData() {
			var imageWidth;
			var imageHeight;
			var image;
			this.getImage = function() {
				return image;
			}

			this.setImage = function(_image) {
				image = _image;
			}

			this.getImageWidth = function() {
				return imageWidth;
			}

			this.getImageHeight = function() {
				return imageHeight;
			}

			this.setImageWidth = function(width) {
				imageWidth = width;
			}

			this.setImageHeight = function(height) {
				imageHeight = height;
			}
		}

		return {
			getInstance : function(){
				if(instance == null) {
					instance = new ImageData();
				}
				return instance;
			}
		}
	})();