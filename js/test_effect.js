async function main() {
	
	console.log("main");
	
	Effect["bounceOut"] = function(t, b, c, d) {
		if((t /= d) < (1 / 2.75)) return c * (7.5625 * t * t) + b;
		else if(t < (2 / 2.75)) return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
		else if(t < (2.5 / 2.75)) return c * (7.5625 * (t -= (2.25 / 2.75))*t + .9375) + b;
		else return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
	}
	
	//overrideTest(); await plz(500);
	await simpleEffect();
	await notSimpleEffect();
	//notSimpleEffect2();
	
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
	
	await new Effect(sq1, {"frames": dur / 2, "props": {"backgroundColor": "rgb(255, 0, 0)"}, "ease": "quartInOut"}).play();
	await new Effect(sq2, {"frames": dur / 2, "props": {"backgroundColor": "rgb(0, 255, 0)"}, "ease": "quartInOut"}).play();
	await new Effect(sq3, {"frames": dur / 2, "props": {"backgroundColor": "rgb(0, 0, 255)"}, "ease": "quartInOut"}).play();
	await new Effect(sq4, {"frames": dur / 2, "props": {"backgroundColor": "rgb(0, 169, 255)"}, "ease": "quartInOut"}).play();
	
	console.time("simple");
	
	new Effect(sq1, {"frames": dur, "props": {"left": maxLeft, [shadow]: "0px 3px 3px 0px #656565"}, "ease": "quartInOut"}).play();
	new Effect(sq2, {"frames": dur, "props": {"left": maxLeft, "opacity": 0, [transform]: "scale(0.5)"}, "ease": "quartInOut"}).play();
	new Effect(sq3, {"frames": dur, "props": {"left": maxLeft, [filter]: "blur(10px)", [transform]: "rotate(360deg)"}, "ease": "quartInOut"}).play();
	
	new Effect(sq1, {"frames": dur, delay: dur, "props": {"left": 10}, "ease": "quartInOut"}).play();
	new Effect(sq2, {"frames": dur, delay: dur, "props": {"left": 10, opacity: 1, [transform]: "scale(1)"}, "ease": "quartInOut"}).play();
	new Effect(sq3, {"frames": dur, delay: dur, "props": {"left": 10, [filter]: "blur(0px)", [transform]: "rotate(0deg)"}, "ease": "quartInOut"}).play();
	
	await plz(2 * dur * toMs);
		
	await new Effect(sq1, {"frames": dur, "props": {"left": maxLeft}, "ease": "quartInOut"}).play();
	await new Effect(sq2, {"frames": dur, "props": {"left": maxLeft, "opacity": 0, [transform]: "scale(0.5)"}, "ease": "quartInOut"}).play();
	await new Effect(sq3, {"frames": dur, "props": {"left": maxLeft, [filter]: "blur(10px)", [transform]: "rotate(360deg)"}, "ease": "quartInOut"}).play();
	
	await new Effect(sq1, {"frames": dur, "props": {"left": 10}, "ease": "quartInOut"}).play();
	await new Effect(sq2, {"frames": dur, "props": {"left": 10, "opacity": 1, [transform]: "scale(1)"}, "ease": "quartInOut"}).play();
	await new Effect(sq3, {"frames": dur, "props": {"left": 10, [filter]: "blur(0px)", [transform]: "rotate(0deg)"}, "ease": "quartInOut"}).play();
	
	console.timeEnd("simple");
	
	new Effect(sq4, {"frames": dur * 1.5, "props": {"left": Math.min(700, document.body.clientWidth - 100 - 10), "backgroundColor": "rgb(0, 255, 0)"}, "ease": "no"}).play();
	await new Effect(sq4, {"frames": dur * 1.5, "props": {"top": document.body.clientHeight - 100}, "ease": "bounceOut"}).play();
	
	await plz(dur * toMs);
	
	[sq1, sq2, sq3, sq4].map(square => new Effect(square, {"frames": dur, "props": {"opacity": 0}, "ease": "quartInOut"}).play());
	
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