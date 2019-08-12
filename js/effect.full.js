class KeepEffect extends Effect {

	/**
	* @static
	* @override
	* @nocollapse
	* @method parseProps: parse effect start & end CSS properties, and keep start values
	* @param {Element} target: element
	* @param {Object} props: CSS properties
	*/
	static parseProps(eff) {
		let props = super.parseProps(eff);
		eff.s = props; // start values
		return props;
	}
	
}

class BackEffect extends KeepEffect {

	/**
	* @nocollapse
	* @method back: where you came from
	*/
	back() {
		
	}
	
}

class YoyoEffect extends BackEffect {

	/**
	* @param {Element} target: who wants to move ?
	* @param {Object} options: effect options
	*/
	constructor(target, options) {
		super(target, options);
		this.options.y = 1;
	}
	
	/**
	* @override
	* @nocollapse
	* @method done: 
	*/
	done() {
		this.options.y = 1 - this.options.y;
	}
}