QUE.views.classifications = {};

QUE.views.classifications.get_hierarchy = function(){
	var nodes = [];
	var roots = [];

	MEM.learned.dictionary.entries.forEach(function( entry ){
		if( entry.d ){
			entry.d.forEach(function( def ){
				if( def.c ){
					def.c.forEach(function( c ){
						var curr_match = nodes.find( x => x.w == c.w && x.d == c.d );
						if( !curr_match ){
							curr_match = { w : c.w, d : c.d, children : [] };
							nodes.push( curr_match );
							roots.push( curr_match );
						}

						var child_match = nodes.find( x => x.w == entry.w && x.d == def._ );
						if( !child_match ){
							child_match = { w : entry.w, d : def._, children : [] };
							nodes.push( curr_match );
						}
						else{
							var root_idx = roots.findIndex( x => x.w == child_match.w && x.d == child_match.d );
							if( root_idx != -1 ) roots.splice( root_idx, 1 );
						}

						curr_match.children.push( child_match );
					}, this);
				}
			}, this);
		}
	}, this);

	return roots;
};

QUE.views.classifications.draw = function(){
	var get_entry_html = function( entry ){
		if( !entry.children ){
			return '<div class="word">' + 
				entry.w + ' <span class="definition-id">' + entry.d + '</span>' +
			'</div><br>';
		}

		return '<div class="word">' +
			entry.w + ' <span class="definition-id">' + entry.d + '</span>' +
			'<div class="children">' +
				entry.children.map(function( c ){
					return get_entry_html( c );
				}).join('') +
			'</div>' +
		'</div><br>';
	};

	$( "#content" ).html(
		QUE.view.get_header() +
		'<div class="content">' +
			'<div class="ui-content" id="classifications">' +
				this.get_hierarchy().map(function( entry ){
					return get_entry_html( entry );
				}, this).join('') +
			'</div>' +
		'</div>'
	);
	
	$( "#user-input-field input" ).focus();
};