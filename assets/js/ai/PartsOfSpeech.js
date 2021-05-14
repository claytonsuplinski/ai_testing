AI.parts_of_speech = {
	definitions : [
		{ key : 'j', abbr : 'adj'   , full : 'adjective'    },
		{ key : 'a', abbr : 'adv'   , full : 'adverb'       },
		{ key : 'c', abbr : 'conj'  , full : 'conjunction'  },
		{ key : 'd', abbr : 'det'   , full : 'determiner'   },
		{ key : 'i', abbr : 'interj', full : 'interjection' },
		{ key : 'n', abbr : 'n'     , full : 'noun'         },
		{ key : 'p', abbr : 'prep'  , full : 'preposition'  },
		{ key : 'o', abbr : 'pron'  , full : 'pronoun'      },
		{ key : 'v', abbr : 'v'     , full : 'verb'        , types : [ 'dynamic', 'intransitive', 'linking', 'stative', 'transitive' ], forms : [ 'present', 'past', 'present participle', 'past participle' ] },
	]
};

AI.parts_of_speech.classify_sentence = function( word_arr ){
	console.log( word_arr );
	return word_arr.map( word => this.classify_word( word ) );
};

AI.parts_of_speech.classify_word = function( word ){
	var word_entry = false;
	                  try{ word_entry = MEM.facts.dictionary.search(       word ); } catch(e){};
	if( !word_entry ) try{ word_entry = MEM.learned.associations.get_word( word ); } catch(e){};

	if( word_entry ) return [ ...new Set( word_entry.d.map( x => x.p ) ) ];
	
	return false;
};

AI.parts_of_speech.convert_pos_string = function( str, input_rep, output_rep ){
	var str = QUE.functions.remove_punctuation( str.toLowerCase() );
	var match = this.definitions.find(function( x ){ return x[ input_rep ] == str; });
	if( match ) return match[ output_rep ];
	console.log( 'Error : No match found when converting POS string.', { str, input_rep, output_rep } );
	return '???';
};