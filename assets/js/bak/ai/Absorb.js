AI.absorb = {};

AI.absorb.add_content = function( content ){
	if( content.entry ){
		console.log( content );
		var word = MEM.learned.dictionary.get_word( content.entry.w );
		if( word ) MEM.learned.dictionary.add_definition( content.entry );
		else       MEM.learned.dictionary.add_word(       content.entry );
	}
};

AI.absorb.update_content = function( content ){
	if( content.entry ){
		var word = MEM.learned.dictionary.get_word( content.entry.w );
		if     ( word && content.definition_idx !== undefined ) MEM.learned.dictionary.update_definition( content.entry , content.definition_idx );
		else if( word                                         ) MEM.learned.dictionary.add_definition(    content.entry );
		else                                                    MEM.learned.dictionary.add_word(          content.entry );
	}
};