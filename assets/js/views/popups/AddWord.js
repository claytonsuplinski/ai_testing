QUE.views.popups.add_word = new JL.popup({
	header : "Add New Word",
	buttons : [
		{ name : 'Add Word', onclick : 'QUE.views.popups.add_word.submit();' }
	],
});
QUE.views.popups.add_word.this_string = 'QUE.views.popups.add_word';

QUE.views.popups.add_word.close = function(){
	$( ".popup" ).hide(	);
};

QUE.views.popups.add_word.get_values = function(){
	var output = {};
	QUE.config.definition_components.forEach(function( t, i ){
		var val = $( '#trait-content-' + i ).val();
		if( val !== '' ){
			if( t.options ){
				var name_match = t.options.find( o => o.name == val );
				if( name_match ) val = name_match.val;
			}
			else{
				switch( t.type ){
					case 'words':
						val = JSON.parse( val );
						break;
					case 'word':
						break;
				};
			}
			output[ t.key ] = val;
		}
	});
	return output;
};

QUE.views.popups.add_word.post_submit = function( response ){
	if( response.error ){
		alert( 'Error : ' + response.error );
	}
	else{
		this.close();
		if( this.on_submit ) this.on_submit();
	}
};

QUE.views.popups.add_word.submit = function(){
	var output = this.get_values();
	var response = AI.dictionary.insert( output );
	this.post_submit( response );
};

QUE.views.popups.add_word.html_words_trait = function( p ){
	var self = this;
	var entry = this.entry;
	var value = entry[ p.key ];
	var update_params = 'key : \'' + p.key + '\', id : \'' + p.id + '\', id_words : \'' + p.id_words + '\'';
	return '<div class="add-word" onclick="' + self.this_string + '.update_words_trait({ action : \'add\', ' + update_params + ' });"' + 
			'>Add Word</div>' +
	( !value ? '' : 
		value.map(function( word, idx ){
			return '<div class="word">' + 
				word.w  +
				( word.d ? ' (' + word.d + ')' : '' ) + 
				'<span class="remove-word" onclick="' + self.this_string + '.update_words_trait({ action : \'remove\', idx : ' + idx + ', ' + update_params + ' });">X</span>' +
			'</div>';
		}).join('')
	);
};

QUE.views.popups.add_word.update_words_trait = function( p ){
	if( !this.entry[ p.key ] ) this.entry[ p.key ] = [];

	var val = $( '#' + p.id ).val();

	switch( p.action ){
		case 'add':
			var obj = {};
			var parts = val.split( '(' );
			obj.w = parts[ 0 ];
			if( parts.length > 1 ){
				obj.d = parts[ 1 ].split( ')' )[ 0 ];
			}
			this.entry[ p.key ].unshift( obj );
			break;
		case 'remove':	
			this.entry[ p.key ].splice( p.idx, 1 );
			break;
	}

	$( '#' + p.id_words ).html( this.html_words_trait( p ) );
};

QUE.views.popups.add_word.load = function( p ){
	var self = this;
	var p = p || {};
	this.on_submit = p.on_submit;
	this.entry = p.entry;
	this.set({
		content : '<table id="add-word" class="trait-table">' + 
			QUE.config.definition_components.map(function( t, i ){
				var id = 'trait-content-' + i;
				var value;
				if( self.entry ) value = self.entry[ t.key ];
				var input_value = ( value !== undefined ? value : '' );
				if( t.type == 'words' ) input_value = '';
				var content = '<input id="' + id + '" value="' + input_value + '" class="' + ( t.type ? 'type-' + t.type : '' ) + '"></input>';
				var additional_content = '';
				if( t.options ){
					content = '<select id="' + id + '">' + 
						t.options.map(function(x){
							var val = ( x.val || x.name );
							return '<option val="' + val + '" ' + ( value !== undefined && value == val ? 'selected' : '' ) + '>' +
								x.name +
							'</option>';
						}).join('') +
					'</select>';
				}

				if( t.type == 'words' ){
					var id_words = id + '-words';
					additional_content += '<tr>' +
						'<td id="' + id_words + '" class="trait-words" colspan="2">' +
							self.html_words_trait({ id, id_words, key : t.key }) +
						'</td>' +
					'</tr>';
				}
				
				return '<tr>' +
					'<td class="trait-label">' + t.name + '</td>' +
					'<td class="trait-content">' + content + '</td>' +
				'</tr>' + additional_content;
			}).join('') +
		'</table>'
	});
	$( 'input.type-words, input.type-word' ).autocomplete({
		source : AI.dictionary.entries.map(function( entry ){
			return entry.w + ( entry.d ? ' (' + entry.d + ')' : '' );
		})
	});
	this.show();
};