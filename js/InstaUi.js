var InstaUi = (function() {
		var instance;
		function InstaUi() {
			var canvas = document.getElementById('instaUI');
			var ctx = canvas.getContext('2d');
			var that = this;

			this.setWidth = function(width) {
				canvas.width = width;
			} 

			this.setHeight = function(height) {
				canvas.height = height;
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