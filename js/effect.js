/**
 * @force
 * @export
 * @nocollapse
 * @class Effect : lightweight animation engine / animate HTML elements CSS props
 * @author Nico Pr 2021
 * @url https://github.com/nicopowa/effect
 */
class Effect {
	
	//closure compiler esnext class private fields error
	//static #_id = 0; // id counter
	//static #frameLoop = 0; // raf loop
	//static #effects = []; // effects pool
	//static #propSplit = /(-?\d+(?:.\d+)?(?:e-?\d+)?)/; // split numbers // TODO class variable or in split argument ?

	/**
	 * let myElement = document.createElement("div");
	 * Object.assign(myElement.style, {"width": "100px", "height": "100px", "backgroundColor": "rgb(0, 0, 0)"});
	 * new Effect(myElement, 60, {backgroundColor: "rgb(0, 0, 255)"}, Effect.quartOut);
	 * 
	 * @construct
	 * @param {!Element} target : who wants to move ?
	 * @param {!number} frames : number of frames
	 * @param {!Object} props : CSS props
	 * @param {!Function=} ease : easing function name
	 * @param {!number=} delay : frames before start
	 * @param {!boolean=} override : stop current effect
	 * @param {!Function=} callback : effect end function
	 * @return {Effect} Effect instance
	 */
	constructor(target, frames, props, ease, delay, override, callback) {

		// parse delay
		delay = delay++ || 1;

		// was params object instead of this.vars

		this.effid = +target.getAttribute("data-ef") || ++Effect._id; // element effect reference
		this.subject = target; // animated element
		this.later = delay; // delay frames
		this.when = delay; // keep original delay
		this.elapsed = 0; // current frame
		this.newlook = {}; // target CSS props
		this.sthap = frames; // total frames
		this.props = props; // keep original props
		this.twist = ease || Effect.no; // easing function
		this.pwnd = override || false; // override
		this.dring = callback || function() {}; // callback
		this.sharp = 2; // numeric values precision, TODO rgb color codes easing float unhandled on older devices
		this.kept = null;

		// assign id to HTML element
		target.setAttribute("data-ef", this.effid);

		if(DEBUG) 
			console.log(
				"effect", 
				this.effid, 
				this.subject.nodeName, 
				this.sthap, "frames", 
				"delay", this.later
			);

	}
	
	/**
	 * @force
	 * @export
	 * @method play : start effect
	 * @return {Promise}
	 */
	play() {

		// reset current frame
		this.elapsed = 0;

		let that = this, 
			prom = new Promise(resolve => { that.kept = resolve; });
		
		Effect
		.addEffect(that);

		return prom;

	}
	
	/**
	 * @force
	 * @export
	 * @method stop : stop effect
	 * @return {number}
	 */
	stop() {

		return Effect
		.removeEffect(this.effid);

	}
	
	/**
	 * @static
	 * @private
	 * @nocollapse
	 * @method init : set up things
	 * @return void
	 */
	static initialize() {

		// id counter
		Effect._id = 0;
		
		// raf stamp
		this.stamp = 0;

		// raf loop
		this.frameLoop = 0;

		// effects pool
		this.effects = [];

		// completed effects
		this.done = [];

		// split numbers // TODO class variable or in split argument ?
		this.propSplit = /(-?\d+(?:.\d+)?(?:e-?\d+)?)/;
	
	}
	
	/**
	 * @static
	 * @private
	 * @nocollapse
	 * @method addEffect : add to pool
	 * @param {!Effect} effect : effect instance
	 */
	static addEffect(effect) {

		if(effect.pwnd) 
			// override
			this.removeEffect(effect.effid);

		// push to pool
		this.effects
		.push(effect);

		// not running, run frame loop
		if(!this.frameLoop) {

			if(DEBUG) 
				console.log("start frame loop");

			// dummy first raf to get DOMHighResTimeStamp
			this.frameLoop = window.requestAnimationFrame(stamp => {

				// keep first timestamp
				this.stamp = stamp;

				// draw first frame
				this.animationFrame(this.stamp);

			});

		}

	}
	
	/**
	 * @static
	 * @private
	 * @nocollapse
	 * @method removeEffect : remove from pool
	 * @param {number} id : effect id
	 * @return {number}
	 */
	static removeEffect(id) {

		// TODO clean effect disposal and null ?

		// savage <3
		this.effects = this.effects
		.filter(eff => eff.effid != id);

		return id;

	}
	
	/**
	 * @static
	 * @private
	 * @nocollapse
	 * @method animationFrame : calc stamp and loop effects
	 * @param {number} stamp : from requestAnimationFrame
	 */
	static animationFrame(stamp) {

		if(!this.effects.length) {

			if(DEBUG) 
				console.log("end frame loop");

			// pool is empty, stop frame loop
			return this.frameLoop = 0;

		}

		// d-d-drop the frames
		let step = Math.round(60 / 1000 * (stamp - this.stamp));
		
		if(DEBUG) 
			if(step > 1) 
				console.log("drop", step - 1);

		// keep frame timestamp
		this.stamp = stamp;
		
		// request next frame
		this.frameLoop = window.requestAnimationFrame(this.animationFrame.bind(this));
		//this.frameLoop = window.requestAnimationFrame(stamp => { this.animationFrame(stamp); }); // wtf old ipad minify fix ??

		// loop effects
		this.effects = this.effects.reduce((res, eff) => this.effectTick(res, eff, step), []);
		
		// callbacks
		while(this.done.length) {

			let eff = this.done.shift();

			if(DEBUG) 
				console.log(eff.effid + " end");

			// reset delay in case effect is played again
			eff.later = eff.when;

			// resolve promise
			eff.kept();

			// callback
			eff.dring(eff.subject);

		}

	}
	
	/**
	 * @static
	 * @private
	 * @nocollapse
	 * @method effectTick : called from frame loop
	 * @param {Array} res : reduce accumulator
	 * @param {Object} eff : current effect
	 * @param {number} step : frame step
	 */
	static effectTick(res, eff, step) {

		if(--eff.later > 0) 
			// delayed, wait
			res.push(eff);

		else {

			if(eff.later === 0) 
				// finished delay, get target CSS props before effect
				this.parseProps(eff);
			
			// drop frame can exceed total frames for very short effects
			eff.elapsed = Math.min(eff.sthap, eff.elapsed + step);
			
			// loop CSS props
			for(let propName in eff.newlook) {

				// tmp
				let prop = eff.newlook[propName], 
					// clone start values
					update = prop.fromValues.slice(0);

				// loop numeric values
				for(let i = 0; i < prop.indexes.length; i++) {
					// tmp
					let index = prop.indexes[i]; 

					// current frame value, apply easing, round digits
					update[index] = eff
					.twist(eff.elapsed, prop.fromValues[index], prop.gaps[i], eff.sthap)
					.toFixed(eff.sharp);

				}

				//if(DEBUG) console.log(propName + " " + update.join("")); // careful with this one
				
				// apply new CSS value
				eff.subject.style[propName] = update.join("");
			
			}

			if(eff.elapsed < eff.sthap) 
				// wait next frame
				res.push(eff);

			else 
				// done, resolve + callback and don't push
				this.done.push(eff);

		}

		return res;

	}
	
	/**
	 * http://blog.moagrius.com/actionscript/jsas-understanding-easing/
	 * https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
	 * @force
	 * @export
	 * @static
	 * @method no : linear ease
	 * @param {number} t : current time or position / can be frames, steps, seconds, ms, whatever
	 * @param {number} b : beginning value
	 * @param {number} c : change between the beginning & destination value
	 * @param {number} d : total time of the tween
	 * @return {number}
	 */
	static no(t, b, c, d) {

		return c * t / d + b;
		
	}
	
	/**
	 * @force
	 * @export
	 * @static
	 * @method quartOut : 
	 * @param {number} t : 
	 * @param {number} b : 
	 * @param {number} c : 
	 * @param {number} d : 
	 * @return {number}
	 */
	static quartOut(t, b, c, d) {

		return -c * ((t = t / d - 1) * t * t * t - 1) + b;

	}
	
	/**
	 * @force
	 * @export
	 * @static
	 * @method quartIn : 
	 * @param {number} t : 
	 * @param {number} b : 
	 * @param {number} c : 
	 * @param {number} d : 
	 * @return {number}
	 */
	static quartIn(t, b, c, d) {

		return c * (t /= d) * t * t * t + b;

	}
	
	/**
	 * @force
	 * @export
	 * @static
	 * @method quartInOut : 
	 * @param {number} t : 
	 * @param {number} b : 
	 * @param {number} c : 
	 * @param {number} d : 
	 * @return {number}
	 */
	static quartInOut(t, b, c, d) {

		if((t /= d / 2) < 1) 
			return c / 2 * t * t + b;

		return -c / 2 * ((--t) * (t - 2) - 1) + b;

	}
	
	/**
	 * @static
	 * @private
	 * @nocollapse
	 * @method parseProps : parse effect start & end CSS properties
	 * @param {Object} eff : the effect
	 */
	static parseProps(eff) {

		// loop effect props
		for(let prop in eff.props) {

			// parse start values
			let fromValues = this.parseProp(
				eff.subject.style[prop] 
				|| window
				.getComputedStyle(eff.subject)
				.getPropertyValue(prop)
			), 
				// parse end values
				toValues = this.parseProp(eff.props[prop]), 
				// init gaps and numeric values indexes
				gaps = [], 
				indexes = [];

			// find numeric values indexes
			for(let i = 0; i < fromValues.length; i++) 
				if(!isNaN(fromValues[i])) 
					indexes.push(i);

			// copy unit from start values if ommited // TODO better
			for(let i = toValues.length; i < fromValues.length; i++) 
				toValues.push(fromValues[i]);

			// calc gaps between start and end values
			for(let i = 0; i < indexes.length; i++) 
				gaps.push(toValues[indexes[i]] - fromValues[indexes[i]]);

			// all set
			eff.newlook[prop] = {
				indexes: indexes, 
				gaps: gaps, 
				fromValues: fromValues
			};

			//if(DEBUG) console.log(prop + " FROM " + fromValues.join("") + " TO " + toValues.join(""));
		
		}

	}
	
	/**
	 * @static
	 * @private
	 * @nocollapse
	 * @method parseProp : parse number values from string
	 * @param {string} value : CSS value
	 */
	static parseProp(value) {

		//console.log("parse", value);

		return String(value)
		// split strings and numbers
		.split(this.propSplit)
		// remove empty strings
		.filter(Boolean)
		//cast numbers
		.map(value => (isNaN(value) ? value : +value));

	}
	
}

Effect.initialize();