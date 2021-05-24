try{ JL = JL; } catch(e){ JL = {}; }

JL.popup = function( p ){
	[ 'header', 'content', 'footer', ].forEach(function( x ){
		this[ x ] = p[ x ] || '';
	}, this);

	this.id = p.id;

	this.buttons = p.buttons || [];
	if( !p.no_close_button ) this.buttons.push({ name : 'Close', icon : 'close', onclick : '$( this ).parent().parent().parent().hide(\'fade\');' });

	this.create();
};

JL.popup.prototype.create = function(){
	this.element = $(
		'<div class="popup" ' + ( this.id ? 'id="' + this.id + '"' : '' ) + ' onclick="$( this ).hide(\'fade\');">' +
			'<div class="popup-container">' +
				'<div class="popup-header" ></div>' +
				'<div class="popup-content"></div>' +
				'<div class="popup-footer" ></div>' +
			'</div>' +
		'</div>'
	);

	this.element.find( '.popup-container' ).click(function( e ){ e.stopPropagation();  });

	$( 'body' ).append( this.element );

	this.draw();
};

JL.popup.prototype.set = function( p ){
	Object.assign( this, p );
	this.draw();
};

JL.popup.prototype.get_button_html = function( button ){
	return '<div class="popup-button noselect" onclick="' + ( button.onclick || '' ).replace(/\'/g, "&apos;").replace(/\"/g, '&quot;') + '">' +
		( button.icon ? '<i class="fa fa-' + button.icon + '"></i>' : '' ) +
		button.name +
	'</div>';
};

JL.popup.prototype.get_buttons_html = function(){
	return this.buttons.map(function( button ){
		return this.get_button_html( button );
	}, this).join('');
};

JL.popup.prototype.show = function( p ){
	var p = p || {};

	this.element.show( 'fade', function(){
		if( p.callback ) p.callback();
	});
};

JL.popup.prototype.draw = function(){
	$( this.element ).find( '.popup-header'  ).html( this.header + '<hr>' );
	$( this.element ).find( '.popup-content' ).html( this.content         );
	$( this.element ).find( '.popup-footer'  ).html( '<hr>' + this.get_buttons_html() + this.footer );
};
