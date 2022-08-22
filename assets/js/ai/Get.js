AI.get = {};

AI.get.comparison = function( p ){
	// The following code is for determining the threshold value for p.type == 'greater' (than) or 'less' (than)
	var threshold = p.threshold;
	if( threshold === undefined ){
		threshold = context[ p.context_key || p.key ];
	}
};