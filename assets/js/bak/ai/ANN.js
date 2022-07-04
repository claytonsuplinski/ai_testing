// TODO : Implement an Artificial Neural Network class
//     -Website with example implementation : https://dev.to/liashchynskyi/creating-of-neural-network-using-javascript-in-7minutes-o21
//     -Make it generic enough to be usable in other contexts.
//     -For text processing:
//         -The input values will be numerical representations of all the text (it'll be a variable number of input values).
//         -The output values will be numerical representations of the generated output text (it'll be a variable number of input values).

AI.ANN = function( p ){
	this.init( p );
};

AI.ANN.prototype.init = function( p ){
	console.log( p );
};