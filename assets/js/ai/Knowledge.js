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

AI.knowledge.add_event = function( p ){
	var eve = {
		'.' : p.sentence_type.key,
		s   : [],
		t   : {},
	};
	
	// Derive objects / words for each part of the sentence.
	p.sentence_type.parts.forEach(function( part, part_idx ){
		var input_val = p.sentence_parts[ part_idx ];
		var part_key  = part.key || part.name[ 0 ].toLowerCase();
		
		if( part.object ){
			try{
				var obj_id = Number( input_val.split( '(' )[ 1 ].split( ')' )[ 0 ] );
				var obj    = AI.knowledge.get_object( obj_id );
				
				if( obj ){
					eve.s.push({ t : part_key, o : obj.id });
					return;
				}
			} catch(e){}
		}
		
		eve.s.push({ t : part_key, w : AI.dictionary.find({ word : QUE.functions.unstringify_word( input_val.split('* ')[ 1 ] ) })[ '_' ] });
	});
	
	// Derive values for the temporal scope of the sentence.
	switch( p.temporal_scope.type ){
		case 'Current Time':
			eve.t.v = QUE.functions.datetime_to_string( new Date() );
			break;
	}
	
	this.data.events.push( eve );
};

AI.knowledge.save_objects = function(){
	QUE.functions.download_json( this.data.objects, 'objects.json' );
};

AI.knowledge.save_events = function(){
	QUE.functions.download_json( this.data.events, 'events.json' );
};