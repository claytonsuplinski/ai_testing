AI.respond = {};

AI.respond.conversation = function( sentences, content ){
	var association = content.association;

	if( !association ){
		try{
			var sentence = sentences[ 0 ];
			if( sentence.subject && sentence.action && sentence.object ){				
				return {
					content : [ 'subject', 'action', 'object' ].map(function( x ){
						return 'The ' + x + ' of the sentence is "' + sentence[ x ] + '".';
					}).join('<br>')
				};
			}
		} catch(e){}
	}

	// TODO : For a command or question, have a response.actions section. That will be an array of functions to be run in AI.respond.
	// 		-For a statement, values will only be added to response.thoughts.
	// 		-If response.actions.length == 0, then the computer doesn't have to do anything in response to what the user said.
	// 			-In this situation, the computer can come up with either a question to ask the user (about what was just said) or provide a somewhat generic response.
	// 				-For example, if I said "I ate pie.", the computer could respond by saying "What kind of pie was it?".

	if     ( sentences.find( s => s.classifications.type == 'command' ) ){ // If a command was said.
		var command = sentences.find( s => s.classifications.type == 'command' );
		var thought = command.thoughts[ 0 ];

		if( thought.action.definitions.length ){
			var action_def = thought.action.definitions[ 0 ];
			if( action_def.x ){
				if( action_def.x.f ){
					if( thought.target ){
						try{
							return {
								content : eval(
									action_def.x.f + '( ' + JSON.stringify( MEM.learned.dictionary.get_children( thought.target.word ) ) + ' )'
								) + '.'
							};
						} catch( e ){
							console.log( thought );
							return {
								content : "I'm sorry, I don't know how to do that."
							};
						}
					}
				}
			}
		}
		return AI.respond.unknown_word( thought.action.word );
	}
	else if( sentences.find( s => s.classifications.type == 'question' ) ){ // If a question was asked.
		var question = sentences.find( s => s.classifications.type == 'question' );
		var thought  = question.thoughts[ 0 ];

		if( question.words[ 0 ].toLowerCase() == 'how' ){
			return {
				content : [
					"This is how to do that:",
					"Step 1",
					"Step 2",
					"Step 3",
				].join('<br>')
			};
		}
		else if( thought.action.definitions.length ){
			var action_def = thought.action.definitions[ 0 ];
			if( action_def.x ){
				if( action_def.x.f ){
					if( thought.target ){
						try{
							return {
								content : 'The ' + thought.action.word + ' of ' + thought.target.word + 
										' is <br>' + eval( action_def.x.f + '( ' + thought.target.word + ' )' ) + '.'
							};
						} catch( e ){
							return {
								content : "I'm sorry, I don't know how to answer that question."
							};
						}
					}
				}
				else if( action_def.x.c ){
					if( thought.target ){
						var vars = {};

						AI.do.extract_variable_names( action_def.x.c ).forEach(function( name ){
							vars[ name ] = null;
						});

						if( vars[ 'this_conditional' ] !== undefined ){
							// TODO : Handle the target.x.c here.
							// 		-Extract the variables from the conditional.
							// 		-Prompt the user to provide those values.
							// 		-After receiving the values from the user, evaluate the conditional.
							try{
								console.log( AI.do.extract_variable_names( thought.target.definitions[ 0 ].x.c ) );
							} catch(e){}
						}
						
						try{
							return {
								content : 'The conditional for this sentence is <br>' + action_def.x.c
							};
						} catch( e ){
							return {
								content : "I'm sorry, I don't know how to answer that question."
							};
						}
					}
				}
			}
		}

		return {
			content : "I don't know the answer to that question."
		};
	}
	else{                                                                   // If a statement was said.
		var last_sentence = sentences[ sentences.length - 1 ];
		var last_thought  = last_sentence.thoughts[ last_sentence.thoughts.length - 1 ];

		var responses = [
			'That is interesting.',
		];

		console.log( last_thought );
		if( last_thought.target ){
			responses = responses.concat([
				'What kind of ' + last_thought.target.word + ' was it?',
			]);
		}

		return {
			content : QUE.functions.random_element( responses )
		};
	}
	
	// ---------------------------------------------------------------------
	// | If the association doesn't already exist in the computer's memory |
	// ---------------------------------------------------------------------
	// if( association && !content.matching_definitions ){
	// 	AI.absorb.add_content( content );
    // 
	// 	var definition_added = 'Definition added for the word &quot;' + association.w + '&quot;.';
	// 
	// 	if( association.d.r ){
	// 		return {
	// 			content : [
	// 				definition_added,
	// 				'The root word for "' + association.w + '" is "' + association.d.r + '".',
	// 			].join('<br>')
	// 		};
	// 	}
	// 	else if( association.d.p ){
	// 		return {
	// 			content : [
	// 				definition_added,
	// 				'The part of speech for "' + association.w + '" is "' + AI.parts_of_speech.convert_pos_string( association.d.p, 'key', 'full' ) + '".',
	// 			].join('<br>')
	// 		};
	// 	}
	// 	
	// 	return { content : [ definition_added ].join('<br>') };
	// }
	// else if( content.matching_defintions ){
	// 	var match_indices = content.matching_definitions.map(function( def ){
	// 		return content.matching_entry.d.findIndex(function( d ){ return JSON.stringify( d ) == JSON.stringify( def ); });
	// 	});
	// 	var id            = QUE.views.conversation.messages.length;
	// 	var this_message  = 'QUE.views.conversation.messages.find( x => x.id == ' + id + ' )';
	// 	var message_obj   = {
	// 		content   : 'A matching definition already exists for &quot;' + association.w + '&quot;. What should I do?',
	// 		prompt    : '<div class="button    add-definition" onclick="' + this_message + '.functions.add();"   >Add New Definition</div>' +
	// 				'<div class="button ignore-definition" onclick="' + this_message + '.functions.ignore();">Ignore Changes</div>' +
	// 				content.matching_definitions.map(function( def, i ){
	// 					return '<div class="existing-definition">' +
	// 						'<div class="button update-definition" onclick="' + this_message + '.functions.update(' + match_indices[i] + ');">' + 
	// 							'Update Definition' + 
	// 						'</div>' +
	// 						QUE.views.dictionary.get_definition_html( def ) +
	// 					'</div>';
	// 				}).join(''),
	// 		functions : {
	// 			add    : function(){
	// 				AI.absorb.add_content( content );
	// 				this.status_message( 'Definition added.', 'add-definition' );
	// 			},
	// 			ignore : function(){
	// 				this.status_message( 'Changes ignored.', 'ignore-definition' );
	// 			},
	// 			update : function( idx ){
	// 				content.definition_idx = idx;
	// 				AI.absorb.update_content( content );
	// 				this.status_message( 'Definition updated.', 'update-definition' );
	// 			},
	// 			status_message : function( msg, classes ){
	// 				message_obj.prompt = '<div class="status-message ' + classes + '">' + msg + '</div>';
	// 				QUE.views.conversation.draw();
	// 			},
	// 		},
	// 		id
	// 	};
	// 	
	// 	return message_obj;
	// }
	// else if( content.thoughts ){
	// 	return {
	// 		content : content.thoughts.map(function( thoughts ){
	// 			return thoughts.map(function( thought ){
	// 				return '[ ' + thought.subject.word + ' ] ' +
	// 					' -- {' + thought.action.word + '} ' + 
	// 					( !thought.target ? '' :
	// 						' --> [ ' + thought.target.word + ' ] '
	// 					);
	// 			}).join('<br>');
	// 		}).join('<br>----------<br>')
	// 	};
	// }
	
	return { content : "Sorry, I didn't understand that." };
};

AI.respond.unknown_word = function( word ){
	var id            = QUE.views.conversation.messages.length;
	var prompt_id     = 'prompt-' + id;
	var this_message  = 'QUE.views.conversation.messages.find( x => x.id == ' + id + ' )';
	var message_obj   = {
		content   : 'I don\'t know what the word "' + word + '" means.',
		prompt    : '<textarea id="' + prompt_id + '" class="new-definition">' +
				[
					'{',
						'\t&quot;p&quot;: &quot;n&quot;,',
						'\t&quot;w&quot;: &quot;' + word + '&quot;',
					'}'
				].join('\r\n') +
			'</textarea>' + 
			'<div class="button add-definition" onclick="' + this_message + '.functions.add();"   >Add New Definition</div>',
		functions : {
			add    : function(){
				AI.absorb.add_content({ entry : JSON.parse( $( '#' + prompt_id ).val() ) });
				this.status_message( 'Definition added.', 'add-definition' );
				// TODO : Have the computer follow up with the user.
				// 		-Either ask for another definition (if there are more words the computer doesn't know).
				// 		-Or respond to the original statement/question/command from the user.
			},
			status_message : function( msg, classes ){
				message_obj.prompt = '<div class="status-message ' + classes + '">' + msg + '</div>';
				QUE.views.conversation.draw();
			},
		},
		id
	};
	return message_obj;
};

AI.respond.to_statement = function( sentence, content ){
};

AI.respond.to_question = function( sentence, content ){
};

AI.respond.to_command = function( sentence, content ){
};

AI.respond.to_exclamation = function( sentence, content ){
};