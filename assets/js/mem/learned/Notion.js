MEM.learned.notion = function( p ){
	this.name = p.name;
	this.init( p );
};

MEM.learned.notion.prototype.init = function( p ){
	this.actions = [];  // Verbs that this thing is doing (along with adverbs that describe how the thing is being done).
	this.traits  = [];  // Adjectives that describe the thing.

	if( p.action ) this.add_action( p.action );

	this.definitions = MEM.learned.dictionary.get_definitions( this.name );
};

MEM.learned.notion.prototype.add_action = function( action ){
	this.actions.push( action );
};

MEM.learned.notion.prototype.merge = function( matching_notions ){
};