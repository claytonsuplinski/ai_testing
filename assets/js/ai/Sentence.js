AI.sentence = {};

AI.sentence.get_type = function( sentence ){
	var sentence_end = sentence.parts[ sentence.parts.length - 1 ];
	if( sentence_end == '?' ) return 'question';
	if( sentence_end == '!' ) return 'exclamation';
	
	if( sentence_end == '.' && sentence.raw.toLowerCase().startsWith( 'computer,' ) ) return 'command';
	if( sentence_end == '.'                                                         ) return 'statement';
	
	return '???';
};

AI.sentence.get_sentence_subject = function( sentence ){
};

AI.sentence.get_sentence_action = function( sentence ){
};

AI.sentence.get_sentence_target_object = function( sentence ){
};

AI.sentence.get_structure = function( sentence ){
	if( !this.is_sentence( sentence ) ) return 'invalid';
	return 'simple, compound, complex, or compound-complex';
};

AI.sentence.is_sentence = function( sentence ){
	// It is a sentence if it contains both a noun (subject) and verb (predicate).
	// Note : the sentence also needs to have an object. I'll need to figure out a way to identify that.
	var has_noun = false;
	var has_verb = false;
	
	sentence.words.forEach(function( word ){
		var definitions = MEM.learned.dictionary.get_definitions( word );
		if( definitions.length ){
			if     ( definitions.find( d => d.p == 'v' ) ) has_verb = true;
			else if( definitions.find( d => d.p == 'n' ) ) has_noun = true;
		}
	}, this);
	
	return ( has_noun && has_verb );
};

AI.sentence.split_words = function( sentence ){
	return sentence.match( /[\w\'\’\.-]+|[^\w\'\’\.\s-]+/g );
};

AI.sentence.ends_with_abbreviation = function( text ){
	var words = text.split(' ');
	var last_word = words[ words.length - 1 ];
	if( text.endsWith( '.' ) ){
		if( last_word.length <= 2 ) return true;
		if( MEM.learned.dictionary.get_word( last_word ) ) return true;
	}

	return false;
};

AI.sentence.split_sentences = function( text ){
	var sentences = [];
	
	// Split the text into chunks, based on the punctuation and white-space positioning.
	
	var text_chunks = text.replace( /([.?!])\s*(?=[A-Z])/g, "$1%|%" ).split("%|%");
	
	// Condense chunks of text that were separated in the previous step, but actually belong in the same sentence.
	
	var curr_sentence = '';
	while( text_chunks.length ){
		var curr_chunk = text_chunks.shift();
		curr_sentence += curr_chunk;
		
		if( !this.ends_with_abbreviation( curr_chunk ) || !text_chunks.length ){
			sentences.push( curr_sentence );
			curr_sentence = '';
		}
	}
	
	// Separate each sentence into words.
	sentences = sentences.map(function( sentence ){
		var parts = this.split_words( sentence );
		return {
			parts,
			raw   : sentence,
			words : parts.filter( x => QUE.functions.has_letter( x ) ),
		};
	}, this);
	
	
	sentences.forEach(function( sentence ){
		// Separate the punctuation from the end of the last word of each sentence.
	
		var last_word = sentence.words[ sentence.words.length - 1 ];
		if( last_word.endsWith( '.' ) ){
			[ 'parts', 'words' ].forEach(function( x ){
				sentence[ x ][ sentence[ x ].length - 1 ] = last_word.substring( 0, last_word.length - 1 );
			}, this);
			sentence.parts.push( '.' );
		}
		
		// Determine the sentence type and structure.
		
		sentence.type      = this.get_type(      sentence );
		sentence.structure = this.get_structure( sentence );
		
		
		// Classify the different parts of each sentence (like subject, action, object, etc...)

		// TODO : Replace the following code with MEM.learned.notion instances.
		// 		-Note: there could be multiple subject/action/object tuples in one sentence.
		// Example usage :
		// { "subject" : { "word" : "I" }, "action" : { "traits" : [ "slowly" ], "word" : "ate" }, "target" : { "traits" : [ "chocolate" ], "word" : "ice cream" } }
		sentence.thoughts = [];
		if( [ '.', '?' ].includes( sentence.raw[ sentence.raw.length - 1 ] ) ) sentence.raw = sentence.raw.slice( 0, -1 );

		var content;

		if( sentence.raw.includes( ' | ' ) && !sentence.raw.includes( '{ ' ) ){  // Using shorthand syntax.
			var parts = sentence.raw.split(' | ');

			content = {};

			[ 'subject', 'action', 'target' ].forEach(function( key, i ){
				if( parts.length > i ){
					content[ key ] = {};
					if( parts[ i ].includes( '(' ) ){
						content[ key ].traits = parts[ i ].match(/\((.*)\)/)[ 1 ].split(',');
						parts[ i ] = parts[ i ].replace(/ *\([^)]*\) */g, "");
					}
					content[ key ].word = parts[ i ];
				}
			});
		}
		else{  // Using full syntax.
			try{
				content = JSON.parse( sentence.raw );
			} catch(e){}
		}

		try{
			var target  = content.action.target  = new MEM.learned.notion( content.target  );
			var action  = content.subject.action = new MEM.learned.action( content.action  );
			var subject =                          new MEM.learned.notion( content.subject );

			var thought = new MEM.learned.thought({ subject, action, target });

			sentence.thoughts.push( thought );
		} catch(e){ console.log( 'Error : Invalid syntax. -- ', e ); }

	}, this);
	
	return sentences;
};