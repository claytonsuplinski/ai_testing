AI.dictionary = {};

AI.dictionary.load = function( p ){
	var p = p || {};

	var self = this;

	this.entries = [];
	
	$.ajax({
		url      : './assets/data/learned/dictionary.json',
		dataType : 'json',
		success  : function( data ){
			self.entries = data;
		
			if( p.callback ) p.callback();
		},
		error    : function( e ){
			console.log( '----------------------------------' );
			console.log( 'Error loading ' + self.type + ' ' + self.name + ' memory.' );
			console.log( e );
			
			if( p.callback ) p.callback();
		}
	});
};

AI.dictionary.find = function( p ){
	var word = p.word;
	return this.entries[ 'find' + ( p.find_index ? 'Index' : '' ) ]( x => ( x.w == word.w && x.d == word.d ) );
};

AI.dictionary.insert = function( word ){
	if( !word.w ) return { error : 'Failed to insert into dictionary. No word provided.' };
	var match = this.find({ word });
	if( !match ){
		var idx = 0;
		for( var x of this.entries ){
			if(
				  x.w >  word.w ||
				( x.w == word.w && x.d > word.d )
			){
				this.entries.splice( idx, 0, word );
				break;
			}
			else if( idx >= this.entries.length - 1 ){
				this.entries.splice( idx + 1, 0, word );
				break;
			}
			idx++;
		};
	}
	else{
		return { error : 'Failed to insert into dictionary. Entry already exists for ' + word.w + ' (' + ( word.d || '' ) + ').' };
	}
	return { success : word };
};

AI.dictionary.update = function( prev_word, next_word ){
	if( !next_word.w ) return { error : 'Failed to update dictionary. No word provided.' };
	var prev_idx = this.find({ word : prev_word, find_index : true });
	if( prev_idx != -1 ){
		this.entries.splice( prev_idx, 1 );
		var inserted = this.insert( next_word );
		if( inserted.error ){
			this.entries.splice( prev_idx, 0, prev_word );
			return { error : 'Failed to update dictionary. Conflicting entry for ' + word.w + ' (' + ( word.d || '' ) + ').' };
		}
	}
	else{
		return { error : 'Failed to update dictionary. No matching entry for ' + word.w + ' (' + ( word.d || '' ) + ').' };
	}
	return { success : next_word };
};

AI.dictionary.save = function( word ){
	QUE.functions.download_json( this.entries, 'dictionary.json' );
};