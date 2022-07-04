QUE.views.dictionary = {};

QUE.views.dictionary.draw = function(){
	$( "#content" ).html(
		QUE.view.get_header() +
		'<div class="content">' +
			'<div class="ui-content" id="dictionary">' +
				AI.dictionary.entries.map(function( entry, idx ){
					return '<div class="entry">' + 
						'<div class="word ' + this.mode + '-mode" ' + 
									'onclick="QUE.views.popups.edit_word.load({ entry : AI.dictionary.entries[' + idx + '], on_submit : function(){ QUE.views.dictionary.draw(); } });">' + 
							entry.w + ( entry.d ? ' <span class="word-description">(' + entry.d + ')</span>' : '' ) +
						'</div>' +
					'</div>';
				}, this).join('') +
			'</div>' +
			'<div class="ui-section">' +
				'<div id="save-button"     class="button" onclick="AI.dictionary.save();">Save</div>' +
				'<div id="add-word-button" class="button" onclick="QUE.views.popups.add_word.load({ on_submit : function(){ QUE.views.dictionary.draw(); } });">Add Word</div>' +
			'</div>' +
		'</div>'
	);
	$( '#dictionary' ).attr( 'tabindex', -1 ).css( 'outline', 'none' ).focus();
};