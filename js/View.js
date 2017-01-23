var View  = (function() {
		function View() {
			this.getMainWrapper = function() {
				var element = document.getElementByClassName('main-wrapper')[0];
				return element;
			}

			this.create = function(elementName) {
				var element = document.createElement(elementName);
				return element;
			}

			this.addClass = function(element, className) {
				element.className = className;
			}

			this.append = function(parentElement , childElement) {
				parentElement.appendChild(childElement);
			}

			return {
				getInstance: function() {
					if(instance == null) {
						instance = new View();
					}

					return instance;
				}
			}
		}
	}());