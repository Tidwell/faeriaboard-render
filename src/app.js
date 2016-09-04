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
		f.addLand($(this).attr('rel'));
	});
	$('button[data-download]').on('click', function() {
		window.open(f.canvas.toDataURL());
	});
	$('button[data-add]').on('click', function() {
		f.addToken($('select').val());
	});

	$('.toggle').on('click', function() {
		var $tools = $('.tool-container');
		console.log()
		if ($tools.css('left').indexOf('-') > -1) {
			return $tools.animate({
				left: 0
			});
		}
		$tools.animate({
			left: -$tools.width()
		});
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
		data.sort(function(a,b){
			if (a.name > b.name) { return 1; }
			if (b.name > a.name) { return -1; }
			return 0;
		})
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
					      <img src="images/tokens/token_white_${name}.png" />
					      <span>${val.name}</span>
					      
					    </span>
					    
					  </div>
					</div>`);

			itemsCards.push(`<div class="mdl-list" data-card-id="${val.id}">
					  <div class="mdl-list__item">
					    <span class="mdl-list__item-primary-content">
					      <img src="http://www.faeriadecks.com/images/card-renders/${val.id}.png"/>
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
	});

	$('#cards-tokens').on('click', '.mdl-list', function() {
		var name = $(this).find('span')[1].innerText.toLowerCase().replace(/ /g, '');
		f.addToken('token_white_'+name);
	})

	$('#cards').on('click', '.mdl-list', function() {
		var id = $(this).attr('data-card-id');
		f.addCard(id);
	})
}
//will accept a canvas element passed from options
//will set the width/height from options
//will use defaults if no options passed

console.log(f)