(function() {
	
	var Trace = new function() {
		this.element = document.createElement('script');
		this.element.type = 'text/plain';
		this.element.style.background = 'black';
		this.element.style.bottom = '0px';
		this.element.style.color = 'white';
		this.element.style.display = 'block';
		this.element.style.fontFamily = 'monospace';
		this.element.style.height = '40px';
		this.element.style.opacity = '0.5';
		this.element.style.overflow = 'auto';
		this.element.style.position = 'fixed';
		this.element.style.resize = 'vertical';
		this.element.style.webkitTransition = 'opacity 0.1s linear, bottom 0.1s ease-in';
		this.element.style.mozTransition = 'opacity 0.1s linear, bottom 0.1s ease-in';
		this.element.style.whiteSpace = 'pre';
		this.element.style.width = '100%';
		this.element.style.zIndex = '1';
		this.element.onmouseover = function() {
			this.style.height = '80px';
			this.style.opacity = '0.9';
		}
		this.element.onmouseout = function() {
			this.style.height = '40px';
			this.style.opacity = '0.5';
		}
		document.head.appendChild(this.element);
		document.head.style.display = 'block';
		
		this.append = function(s) {
			this.element.innerHTML += s + "\n";
			this.element.scrollTop = this.element.scrollHeight;
		}
		
		this.clear = function() {
			this.element.innerHTML = '';
		}
	}
	
	window.trace = function(s) {
		Trace.append(s)
	};
	
	window.clearTrace = function(s) {
		Trace.clear()
	};
	
})();
