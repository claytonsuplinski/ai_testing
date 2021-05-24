MEM.learned.thoughts = {
	notions  : [],  // A list of all things (and their corresponding traits/actions). This will include all traits accumulated over multiple thoughts.
	thoughts : [],  // A list of individual thoughts. Each thought is made up of at least one notion. The thoughts will be in the order in which they occur.
};

MEM.learned.thoughts.add_thought = function( thought ){
	// Each thought corresponds with one sentence.
	this.thoughts.push( thought );
};

MEM.learned.thoughts.add_notion = function( notion ){
	// Each notion corresponds with one noun (and associated verbs, adjectives, adverbs, and target nouns).
};

MEM.learned.thoughts.merge_notions = function(){
};