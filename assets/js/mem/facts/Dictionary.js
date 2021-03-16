MEM.facts.dictionary = {};

MEM.facts.dictionary.list_all_parts_of_speech = function(){
	var results = {};
	this.entries.forEach(function( entry ){
		if( !results[ entry.pos ] ) results[ entry.pos ] = { count : 0, examples : [] };
		results[ entry.pos ].count++;
		if( results[ entry.pos ].examples.length < 200 ) results[ entry.pos ].examples.push( entry );
	});
	
	console.log( results );
};

MEM.facts.dictionary.search = function( word ){
	var word = word.toLowerCase();
	return this.entries.find(function( entry ){
		return entry.n == word;
	}) || false;
};

MEM.facts.dictionary.load = function( callback ){
	var self = this;
	
	if( this.entries ){
		if( callback ) callback();
		return;
	}
	
	this.entries = [];
	
	$.ajax({
		url      : './assets/data/facts/dictionary.json',
		dataType : 'json',
		success  : function( data ){
			self.entries = data;
		
			if( callback ) callback();
		}
	});
};

/*
###################################
# Reformatting of dictionary.json #
###################################

Goals:
	-Have one entry per word
		-Include the multiple definitions / parts of speech under that word object.
	-Re-classify words that have "p." as their part of speech.
	-Clean up entries -- to optimize space.
	-See about merging the thesaurus content into the dictionary entries.
	-When I start saving the computer's "memory", I may want to append info to the individual words in the dictionary
		-Like number of times used, what contexts / part of speech in which the word is used (and how often), 
			what words that word is associated with (and how often).

Parts of speech:
	Adjective    -- "a."      -> "j"
	Adverb       -- "adv."    -> "a"
	Conjunction  -- "conj."   -> "c"
	Interjection -- "interj." -> "i"
	Noun         -- "n."      -> "n"
	Preposition  -- "prep."   -> "p"
	Pronoun      -- "pron."   -> "o"
	Verb         -- "v."      -> "v"
	
	Past (see about merging these entries with actual parts of speech) -- "p."
*/