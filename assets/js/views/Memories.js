QUE.views.memories = {};

QUE.views.memories.get_definition_line = function( key, val ){
	return '<tr>' +
		'<td class="name">' + key + '</td>' +
		'<td class="info">' + val + '</td>' +
	'</tr>';
};

QUE.views.memories.draw = function(){
	if( !this.memory_types ){
		this.memory_types = Object.keys( MEM.learned );
		this.memory_index = 0;
	}
	
	var curr_memory = MEM.learned[ this.memory_types[ this.memory_index ] ].entries;

	$( "#content" ).html(
		QUE.view.get_header() +
		'<div class="content">' +
			// Note : If other types of memories get implemented, this select object will be useful. Otherwise, it is unnecessary with only one memory file.
			// '<div class="ui-section">' + 
			// 	'<div class="select-label">Memory Type : </div>' +
			// 	'<select onchange="QUE.views.memories.select( this.value );">' +
			// 		this.memory_types.map(function( x, i ){
			// 			return '<option value="' + i + '">' + QUE.functions.to_title_case( x ) + '</option>';
			// 		}).join('') +
			// 	'</select>' +
			// '</div>' +
			'<div class="ui-content" id="memories">' +
				curr_memory.map(function( entry ){
					return '<div class="entry">' + 
						'<div class="word">' + entry.w + '</div>' +
						( !entry.d ? '' :
							entry.d.map(function( def ){
								return '<table class="definition">' +
									( !def.p ? '' : this.get_definition_line( 'POS', AI.parts_of_speech.convert_pos_string( def.p, 'abbr', 'full' ) ) ) +
									( !def.t ? '' : this.get_definition_line( 'Word Types', def.t.join(', ') ) ) +
									( !def.c ? '' : this.get_definition_line( 'Categories', def.c.join(', ') ) ) +
									( !def.d ? '' : this.get_definition_line( 'Descriptions', def.d.join('; ') ) ) +
								'</table>';
							}, this).join('<hr class="definition-divider">')
						) +
					'</div>';
				}, this).join('') +
			'</div>' +
		'</div>'
	);
	
	$( "#user-input-field input" ).focus();
};