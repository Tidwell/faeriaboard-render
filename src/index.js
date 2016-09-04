(function() {

function FaeriaBoard(opt) {
	this.opt = opt;
	this.canvas = new fabric.Canvas(opt.canvasId);

	this.canvas.setHeight(opt.height || 100);
	this.canvas.setWidth(opt.width || 100);

	this.landGroup = new fabric.Group([]);
	this.wellGroup = new fabric.Group([]);

	var self = this;
	
	//fix layer ordering
	self.canvas.on('object:modified', function() {
		self.canvas.deactivateAll().renderAll();
		self.updateZIndex();
	});

	self.canvas.on('object:moving', function(options) {
		options.target.set({
			left: Math.round(options.target.left / self.grid) * self.grid,
			top: Math.round(options.target.top / self.grid) * self.grid
		});
	});
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

		img.top = ((self.opt.height - img.height)/2);
		img.left = ((self.opt.width - img.width)/2);

		self.canvas.add(img);

		self.canvas.moveTo(img,0);

		self.addWells();

		if (cb) { cb(); }
	});

	self.grid = 5;

	// for (var i = 0; i < (self.canvas.width / self.grid); i++) {
	//   self.canvas.add(new fabric.Line([ i * self.grid, 0, i * self.grid, self.canvas.width], { stroke: '#ccc', selectable: false }));
	//   self.canvas.add(new fabric.Line([ 0, i * self.grid, self.canvas.width, i * self.grid], { stroke: '#ccc', selectable: false }))
	// }
};

FaeriaBoard.prototype.updateZIndex = function() {
	//zIndex is not a real property, we use moveTo but that
	//makes us figure out the actual index in the array
	//thus, this mess
	var self = this;

	this.landGroup._objects.forEach(function(land){
		land.zIndex = 5000-land.top;
	});
	this.landGroup._objects.sort(function(land1, land2){
		if (land1.zIndex < land2.zIndex) {
			return 1;
		}
		if (land1.zIndex > land2.zIndex) {
			return -1;
		}
		return 0;
	});
	this.landGroup._objects.forEach(function(land,i) {
		self.canvas.moveTo(land,i+3);
	});

	this.canvas.renderAll();
};

FaeriaBoard.prototype.addLand = function(type) {
	var self = this;
	fabric.Image.fromURL('images/'+type+'.png', function(img) {
		img.width = 150;
		img.height = 150;
		
		img.top = (self.opt.height - img.height)/2;
		img.left = (self.opt.width - img.width)/2;

		self.landGroup.add(img);
		self.canvas.add(img);
		img.hasControls = false;
		img.hasBorders = false;
		img.lockRotation = true;
		
		self.updateZIndex();
	});
};
FaeriaBoard.prototype.addToken = function(type) {
	var self = this;
	fabric.Image.fromURL('images/tokens/'+type+'.png', function(img) {
		img.width = 130;
		img.height = 130;
		img.hasControls = false;
		img.hasBorders = false;
		
		img.top = (self.opt.height - img.height)/2;
		img.left = (self.opt.width - img.width)/2;

		self.canvas.add(img);
	});
};

var replaceImg = new Image();
replaceImg.src = 'images/faeriawithout.png';
replaceImg.width = 100;
replaceImg.height = 200;
replaceImg.hasControls = false;
replaceImg.hasBorders = false;
replaceImg.selectable = false;

var fullImg = new Image();
fullImg.src = 'images/faeriawith.png';
fullImg.width = 100;
fullImg.height = 200;
fullImg.hasControls = false;
fullImg.hasBorders = false;
fullImg.selectable = false;

FaeriaBoard.prototype.bindWellClick = function(img,top,left) {
	var isFull = true;
	replaceImg.top = fullImg.top = top;
	replaceImg.left = fullImg.left = left;

	img.on('mouseup', function() {
		if (isFull) {
			img.setElement(replaceImg);
			isFull = false;
		} else {
			img.setElement(fullImg);
			isFull = true;
		}
	});
}


FaeriaBoard.prototype.addWells = function() {
	var self = this;

	fabric.Image.fromURL('images/faeriawith.png', function(img) {
		img.width = 100;
		img.height = 200;
		img.hasControls = false;
		img.hasBorders = false;
		img.selectable = false;
		
		img.top = 200;
		img.left = 225;
		self.wellGroup.add(img);
		self.canvas.add(img);

		self.bindWellClick(img,200,225);
		self.canvas.sendToBack(img);
	});

	fabric.Image.fromURL('images/faeriawith.png', function(img) {
		img.width = 100;
		img.height = 200;
		img.hasControls = false;
		img.hasBorders = false;
		img.selectable = false;
		
		img.top = 200;
		img.left = 875;
		self.wellGroup.add(img);
		self.canvas.add(img);

		self.bindWellClick(img,200,875);
		self.canvas.sendToBack(img);
	});

	fabric.Image.fromURL('images/faeriawith.png', function(img) {
		img.width = 100;
		img.height = 200;
		img.hasControls = false;
		img.hasBorders = false;
		img.selectable = false;
		
		img.top = 480;
		img.left = 875;
		self.wellGroup.add(img);
		self.canvas.add(img);

		self.bindWellClick(img,480,875);
	});

	fabric.Image.fromURL('images/faeriawith.png', function(img) {
		img.width = 100;
		img.height = 200;
		img.hasControls = false;
		img.hasBorders = false;
		img.selectable = false;
		
		img.top = 480;
		img.left = 225;
		self.wellGroup.add(img);
		self.canvas.add(img);

		self.bindWellClick(img,480,225);
	});
};


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