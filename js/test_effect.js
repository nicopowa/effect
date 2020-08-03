window.onload = main;

var DEBUG = false;

const pointAround = (centerx, centery, x, y, angle) => {
	let x1 = x - centerx, 
	y1 = y - centery, 
	x2 = x1 * Math.cos(angle) - y1 * Math.sin(angle), 
	y2 = x1 * Math.sin(angle) + y1 * Math.cos(angle);
	return {x: x2 + centerx, y: y2 + centery};
}

let sqs = Math.min(window.innerWidth, window.innerHeight) / 10; // square size

const prefix = (() => { // get browser prefix // https://davidwalsh.name/vendor-prefix
	let styles = window.getComputedStyle(document.documentElement, ""), 
	pre = (Array.prototype.slice.call(styles).join("").match(/-(moz|ms|webkit)-/) || (styles["OLink"] === "" && ["", "o"]))[1];
	return pre == "moz" ? "" : "-" + pre + "-";
})();

console.log("PREFIX", prefix);

const getVendorPrefix = () => {
	let regex = /^-(moz|ms|webkit)-/;
	return Promise.resolve(Array.from(window.getComputedStyle(document.documentElement, "")).find(prop => regex.test(prop))).then(prop => prop.match(regex)[0]).catch(err => "");
};

const toSec = 1 / 60;
const toMs = 1000 / 60;

const transform = prefix + "transform"; // prefixed transform property
const filter = prefix + "filter"; // prefixed filter property
const shadow = prefix + "box-shadow"; // prefixed shadow property

const plz = ms => new Promise(resolve => setTimeout(resolve, ms)); // async wait

const toRadians = Math.PI / 180; // convert

const asyncForEach = async (array, callback) => { // does the job
	for(let index = 0; index < array.length; index++) await callback(array[index], index, array);
};

const asyncForEachLast = async (array, callback) => { // loop and await only last element
	for(var index = 0; index < array.length - 1; index++) callback(array[index], index, array);
	await callback(array[index], index, array);
};

const randXCoord = () => Math.round(Math.random() * (window.innerWidth - sqs)); // random x coord in screen
const randYCoord = () => Math.round(Math.random() * (window.innerHeight - sqs)); // y

const randColor = () => "#" + Math.random().toString(16).substr(-6);

function square(left, top, width, height, index) {
	let sq = document.createElement("div");
	sq.style.position = "absolute";
	sq.style.left = left + "px";
	sq.style.top = top + "px";
	sq.style.width = width + "px";
	sq.style.height = height + "px";
	sq.style.textAlign = "center";
	sq.style.verticalAlign = "center";
	sq.style.lineHeight = height + "px";
	sq.classList.add("square");
	sq.innerHTML = index;
	return sq;
}

async function main() {
	
	console.log("main");

	console.log("PREFIX", await getVendorPrefix());

	/*let ghost = document.createElement("div");
	document.body.appendChild(ghost);
	ghost.style.width = ghost.style.height = "1px";
	ghost.style[transform] = "rotate(1px)";
	ghost.style[filter] = "blur(1px)";
	ghost.style[shadow] = "1px 1px 1px 1px #FFFFFF";
	document.body.removeChild(ghost);
	ghost = null;*/

	Effect["bounceOut"] = function(t, b, c, d) { // some bounce
		if((t /= d) < (1 / 2.75)) return c * (7.5625 * t * t) + b;
		else if(t < (2 / 2.75)) return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
		else if(t < (2.5 / 2.75)) return c * (7.5625 * (t -= (2.25 / 2.75))*t + .9375) + b;
		else return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
	}
	
	let sq1 = square(10, 10, 100, 100, "click me");
	sq1.style.backgroundColor = "rgb(255, 0, 0)";
	sq1.style.opacity = 1;
	sq1.style[shadow] = "0px 0px 0px 0px #656565";
	document.body.appendChild(sq1);
	
	sq1.addEventListener("click", start);
}

async function start() {
	
	let sq1 = event.target;
	
	sq1.removeEventListener("click", start);
	sq1.innerHTML = "0";
	
	await plz(250);
	
	//overrideTest(); await plz(500);
	
	await verySimpleEffect(sq1);
	await simpleEffect();
	//await notSimpleEffect();
}

async function verySimpleEffect(sq1) {
	
	let dur = 60;
	let maxLeft = Math.min(window.innerWidth - 100 - 10, 500);
	let maxTop = Math.min(window.innerHeight - 100 - 10, 500);
	
	console.time("verysimple");
	
	await new Effect(sq1, dur, {"left": maxLeft}, Effect.quartInOut).play();
	await new Effect(sq1, dur, {"top": maxTop}, Effect.quartInOut).play();
	await new Effect(sq1, dur, {"left": 10}, Effect.quartInOut).play();
	await new Effect(sq1, dur, {"top": 10}, Effect.quartInOut).play();
	
	
	console.timeEnd("verysimple");
	
	await new Effect(sq1, dur, {"opacity": 0}, Effect.quartInOut).play();
	
	document.body.removeChild(sq1);
}

async function simpleEffect() {
	
	let sq1 = square(10, 10, 100, 100, 0);
	sq1.style.backgroundColor = "rgb(0, 0, 0)";
	sq1.style.opacity = 1;
	sq1.style[shadow] = "0px 0px 0px 0px #656565";
	document.body.appendChild(sq1);
	
	let sq2 = square(10, 120, 100, 100, 1);
	sq2.style.backgroundColor = "rgb(0, 0, 0)";
	sq2.style.opacity = 1;
	document.body.appendChild(sq2);
	sq2.style[transform] = "scale(1)";
	
	let sq3 = square(10, 230, 100, 100, 2);
	sq3.style.backgroundColor = "rgb(0, 0, 0)";
	sq3.style.opacity = 1;
	document.body.appendChild(sq3);
	sq3.style[transform] = "rotate(0deg)";
	sq3.style[filter] = "blur(0px)";
	
	let sq4 = square(10, 340, 100, 100, 3);
	sq4.style.backgroundColor = "rgb(0, 0, 0)";
	sq4.style.opacity = 1;
	document.body.appendChild(sq4);
	
	await plz(500);
	
	let dur = 60;
	let maxLeft = Math.min(window.innerWidth - 100 - 10, 500);
	
	await new Effect(sq1, dur / 2, {"backgroundColor": "rgb(255, 0, 0)"}, Effect.quartInOut).play();
	await new Effect(sq2, dur / 2, {"backgroundColor": "rgb(0, 255, 0)"}, Effect.quartInOut).play();
	await new Effect(sq3, dur / 2, {"backgroundColor": "rgb(0, 0, 255)"}, Effect.quartInOut).play();
	await new Effect(sq4, dur / 2, {"backgroundColor": "rgb(0, 169, 255)"}, Effect.quartInOut).play();
	
	console.time("simple");
	
	let firstEffect = new Effect(sq1, dur, {"left": maxLeft, [shadow]: "rgb(0, 0, 0) 0px 8px 8px 3px"}, Effect.quartInOut);
	let secondEffect = new Effect(sq2, dur, {"left": maxLeft, "opacity": 0, [transform]: "scale(0.5)"}, Effect.quartInOut);
	let thirdEffect = new Effect(sq3, dur, {"left": maxLeft, [filter]: "blur(10px)", [transform]: "rotate(360deg)"}, Effect.quartInOut);
	
	firstEffect.play();
	secondEffect.play();
	await thirdEffect.play();
	
	let firstEffectBack = new Effect(sq1, dur, {"left": 10, [shadow]: "rgb(0, 0, 0) 0px 0px 0px 0px"}, Effect.quartInOut);
	let secondEffectBack = new Effect(sq2, dur, {"left": 10, opacity: 1, [transform]: "scale(1)"}, Effect.quartInOut);
	let thirdEffectBack = new Effect(sq3, dur, {"left": 10, [filter]: "blur(0px)", [transform]: "rotate(0deg)"}, Effect.quartInOut);
	
	firstEffectBack.play();
	secondEffectBack.play();
	await thirdEffectBack.play();
		
	await firstEffect.play();
	await secondEffect.play();
	await thirdEffect.play();
	
	await firstEffectBack.play();
	await secondEffectBack.play();
	await thirdEffectBack.play();
	
	console.timeEnd("simple");
	
	new Effect(sq4, dur * 1.5, {"left": Math.min(700, document.body.clientWidth - 100 - 10), "backgroundColor": "rgb(0, 255, 0)"}, "no").play();
	await new Effect(sq4, dur * 1.5, {"top": document.body.clientHeight - 100}, "bounceOut").play();
	
	await plz(dur * toMs);
	
	[sq1, sq2, sq3, sq4].map(square => new Effect(square, dur, {"opacity": 0}, Effect.quartInOut).play());
	
	await plz(dur * toMs);
	
	document.body.removeChild(sq1);
	document.body.removeChild(sq2);
	document.body.removeChild(sq3);
	document.body.removeChild(sq4);
	
}

async function notSimpleEffect() {
	let squares = [];
	let nsqw = Math.round(window.innerWidth / sqs);
	let nsqh = Math.round(window.innerHeight / sqs);
	let num = nsqw * nsqh;
	for(let i = 0; i < num; i++) {
		let sq = square((window.innerWidth - sqs) / 2, (window.innerHeight - sqs) / 2, sqs, sqs, i);
		sq.style.backgroundColor = randColor();
		sq.style[filter] = "blur(0px)"
		sq.style.zIndex = i;
		sq.style["border-radius"] = "0px";
		document.body.appendChild(sq);
		squares.push(sq);
	}
	squares.reverse();
	
	
	await asyncForEach(squares, async (square, index) => {
		let coords = pointAround(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 2 - sqs, window.innerHeight / 2, 360 * index / squares.length * toRadians);
		return new Effect(square, 1, {left: coords.x - sqs / 2, top: coords.y - sqs / 2, "border-radius": sqs / 2}, Effect.quartInOut).play();
	});
	await plz(60 * 20);
	let dur = 60;
	
	console.time("notsimple");
	
	await asyncForEachLast(squares, (square, index) => new Effect(square, dur, {left: index % nsqw * sqs, top: Math.floor(index / nsqw) * sqs, "border-radius": 0}, Effect.quartInOut).play());
	await asyncForEachLast(squares, (square, index) => new Effect(square, dur, {[filter]: "blur(5px)"}, Effect.quartInOut).play());
	await asyncForEachLast(squares, (square, index) => new Effect(square, dur, {[filter]: "blur(0px)"}, Effect.quartInOut).play());
	await asyncForEachLast(squares, (square, index) => new Effect(square, dur, {left: randXCoord(), top: randYCoord(), "border-radius": sqs / 2}, Effect.quartInOut).play());
	await asyncForEachLast(squares, (square, index) => new Effect(square, dur, {left: (window.innerWidth - sqs) / 2, top: (window.innerHeight - sqs) / 2, "border-radius": 0, opacity: 0.05}, Effect.quartInOut).play());
	await asyncForEachLast(squares, (square, index) => {
		let coords = pointAround(window.innerWidth  / 2, window.innerHeight / 2, window.innerWidth / 2 - Math.min((window.innerWidth - sqs) / 2, (window.innerHeight - sqs) / 2), window.innerHeight / 2, 360 * index / squares.length * toRadians);
		return new Effect(square, dur, {left: coords.x - sqs / 2, top: coords.y - sqs / 2, "border-radius": sqs / 2, opacity: 1}, Effect.quartInOut).play();
	});
	
	console.timeEnd("notsimple");
}

async function overrideTest() {
	console.log("override test");
	let sq1 = square(10, 10, 100, 100, 0);
	sq1.style.backgroundColor = "#FF0000";
	document.body.appendChild(sq1);
	
	let eff = new Effect(sq1, {frames: 180, props: {left: "500px"}, ease: Effect.quartOut});
	eff.play();
	console.log("wait");
	await plz(1000);
	console.log("override");
	await new Effect(sq1, {frames: 90, props: {left: "10px"}, ease: Effect.quartOut, override: true}).play();
	/*console.log("stop");
	eff.stop();*/
	console.log("done");
}