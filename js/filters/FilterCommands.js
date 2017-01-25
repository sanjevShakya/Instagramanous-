function grayScale(pixels) {
	var d = pixels;
	for (var i = 0; i < d.length; i+=4) {
		var r = d[i];
		var g = d[i+1];
		var b = d[i+2];
	// CIE luminance for the RGB
	// The human eye is bad at seeing red and blue, so we de-emphasize them.
		var v = 0.2126*r + 0.7152*g + 0.0722*b;
		d[i] = d[i+1] = d[i+2] = v
	}
	return pixels;
}

function threshold(pixels) {
	var thres = 3;
	var d = pixels;
	for (var i = 0; i < d.length; i+=4) {
		var r = d[i];
		var g = d[i+1];
		var b = d[i+2];
		var v = (0.2126*r + 0.7152*g + 0.0722*b >= thres) ? 255 : 0;
		d[i] = d[i+1] = d[i+2] = v
	}
	return pixels;
}

function restore(pixels) {
	return pixels;
}

var Command = function(execute, undo, value) {
	this.execute = execute;
	this.undo = undo;
	this.value = value;

}

var GrayScaleCommand = function(value) {
	//Command(execute, undo, value);
	console.log("grayScale command");
	return new Command(grayScale, value.slice(), value);
}

var ThresholdCommand = function(data) {
	return new Command(threshold, value.slice(), value);
}

var FilterEffect = function() {
	var commands = [];
	return {
		execute: function(command) {
			console.log(command);
			command.execute(command.value);
			commands.push(command);
		},

		undo: function() {
			var command = commands.pop();
			current = command.undo(command.value)
		}
	}
}