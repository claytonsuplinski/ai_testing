AI.parts_of_speech = {
	definitions : [
		{ key : 'j', abbr : 'adj'   , full : 'adjective'    },
		{ key : 'a', abbr : 'adv'   , full : 'adverb'       },
		{ key : 'c', abbr : 'conj'  , full : 'conjunction'  },
		{ key : 'i', abbr : 'interj', full : 'interjection' },
		{ key : 'n', abbr : 'n'     , full : 'noun'         },
		{ key : 'p', abbr : 'prep'  , full : 'preposition'  },
		{ key : 'o', abbr : 'pron'  , full : 'pronoun'      },
		{ key : 'v', abbr : 'v'     , full : 'verb'        , types : [ 'dynamic', 'intransitive', 'linking', 'stative', 'transitive' ], forms : [ 'present', 'past', 'present participle', 'past participle' ] },
	]
};

AI.parts_of_speech.classify = function( word_arr ){
};

AI.parts_of_speech.convert_pos_string = function( str, input_rep, output_rep ){
	var str = QUE.functions.remove_punctuation( str.toLowerCase() );
	var match = this.definitions.find(function( x ){ return x[ input_rep ] == str; });
	if( match ) return match[ output_rep ];
	console.log( 'Error : No match found when converting POS string.', { str, input_rep, output_rep } );
	return '???';
};