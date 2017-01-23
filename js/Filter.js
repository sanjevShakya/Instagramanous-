var Filter = (function() {
	var instance;

	function Filter() {
		var editPanel = document.getElementsByClassName('col-2-right')[0];

		this.element;

		this.init = function() {
			this.element = document.createElement('div');
			this.element.setAttribute('class','filter');
			editPanel.appendChild(this.element);
		}
	}
	return {
		getInstance: function() {
			return new Filter().init();
		}
	}
	
	})();