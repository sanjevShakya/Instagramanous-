var InstaUi = (function() {
		var instance;
		function InstaUi() {
			var canvas = document.getElementById('instaUI');
			var ctx = canvas.getContext('2d');
			var that = this;
			var copyData;

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
			this.setContext = function(_context) {
				console.log('updated context');
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