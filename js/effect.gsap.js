class Effect { // unify Effect & TweenMax calls
	
	constructor(target, frames, props, ease, delay, override, callback) {
		ease = ease || "no";
		delay = delay * toSec || 0;
		this.target = target;
		this.secs = frames * toSec;
		this.callback = callback || function() {};
		this.params = Object.assign(props, {delay: delay, ease: Effect.ease(ease)});
	}
	
	play() {
		return Effect.asyncTween(this.target, this.secs, this.params, this.callback);
	}
	
	static ease(name) {
		let eases = {
			"no": Linear.easeNone,
			"quartIn": Quart.easeIn,
			"quartOut": Quart.easeOut,
			"quartInOut": Quart.easeInOut,
			"bounceOut": Bounce.easeOut
		};
		return eases[name];
	}
	
	static asyncTween(target, duration, options, callback) { // savage TweenMax onComplete promise
		return new Promise(resolve => TweenMax.to(target, duration, Object.assign(options, {"onComplete": function() {
			callback();
			resolve();
		}})));
	}
	
	/*static asyncTween(target, duration, options) {
		return new Promise(resolve => TweenMax.to(target, duration, Object.assign(options, {"onComplete": resolve}))); // savage TweenMax onComplete promise
	}*/
}