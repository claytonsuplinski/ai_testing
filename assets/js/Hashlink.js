QUE.hashlinks = new Hashlinks({
	view : {},
});

QUE.hashlinks.on_start = function(){
	var self = this;

	var callback = function(){
		QUE.views[ self.params.view.value || QUE.default_view ].draw();
	};
	
	var loading_sequence = [
		MEM.learned.dictionary,
	];
	
	var load = function( idx ){
		var idx = idx || 0;
		loading_sequence[ idx ].load( idx < loading_sequence.length - 1 ? load( idx + 1 ) : callback );
	};
	
	load();
};

window.onhashchange = function(){ QUE.hashlinks.start(); };
window.onload       = function(){ QUE.hashlinks.start(); };