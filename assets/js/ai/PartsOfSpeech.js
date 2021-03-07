AI.parts_of_speech = {};

AI.parts_of_speech.extract = function( sentence ){
	var parts = sentence.match(/[\w-']+|[^\w\s]+/g);
	console.log( '-------------' );
	parts.forEach(function( word ){
		console.log( word, ' -- ', MEM.facts.dictionary.search( word ) );
	});
};

/*
###################
# Parts of Speech #
###################
( List of simple parts of speech : https://www.grammar.cl/rules/parts-of-speech-in-english.gif )
( List of detailed parts of speech (slide 2) : http://www.stat.columbia.edu/~madigan/DM08/hmm.pdf )

-Noun:

-Pronoun:

-Adjective:

-Verb:

-Adverb:

-Preposition:

-Conjunction:

-Interjection:

-Article:

######################
# Types of Sentences #
######################
https://grammar.yourdictionary.com/grammar/sentences/types-of-sentences.html

-Declarative:
	-Conveying information; stating a fact
	-Ex: The boy walked home.
	-For communicating with the computer:
		-Any sentence that doesn't being with "Computer, " and doesn't end with ? or !.

-Interrogative:
	-A question
	-Ex: Why does the sun shine?
	-For communicating with the computer:
		-Any sentence that ends with a question mark.

-Imperative:
	-A command / demand
	-Ex: Turn left at the bridge.
	-For communicating with the computer:
		-Any sentence that begins with "Computer, " and doesn't end with ? or !.

-Exclamatory: (this might not be necessary for my purposes)
	-Like a Declarative Sentence, but with strong emotion behind it.
	-Ex: He just won a gold medal!
	-For communicating with the computer:
		-Any sentence that ends with an exclamation point.
*/