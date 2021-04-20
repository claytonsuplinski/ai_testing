QUE.views.dictionary = { mode : 'edit' };

QUE.views.dictionary.toggle_mode = function(){
	this.mode = ( this.mode == 'edit' ? 'delete' : 'edit' );
	this.draw();
};

QUE.views.dictionary.get_definition_line = function( obj, k, key, val ){
	if( !obj[ k ] ) return '';
	return '<tr>' +
		'<td class="key ">' + k   + '</td>' +
		'<td class="name">' + key + '</td>' +
		'<td class="info">' + val + '</td>' +
	'</tr>';
};

QUE.views.dictionary.get_definition_html = function( def, modify_params ){
	var onclick = '';
	var classes = '';
	if( modify_params ){
		onclick = 'QUE.views.dictionary.' + modify_params.mode + '_definition( this, ' + modify_params.word_idx + ', ' + modify_params.def_idx + ' );this.onclick=false;';
		classes = modify_params.mode + '-mode';
	} 

	return '<table class="definition ' + classes + '" onclick="' + onclick + '">' +
		( !def.r ? '' : this.get_definition_line( def, 'r', 'Root Word'      , def.r            ) ) +
		( !def.p ? '' : this.get_definition_line( def, 'p', 'POS'            , AI.parts_of_speech.convert_pos_string( def.p, 'key', 'full' ) ) ) +
		( !def.t ? '' : this.get_definition_line( def, 't', 'Word Types'     , def.t.join(', ') ) ) +
		( !def.c ? '' : this.get_definition_line( def, 'c', 'Classifications', def.c.join(', ') ) ) +
		( !def.d ? '' : this.get_definition_line( def, 'd', 'Descriptions'   , def.d.join('; ') ) ) +
		( !def.x ? '' :
			this.get_definition_line( def, 'x', 'Algorithmic Defs', 
				'<table class="sub-definition code">' +
					( !def.x.c ? '' : this.get_definition_line( def.x, 'c', 'Conditional', def.x.c ) ) +
					( !def.x.q ? '' : this.get_definition_line( def.x, 'q', 'Quantity'   , def.x.q ) ) +
					( !def.x.v ? '' : this.get_definition_line( def.x, 'v', 'Value'      , def.x.v ) ) +
				'</table>'
			)
		) +
		( !def.a ? '' :
			this.get_definition_line( def, 'a', 'Associations', 
				def.a.map(function( association ){
					return '<table class="sub-definition">' +
						( !association.w ? '' : this.get_definition_line( association, 'w', 'Word', association.w ) ) +
						( !association.t ? '' : this.get_definition_line( association, 't', 'Type', association.t ) ) +
					'</table>';
				}, this).join('')
			)
		) +
	'</table>';
};

QUE.views.dictionary.add_entry = function(){
	console.log( $( "#add-word"       ).val() );
	console.log( $( "#add-definition" ).val() );
	var word       = $( "#add-word"       ).val();
	var definition = $( "#add-definition" ).val();

	if( !word ){
		alert( 'Error : Word not set.' );
		return;
	}

	try{
		definition = JSON.parse( definition );

		var entry = MEM.learned.dictionary.get_word( word );
		if( !entry ) entry = MEM.learned.dictionary.add_word({ w : word });

		if( definition ) MEM.learned.dictionary.add_definition({ w : word, d : definition });
		
		this.draw();
	} catch(e){
		alert( 'Error: Invalid JSON syntax for definition.' );
		console.log( e );
	}
};

QUE.views.dictionary.delete_word = function( ele, idx ){
	MEM.learned.dictionary.entries.splice( idx, 1 );
	this.draw();
};

QUE.views.dictionary.edit_word = function( ele, idx ){
	var entry = MEM.learned.dictionary.entries[ idx ];
	$( ele ).html( '<input value="' + entry.w + '" onblur="QUE.views.dictionary.finish_editing_word( this, ' + idx + ' );"></input>' );
};

QUE.views.dictionary.finish_editing_word = function( ele, idx ){
	MEM.learned.dictionary.change_word(
		MEM.learned.dictionary.entries[ idx ].w,
		$( ele ).val()
	);
	this.draw();
};

QUE.views.dictionary.delete_definition = function( ele, word_idx, def_idx ){
	MEM.learned.dictionary.entries[ word_idx ].d.splice( def_idx, 1 );
	this.draw();
};

QUE.views.dictionary.edit_definition = function( ele, word_idx, def_idx ){
	$( ele ).html(
		'<tr><td>' +
			'<textarea onblur="QUE.views.dictionary.finish_editing_definition( this, ' + word_idx + ', ' + def_idx + ' );">' +
				JSON.stringify( MEM.learned.dictionary.entries[ word_idx ].d[ def_idx ], null, "\t" ) +
			'</textarea>' +
		'</td></tr>'
	);
}

QUE.views.dictionary.finish_editing_definition = function( ele, word_idx, def_idx ){
	try{
		var updated_definition = JSON.parse( $( ele ).val() );
		MEM.learned.dictionary.entries[ word_idx ].d[ def_idx ] = updated_definition;
		this.draw();
	} catch(e){
		alert( 'Error: Invalid JSON syntax.' );
		console.log( e );
	}
};

QUE.views.dictionary.draw = function(){
	if( !this.memory_types ){
		this.memory_types = Object.keys( MEM.learned );
		this.memory_index = 0;
	}
	
	var curr_memory = MEM.learned[ this.memory_types[ this.memory_index ] ].entries;

	$( "#content" ).html(
		QUE.view.get_header() +
		'<div class="content">' +
			'<div class="ui-section" id="user-input-field">' + 
				'<input    id="add-word"       class="half-input" placeholder="Word"></input>' + 
				'<textarea id="add-definition" class="half-input" placeholder="Definition" rows="1" onfocus="$( this ).addClass(\'expanded\');" onblur="$( this ).removeClass(\'expanded\');"></textarea>' + 
				'<div id="send-message-button" class="button" onclick="QUE.views.dictionary.add_entry();">Add</div>' +
			'</div>' +
			'<div class="ui-content" id="dictionary">' +
				curr_memory.map(function( entry, word_idx ){
					return '<div class="entry">' + 
						'<div class="word ' + this.mode + '-mode" onclick="QUE.views.dictionary.' + this.mode + '_word( this, ' + word_idx + ' );this.onclick=false;">' + 
							entry.w + 
						'</div>' +
						( !entry.d ? '' :
							entry.d.map(function( def, def_idx ){
								return this.get_definition_html( def, { mode : this.mode, word_idx, def_idx } );
							}, this).join( '<hr class="definition-divider">' )
						) +
					'</div>';
				}, this).join('') +
			'</div>' +
			'<div class="ui-section">' +
				'<div id="save-button" class="button" onclick="MEM.learned.dictionary.save();">Save</div>' +
				'<div id="edit-button" class="' + this.mode + ' button" onclick="QUE.views.dictionary.toggle_mode();">' +
					QUE.functions.to_title_case( this.mode ) +
				'</div>' +
			'</div>' +
		'</div>'
	);
	
	$( "#user-input-field input" ).focus();
};