

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

		function filterEventHandler(e) {
			var filterMapInstance = FilterMap.getInstance();
			var canvasInstance = InstaUi.getInstance();
			var map = filterMapInstance.getMyFilterMap();
			var key = parseInt(e.target.id);
			var value = map.get(key)(canvasInstance);
		}
	}
	return {
		getInstance: function() {
			return new Filter();
		}
	}
	
})();

