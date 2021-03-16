AI.sentence = {};

AI.sentence.get_type = function( word_arr ){
	var sentence_end = word_arr[ word_arr.length - 1 ];
	if( sentence_end == '?' ) return 'question';
	if( sentence_end == '!' ) return 'exclamation';
	
	var sentence = word_arr.join('').toLowerCase();
	if( sentence_end == '.' && sentence.startsWith( 'computer,' ) ) return 'command';
	if( sentence_end == '.'                                       ) return 'statement';
	
	return '???';
};

AI.sentence.split_words = function( sentence ){
	return sentence.match( /[\w\'\’\.-]+|[^\w\'\’\.\s-]+/g );
};

AI.sentence.ends_with_abbreviation = function( text ){
	var words = text.split(' ');
	var last_word = words[ words.length - 1 ];
	if( text.endsWith( '.' ) ){
		if( last_word.length <= 2 ) return true;
		if( MEM.facts.dictionary.search( last_word ) ) return true;
	}

	return false;
};

AI.sentence.split_sentences = function( text ){
	var sentences = [];
	
	// Split the text into chunks, based on the punctuation and white-space positioning.

	var text_chunks = text.replace( /([.?!])\s*(?=[A-Z])/g, "$1|" ).split("|");
	console.log( text_chunks );
	
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
	sentences = sentences.map(function( sentence ){ return this.split_words( sentence ); }, this);
	
	// Separate the punctuation from the end of the last word of each sentence.
	sentences.forEach(function( sentence ){
		var last_word = sentence[ sentence.length - 1 ];
		if( last_word.endsWith( '.' ) ){
			sentence[ sentence.length - 1 ] = last_word.substring( 0, last_word.length - 1 );
			sentence.push( '.' );
		}
	}, this);
	
	return sentences;
};