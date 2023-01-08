QUE.views.popups.memories = new JL.popup({
	header : "Computer's Memories",
});

/*
This is a list of events that took place.
	-Ex: things I said to the computer
Think of this as sort of a log of things said to the computer.
*/

QUE.views.popups.memories.load = function(){
	var fields = [ 'traits' ];
	this.set({
		content : MEM.learned.thoughts.memories.map(function( memory ){
			console.log( memory );
			return '<div class="memory">' + 
				'<table>' + 
					'<tr>' +
						'<td class="memory-word" rowspan="2">' + memory.word + '</td>' +
						fields.map(function( x ){
							return '<th>' + QUE.functions.to_title_case( x ) + '</th>';
						}).join('') +
					'</tr>' +
					'<tr>' +
						fields.map(function( x ){
							if( memory[ x ] ) return '<td class="' + x + '">' + memory[ x ] + '</td>';
						}).join('') +
					'</tr>' + 
				'</table>' +
			'</div>';
		}).join('')
	});
	this.show();
};