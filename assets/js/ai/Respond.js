AI.respond = {};

AI.respond.conversation = function( sentences, association ){
	if( !association ){
		var sentence = sentences[ 0 ];
		if( sentence.subject && sentence.action && sentence.object ){
			return [ 'subject', 'action', 'object' ].map(function( x ){
				return 'The ' + x + ' of the sentence is "' + sentence[ x ] + '".';
			}).join('<br>');
		}
		return "Sorry, I didn't understand that.";
	}
	
	return [
		'Definition added for the word &quot;' + association.w + '&quot;.',
		'The part of speech for "' + association.w + '" is "' + AI.parts_of_speech.convert_pos_string( association.d.p, 'key', 'full' ) + '".',
	].join('<br>');
};