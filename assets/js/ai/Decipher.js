AI.decipher = {};

AI.decipher.patterns = [
	// <new_word> is the <type_of_word> of <root_word>.
	{
		splits   : [ 'is the ', ' of ' ],
		callback : function( response, parts ){
			var new_word  = parts[ 0 ];
			var type      = parts[ 1 ];
			var root_word = QUE.functions.strip_ending_period( parts[ 2 ] );

			[ 'tense', 'form' ].forEach(function( x ){
				var idx = type.indexOf( ' ' + x );
				if( idx != -1 ) type = type.substring( 0, idx );
			});
			
			response.association = { 'w' : new_word, 'd' : { 'r' : root_word, 'c' : [ type ] } };
		}
	},
	// Handle hard-coded sentence format : The <type_of_algorithmic_definition> definition of <word> is <defintion_of_word>.
	{
		splits   : [ 'the ', ' definition of ', ' is ' ],
		callback : function( response, parts ){
			var algorithmic_def_key = MEM.learned.dictionary.algorithmic_definition_type_to_key( parts[ 1 ] );
			response.association = { 'w' : parts[ 2 ], 'd' : { 'x' : {} } };
			response.association.d.x[ algorithmic_def_key ] = QUE.functions.strip_ending_period( parts[ 3 ] );
		}
	},
	// Handle hard-coded sentence format : <word> is a type of <classification>.
	{
		splits   : [ ' is a type of ' ],
		callback : function( response, parts ){
			response.association = { 'w' : parts[ 0 ], 'd' : { 'c' : [ QUE.functions.strip_ending_period( parts[ 1 ] ) ] } };
		}
	},
	// Handle hard-coded sentence format : <word> is a <part_of_speech>.
	{
		splits   : [ ' is a ' ],
		callback : function( response, parts ){
			response.association = { 'w' : parts[ 0 ], 'd' : { 'p' : AI.parts_of_speech.convert_pos_string( parts[ 1 ], 'full', 'key' ) } };
		}
	},
	{
		splits   : [ ' is an ' ],
		callback : function( response, parts ){
			response.association = { 'w' : parts[ 0 ], 'd' : { 'p' : AI.parts_of_speech.convert_pos_string( parts[ 1 ], 'full', 'key' ) } };
		}
	},
];

AI.decipher.sentences = function( sentences ){
	var response = {};

	var sentence = sentences[ 0 ].raw;

	sentences.forEach(function( s ){
		s.thoughts.forEach(function( t ){
			MEM.learned.thoughts.add_thought( t );
			if( t.subject ) MEM.learned.thoughts.add_notion( t.subject );
			if( t.target  ) MEM.learned.thoughts.add_notion( t.target  );
		});
	});

	// TODO : Stop using patterns when parsing the sentences.
	//		-Use the MEM.learned.thoughts and MEM.learned.notion classes to represent the content.
	//			-In the computer's response, visualize this content.
	// 		-Utilize the MEM.learned.notion instances in sentences[ 0 ] (the notion objects are derived in AI.sentence).

	this.patterns.forEach(function( pattern ){
		if( !response.association ){
			var sentence_copy  = sentence.toLowerCase();
			var sentence_parts = [];
			pattern.splits.forEach(function( s ){
				var parts = sentence_copy.split( s );
				if( parts.length >= 2 ){
					sentence_parts.push( parts[ 0 ] );
					sentence_copy = parts.slice( 1 ).join( s );
				}
			}, this);
			sentence_parts.push( sentence_copy );
			if( sentence_parts.length == pattern.splits.length + 1 ) pattern.callback( response, sentence_parts );
		}
	}, this);
	
	// Determine if association already exists
	if( response.association ){
		response.matching_entry = MEM.learned.dictionary.get_word( response.association.w );
		if( response.matching_entry && response.association.d ){
			response.matching_definitions = response.matching_entry.d;
			// var matches = MEM.learned.dictionary.get_definitions( response.association.w, response.association.d, { update_match : true } );
			// if( matches.length ) response.matching_definitions = matches;
		}
	}
	else{ // If no matching pattern, then provide the thoughts in the response object.
		response.thoughts = sentences.map( s => s.thoughts );
	}
	
	return response;
};

AI.decipher.definition_from_context = function( target_word, sentence ){
};