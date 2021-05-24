MEM.learned.action = function( p ){
	this.name = p.name;

	if( p.target ) this.target = p.target;

	this.init();
};

MEM.learned.action.prototype.init = function(){
	this.traits  = [];  // Adverbs that describe how the action was done.

	this.definitions = MEM.learned.dictionary.get_definitions( this.name );
};