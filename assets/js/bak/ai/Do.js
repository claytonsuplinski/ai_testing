AI.do = {};

AI.do.extract_variable_names = function( def ){
	try{
		return def.match(/\{(.*?)\}/g).map( x => x.replace( /^{/, '' ).replace( /}$/, '' ) );
	} catch(e){ return []; };
};

AI.do.react_to_command = function( sentence ){
	// TODO : Either try to do what the command is asking or say why it can't be done
};

AI.do.any = function( arr ){
	var result = QUE.functions.random_element( arr );
	
	[ 'w', 'word' ].some(function( x ){
		if( result[ x ] !== undefined ){
			result = result[ x ];
			return true;
		}
	});

	return result;
};