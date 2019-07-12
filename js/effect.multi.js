/*
* Effect
* tiny animation engine
* Nico Pr 2019
* https://nicopr.fr/effect
*/

/**
* @export
*/
class Effect {
	
	/**
	* @param {Element} target: who wants to move ?
	* @param {Object} options: effect options
	*/
	constructor(target, options) {
		this.options = {
			effid: +target.getAttribute("data-eff") || ++Effect._id, // element effect reference
			el: target, // animated element
			d: options["delay"]++ || 1, // delay frames
			c: 0, // current frame
			t: options["frames"], // total frames
			p: options["props"], // CSS props
			e: options["ease"] || "no", // easing function
			o: options["override"] || false // override
		};
		target.setAttribute("data-eff", this.options.effid); // assign id to HTML element
	}
	
	/**
	* @export
	* @method play: start effect
	* @return {Promise}
	*/
	play() {
		let prom = new Promise(resolve => { this.options.r = resolve; });
		Effect.addEffect(this.options);
		return prom;
	}
	
	/**
	* @export
	* @method stop: stop effect
	*/
	stop() {
		Effect.removeEffect(this.options.effid);
	}
	
	/**
	* @static
	* @private
	* @nocollapse
	* @method init: set up things
	*/
	static init() {
		this._id = 0; // id counter
		this.frameLoop = undefined; // raf loop
		this.effects = []; // effects pool
		this.propSplit = /((?:e-)?\d+(?:.\d+)?)/; // TODO rewrite expo
	}
	
	/**
	* @static
	* @private
	* @nocollapse
	* @method addEffect: add to pool
	* @param {Object} effect: 
	*/
	static addEffect(effect) {
		if(effect.o) this.removeEffect(effect.effid); // override
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
	* @param {number} id: 
	*/
	static removeEffect(id) {
		// TODO clean effect disposal and null ?
		this.effects = this.effects.filter(eff => eff.effid != id); // savage <3
	}
	
	/**
	* @static
	* @nocollapse
	* @private
	* @method animationFrame: calc stamp and loop effects
	* @param {number} stamp: from requestAnimationFrame
	*/
	static animationFrame(stamp) {
		let step = 1 + Math.round((stamp - this.stamp) / 60); // drop some frame
		//if(step > 1) console.log("DROP", step - 1);
		this.stamp = stamp; // keep frame timestamp
		this.frameLoop = window.requestAnimationFrame(this.animationFrame.bind(this)); // request next frame
		this.effects = this.effects.reduce((res, eff) => this.effectTick(res, eff, step), []); // loop effects
		if(!this.effects.length) this.frameLoop = window.cancelAnimationFrame(this.frameLoop); // pool is empty, stop frame loop
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
		if(--eff.d > 0) res.push(eff); // delayed, wait
		else {
			if(eff.d === 0) eff.p = Effect.parseProps(eff.el, eff.p); // finished delay, get target CSS props before effect
			eff.c = Math.min(eff.t, eff.c + step); // drop frame can exceed total frames for very short effects
			for(let propName in eff.p) { // loop CSS props
				let prop = eff.p[propName], // tmp
				update = prop.fromValues.slice(0); // clone start values
				for(let i = 0; i < prop.indexes.length; i++) { // loop numeric values
					let index = prop.indexes[i]; // tmp
					update[index] = Effect[eff.e](eff.c, prop.fromValues[index], prop.gaps[i], eff.t).toFixed(2); // current frame value, apply easing, round 2 digits
				}
				eff.el.style[propName] = update.join(""); // apply new CSS value
			}
			if(eff.c < eff.t) res.push(eff); // wait next frame
			else eff.r(); // done, resolve and don't push
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
	* @param {Element} target: element
	* @param {Object} props: CSS properties
	*/
	static parseProps(target, props) {
		for(let prop in props) { // loop effect props
			let fromValues = this.parseProp(target.style[prop] || window.getComputedStyle(target).getPropertyValue(prop)), // parse start values
			toValues = this.parseProp(props[prop]), // parse end values
			gaps = [], indexes = []; // init gaps and numeric values indexes
			for(let i = 0; i < fromValues.length; i++) if(!isNaN(fromValues[i])) indexes.push(i); // find numeric values indexes
			for(let i = toValues.length; i < fromValues.length; i++) toValues.push(fromValues[i]); // copy unit from start values if ommited // TODO better
			for(let i = 0; i < indexes.length; i++) gaps.push(toValues[indexes[i]] - fromValues[indexes[i]]); // calc gaps between start and end values
			props[prop] = {indexes: indexes, gaps: gaps, fromValues: fromValues}; // all set
		}
		return props;
	}
	
	/**
	* @static
	* @nocollapse
	* @method parseProp: parse number values from string
	* @param {string} value: 
	*/
	static parseProp(value) {
		return String(value).split(this.propSplit).filter(Boolean).map(value => isNaN(value) ? value : +value); // split strings and numbers, remove empty strings, cast numbers
	}
	
}

Effect.init();