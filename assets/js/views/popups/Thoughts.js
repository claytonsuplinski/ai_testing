QUE.views.popups.thoughts = new JL.popup({
	header : "Computer's Thoughts",
});

QUE.views.popups.thoughts.load = function(){
	var fields = [ 'subject', 'action', 'target' ];
	this.set({
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
	this.show();
};