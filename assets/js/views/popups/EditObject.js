QUE.views.popups.edit_object = new JL.popup({
	header : "Edit Object",
	buttons : [
		{ name : 'Save', onclick : 'QUE.views.popups.edit_object.submit();' }
	],
});
QUE.views.popups.edit_object.this_string = 'QUE.views.popups.edit_object';

QUE.views.popups.edit_object.traits = [
	{ label : 'Name'  , id : 'name'  , content : 'self.object.name'   },
	{ label : 'Traits', id : 'traits', content : 'JSON.stringify(self.object.traits)', type : 'json' },
	{ label : 'Events', id : 'events', content : 'JSON.stringify(self.object.events)', type : 'json' },
];

QUE.views.popups.edit_object.close = function(){
	$( ".popup" ).hide(	);
};

QUE.views.popups.edit_object.get_values = function(){
	var output = {};
	this.traits.forEach(function( trait ){
		var val = $( '#edit-object-' + trait.id ).val();
		if( trait.type == 'json' ) val = JSON.parse( val );
		output[ trait.id ] = val;
	}, this);
	return output;
};

QUE.views.popups.edit_object.submit = function(){
	var output = this.get_values();
	AI.knowledge.edit_object( this.object.id, output );
	this.close();
	if( this.on_submit ) this.on_submit();
};

QUE.views.popups.edit_object.load = function( p ){
	var self = this;
	this.p = p || this.p || {};
	this.on_submit = this.p.on_submit;
	this.object = AI.knowledge.get_object( this.p.id );
	this.set({
		content : '<table class="trait-table">' + 
				this.traits.map(function( trait ){
					var input_id = 'edit-object-' + trait.id;
					var input    = '<input id="' + input_id + '" value="' + eval( trait.content ) + '">';
					if( trait.type == 'json' ) input = '<textarea id="' + input_id + '">' + eval( trait.content ) + '</textarea>';
					return '<tr>' +
						'<td class="trait-label">' + trait.label + '</td>' +
						'<td class="trait-content">' + input + '</td>' +
					'</tr>';
				}).join('') +
			'</table>'
	});
	this.show();
};