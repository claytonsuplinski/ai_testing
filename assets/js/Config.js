QUE = {};

QUE.views = { popups : {} };

QUE.config = {
	default_view   : 'guide',
	excluded_views : 'popups',
};

QUE.config.parts_of_speech = [
	{ val : 'j', abbr : 'adj'   , name : 'Adjective'    },
	{ val : 'a', abbr : 'adv'   , name : 'Adverb'       },
	{ val : 'c', abbr : 'conj'  , name : 'Conjunction'  },
	{ val : 'd', abbr : 'det'   , name : 'Determiner'   },
	{ val : 'i', abbr : 'interj', name : 'Interjection' },
	{ val : 'n', abbr : 'n'     , name : 'Noun'         },
	{ val : 'p', abbr : 'prep'  , name : 'Preposition'  },
	{ val : 'o', abbr : 'pron'  , name : 'Pronoun'      },
	{ val : 'v', abbr : 'v'     , name : 'Verb'         },
];

QUE.config.definition_components = [
	{ name : 'Word'           , key : 'w'  },
	{ name : 'Description'    , key : 'd'  },
	{ name : 'Part of Speech' , key : 'p'  , options : [{ name : '' }].concat( QUE.config.parts_of_speech ) },
	{ name : 'Synonym'        , key : 'sy' , type : 'word'  },    // Ex: for the word "an", the word "a" would be a synonym -- no other fields would need to be filled out (besides possibly description)
	{ name : 'Antonym'        , key : 'an' , type : 'word'  },    // Ex: for the word "likely", the word "unlikely" would be an antonym -- no other fields would need to be filled out (besides possibly description)
	{ name : 'Value'          , key : 'v'  },
	{ name : 'Executable Code', key : 'x'  },
	{ name : 'Traits'         , key : 'tr' , type : 'words' },    // Ex: for apple, a trait might be { word : "red" }
	{ name : 'Types'          , key : 'ty' , type : 'words' },    // Ex: for apple, a type might be { word : "fruit" }
];

QUE.config.sentence_types = [
	{
		name  : 'Statement',
		parts : [
			{ name : 'Subject', pos : [ 'n' ], object : 1 },
			{ name : 'Action' , pos : [ 'v' ] },
			{ name : 'Target' , pos : [ 'n' ], object : 1 },
		]
	},
	{
		name  : 'Question',
		parts : [
			{ name : 'Subject' },
			{ name : 'Action'  },
			{ name : 'Target'  },
		]
	},
	{
		name  : 'Command',
		parts : [
			{ name : 'Subject' },
			{ name : 'Action'  },
			{ name : 'Target'  },
		]
	},
];

MEM = {
	facts   : {},
	learned : {},
};