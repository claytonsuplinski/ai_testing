QUE.hashlinks = new Hashlinks({
	view : {},
});

QUE.hashlinks.on_start = function(){
	var curr_view = QUE.views[ this.params.view.value || QUE.config.default_view ];

	AI.dictionary.load({
		callback : function(){
			if     ( curr_view.load ) curr_view.load();
			else if( curr_view.draw ) curr_view.draw();
		}
	});
};

window.onhashchange = function(){ QUE.hashlinks.start(); };
window.onload       = function(){ QUE.hashlinks.start(); };