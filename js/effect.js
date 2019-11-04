/*
* Effect
* lightweight animation engine
* https://nicopr.fr/effect
*/

/**
* @define {boolean} DEBUG: verbose
*/
var DEBUG = false;

/**
* @export
* @class Effect: animate HTML elements CSS props
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
	* new Effect(myElement, 60, {backgroundColor: "rgb(0, 0, 255)"}, "quartOut");
	*
	* @param {Element} target: who wants to move ?
	* @param {number} frames: number of frames
	* @param {Object} props: CSS props
	* @param {string} ease: easing function name
	* @param {number} delay: frames before start
	* @param {boolean} override: stop current effect
	* @param {Function} callback: effect end function
	*/
	constructor(target, frames, props, ease, delay, override, callback) {
		delay = delay++ || 1; // parse delay
		this.params = { // all params
			effid: +target.getAttribute("data-ef") || ++Effect._id, // element effect reference
			subject: target, // animated element
			later: delay, // delay frames
			when: delay, // keep original delay
			elapsed: 0, // current frame
			newlook: {}, // target CSS props
			sthap: frames, // total frames
			props: props, // keep original props
			twist: ease || "no", // easing function
			pwnd: override || false, // override
			dring: callback || function() {}, // callback
			sharp: 2 // numeric values precision // TODO rgb color codes easing precision bug on older devices
		};
		target.setAttribute("data-ef", this.params.effid); // assign id to HTML element
		if(DEBUG) console.log("effect", this.params.effid, this.params.subject.nodeName);
	}
	
	/**
	* @export
	* @method play: start effect
	* @return {Promise}
	*/
	play() {
		this.params.elapsed = 0; // reset current frame
		let that = this, prom = new Promise(resolve => { that.params.kept = resolve; });
		Effect.addEffect(that.params);
		return prom;
	}
	
	/**
	* @export
	* @method stop: stop effect
	* @return {number}
	*/
	stop() {
		return Effect.removeEffect(this.params.effid);
	}
	
	/**
	* @static
	* @private
	* @nocollapse
	* @method init: set up things
	* @return void
	*/
	static init() {
		this._id = 0; // id counter
		this.frameLoop = 0; // raf loop
		this.effects = []; // effects pool
		this.propSplit = /(-?\d+(?:.\d+)?(?:e-?\d+)?)/; // split numbers // TODO class variable or in split argument ?
	}
	
	/**
	* @static
	* @private
	* @nocollapse
	* @method addEffect: add to pool
	* @param {Object} effect: params object
	*/
	static addEffect(effect) {
		if(effect.pwnd) this.removeEffect(effect.effid); // override
		this.effects.push(effect); // push to pool
		if(!this.frameLoop) { // not running, lift off
			this.frameLoop = window.requestAnimationFrame(stamp => { // dummy first raf to get DOMHighResTimeStamp
				this.stamp = stamp; // keep first timestamp
				this.animationFrame(this.stamp); // draw first frame
			});
		}
	}
	
	/**
	* @static
	* @private
	* @nocollapse
	* @method removeEffect: remove from pool
	* @param {number} id: effect id
	* @return {number}
	*/
	static removeEffect(id) {
		// TODO clean effect disposal and null ?
		this.effects = this.effects.filter(eff => eff.effid != id); // savage <3
		return id;
	}
	
	/**
	* @static
	* @nocollapse
	* @private
	* @method animationFrame: calc stamp and loop effects
	* @param {number} stamp: from requestAnimationFrame
	*/
	static animationFrame(stamp) {
		if(!this.effects.length) return this.frameLoop = 0; // pool is empty, stop frame loop
		let step = Math.round(60 / 1000 * (stamp - this.stamp)); // d-d-drop the frames
		if(DEBUG) if(step > 1) console.log("DROP", step - 1);
		this.stamp = stamp; // keep frame timestamp
		//this.frameLoop = window.requestAnimationFrame(stamp => { this.animationFrame(stamp); }); // wtf old ipad minify fix ??
		this.frameLoop = window.requestAnimationFrame(this.animationFrame.bind(this)); // request next frame
		this.effects = this.effects.reduce((res, eff) => this.effectTick(res, eff, step), []); // loop effects
	}
	
	/**
	* @static
	* @nocollapse
	* @private
	* @method effectTick: called from frame loop
	* @param {Array} res: reduce accumulator
	* @param {Object} eff: current effect
	* @param {number} step: frame step
	*/
	static effectTick(res, eff, step) {
		if(--eff.later > 0) res.push(eff); // delayed, wait
		else {
			if(eff.later === 0) Effect.parseProps(eff); // finished delay, get target CSS props before effect
			eff.elapsed = Math.min(eff.sthap, eff.elapsed + step); // drop frame can exceed total frames for very short effects
			for(let propName in eff.newlook) { // loop CSS props
				let prop = eff.newlook[propName], // tmp
				update = prop.fromValues.slice(0); // clone start values
				for(let i = 0; i < prop.indexes.length; i++) { // loop numeric values
					let index = prop.indexes[i]; // tmp
					update[index] = Effect[eff.twist](eff.elapsed, prop.fromValues[index], prop.gaps[i], eff.sthap).toFixed(eff.sharp); // current frame value, apply easing, round digits
				}
				//if(DEBUG) console.log(propName + " " + update.join("")); // careful with this one
				eff.subject.style[propName] = update.join(""); // apply new CSS value
			}
			if(eff.elapsed < eff.sthap) res.push(eff); // wait next frame
			else { // done, resolve + callback and don't push
				if(DEBUG) console.log(eff.effid + " end");
				eff.later = eff.when; // reset delay in case effect is played again
				eff.kept(); // resolve promise
				eff.dring(eff.subject); // callback
			}
		}
		return res;
	}
	
	/**
	* http://blog.moagrius.com/actionscript/jsas-understanding-easing/
	* https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
	* @export
	* @static
	* @nocollapse
	* @method no: linear ease
	* @param {number} t: current time or position / can be frames, steps, seconds, ms, whatever
	* @param {number} b: beginning value
	* @param {number} c: change between the beginning & destination value
	* @param {number} d: total time of the tween
	*/
	static no(t, b, c, d) {
		return c * t / d + b;
	}
	
	/**
	* @export
	* @static
	* @nocollapse
	* @method quartOut: 
	* @param {number} t: 
	* @param {number} b: 
	* @param {number} c: 
	* @param {number} d: 
	*/
	static quartOut(t, b, c, d) {
		return -c * ((t = t / d - 1) * t * t * t - 1) + b;
	}
	
	/**
	* @export
	* @static
	* @nocollapse
	* @method quartIn: 
	* @param {number} t: 
	* @param {number} b: 
	* @param {number} c: 
	* @param {number} d: 
	*/
	static quartIn(t, b, c, d) {
		return c * (t /= d) * t * t * t + b;
	}
	
	/**
	* @export
	* @static
	* @nocollapse
	* @method quartInOut: 
	* @param {number} t: 
	* @param {number} b: 
	* @param {number} c: 
	* @param {number} d: 
	*/
	static quartInOut(t, b, c, d) {
		if((t /= d / 2) < 1) return c / 2 * t * t + b;
		return -c / 2 * ((--t) * (t - 2) - 1) + b;
	}
	
	/**
	* @static
	* @nocollapse
	* @method parseProps: parse effect start & end CSS properties
	* @param {Object} eff: the effect
	*/
	static parseProps(eff) {
		for(let prop in eff.props) { // loop effect props
			let fromValues = this.parseProp(eff.subject.style[prop] || window.getComputedStyle(eff.subject).getPropertyValue(prop)), // parse start values
			toValues = this.parseProp(eff.props[prop]), // parse end values
			gaps = [], indexes = []; // init gaps and numeric values indexes
			for(let i = 0; i < fromValues.length; i++) if(!isNaN(fromValues[i])) indexes.push(i); // find numeric values indexes
			for(let i = toValues.length; i < fromValues.length; i++) toValues.push(fromValues[i]); // copy unit from start values if ommited // TODO better
			for(let i = 0; i < indexes.length; i++) gaps.push(toValues[indexes[i]] - fromValues[indexes[i]]); // calc gaps between start and end values
			eff.newlook[prop] = {indexes: indexes, gaps: gaps, fromValues: fromValues}; // all set
			if(DEBUG) console.log(prop + " FROM " + fromValues.join("") + " TO " + toValues.join(""));
		}
	}
	
	/**
	* @static
	* @nocollapse
	* @method parseProp: parse number values from string
	* @param {string} value: CSS value
	*/
	static parseProp(value) {
		//console.log("parse", value);
		return String(value).split(this.propSplit).filter(Boolean).map(value => isNaN(value) ? value : +value); // split strings and numbers, remove empty strings, cast numbers
	}
	
}

Effect.init();