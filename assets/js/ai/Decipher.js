AI.decipher = {};

AI.decipher.sentences = function( sentences ){
	var response = { actions : [] };

	var sentence = sentences[ 0 ].raw;

	sentences.forEach(function( s ){
		s.thoughts.forEach(function( t ){
			MEM.learned.thoughts.add_thought( t );
			if( t.subject ) MEM.learned.thoughts.add_notion( t.subject );
			if( t.target  ) MEM.learned.thoughts.add_notion( t.target  );
		});
		// console.log( s );
	});
	
	response.thoughts = sentences.map( s => s.thoughts );
	
	return response;
};

AI.decipher.definition_from_context = function( target_word, sentence ){
};