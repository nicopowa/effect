/**
* @export
*/
class Effect {
	
	/**
	* @param {HTMLElement} target: who wants to move ?
	* @param {Object} options: effect options
	*/
	constructor(target, options) {
		if(!options["delay"]) options["props"] = Effect.parseProps(target, options["props"]); // no delay, parse props
		this.options = {
			id: parseInt(target.getAttribute("data-eff"), 10) || ++Effect._id, // element effect reference
			el: target, // animated element
			d: options["delay"]++ || -1, // delay frames
			c: 0, // current frame
			t: options["frames"], // total frames
			p: options["props"], // CSS props
			e: options["ease"] || "no", // easing function
			o: options["override"] || false // override
		};
		target.setAttribute("data-eff", this.options.id);
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
		Effect.removeEffect(this.options.id);
	}
	
	/**
	* @static
	* @nocollapse
	*/
	static init() {
		this._id = 0; // id counter
		this.frameLoop = -1; // raf loop
		this.effects = []; // effects queue
		this.propRegex = /^([a-z\)\(]*)([e\d\.-]+)(.*)$/; // parse css prop
		//this.transRegex = /^(\w+)/;
	}
	
	/**
	* @static
	* @nocollapse
	*/
	static addEffect(effect) {
		if(effect.o) this.removeEffect(effect.id); // override
		this.effects.push(effect); // push to queue
		if(this.frameLoop !== -1) return; // frame loop already running
		this.frameLoop = window.requestAnimationFrame(stamp => {
			this.stamp = stamp;
			this.animationFrame(this.stamp);
		});
	}
	
	/**
	* @static
	* @nocollapse
	*/
	static removeEffect(id) {
		this.effects = this.effects.filter(eff => eff.id !== id); // remove
	}
	
	/**
	* @static
	* @nocollapse
	*/
	static hookNextFrame() {
		this.frameLoop = window.requestAnimationFrame(this.animationFrame.bind(this)); // next frame plz
	}
	
	/**
	* @static
	* @nocollapse
	*/
	static cancelNextFrame() {
		window.cancelAnimationFrame(this.frameLoop); // cancel frame loop
		this.frameLoop = -1; // reset
	}
	
	/**
	* @static
	* @nocollapse
	*/
	static animationFrame(stamp) {
		this.step = 1 + Math.round((stamp - this.stamp) / 60); // shall we skip frames ?
		//if(this.step > 1) console.log("skip", this.step - 1);
		this.stamp = stamp; // keep frame timestamp
		//console.log("hook");
		this.hookNextFrame(); // request next frame
		//console.log("hooked");
		this.effects = this.effects.reduce(this.effectTick.bind(this), []); // loop effects
		if(!this.effects.length) this.cancelNextFrame(); // empty queue, stop frame loop
	}
	
	/**
	* @static
	* @nocollapse
	*/
	static effectTick(res, eff) {
		//console.log("tick");
		if(--eff.d > 0) res.push(eff); // delayed, wait
		else {
			if(eff.d === 0) eff.p = Effect.parseProps(eff.el, eff.p); // finished delay, calc props before animation
			eff.c = Math.min(eff.t, eff.c + this.step); // in case skip frame exceeds total frames
			
			/*Object.keys(eff.p).forEach(prop => // loop props
				eff.el.style[prop] = // calc frame value
					eff.p[prop].strBefore // prepend CSS
					+ Effect[eff.e]( // current value, apply easing
						eff.c, // t
						eff.p[prop].fromValue, // b
						eff.p[prop].valueGap, // c
						eff.t) // d
					+ eff.p[prop].strAfter // append CSS
			);*/
			
			for(let prop in eff.p) { // gain 24 bytes minify, check perf vs Object.keys
				eff.el.style[prop] = // calc frame value
					eff.p[prop].strBefore // prepend CSS
					+ Effect[eff.e]( // current value, apply easing
						eff.c, // t
						eff.p[prop].fromValue, // b
						eff.p[prop].valueGap, // c
						eff.t) // d
					+ eff.p[prop].strAfter // append CSS
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
	* @param t: current time or position / can be frames, steps, seconds, ms, whatever
	* @param b: beginning value
	* @param c: change between the beginning & destination value
	* @param d: total time of the tween
	*/
	static no(t, b, c, d) {
		return c * t / d + b;
	}
	
	/**
	* @export
	* @static
	* @nocollapse
	*/
	static quartOut(t, b, c, d) {
		return -c * ((t = t / d - 1) * t * t * t - 1) + b;
	}
	
	/**
	* @export
	* @static
	* @nocollapse
	*/
	static quartIn(t, b, c, d) {
		return c * (t /= d) * t * t * t + b;
	}
	
	/**
	* @export
	* @static
	* @nocollapse
	*/
	static quartInOut(t, b, c, d) {
		if((t /= d / 2) < 1) return c / 2 * t * t + b;
		return -c / 2 * ((--t) * (t - 2) - 1) + b;
	}
	
	/**
	* @static
	* @nocollapse
	* @method parseProps: parse HTML element css properties
	* @param {HTMLElement} target: element
	* @param {Object} props: CSS properties
	*/
	static parseProps(target, props) {
		for(let prop in props) {
			let from = Effect.propRegex.exec(target.style[prop] || window.getComputedStyle(target).getPropertyValue(prop)), 
			to = Effect.propRegex.exec(props[prop]),
			fromValue = parseFloat(from[2]),
			toValue = parseFloat(to[2]), 
			valueGap = toValue - fromValue;
			props[prop] = {
				fromValue: fromValue, 
				//toValue: toValue, // not needed for tween and ease
				valueGap: valueGap, // only need gap
				strBefore: to[1] || from[1], 
				strAfter: to[3] || from[3]
			};
			//console.log("from", props[prop].fromValue, "to", props[prop].toValue);
		}
		return props;
	}
	
	/*static getTransform(target, prop) {
		let transform = this.transRegex.exec(prop), 
		matrix = window.getComputedStyle(target, null).getPropertyValue("transform").match(/([-e\.\d]+)/g).map(val => parseFloat(val)), // switch prefixes ?
		scale = Math.sqrt(Math.pow(matrix[0], 2) + Math.pow(matrix[1], 2)), 
		rotate = Math.round(Math.asin(matrix[1] / scale) * (180 / Math.PI));
		if(1 / rotate === -Infinity) rotate += 360;
		let transforms = {"scale": scale, "rotate": rotate, "translateX": matrix[4], "translateY": matrix[5]}; // TODO skew scaleX scaleY
		return [transform[0] + "(", transforms[transform[0]], ")"];
	}*/
}

Effect.init();