QUE.views.classifications = {};

QUE.views.classifications.get_hierarchy = function(){
	var entries = [];

	MEM.learned.dictionary.entries.forEach(function( entry ){
		if( entry.d ){
			entry.d.forEach(function( def ){
				if( def.c ){
					def.c.forEach(function( word ){
						var match = entries.find( x => x.word == word );

						if( !match ){
							match = { word, children : [] };
							entries.push( match );
						}
						match.children.push({ word : entry.w });
					}, this);
				}
			}, this);
		}
	}, this);

	console.log( entries );

	return entries;
};

QUE.views.classifications.draw = function(){
	var get_entry_html = function( entry ){
		if( !entry.children ) return '<div class="word">' + entry.word + '</div>';

		return '<div class="word">' +
			entry.word +
			'<div class="children">' +
				entry.children.map(function( c ){
					return get_entry_html( c );
				}).join('') +
			'</div>' +
		'</div>';
	};

	$( "#content" ).html(
		QUE.view.get_header() +
		'<div class="content">' +
			'<div class="ui-content" id="classifications">' +
				this.get_hierarchy().map(function( entry ){
					return get_entry_html( entry );
					return '<div class="entry">' + 
						'<div class="word">' + entry.word + '</div>' +
						'<div class="children">' + 
							entry.children.map(function( c ){
								return '<div class="">' + 
								'</div>';
							}).join('') +
						'</div>' +
					'</div>';
				}, this).join('') +
			'</div>' +
		'</div>'
	);
	
	$( "#user-input-field input" ).focus();
};