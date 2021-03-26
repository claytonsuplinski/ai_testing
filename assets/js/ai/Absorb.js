AI.absorb = {};

AI.absorb.content = function( content ){
	if( content.association ){
		MEM.learned.associations.add( content.association );
	}
};