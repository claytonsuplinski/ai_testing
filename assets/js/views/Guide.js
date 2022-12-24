QUE.views.guide = {};

QUE.views.guide.load = function(){
	this.select_sentence_type( 0 );
};

QUE.views.guide.submit_sentence = function(){
	console.log( $( '#sentence-type' ).val() );

	var input = {};
	this.sentence_type.parts.forEach(function( part ){
		input[ part.name ] = AI.dictionary.find({
			word : QUE.functions.unstringify_word( $( '#word-' + part.name.toLowerCase() ).val() ),
		});
	});

	AI.knowledge.add_event( input );
};

QUE.views.guide.select_sentence_type = function( idx ){
	this.sentence_type = QUE.config.sentence_types[ idx ];
	this.draw();
};

QUE.views.guide.draw = function(){
	$( "#content" ).html(
		QUE.view.get_header() +
		'<div class="content">' +
			'<div class="ui-section dropdown-input">' + 
				'<div class="label">Type of sentence</div>' +
				'<select id="sentence-type">' +
					QUE.config.sentence_types.map(function( option ){
						return '<option>' +
							option.name +
						'</option>';
					}).join('') +
				'</select>' +
			'</div>' +
			'<div class="ui-section"><hr class="divider"></div>' +
			'<div class="ui-section">' +
				'<table class="guide-table">' +
					'<tr>' + 
						'<th></th>' +
						this.sentence_type.parts.map( x => '<th>' + x.name + '</th>' ).join('') +
					'</tr>' +
					[
						{ name : 'Word'      },
						{ name : 'Properties', title : 'Traits pertaining to this word (ex: color : &quot;red&quot; )' },
						{ name : 'Context'   , title : 'Traits pertaining to the entire sentence (ex: temp_hot : 90 )' },
					].map(function( word ){
						return '<tr>' + 
							'<td class="label" title="' + ( word.title || '' ) + '">' + word.name + '</td>' +
							this.sentence_type.parts.map(function( type ){
								return '<td>' +
									'<input id="' + [ word.name, type.name ].map( x => x.toLowerCase() ).join('-') + '"></input>' +
								'</td>';
							}, this).join('') +
						'</tr>';
					}, this).join('') +
					'<tr>' +
						'<td colspan="2" class="label">Temporal Scope</td>' +
						'<td colspan="2">' + 
							'<select>' +
								[
									{ val : 'Current Time' },
									{ val : 'Always'       },
									{ val : 'Sometimes'    },
									{ val : 'Past'         },
									{ val : 'Future'       },
								].map(function( x ){ return '<option>' + x.val + '</option>'; }).join('') +
							'</select>' +
						'</td>' +
 					'</tr>' +
				'</table>' +
			'</div>' +
			'<div class="ui-section">' +
				'<div                  class="button" onclick="QUE.views.guide.submit_sentence();">Submit</div>' +
				'<div id="save-button" class="button" onclick="QUE.views.guide.save_computer_memory();">Save</div>' +
				'<div                  class="button" onclick="QUE.views.popups.thoughts.load();">Thoughts</div>' +
				'<div                  class="button" onclick="QUE.views.popups.memories.load();">Memories</div>' +
			'</div>' +
		'</div>'
	);

	this.sentence_type.parts.forEach(function( part ){
		var source = AI.dictionary.entries.filter(function( entry ){
				return part.pos.includes( entry.p );
			}).map(function( entry ){
				return '* ' + QUE.functions.stringify_word( entry );
			});

		if( part.object ){
			source = source.concat( AI.knowledge.get_all_objects().map(function( obj ){
					return QUE.functions.stringify_object( obj );
				}) );
		}

		$( 'input#word-' + part.name ).autocomplete({ source });
	});
	
	$( "#user-input-field input" ).focus();
};