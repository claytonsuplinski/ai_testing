MEM.learned.associations = { name : 'associations', type : 'learned' };

// TODO : Turn some of this functionality into a class that can be inherited by other learned memories.
// 		-When doing this, see if I can come up with a more efficient way of specifying the name value for the object.

MEM.learned.associations.load = function( callback ){
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

MEM.learned.associations.add_word = function( word ){
	var entry = { w : word.w, d : [] };
	if( word.d ) entry.d.push( word.d );
	this.entries.splice( QUE.functions.get_sorted_index( this.entries.map( x => x.w ), entry.w ), 0, entry );
};

MEM.learned.associations.add_definition = function( word ){
	var entry = this.get_word( word.w );
	if( entry ) entry.d.push( word.d );
};

MEM.learned.associations.update_definition = function( word, definition_idx ){
	var entry = this.get_word( word.w );
	if( entry ) Object.assign( entry.d[ definition_idx ], word.d );
};

MEM.learned.associations.save = function(){
	QUE.functions.download_json( this.entries, this.name + '.json' );
};

MEM.learned.associations.get_word = function( word ){
	var word = word.toLowerCase();
	return this.entries.find(function( entry ){ return entry.w == word; });
};

MEM.learned.associations.get_definitions = function( word, def_criteria, params ){
	var params = params || {};
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

MEM.learned.associations.query = function( p ){
	var result = false;
	
	if( p.word ) result = this.get_word( p.word );
	
	return result;
};