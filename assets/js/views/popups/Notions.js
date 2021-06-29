QUE.views.popups.notions = new JL.popup({
	header : "Computer's Notions",
});

QUE.views.popups.notions.load = function(){
	var fields = [ 'traits' ];
	this.set({
		content : MEM.learned.thoughts.notions.map(function( notion ){
			console.log( notion );
			return '<div class="notion">' + 
				'<table>' + 
					'<tr>' +
						'<td class="notion-word" rowspan="2">' + notion.word + '</td>' +
						fields.map(function( x ){
							return '<th>' + QUE.functions.to_title_case( x ) + '</th>';
						}).join('') +
					'</tr>' +
					'<tr>' +
						fields.map(function( x ){
							if( notion[ x ] ) return '<td class="' + x + '">' + notion[ x ] + '</td>';
						}).join('') +
					'</tr>' + 
				'</table>' +
			'</div>';
		}).join('')
	});
	this.show();
};