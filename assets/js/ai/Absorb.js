AI.absorb = {};

AI.absorb.add_content = function( content ){
	if( content.association ){	
		if( content.matching_entry ) MEM.learned.dictionary.add_definition( content.association );
		else                         MEM.learned.dictionary.add_word(       content.association );
	}
};

AI.absorb.update_content = function( content ){
	if( content.association ){
		if     ( content.matching_definitions ) MEM.learned.dictionary.update_definition( content.association, content.definition_idx );
		else if( content.matching_entry       ) MEM.learned.dictionary.add_definition(    content.association );
		else                                    MEM.learned.dictionary.add_word(          content.association );
	}
};