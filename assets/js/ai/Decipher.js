AI.decipher = {};

AI.decipher.sentences = function( sentences ){
	var response = {};

	var sentence = sentences[ 0 ].raw;
	
	// Handle hard-coded sentence format : <new_word> is the <type_of_word> of <root_word>.
	var re = new RegExp( '.+ is the .+ of .+\\.', 'i' );
	if( re.test( sentence ) ){
		sentence = sentence.toLowerCase();
		var parts = sentence.split(' is the ');
		var new_word = parts[ 0 ];
		parts = parts[ 1 ].split(' of ');
		var type = parts[ 0 ];
		[ 'tense', 'form' ].forEach(function( x ){
			var idx = type.indexOf( ' ' + x );
			if( idx != -1 ) type = type.substring( 0, idx );
		});
		var root_word = parts[ 1 ].substring( 0, parts[ 1 ].lastIndexOf('.') );
		
		response.association = { 'w' : new_word, 'd' : { 'r' : root_word, 'c' : [ type ] } };
	}
	// Handle hard-coded sentence format : <word> is a <part_of_speech>.
	else if( sentence.includes( ' is a ' ) || sentence.includes( ' is an ' ) ){
		try{
			sentence = sentence.replace( / an /g, ' a ' );

			var parts = sentence.split(' is a ');
			var word  = parts[ 0 ].toLowerCase();
			var pos   = AI.parts_of_speech.convert_pos_string( parts[ 1 ], 'full', 'key' );
			
			response.association = { 'w' : word, 'd' : { 'p' : pos } };
		} catch(e){}
	}
	
	// Determine if association already exists
	if( response.association ){
		response.matching_entry = MEM.learned.associations.get_word( response.association.w );
		if( response.matching_entry && response.association.d ){
			var matches = MEM.learned.associations.get_definitions( response.association.w, response.association.d, { update_match : true } );
			if( matches.length ) response.matching_definitions = matches;
		}
	}
	
	return response;
};