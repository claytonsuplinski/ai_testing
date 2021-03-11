QUE.views.home = { messages : [] };

QUE.views.home.send_message = function( message ){
	AI.sentence.split_sentences( message.content );
	if( !message.timestamp ) message.timestamp = QUE.functions.datetime_to_string( new Date() );
	this.messages.unshift( message );
	this.draw();
};

QUE.views.home.send_user_message = function(){
	console.log( '-----------------------' );
	var message = $( "#user-input-field input" ).val();
	
	if( message ){
		this.send_message({ speaker : 'User', content : message });
		
		setTimeout( function(){
			QUE.views.home.send_computer_message();
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

QUE.views.home.send_computer_message = function(){
	this.send_message({ speaker : 'Computer', content : "Hello, I'm the computer!" });
};

QUE.views.home.save_computer_memory = function(){
	[ 'associations' ].forEach(function( x ){
		MEM.learned[ x ].save();
	});
};

QUE.views.home.check_for_enter = function(){
	if( event.keyCode == 13 ) QUE.views.home.send_user_message();
};

QUE.views.home.draw = function(){
	$( "#content" ).html(
		QUE.view.get_header() +
		'<div class="content">' +
			'<div id="user-input-field">' + 
				'<input placeholder="Say something to the computer here..." onkeydown="QUE.views.home.check_for_enter( this );"></input>' + 
				'<div id="send-message-button" class="button" onclick="QUE.views.home.send_user_message();">Send</div>' +
			'</div>' +
			'<div id="conversation">' +
				this.messages.map(function( message ){
					return '<div class="message ' + ( message.speaker == 'Computer' ? 'computer' : '' ) + '">' +
						[
							'<div class="speaker">' + message.speaker + '</div>',
							'<div class="message-body">' + message.content + '</div>',
							'<div class="timestamp">' + message.timestamp + '</div>',
						].join('') +
					'</div>';
				}).join('<br>') +
			'</div>' +
			'<div class="ui-field">' +
				'<div id="save-button" class="button" onclick="QUE.views.home.save_computer_memory();">Save</div>' +
			'</div>' +
		'</div>'
	);
	
	$( "#user-input-field input" ).focus();
};