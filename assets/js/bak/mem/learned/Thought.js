MEM.learned.thought = function( p ){
	this.subject = p.subject;
	this.action  = p.action;
	this.target  = p.target;
};

MEM.learned.thought.prototype.init = function(){
	// Fields / things to include in a thought:
	// 		-The timing of a thought (past/future/exact time)
	// 		-The timing of this thought with respect to other thoughts
	// 		-The duration of this event
	// 		-The location of this thought
};