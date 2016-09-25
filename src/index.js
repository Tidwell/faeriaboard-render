(function() {


	var LowerImages = 5;

	function setNoAction(img) {
		img.evented = false;
		img.hasControls = false;
		img.hasBorders = false;
		img.selectable = false;
	}

	function makeNotSelectable(img) {
		img.hasControls = false;
		img.hasBorders = false;
		img.selectable = false;
	}

	function noControls(img) {
		img.hasControls = false;
		img.hasBorders = false;
	}

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

		self.canvas.observe('mouse:over', function(e) {
			if (e.target.isWell) {
				e.target.hoverCursor = 'pointer';
			}
			if (e.target.type == 'i-text') {
				e.target.hoverCursor = 'Text';
			}
		});
	}

	/*
		accepts a cb called with (err, renderedImage)
	 */
	FaeriaBoard.prototype.render = function(cb) {
		var self = this;
		if (!this.canvas) {
			cb(new Error('No canvas to render to'), null);
		}

		this.canvas.setBackgroundImage('images/bg.jpg');

		fabric.Image.fromURL('images/board.png', function(img) {
			setNoAction(img);

			img.top = ((self.opt.height - img.height) / 2);
			img.left = ((self.opt.width - img.width) / 2);

			self.canvas.add(img);

			self.canvas.moveTo(img, 0);

			if (cb) {
				cb();
			}
		});

		self.addWells();

		self.addOrbs();

		self.addGameUI();

		self.grid = 5;

		// for (var i = 0; i < (self.canvas.width / self.grid); i++) {
		//   self.canvas.add(new fabric.Line([ i * self.grid, 0, i * self.grid, self.canvas.width], { stroke: '#ccc', selectable: false }));
		//   self.canvas.add(new fabric.Line([ 0, i * self.grid, self.canvas.width, i * self.grid], { stroke: '#ccc', selectable: false }))
		// }
	};

	FaeriaBoard.prototype.addGameUI = function() {
		var self = this;

		fabric.Image.fromURL('images/faeria.png', function(img) {
			setNoAction(img);
			img.width = 150;
			img.height = 150;
			img.top = ((self.opt.height - img.height)) - 50;
			img.left = 20;

			self.canvas.add(img);

			self.canvas.add(new fabric.IText('3', {
				fontFamily: 'Libre Baskerville',
				fontSize: 50,
				fontWeight: 'bold',
				left: 80,
				top: ((self.opt.height - img.height)) - 0,
			}));
		});

		fabric.Image.fromURL('images/wheel-full.png', function(img) {
			setNoAction(img);
			img.width = 250;
			img.height = 250;
			img.top = ((self.opt.height - img.height)) + 25;
			img.left = self.opt.width - img.width + 25;

			self.canvas.add(img);
		});
	}

	FaeriaBoard.prototype.addOrbs = function() {
		var self = this;
		fabric.Image.fromURL('images/avatars/quest_004.png', function(img) {
			setNoAction(img);
			img.width = 120;
			img.height = 120;

			img.top = ((self.opt.height - img.height)) - 70;
			img.left = ((self.opt.width - img.width) / 2);

			self.canvas.add(img);


		});
		fabric.Image.fromURL('images/orbs/OrbStructure_8.png', function(img) {
			setNoAction(img);
			img.width = 220;
			img.height = 220;

			img.top = ((self.opt.height - img.height));
			img.left = ((self.opt.width - img.width) / 2);

			self.canvas.add(img);
		});

		fabric.Image.fromURL('images/avatars/quest_002.png', function(img) {
			setNoAction(img);
			img.width = 120;
			img.height = 120;

			img.top = 45;
			img.left = ((self.opt.width - img.width) / 2);

			self.canvas.add(img);
			self.canvas.sendToBack(img);

			fabric.Image.fromURL('images/life.png', function(img) {
				setNoAction(img);
				img.width = 60;
				img.height = 60;

				img.top = 90;
				img.left = ((self.opt.width - img.width) / 2) + 70;

				self.canvas.add(img);

				var txt = new fabric.IText('20', {
					fontFamily: 'Libre Baskerville',
					fill: 'white',
					fontSize: 35,
					fontWeight: 'bold',
					left: (self.opt.width / 2) + 45,
					top: 95,
				});
				self.canvas.add(txt);
			});

		});
		fabric.Image.fromURL('images/orbs/OrbStructure_3.png', function(img) {
			setNoAction(img);
			img.width = 220;
			img.height = 220;

			img.top = 15;
			img.left = ((self.opt.width - img.width) / 2);

			self.canvas.add(img);
			self.canvas.sendToBack(img);

			fabric.Image.fromURL('images/life.png', function(img) {
				setNoAction(img);
				img.width = 60;
				img.height = 60;

				img.top = self.opt.height - 150;
				img.left = ((self.opt.width - img.width) / 2) + 70;

				self.canvas.add(img);

				var txt = new fabric.IText('20', {
					fontFamily: 'Libre Baskerville',
					fill: 'white',
					fontSize: 35,
					fontWeight: 'bold',
					left: (self.opt.width / 2) + 50,
					top: self.opt.height - 145,
				});
				self.canvas.add(txt);
			});
		});
	};

	FaeriaBoard.prototype.updateZIndex = function() {
		//zIndex is not a real property, we use moveTo but that
		//makes us figure out the actual index in the array
		//thus, this mess
		var self = this;

		this.landGroup._objects.forEach(function(land) {
			land.zIndex = 5000 - land.top;
		});
		this.landGroup._objects.sort(function(land1, land2) {
			if (land1.zIndex < land2.zIndex) {
				return 1;
			}
			if (land1.zIndex > land2.zIndex) {
				return -1;
			}
			return 0;
		});
		this.landGroup._objects.forEach(function(land, i) {
			self.canvas.moveTo(land, i + LowerImages);
		});

		this.canvas.renderAll();
	};

	FaeriaBoard.prototype.addLand = function(type, offsetObj) {
		var self = this;
		fabric.Image.fromURL('images/' + type + '.png', function(img) {
			img.width = 145;
			img.height = 145;

			if (offsetObj) {
				img.top = offsetObj.top;
				img.left = offsetObj.left;
			} else {
				img.top = (self.opt.height - img.height) / 2;
				img.left = (self.opt.width - img.width) / 2;
			}

			self.landGroup.add(img);
			self.canvas.add(img);
			noControls(img);
			img.lockRotation = true;

			self.updateZIndex();
		});
	};
	FaeriaBoard.prototype.addToken = function(type, offsetObj) {
		var self = this;
		fabric.Image.fromURL('images/tokens/' + type + '.png', function(img) {
			img.width = 130;
			img.height = 130;
			noControls(img);

			var top;
			var left;
			if (offsetObj) {
				top = offsetObj.top;
				left = offsetObj.left;
			} else {
				top = (self.opt.height - img.height) / 2;
				left = (self.opt.width - img.width) / 2;
			}

			var name = type.replace('token_', '').replace('black_', '').replace('white_', '');
			console.log(name, window.FAERIACARDS[name].attack, window.FAERIACARDS[name].health)
			var power = new fabric.IText(''+window.FAERIACARDS[name].attack||0, {
				fontFamily: 'Libre Baskerville',
				fill: 'white',
				fontSize: 25,
				fontWeight: 'bold',
				top: 90,
				left: 25
			});

			var toughness = new fabric.IText(''+window.FAERIACARDS[name].health||0, {
				fontFamily: 'Libre Baskerville',
				fill: 'white',
				fontSize: 25,
				fontWeight: 'bold',
				top: 90,
				left: 95
			});

			var tokenGroup = new fabric.Group([img, power, toughness], {
				left: left,
				top: top
			});

			self.canvas.add(tokenGroup);
		});
	};

	FaeriaBoard.prototype.addCard = function(type, offsetObj) {
		var self = this;
		fabric.Image.fromURL('/card/' + type + '.png', function(img) {
			img.width = 250;
			img.height = 250;
			noControls(img);


			if (offsetObj) {
				img.top = offsetObj.top;
				img.left = offsetObj.left;
			} else {
				img.top = (self.opt.height - img.height) / 2;
				img.left = (self.opt.width - img.width) / 2;
			}

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

	FaeriaBoard.prototype.bindWellClick = function(img, top, left) {
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
		img.isWell = true;
	};


	FaeriaBoard.prototype.addWells = function() {
		var self = this;

		fabric.Image.fromURL('images/faeriawith.png', function(img) {
			img.width = 100;
			img.height = 200;
			makeNotSelectable(img);

			img.top = 200;
			img.left = 225;
			self.wellGroup.add(img);
			self.canvas.add(img);

			self.bindWellClick(img, 200, 225);
			self.canvas.sendToBack(img);

		});

		fabric.Image.fromURL('images/faeriawith.png', function(img) {
			img.width = 100;
			img.height = 200;
			makeNotSelectable(img);

			img.top = 200;
			img.left = 875;
			self.wellGroup.add(img);
			self.canvas.add(img);

			self.bindWellClick(img, 200, 875);
			self.canvas.sendToBack(img);

		});

		fabric.Image.fromURL('images/faeriawith.png', function(img) {
			img.width = 100;
			img.height = 200;
			makeNotSelectable(img);

			img.top = 480;
			img.left = 875;
			self.wellGroup.add(img);
			self.canvas.add(img);

			self.bindWellClick(img, 480, 875);
		});

		fabric.Image.fromURL('images/faeriawith.png', function(img) {
			img.width = 100;
			img.height = 200;
			makeNotSelectable(img);

			img.top = 480;
			img.left = 225;
			self.wellGroup.add(img);
			self.canvas.add(img);
			self.bindWellClick(img, 480, 225);
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
	} else if (window) {
		window.FaeriaBoardRenderer = exposed;
	}

}());