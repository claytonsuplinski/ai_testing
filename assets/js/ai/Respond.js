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
	
	// ---------------------------------------------------------------------
	// | If the association doesn't already exist in the computer's memory |
	// ---------------------------------------------------------------------
	if( !content.matching_definitions ){
		AI.absorb.add_content( content );
	
		if( association.d.r ){
			return {
				content : [
					'Definition added for the word &quot;' + association.w + '&quot;.',
					'The root word for "' + association.w + '" is "' + association.d.r + '".',
				].join('<br>')
			};
		}
		
		return {
			content : [
				'Definition added for the word &quot;' + association.w + '&quot;.',
				'The part of speech for "' + association.w + '" is "' + AI.parts_of_speech.convert_pos_string( association.d.p, 'key', 'full' ) + '".',
			].join('<br>')
		};
	}
	else{
		// TODO : Create an interface for the user to select whether a new definition should be added or an existing definition should be updated for the word.
		//     -I'll need to calculate the definition index for each matching definition (with respect to all definitions, not just the matching definitions).
		console.log( content.matching_definitions );
		var match_indices = content.matching_definitions.map(function( def ){
			return content.matching_entry.d.findIndex(function( d ){ return JSON.stringify( d ) == JSON.stringify( def ); });
		});
		var id            = QUE.views.conversation.messages.length;
		var this_message  = 'QUE.views.conversation.messages.find( x => x.id == ' + id + ' )';
		var message_obj   = {
			content   : 'A matching definition already exists for &quot;' + association.w + '&quot;. What should I do?',
			prompt    : '<div class="button    add-definition" onclick="' + this_message + '.functions.add();"   >Add New Definition</div>' +
					'<div class="button ignore-definition" onclick="' + this_message + '.functions.ignore();">Ignore Changes</div>' +
					content.matching_definitions.map(function( def, i ){
						return '<div class="existing-definition">' +
							'<div class="button update-definition" onclick="' + this_message + '.functions.update(' + match_indices[i] + ');">' + 
								'Update Definition' + 
							'</div>' +
							QUE.views.memories.get_definition_html( def ) +
						'</div>';
					}).join(''),
			functions : {
				add    : function(){
					AI.absorb.add_content( content );
					this.status_message( 'Definition added.', 'add-definition' );
				},
				ignore : function(){
					this.status_message( 'Changes ignored.', 'ignore-definition' );
				},
				update : function( idx ){
					content.definition_idx = idx;
					AI.absorb.update_content( content );
					this.status_message( 'Definition updated.', 'update-definition' );
				},
				status_message : function( msg, classes ){
					message_obj.prompt = '<div class="status-message ' + classes + '">' + msg + '</div>';
					QUE.views.conversation.draw();
				},
			},
			id
		};
		
		return message_obj;
	}
	
	return { content : "Sorry, I didn't understand that." };
};