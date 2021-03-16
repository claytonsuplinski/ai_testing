MEM.learned.associations = { name : 'associations', type : 'learned' };

// TODO : Turn some of this functionality into a class that can be inherited by other learned memories.
// 		-When doing this, see if I can come up with a more efficient way of specifying the name value for the object.

MEM.learned.associations.load = function( callback ){
	var self = this;

	// this.entries = [];
	this.entries = [ { test : 123 } ];
	
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

MEM.learned.associations.add = function( curr_values, update_values ){
	var update_values = update_values || {};

	var word = this.entries.find(function( entry ){ return entry.w == curr_values.w; });
	if( !word ){
		word = { w : curr_values.w, d : [] };
		this.entries.splice( QUE.functions.get_sorted_index( this.entries.map( x => x.w ), curr_values.w ), 0, word );
	}
	
	if( curr_values.d ){
		var def_keys = Object.keys( curr_values.d );
		var definition = word.d.find(function( d ){
			return def_keys.every(function( k ){ return d[ k ] == curr_values.d[ k ]; }); // I may need some sort of "recursive equals" function here (for nested values).
		});
		console.log( definition );
		if( definition && update_values.d ){
			Object.assign( definition, update_values.d );
		}
		else if( !definition ){
			definition = {};
			console.log( curr_values.d );
			Object.assign( definition, curr_values.d );
			word.d.push( definition );
		}
	}
	console.log( 'Add : ', curr_values, update_values, word );
};

MEM.learned.associations.save = function(){
	QUE.functions.download_json( this.entries, this.name + '.json' );
};

MEM.learned.associations.query = function(){
};