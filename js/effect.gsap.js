window.isGSAP = true;

class Effect { // unify Effect & TweenMax calls
	
	//target, frames, props, ease, delay, override, callback

	constructor(target, frames, props, ease, delay, override, callback) {
		
		this.target = target;
		this.callback = callback || function() {};
		this.params = Object.assign(props, {duration: frames * toSec, delay: (delay || 0) * toSec, ease: ease()});

	}
	
	play() {

		return Effect.asyncTween(this.target, this.params, this.callback);

	}

	static no() {

		return Linear.easeNone;
		
	}
	
	static quartOut() {

		return Quart.easeOut;

	}
	
	static quartIn() {

		return Quart.easeIn;

	}
	
	static quartInOut() {

		return Quart.easeInOut;

	}

	static bounceOut() {

		return Bounce.easeOut;

	}
	
	static asyncTween(target, options, callback) { 

		return gsap
		.to(
			target, 
			options
		)
		.then(
			() => 
				callback()
		);
		
	}
	
}