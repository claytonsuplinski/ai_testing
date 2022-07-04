QUE.views.popups.edit_word = new JL.popup({
	header : "Edit Word",
	buttons : [
		{ name : 'Edit Word', onclick : 'QUE.views.popups.edit_word.submit();' }
	],
});
QUE.views.popups.edit_word.this_string = 'QUE.views.popups.edit_word';

for( var x of [ 'close', 'get_values', 'load', 'post_submit', 'html_words_trait', 'update_words_trait' ] ){
	QUE.views.popups.edit_word[ x ] = QUE.views.popups.add_word[ x ];
}

QUE.views.popups.edit_word.submit = function(){
	var output = this.get_values();
	var response = AI.dictionary.update( this.entry, output );
	this.post_submit( response );
};