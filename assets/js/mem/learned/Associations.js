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

MEM.learned.associations.save = function(){
	QUE.functions.download_json( this.entries, this.name + '.json' );
};

MEM.learned.associations.query = function(){
};