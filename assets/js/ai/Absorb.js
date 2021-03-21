AI.absorb = {};

AI.absorb.associations = function( sentences ){
	var sentence = sentences[ 0 ].raw;
	
	// Handle hard-coded sentence format : <word> is a <part_of_speech>.
	if( sentence.includes( ' is a ' ) || sentence.includes( ' is an ' ) ){
		try{
			sentence = sentence.replace( / an /g, ' a ' );

			var parts = sentence.split(' is a ');
			var word  = parts[ 0 ].toLowerCase();
			var pos   = AI.parts_of_speech.convert_pos_string( parts[ 1 ], 'full', 'key' );
			
			var association = { 'w' : word, 'd' : { 'p' : pos } };
			
			MEM.learned.associations.add( association );
			
			return association;
		} catch(e){
			return false;
		}
	}
	
	return false;
};