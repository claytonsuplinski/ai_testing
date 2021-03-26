AI.respond = {};

AI.respond.conversation = function( sentences, content ){
	var association = content.association;

	if( !association ){
		try{
			var sentence = sentences[ 0 ];
			if( sentence.subject && sentence.action && sentence.object ){
				return [ 'subject', 'action', 'object' ].map(function( x ){
					return 'The ' + x + ' of the sentence is "' + sentence[ x ] + '".';
				}).join('<br>');
			}
		} catch(e){}
	}
	
	// ---------------------------------------------------------------------
	// | If the association doesn't already exist in the computer's memory |
	// ---------------------------------------------------------------------
	if( !content.matching_entry ){
		AI.absorb.content( content );
	
		if( association.d.r ){
			return [
				'Definition added for the word &quot;' + association.w + '&quot;.',
				'The root word for "' + association.w + '" is "' + association.d.r + '".',
			].join('<br>');
		}
		
		return [
			'Definition added for the word &quot;' + association.w + '&quot;.',
			'The part of speech for "' + association.w + '" is "' + AI.parts_of_speech.convert_pos_string( association.d.p, 'key', 'full' ) + '".',
		].join('<br>');
	}
	else{
		// TODO : Create an interface for the user to select whether a new definition should be added or an existing definition should be updated for the word.
		return 'Definition already exists for &quot;' + association.w + '&quot;.';
	}
	
	return "Sorry, I didn't understand that.";
};