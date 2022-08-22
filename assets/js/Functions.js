QUE.functions = {};

QUE.functions.pad = function( num, decimal_place, delimiter ){
	var delimiter = delimiter || '0';
	var num = num + '';
	return num.length >= decimal_place ? num : new Array( decimal_place - num.length + 1 ).join( delimiter ) + num;
};

QUE.functions.remove_punctuation = function( str ){
	return str.replace(/[.,\/#!$%?\^&\*;:{}=\-\[\]_`~()\']/g, "").replace(/ /g, '');
};

QUE.functions.strip_ending_period = function( str ){
	return str.substring( 0, str.lastIndexOf('.') );
};

QUE.functions.has_letter = function( str ){
	return ( /[A-Za-z]/i ).test( str );
};

QUE.functions.stringify_word = function( word ){
	return word.w + ( word.d ? ' (' + word.d + ')' : '' );
};

QUE.functions.unstringify_word = function( str ){
	if( str.includes( '(' ) ){
		var input_val = input_val.split( '(' );
		return {
			w : input_val[ 0 ],
			d : input_val[ 1 ].split( ')' )[ 0 ],
		};
	}
	else{
		return {
			w : str,
		};
	}
};

QUE.functions.to_title_case = function(str){
	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

QUE.functions.random_element = function( arr ){
	try{ return arr[ Math.floor( Math.random() * arr.length ) ]; } catch(e){}
	return false;
};

QUE.functions.get_sorted_index = function( arr, val ){
	var low  = 0;
	var high = arr.length;

	while( low < high ){
		var mid = ( low + high ) >>> 1;
		if( arr[ mid ] < val ) low  = mid + 1;
		else                   high = mid;
	}
	return low;
};

QUE.functions.get_url_content = function( p ){
	$.ajax({
		url         : p.url,
		dataType    : 'jsonp',
		crossDomain : true,
		success  : function( data ){
			console.log( data );
			
			if( p.callback ) p.callback( data );
		},
		error   : function( e ){
			console.log( "Error loading url : ", e );
		}
	});
};

QUE.functions.datetime_to_string = function( dt ){
	return [
		[
			dt.getFullYear(),
			this.pad( dt.getMonth() + 1, 2 ),
			this.pad( dt.getDate()     , 2 )
		].join('-'),
		[
			this.pad( dt.getHours()  , 2 ),
			this.pad( dt.getMinutes(), 2 ),
			this.pad( dt.getSeconds(), 2 )
		].join(':')
	].join(' ');
};

QUE.functions.xml_string_to_json = function( str ){
	var output = {};
	var words  = str.split( /\>\s*\</ );

	words.forEach(function( word ){
		while( word[ 0 ] == '<' ) word = word.substring(1);
		var parts = word.split('>');
		output[ parts[ 0 ] ] = parts[ 1 ].split('<')[ 0 ];
	});

	return output;
};

QUE.functions.download_json = function( obj, filename ){
	var content = "data:text/json;charset=utf-8," + encodeURIComponent( JSON.stringify( obj ) );
	var ele = document.createElement( 'a' );
	ele.setAttribute( "href",     content      );
	ele.setAttribute( "download", filename || "output.json" );
	document.body.appendChild( ele );
	ele.click();
	ele.remove();
};