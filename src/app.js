var f = FaeriaBoardRenderer.create({
	canvasId: 'render-canvas',
	width: 1200,
	height: 800
});
f.render(function() {
	bindDOM();
});

function bindDOM() {
	$('#btns').on('click', 'button', function() {

	});

	$('.land-draggable').draggable({
		revert: 'invalid',
		helper: 'clone',
		appendTo: 'body'
	});
	$('.canvas-container').droppable({
		accept: '.land-draggable, .token-draggable, .card-draggable',
		drop: function(event, ui) {
			var land = $(ui.draggable).attr('rel');
			if (land) {
				f.addLand(land, {
				top: $(ui.helper).offset().top - $('.canvas-container').offset().top-40,
				left: $(ui.helper).offset().left - $('.canvas-container').offset().left-40
			});
			}
			var name = $(ui.draggable).attr('data-token-name') ? $(ui.draggable).attr('data-token-name').toLowerCase().replace(/ /g, '') : null;
			if (name) {
				f.addToken(name, {
					top: $(ui.helper).offset().top - $('.canvas-container').offset().top-40,
					left: $(ui.helper).offset().left - $('.canvas-container').offset().left-40
				});
			}
			var id = $(ui.draggable).attr('data-card-id');
			if (id) {
				f.addCard(id, {
					top: $(ui.helper).offset().top - $('.canvas-container').offset().top-40,
					left: $(ui.helper).offset().left - $('.canvas-container').offset().left-40
				});
			}
		}
	});

		
	$('button[data-download]').on('click', function() {
		window.open(f.canvas.toDataURL());
	});
	
	// This is a hack to replace the mdl-layout__drawer-button icon from the standard hamburger menu icon to the chat icon for our use.
	function changeIcon() {
		var _db = document.querySelector('.mdl-layout__drawer-button i');
		if (_db) {
			_db.textContent = 'settings';
		}
		if (!_db) {
			setTimeout(function() {
				changeIcon();
			}, 50);
		}
	}
	changeIcon();

	$.getJSON('../node_modules/faeria-cards/build/output.json', function(data) {
		data.sort(function(a, b) {
			if (a.name > b.name) {
				return 1;
			}
			if (b.name > a.name) {
				return -1;
			}
			return 0;
		});

		var cardMap = {};
		data.forEach(function(card) {
			var name = card.name.toLowerCase().replace(/ /g, '');
			cardMap[name] = card;
		});
		window.FAERIACARDS = cardMap;

		var items = [];
		var itemsCards = [];
		$.each(data, function(key, val) {
			while (val.id.toString().length < 3) {
				val.id = '0' + val.id;
			}
			if (val.color === 'PANDORA' || val.type === 'event') {
				return;
			}

			var name = val.name.toLowerCase().replace(/ /g, '');

			items.push(`<div class="mdl-list">
					  <div class="mdl-list__item">
					    <span class="mdl-list__item-primary-content">
					      <img src="images/tokens/token_white_${name}.png" class="token-draggable" data-token-name="token_white_${name}" />
					      <img src="images/tokens/token_black_${name}.png" class="token-draggable" data-token-name="token_black_${name}" />
					      <span>${val.name}</span>
					      
					    </span>
					    
					  </div>
					</div>`);

			itemsCards.push(`<div class="mdl-list">
					  <div class="mdl-list__item">
					    <span class="mdl-list__item-primary-content">
					      <img src="/card/${val.id}.png" class="card-draggable" data-card-id="${val.id}"/>
					      <span>${val.name}</span>
					      
					    </span>
					    
					  </div>
					</div>`);
		});

		$('<ul/>', {
			html: items.join('')
		}).appendTo('#cards-tokens');

		$('<ul/>', {
			html: itemsCards.join('')
		}).appendTo('#cards');


		$('.token-draggable').draggable({
			revert: 'invalid',
			helper: 'clone',
			appendTo: 'body'
		});
		

		$('.card-draggable').draggable({
			revert: 'invalid',
			helper: 'clone',
			appendTo: 'body'
		});

	});
}
//will accept a canvas element passed from options
//will set the width/height from options
//will use defaults if no options passed

console.log(f)