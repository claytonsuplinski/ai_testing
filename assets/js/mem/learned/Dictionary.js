MEM.learned.dictionary = { name : 'dictionary', type : 'learned' };

// TODO : Turn some of this functionality into a class that can be inherited by other learned memories.
// 		-When doing this, see if I can come up with a more efficient way of specifying the name value for the object.

MEM.learned.dictionary.load = function( callback ){
	var self = this;

	this.entries = [];
	
	$.ajax({
		url      : './assets/data/learned/' + this.name + '.json',
		dataType : 'json',
		success  : function( data ){
			self.entries = data;
		
			if( callback ) callback();
		},
		error    : function( e ){
			console.log( '----------------------------------' );
			console.log( 'Error loading ' + self.type + ' ' + self.name + ' memory.' );
			console.log( e );
			
			if( callback ) callback();
		}
	});
	if( callback ) callback();
};

MEM.learned.dictionary.add_word = function( word ){
	var entry = { w : word.w, d : [], '_' : 0 };
	this.entries.splice( QUE.functions.get_sorted_index( this.entries.map( x => x.w ), entry.w ), 0, entry );
	if( word.d ) this.add_definition( word );
	return entry;
};

MEM.learned.dictionary.change_word = function( old_word, new_word ){
	var entry = this.get_word( old_word );
	entry.w = new_word;
	this.entries = this.entries.sort( (a,b) => ( a.w > b.w ? 1 : -1 ) );
};

MEM.learned.dictionary.add_definition = function( word ){
	var entry = this.get_word( word.w );
	if( entry ){
		word.d._ = entry._;
		entry._++;
		entry.d.push( word.d );
	}
};

MEM.learned.dictionary.update_definition = function( word, definition_idx ){
	var entry = this.get_word( word.w );
	if( entry ){
		// For some keys in entry.d, the value will need to be appended to an array, instead of simply assigned.
		[ 'c' ].forEach(function( x ){
			if( word.d[ x ] !== undefined ){
				if( !entry.d[ definition_idx ][ x ] ) entry.d[ definition_idx ][ x ] = [];
				if( !entry.d[ definition_idx ][ x ].includes( word.d[ x ] ) ) entry.d[ definition_idx ][ x ] = entry.d[ definition_idx ][ x ].concat( word.d[ x ] );
				delete word.d[ x ];
			}
		}, this);
		// For some keys in entry.d, the value will need to be assigned to a nested object.
		[ 'x' ].forEach(function( x ){
			if( word.d[ x ] !== undefined ){
				if( !entry.d[ definition_idx ][ x ] ) entry.d[ definition_idx ][ x ] = {};
				Object.assign( entry.d[ definition_idx ][ x ], word.d[ x ] );
				delete word.d[ x ];
			}
		}, this);
		Object.assign( entry.d[ definition_idx ], word.d );
		this.recalculate_max_def_id( word );
	}
};

MEM.learned.dictionary.save = function(){
	QUE.functions.download_json( this.entries, this.name + '.json' );
};

MEM.learned.dictionary.algorithmic_definition_type_to_key = function( type ){
	switch( type.toLowerCase() ){
		case 'conditional' : return 'c';
		case 'quantity'    : return 'q';
		case 'value'       : return 'v';
	}
	return false;
};

MEM.learned.dictionary.recalculate_max_def_id = function( word ){
	var entry = this.get_word( word.w );
	if( entry ){
		console.log( entry._ );
		console.log( Math.max( ...entry.d.map( d => d._ + 1 ) ) );
		entry._ = Math.max( entry._, Math.max( ...entry.d.map( d => d._ + 1 ) ) );
	}
};

MEM.learned.dictionary.get_word = function( word ){
	var word = word.toLowerCase();
	return this.entries.find(function( entry ){ return entry.w == word; });
};

MEM.learned.dictionary.get_associations = function( word ){
};

MEM.learned.dictionary.get_definitions = function( word, def_criteria, params ){
	var def_criteria = def_criteria || {};
	var params       = params       || {};
	var word   = ( typeof word == 'object' ? word : this.get_word( word ) );
	if( word ){
		var is_match = function( def, x ){ return ( JSON.stringify( def[ x ] ) == JSON.stringify( def_criteria[ x ] ) ); };
		if( params.update_match ){
			is_match = function( def, x ){ return ( JSON.stringify( def[ x ] ) == JSON.stringify( def_criteria[ x ] ) || def[ x ] === undefined ); };
		}
	
		return word.d.filter(function( def ){
			return Object.keys( def_criteria ).every(function( x ){ return is_match( def, x ); });
		});
	}
	return [];
};

MEM.learned.dictionary.query = function( p ){
	var result = false;
	
	if( p.word ) result = this.get_word( p.word );
	
	return result;
};