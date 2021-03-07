QUE.start = function( callback ){
	QUE.data = [];
	
	$.ajax({
		url      : './assets/data/questions.json',
		dataType : 'json',
		success  : function( data ){
			QUE.data = data.filter( x => x.answer ).concat( data.filter( x => !x.answer ) );
			
			if( callback ) callback();
		},
		error    : function( e ){
			console.log( 'Error loading questions', e );
		}
	});
};