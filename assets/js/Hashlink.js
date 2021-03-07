QUE.hashlinks = new Hashlinks({
	question : {},
});

QUE.hashlinks.on_start = function(){
	var callback = function(){
		QUE.views.home.draw();
	};
	
	var loading_sequence = [
		MEM.facts.dictionary,
		MEM.learned.associations,
	];
	
	var load = function( idx ){
		var idx = idx || 0;
		loading_sequence[ idx ].load( idx < loading_sequence.length - 1 ? load( idx + 1 ) : callback );
	};
	
	load();
};

window.onhashchange = function(){ QUE.hashlinks.start(); };
window.onload       = function(){ QUE.hashlinks.start(); };