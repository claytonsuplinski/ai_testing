AI.knowledge = {};

AI.knowledge.load = function( p ){
	var p = p || {};

	var self = this;

	this.data = {
		objects : {
			id    : 0,
			items : [],
		},
	};

	var types = [ 'events', 'objects' ];

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

AI.knowledge.add_object = function( p ){
	// TODO : Decide on the traits that will go with each object.
	// 		-Name, id of object, adjectives (size, color, etc...)

	var obj = {
		name   : p.name,
		id     : this.data.objects.id,
		traits : {},
		events : [],
	};
	
	this.data.objects.items.push( obj );

	this.data.objects.id++;
};

AI.knowledge.edit_object = function( id, p ){
	var obj = this.get_object( id );
	obj = Object.assign( obj, p );
};

AI.knowledge.get_object = function( id ){
	return this.data.objects.items.find( x => x.id == id );
};

AI.knowledge.get_all_objects = function(){
	return this.data.objects.items;
};

AI.knowledge.remove_object = function( id ){
};

AI.knowledge.add_event = function( event ){
	// TODO : Decide on the traits that will go with each event.
	// 		-Ex: id of subject, id of target, timestamp, location, temperature, etc...
	// 		-For the most part, it'll probably just be Object.assign() of words from the sentence on the trait object.
	console.log( event );
	try{ this.objects.push( event[ 'Subject' ] ); } catch(e){}
	try{ this.objects.push( event[ 'Target'  ] ); } catch(e){}
	console.log( this.objects );
};

AI.knowledge.save_objects = function(){
	QUE.functions.download_json( this.data.objects, 'objects.json' );
};