AI.absorb = {};

AI.absorb.associations = function( sentences ){
	var parts = sentences[ 0 ].join(' ').split(' is a ');
	var word = parts[ 0 ].toLowerCase();
	var pos  = AI.parts_of_speech.convert_pos_string( parts[ 1 ], 'full', 'key' );
	
	// TODO : If matching association already exists, the computer should ask if I am referring to the existing definition or a new definition.
	console.log( word, ' | ', pos );
	console.log( MEM.learned.associations.add( { 'w' : word, 'd' : { 'p' : pos } } ) );
};