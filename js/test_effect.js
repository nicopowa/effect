window.onload = main;

function pointAround(centerx, centery, x, y, angle) {
	let x1 = x - centerx;
	let y1 = y - centery;
	let x2 = x1 * Math.cos(angle) - y1 * Math.sin(angle);
	let y2 = x1 * Math.sin(angle) + y1 * Math.cos(angle);
	return {x: x2 + centerx, y: y2 + centery};
}

let sqs = Math.min(window.innerWidth, window.innerHeight) / 10;

const prefix = (function () { // get browser prefix
	let styles = window.getComputedStyle(document.documentElement, ""), pre = (Array.prototype.slice.call(styles).join("").match(/-(moz|ms|webkit)-/) || (styles["OLink"] === "" && ["", "o"]))[1]
	return pre == "moz" ? "" : "-" + pre + "-";
})();

const toSec = 1 / 60;
const toMs = 1000 / 60;

const transform = prefix + "transform"; // prefixed transform property
const filter = prefix + "filter"; // prefixed filter property
const shadow = prefix + "box-shadow"; // prefixed shadow property

const plz = ms => new Promise(resolve => setTimeout(resolve, ms)); // async wait

const toRadians = Math.PI / 180; // convert

const asyncForEach = async (array, callback) => {
	for(let index = 0; index < array.length; index++) await callback(array[index], index, array);
};

const randXCoord = () => Math.round(Math.random() * (window.innerWidth - sqs));

const randYCoord = () => Math.round(Math.random() * (window.innerHeight - sqs));

const randColor = () => {
	let color = Math.floor(Math.random() * 16777216).toString(16);
	return "#000000".slice(0, -color.length) + color;
}

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
	
	Effect["bounceOut"] = function(t, b, c, d) {
		if((t /= d) < (1 / 2.75)) return c * (7.5625 * t * t) + b;
		else if(t < (2 / 2.75)) return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
		else if(t < (2.5 / 2.75)) return c * (7.5625 * (t -= (2.25 / 2.75))*t + .9375) + b;
		else return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
	}
	
	//overrideTest(); await plz(500);
	//await verySimpleEffect();
	await simpleEffect();
	//await notSimpleEffect();
	//notSimpleEffect2();
	
}

async function verySimpleEffect() {
	
	let sq1 = square(10, 10, 100, 100, 0);
	sq1.style.backgroundColor = "rgb(255, 0, 0)";
	sq1.style.opacity = 1;
	sq1.style[shadow] = "0px 0px 0px 0px #656565";
	document.body.appendChild(sq1);
	
	let dur = 60;
	let maxLeft = Math.min(window.innerWidth - 100 - 10, 500);
	await new Effect(sq1, dur, {"left": maxLeft, [shadow]: "rgb(0, 0, 0) 0px 8px 8px 3px"}, "quartInOut").play();
	await new Effect(sq1, dur, {"left": 10, [shadow]: "rgb(0, 0, 0) 0px 0px 0px 0px"}, "quartInOut").play();
}

async function simpleEffect() {
	
	console.log("test simple");
	
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
	
	let sq4 = square(10, 340, 100, 100, 2);
	sq4.style.backgroundColor = "rgb(0, 0, 0)";
	sq4.style.opacity = 1;
	document.body.appendChild(sq4);
	
	await plz(500);
	
	let dur = 60;
	let maxLeft = Math.min(window.innerWidth - 100 - 10, 500);
	
	await new Effect(sq1, dur / 2, {"backgroundColor": "rgb(255, 0, 0)"}, "quartInOut").play();
	await new Effect(sq2, dur / 2, {"backgroundColor": "rgb(0, 255, 0)"}, "quartInOut").play();
	await new Effect(sq3, dur / 2, {"backgroundColor": "rgb(0, 0, 255)"}, "quartInOut").play();
	await new Effect(sq4, dur / 2, {"backgroundColor": "rgb(0, 169, 255)"}, "quartInOut").play();
	
	console.time("simple");
	
	let firstEffect = new Effect(sq1, dur, {"left": maxLeft, [shadow]: "rgb(0, 0, 0) 0px 8px 8px 3px"}, "quartInOut");
	let secondEffect = new Effect(sq2, dur, {"left": maxLeft, "opacity": 0, [transform]: "scale(0.5)"}, "quartInOut");
	let thirdEffect = new Effect(sq3, dur, {"left": maxLeft, [filter]: "blur(10px)", [transform]: "rotate(360deg)"}, "quartInOut");
	
	firstEffect.play();
	secondEffect.play();
	thirdEffect.play();
	
	let firstEffectBack = new Effect(sq1, dur, {"left": 10, [shadow]: "rgb(0, 0, 0) 0px 0px 0px 0px"}, "quartInOut", dur);
	let secondEffectBack = new Effect(sq2, dur, {"left": 10, opacity: 1, [transform]: "scale(1)"}, "quartInOut", dur);
	let thirdEffectBack = new Effect(sq3, dur, {"left": 10, [filter]: "blur(0px)", [transform]: "rotate(0deg)"}, "quartInOut", dur);
	
	firstEffectBack.play();
	secondEffectBack.play();
	thirdEffectBack.play();
	
	await plz(2 * dur * toMs);
		
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
	
	[sq1, sq2, sq3, sq4].map(square => new Effect(square, dur, {"opacity": 0}, "quartInOut").play());
	
	await plz(dur * toMs);
	
	document.body.removeChild(sq1);
	document.body.removeChild(sq2);
	document.body.removeChild(sq3);
	document.body.removeChild(sq4);
	
	console.log("done");
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
	
	console.time("notsimple");
	await asyncForEach(squares, async (square, index) => {
		let coords = pointAround(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 2 - sqs, window.innerHeight / 2, 360 * index / squares.length * toRadians);
		return new Effect(square, {frames: 2, props: {left: coords.x - sqs / 2, top: coords.y - sqs / 2, "border-radius": sqs / 2}, ease: "quartInOut"}).play();
	});
	await plz(60 * 20);
	squares.map((square, index) => new Effect(square, {frames: 90, props: {left: index % nsqw * sqs, top: Math.floor(index / nsqw) * sqs, "border-radius": 0}, ease: "quartInOut"}).play());
	squares.map((square, index) => new Effect(square, {delay: 90, frames: 30, props: {[filter]: "blur(10px)"}, ease: "quartInOut"}).play());
	squares.map((square, index) => new Effect(square, {delay: 150, frames: 30, props: {[filter]: "blur(0px)"}, ease: "quartInOut"}).play());
	squares.map((square, index) => new Effect(square, {delay: 210, frames: 60, props: {left: randXCoord(), top: randYCoord(), "border-radius": sqs / 2}, ease: "quartInOut"}).play());
	squares.map((square, index) => new Effect(square, {delay: 300, frames: 60, props: {left: (window.innerWidth - sqs) / 2, top: (window.innerHeight - sqs) / 2, "border-radius": 0, opacity: 0.05}, ease: "quartInOut"}).play());
	squares.map((square, index) => {
		let coords = pointAround(window.innerWidth  / 2, window.innerHeight / 2, window.innerWidth / 2 - Math.min((window.innerWidth - sqs) / 2, (window.innerHeight - sqs) / 2), window.innerHeight / 2, 360 * index / squares.length * toRadians);
		new Effect(square, {delay: 400, frames: 60, props: {left: coords.x - sqs / 2, top: coords.y - sqs / 2, "border-radius": sqs / 2, opacity: 1}, ease: "quartInOut"}).play();
	});
	console.timeEnd("notsimple");
}

async function notSimpleEffect2() {
	let squares = [];
	let nsqw = Math.round(window.innerWidth / sqs);
	let nsqh = Math.round(window.innerHeight / sqs);
	let num = nsqw * nsqh;
	for(let i = 0; i < num; i++) {
		let sq = square((window.innerWidth - sqs) / 2, (window.innerHeight - sqs) / 2, sqs, sqs, i);
		sq.style.backgroundColor = randColor();
		sq.style[filter] = "blur(0px)"
		sq.style["border-radius"] = "0px";
		sq.style.zIndex = i;
		document.body.appendChild(sq);
		squares.push(sq);
	}
	squares.reverse();
	
	squares.map((square, index) => {
		let coords = pointAround(window.innerWidth  / 2, window.innerHeight / 2, window.innerWidth / 2 - Math.min((window.innerWidth - sqs - 1) / 2, (window.innerHeight - sqs - 1) / 2), window.innerHeight / 2, 360 * index / squares.length * toRadians);
		new Effect(square, {delay: 40, frames: 60, props: {left: coords.x - sqs / 2, top: coords.y - sqs / 2, "border-radius": sqs / 2, opacity: 1}, ease: "quartInOut"}).play();
	});
	squares.map(square => new Effect(square, {delay: 130, frames: 60, props: {left: (window.innerWidth - sqs) / 2, top: (window.innerHeight - sqs) / 2, "border-radius": 0, opacity: 1}, ease: "quartInOut"}).play());

}

async function overrideTest() {
	console.log("override test");
	let sq1 = square(10, 10, 100, 100, 0);
	sq1.style.backgroundColor = "#FF0000";
	document.body.appendChild(sq1);
	
	let eff = new Effect(sq1, {frames: 180, props: {left: "500px"}, ease: "quartOut"});
	eff.play();
	console.log("wait");
	await plz(1000);
	console.log("override");
	await new Effect(sq1, {frames: 90, props: {left: "10px"}, ease: "quartOut", override: true}).play();
	/*console.log("stop");
	eff.stop();*/
	console.log("done");
}