var InstaUi = (function() {
		var instance;
		function InstaUi() {
			var canvas = document.getElementById('instaUI');
			var ctx = canvas.getContext('2d');
			var that = this;
			var copyData;

			this.setWidth = function(_width) {
				console.log('canvas width', _width);
				canvas.width = _width;
			} 

			this.setHeight = function(_height) {
				console.log('canvas height',_height);
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
				console.log('updated context');
				ctx = _context;
			}
			this.getImageData = function() {
				return ctx.getImageData(0, 0, canvas.width, canvas.height);
			}
			this.setCopyData = function(_copy) {
				console.log('copy data updated');
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