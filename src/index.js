(function() {

function FaeriaBoard(opt) {
	this.opt = opt;
	this.canvas = new fabric.Canvas(opt.canvasId);

	this.canvas.setHeight(opt.height || 100);
	this.canvas.setWidth(opt.width || 100);
}

/*
	accepts a cb called with (err, renderedImage)
 */
FaeriaBoard.prototype.render = function(cb) {
	var self = this;
	if (!this.canvas) { cb(new Error('No canvas to render to'), null); }

	this.canvas.setBackgroundImage('images/bg.jpg');

	fabric.Image.fromURL('images/board.png', function(img) {
			img.evented = false;
			img.hasControls = false;
			img.hasBorders = false;
			img.selectable = false;

			img.top = (self.opt.height - img.height)/2;
			img.left = (self.opt.width - img.width)/2;

			self.canvas.add(img);

			if (cb) { cb(); }
		});
};

FaeriaBoard.prototype.addLand = function(type) {
	var self = this;
	fabric.Image.fromURL('images/'+type+'.png', function(img) {
		img.width = 130;
		img.height = 130;
		img.hasControls = false;
		img.hasBorders = false;
		
		img.top = (self.opt.height - img.height)/2;
		img.left = (self.opt.width - img.width)/2;

		self.canvas.add(img);
	});
}


var exposed = {
	FaeriaBoard: FaeriaBoard,
	create: function(opt) {
		return new FaeriaBoard(opt);
	}
};

if (typeof module !== 'undefined' && module.exports) {
	module.exports = exposed;
}
else if (window) {
	window.FaeriaBoardRenderer = exposed;
}

}());