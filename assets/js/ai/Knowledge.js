AI.knowledge = {};

AI.knowledge.load = function( p ){
	var p = p || {};

	var self = this;

	this.data = {};

	this.objects = [];

	var types = [ 'events' ];

	var recursive_helper = function(){
		if( !types.length ){
			if( p.callback ) p.callback();
			return;
		}

		self.load_json( types.shift(), recursive_helper );
	};
	recursive_helper();
};

AI.knowledge.load_json = function( type, callback ){
	var self = this;

	$.ajax({
		url      : './assets/data/learned/knowledge/' + type + '.json',
		dataType : 'json',
		success  : function( data ){
			self.data[ type ] = data;
		
			if( callback ) callback();
		},
		error    : function( e ){
			console.log( '----------------------------------' );
			console.log( 'Error loading knowledge-' + type + '.' );
			console.log( e );
			
			if( callback ) callback();
		}
	});
};

AI.knowledge.add_event = function( event ){
	console.log( event );
	try{ this.objects.push( event[ 'Subject' ] ); } catch(e){}
	try{ this.objects.push( event[ 'Target'  ] ); } catch(e){}
	console.log( this.objects );
};

