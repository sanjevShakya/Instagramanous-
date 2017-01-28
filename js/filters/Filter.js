var filterNames = ["Normal","Clarendon","Gingham","Moon","Lark","Lipstick","Colorize","Reyes","Juno","Slumber","Grayscale", "Threshold","Blur", "Sharpen","Soft Sharpen"];

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

		this.setFilterName = function(_name) {
			this.element.innerHTML = _name;
		}

		function filterEventHandler(e) {
			var filterMapInstance = FilterMap.getInstance();
			var canvasInstance = InstaUi.getInstance();
			var map = filterMapInstance.getMyFilterMap();
			var key = parseInt(e.target.id);
			console.log("key:", e.target.id);
			var value = map.get(key)(canvasInstance); //respective filter handled
		}

		this.createFilters = function() {
			for(var i =0; i < 15 ; i++) {
				this.init();
				this.setId(i);
				this.setFilterName(filterNames[i]);
				this.append();
			}
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

