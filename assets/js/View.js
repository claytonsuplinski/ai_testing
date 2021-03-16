QUE.view = {};

QUE.view.get_header = function(){
	var curr_view = ( QUE.hashlinks.params.view.value || QUE.default_view );
	
	return '<div class="header">' + 
		'<a href="index.html">AI Testing</a>' + 
		'<select onchange="location = this.value;">' +
			Object.keys( QUE.views ).map(function( view_name ){
				var url = QUE.hashlinks.get_url({ clear : true, include : { view : view_name } });
				if( view_name == QUE.default_view ) url = QUE.hashlinks.get_url({ clear : true });
				return '<option value="' + url + '" ' + ( view_name == curr_view ? 'selected' : '' ) + '>' +
					QUE.functions.to_title_case( view_name ) +
				'</option>';
			}).join('') +
		'</select>' +
	'</div>';
};