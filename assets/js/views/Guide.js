QUE.views.guide = {};

QUE.views.guide.draw = function(){
	var word_types = [
		{ name : 'Subject' },
		{ name : 'Action'  },
		{ name : 'Target'  },
	];

	$( "#content" ).html(
		QUE.view.get_header() +
		'<div class="content">' +
			'<div class="ui-section dropdown-input">' + 
				'<div class="label">Type of sentence</div>' +
				'<select>' +
					[ 'statement', 'question', 'command' ].map( x => '<option>' + QUE.functions.to_title_case( x ) + '</option>' ).join('') +
				'</select>' +
			'</div>' +
			'<div class="ui-section"><hr class="divider"></div>' +
			'<div class="ui-section">' +
				'<table class="guide-table">' +
					'<tr>' + 
						'<th></th>' +
						word_types.map( x => '<th>' + x.name + '</th>' ).join('') +
					'</tr>' +
					[
						{ name : 'Word' },
						{ name : 'Properties' }
					].map(function( word ){
						return '<tr>' + 
							'<td class="label">' + word.name + '</td>' +
							word_types.map(function( type ){
								return '<td>' +
									'<input id="' + [ word.name, type.name ].map( x => x.toLowerCase() ).join('-') + '"></input>' +
								'</td>';
							}, this).join('') +
						'</tr>';
					}, this).join('') +
				'</table>' +
			'</div>' +
			'<div class="ui-section">' +
				'<div id="save-button" class="button" onclick="QUE.views.guide.save_computer_memory();">Save</div>' +
				'<div                  class="button" onclick="QUE.views.popups.thoughts.load();">Thoughts</div>' +
				'<div                  class="button" onclick="QUE.views.popups.memories.load();">Memories</div>' +
			'</div>' +
		'</div>'
	);
	
	$( "#user-input-field input" ).focus();
};