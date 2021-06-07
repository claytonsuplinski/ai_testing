QUE.views.conversation = { messages : [] };

QUE.views.conversation.thoughts_popup = new JL.popup({
	header : "Computer's Thoughts",
});

QUE.views.conversation.show_computer_thoughts = function(){
	var fields = [ 'subject', 'action', 'target' ];
	this.thoughts_popup.set({
		content : MEM.learned.thoughts.thoughts.map(function( thought ){
			return '<div class="thought">' + 
				'<table>' + 
					'<tr>' +
						'<td class="thought-id" rowspan="2">' + thought.id + '</td>' +
						fields.map(function( x ){
							return '<th>' + QUE.functions.to_title_case( x ) + '</th>';
						}).join('') +
					'</tr>' +
					'<tr>' +
						fields.map(function( x ){
							if( thought[ x ] ) return '<td class="' + x + '">' + thought[ x ].word + '</td>';
						}).join('') +
					'</tr>' + 
				'</table>' +
			'</div>';
		}).join('')
	});
	this.thoughts_popup.show();
};

QUE.views.conversation.send_message = function( message ){
	if( !message.timestamp ) message.timestamp = QUE.functions.datetime_to_string( new Date() );
	this.messages.unshift( message );
	this.draw();
};

QUE.views.conversation.send_user_message = function(){
	var message = $( "#user-input-field input" ).val();
	
	if( message ){
		this.send_message({ speaker : 'User', content : message });
		
		var sentences = AI.sentence.split_sentences( message );
		var content   = AI.decipher.sentences( sentences );
		var response  = AI.respond.conversation( sentences, content );
		
		// TODO : If matching association already exists, the computer should ask if I am referring to the existing definition or a new definition.
		//     -Integrate this code into the computer response interface : var absorb_response = AI.absorb.content( sentences );
		
		setTimeout( function(){
			QUE.views.conversation.send_computer_message( response );
		}, 500 );
	}
	
	// TODO : Have the computer store a "memory" (in JSON form) -- kinda like the "Bag of Words" model (https://en.wikipedia.org/wiki/Bag-of-words_model)
	// 		-The computer will store info in a JSON object that can be used as its "memory".
	// 		-As the user talks to it, the computer will add more information to its "memory".
	// 		-There will be a button on the web page that will allow the user to download and save the updated "memory" file.
	
	// TODO : Computer will need to extract some sort of "meaning" from the input text.
	// 		-How are "meanings" behind words / concepts stores?
	// 			-As associations with certain types of sensory information
	// 				-Ex: when we think of the color "red", there is a visual association that goes along with it.
	// 			-Frequencies of associations with other words
	// 				-When we think of certain words, we may think of other words that frequently get used with it.
	
	// TODO : Figure out how to identify different parts of speech.
	//     -List of different parts of speech (slide 2) : http://www.stat.columbia.edu/~madigan/DM08/hmm.pdf
};

QUE.views.conversation.send_computer_message = function( message ){
	var message = ( typeof message == 'object' ? message : { content : message.content || "Hello, I'm the computer!" } );
	message.speaker = 'Computer';
	this.send_message( message );
};

QUE.views.conversation.save_computer_memory = function(){
	[ 'associations' ].forEach(function( x ){
		MEM.learned[ x ].save();
	});
};

QUE.views.conversation.check_for_enter = function(){
	// TODO : Re-write this function to be more generic and under QUE.functions
	if( event.keyCode == 13 ) QUE.views.conversation.send_user_message();
};

QUE.views.conversation.draw = function(){
	$( "#content" ).html(
		QUE.view.get_header() +
		'<div class="content">' +
			'<div class="ui-section" id="user-input-field">' + 
				'<input placeholder="Say something to the computer here..." onkeydown="QUE.views.conversation.check_for_enter( this );"></input>' + 
				'<div id="send-message-button" class="button" onclick="QUE.views.conversation.send_user_message();">Send</div>' +
			'</div>' +
			'<div class="ui-content" id="conversation">' +
				this.messages.map(function( message ){
					return '<div class="message ' + ( message.speaker == 'Computer' ? 'computer' : '' ) + '">' +
						[
							'<div class="speaker">' + message.speaker + '</div>',
							'<div class="message-body">' +
								message.content + 
								( !message.prompt ? '' : 
									'<div class="prompt">' + message.prompt + '</div>'
								) +
							'</div>',
							'<div class="timestamp">' + message.timestamp + '</div>',
						].join('') +
					'</div>';
				}).join('<br>') +
			'</div>' +
			'<div class="ui-section">' +
				'<div id="save-button" class="button" onclick="QUE.views.conversation.save_computer_memory();">Save</div>' +
				'<div                  class="button" onclick="QUE.views.conversation.show_computer_thoughts();">Thoughts</div>' +
			'</div>' +
		'</div>'
	);
	
	$( "#user-input-field input" ).focus();
};