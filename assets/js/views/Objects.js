QUE.views.objects = {};

QUE.views.objects.load = function(){
	this.draw();
};

QUE.views.objects.add_object = function(){
	AI.knowledge.add_object({
		name : $( '#add-object-name' ).val(),
	});

	this.draw();
};

QUE.views.objects.edit_object = function(){
};

QUE.views.objects.remove_object = function(){
};

QUE.views.objects.draw = function(){
	// TODO : Add ability to edit and remove each object in the list.

	$( "#content" ).html(
		QUE.view.get_header()  +
		'<div class="content">' +
			'<div class="ui-section add-object">' + 
				'<input id="add-object-name" onkeyup="if( event.keyCode == 13 ){ QUE.views.objects.add_object(); }"></input>' +
				'<div class="button" onclick="QUE.views.objects.add_object();">Add Object</div>' +
			'</div>' +
			'<div class="ui-section"><hr class="divider"></div>' +
			'<div class="ui-section" id="objects">' +
				AI.knowledge.get_all_objects().map(function( obj ){
					return '<div class="entry" onclick="QUE.views.popups.edit_object.load({ id : ' + obj.id + ', on_submit : function(){ QUE.views.objects.draw(); } });">' + 
						obj.id + ' : ' + obj.name + 
					'</div>';
				}).join('') +
			'</div>' +
			'<div class="ui-section">' +
				'<div id="save-button" class="button" onclick="AI.knowledge.save_objects();">Save</div>' +
			'</div>' +
		'</div>'
	);
	
	$( "#add-object-name" ).focus();
};