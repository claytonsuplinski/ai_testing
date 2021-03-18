AI.respond = {};

AI.respond.conversation = function( association ){
	if( !association ) return "Sorry, I didn't understand that.";	
	
	return [
		'Definition added for the word &quot;' + association.w + '&quot;.',
		'The part of speech for "' + association.w + '" is "' + AI.parts_of_speech.convert_pos_string( association.d.p, 'key', 'full' ) + '".',
	].join('<br>');
};