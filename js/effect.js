/**
* @export
*/
class Effect {
	
	constructor(target, options) {
		if(!options.hasOwnProperty("delay")) options["props"] = Effect.parseProps(target, options["props"]);
		else options["delay"]++;
		this.options = {el: target, d: options["delay"], c: 0, t: options["frames"], p: options["props"], e: options["ease"] || "no"};
	}
	
	/**
	* @export
	*/
	play() {
		let prom = new Promise(resolve => { this.options.r = resolve; });
		Effect.addEffect(this.options);
		return prom;
	}
	
	/**
	* @static
	* @nocollapse
	*/
	static init() {
		this.frameLoop = -1;
		this.effects = [];
		this.propRegex = /^([^\d]*)([\d\.]+)([^\d]*)$/;
		this.transRegex = /^(\w+)/;
	}
	
	/**
	* @static
	* @nocollapse
	*/
	static addEffect(effect) {
		this.effects.push(effect);
		if(this.frameLoop !== -1) return;
		this.hookNextFrame();
	}
	
	/**
	* @static
	* @nocollapse
	*/
	static hookNextFrame() {
		this.frameLoop = window.requestAnimationFrame(this.animationFrame.bind(this));
	}
	
	/**
	* @static
	* @nocollapse
	*/
	static cancelNextFrame() {
		window.cancelAnimationFrame(this.frameLoop);
		this.frameLoop = -1;
	}
	
	/**
	* @static
	* @nocollapse
	*/
	static animationFrame(stamp) {
		//if(this.frameLoop === -1) return;
		this.hookNextFrame();
		//for(let i = this.effects.length - 1; i >= 0; i--) this.effectTick(this.effects[i], i);
		this.effects = this.effects.reduce(this.effectTick.bind(this), []); // TODO COMPARE LOOP FOR VS REDUCE
		if(!this.effects.length) this.cancelNextFrame();
	}
	
	/**
	* @static
	* @nocollapse
	*/
	static effectTick(res, eff, index) {
		if(--eff.d > 0) res.push(eff);
		else {
			if(eff.d === 0) eff.p = Effect.parseProps(eff.el, eff.p);
			eff.c++;
			//for(let prop in eff.p) eff.el.style[prop] = eff.p[prop].stringBefore + Effect[eff.e](eff.c, eff.p[prop].fromValues, eff.p[prop].toValues - eff.p[prop].fromValues, eff.t) + eff.p[prop].stringAfter;
			Object.keys(eff.p).forEach(prop => {
				let value = eff.p[prop];
				eff.el.style[prop] = value.stringBefore + Effect[eff.e](eff.c, value.fromValues, value.toValues - value.fromValues, eff.t) + value.stringAfter;
			});
			if(eff.c === eff.t) eff.r();
			else res.push(eff);
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
	* @param d: is the total time of the tween
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
	* @export
	* @static
	* @nocollapse
	*/
	static bounceOut(t, b, c, d) {
		if ((t/=d) < (1/2.75)) return c*(7.5625*t*t) + b;
		else if (t < (2/2.75)) return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		else if (t < (2.5/2.75)) return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		else return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
	}
	
	/**
	* @static
	* @nocollapse
	*/
	static parseProps(target, props) {
		for(let prop in props) {
			let value = target.style[prop] || /*prop === "transform" ? target.style[prop] : */window.getComputedStyle(target).getPropertyValue(prop);
			let from = Effect.propRegex.exec(value);
			let to = Effect.propRegex.exec(props[prop])
			props[prop] = {fromValues: parseFloat(from[2]), toValues: parseFloat(to[2]), stringBefore: to[1] || from[1], stringAfter: to[3] || from[3]};
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