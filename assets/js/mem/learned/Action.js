MEM.learned.action = function( p ){
	this.word = p.word;

	if( p.target ) this.target = p.target;

	this.init( p );
};

MEM.learned.action.prototype.init = function( p ){
	this.traits  = [];  // Adverbs that describe how the action was done.

	if( p.traits ) this.traits = p.traits;

	this.definitions = MEM.learned.dictionary.get_definitions( this.word );
};