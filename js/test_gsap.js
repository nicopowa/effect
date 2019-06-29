async function main() {
	
	console.log("main");
	
	//overrideTest();
	
	await simpleTween();
	await notSimpleTween();
	//notSimpleTween2();
}

// savage TweenMax onComplete promise
const asyncTween = (target, duration, options) => new Promise(resolve => TweenMax.to(target, duration, Object.assign(options, {onComplete: resolve})));

async function simpleTween() {
	
	let sq1 = square(10, 10, 100, 100, 0);
	sq1.style.backgroundColor = "#FF0000";
	document.body.appendChild(sq1);
	
	let sq2 = square(10, 120, 100, 100, 1);
	sq2.style.backgroundColor = "#00FF00";
	document.body.appendChild(sq2);
	sq2.style[transform] = "scale(1)";
	
	let sq3 = square(10, 230, 100, 100, 2);
	sq3.style.backgroundColor = "#0000FF";
	document.body.appendChild(sq3);
	sq3.style[transform] = "rotate(0deg)";
	sq3.style.filter = "blur(0px)";
	
	let sq4 = square(10, 340, 100, 100, 2);
	sq4.style.backgroundColor = "#000000";
	document.body.appendChild(sq4);
	
	let dur = 60; // frames
	let maxLeft = Math.min(window.innerWidth - 100 - 10, 500);
	
	TweenMax.to(sq1, dur * toSec, {left: maxLeft, ease: Quart.inOut});
	TweenMax.to(sq2, dur * toSec, {left: maxLeft, opacity: 0, [transform]: "scale(0.5)", ease: Quart.inOut});
	TweenMax.to(sq3, dur * toSec, {left: maxLeft, filter: "blur(10px)", [transform]: "rotate(360deg)", ease: Quart.inOut});
	
	TweenMax.to(sq1, dur * toSec, {delay: dur * toSec, left: 10, ease: Quart.inOut});
	TweenMax.to(sq2, dur * toSec, {delay: dur * toSec, left: 10, opacity: 1, [transform]: "scale(1)", ease: Quart.inOut});
	TweenMax.to(sq3, dur * toSec, {delay: dur * toSec, left: 10, filter: "blur(0px)", [transform]: "rotate(0deg)", ease: Quart.inOut});
	
	await plz(dur * 2 * toMs);
		
	await asyncTween(sq1, dur * toSec, {left: maxLeft, ease: Quart.inOut});
	await asyncTween(sq2, dur * toSec, {left: maxLeft, opacity: 0, [transform]: "scale(0.5)", ease: Quart.inOut});
	await asyncTween(sq3, dur * toSec, {left: maxLeft, filter: "blur(10px)", [transform]: "rotate(360deg)", ease: Quart.inOut});
	
	await asyncTween(sq1, dur * toSec, {left: 10, ease: Quart.inOut});
	await asyncTween(sq2, dur * toSec, {left: 10, opacity: 1, [transform]: "scale(1)", ease: Quart.inOut});
	await asyncTween(sq3, dur * toSec, {left: 10, filter: "blur(0px)", [transform]: "rotate(0deg)", ease: Quart.inOut});
	
	console.timeEnd("tween");
	
	TweenMax.to(sq4, dur * toSec * 1.5, {left: Math.min(700, window.innerWidth - 100 - 10), ease: Linear.easeNone});
	await asyncTween(sq4, dur * toSec * 1.5, {top: window.innerHeight - 100, ease: Bounce.easeOut});
	
	[sq1, sq2, sq3, sq4].map(square => TweenMax.to(square, dur * toSec, {opacity: 0, ease: Quart.easeOut}));
	
	document.body.removeChild(sq1);
	document.body.removeChild(sq2);
	document.body.removeChild(sq3);
	document.body.removeChild(sq4);
	
	console.log("done");
}

async function notSimpleTween() {
	let squares = [];
	let nsqw = Math.round(window.innerWidth / sqs);
	let nsqh = Math.round(window.innerHeight / sqs);
	let num = nsqw * nsqh;
	for(let i = 0; i < num; i++) {
		let sq = square((window.innerWidth - sqs) / 2, (window.innerHeight - sqs) / 2, sqs, sqs, i);
		sq.style.backgroundColor = randColor();
		sq.style.filter = "blur(0px)"
		sq.style.zIndex = i;
		sq.style["border-radius"] = "0px";
		document.body.appendChild(sq);
		squares.push(sq);
	}
	squares.reverse();
	
	let dur = 1 * toSec;
	
	await asyncForEach(squares, async (square, index) => {
		let coords = pointAround(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 2 - sqs, window.innerHeight / 2, 360 * index / squares.length * toRadians);
		return asyncTween(square, dur * 2, {left: coords.x - sqs / 2, top: coords.y - sqs / 2, "border-radius": sqs / 2, ease: Quart.inOut});
	});
	await plz(60 * 20);
	squares.map((square, index) => TweenMax.to(square, dur * 90, {left: index % nsqw * sqs, top: Math.floor(index / nsqw) * sqs, "border-radius": 0, ease: Quart.inOut}));
	squares.map((square, index) => TweenMax.to(square, dur * 30, {delay: dur * 90, filter: "blur(10px)", ease: Quart.inOut}));
	squares.map((square, index) => TweenMax.to(square, dur * 30, {delay: dur * 150, filter: "blur(0px)", ease: Quart.inOut}));
	squares.map((square, index) => TweenMax.to(square, dur * 60, {delay: dur * 210, left: randXCoord(), top: randYCoord(), "border-radius": sqs / 2, ease: Quart.inOut}));
	squares.map((square, index) => TweenMax.to(square, dur * 60, {delay: dur * 300, left: (window.innerWidth - sqs) / 2, top: (window.innerHeight - sqs) / 2, "border-radius": 0, opacity: 0.05, ease: Quart.inOut}).play());
	squares.map((square, index) => {
		let coords = pointAround(window.innerWidth  / 2, window.innerHeight / 2, window.innerWidth / 2 - Math.min((window.innerWidth - sqs) / 2, (window.innerHeight - sqs) / 2), window.innerHeight / 2, 360 * index / squares.length * toRadians);
		TweenMax.to(square, dur * 60, {delay: dur * 400, left: coords.x - sqs / 2, top: coords.y - sqs / 2, "border-radius": sqs / 2, opacity: 1, ease: Quart.inOut});
	});
}

async function notSimpleTween2() {
	let squares = [];
	let nsqw = Math.round(window.innerWidth / sqs);
	let nsqh = Math.round(window.innerHeight / sqs);
	let num = nsqw * nsqh;
	for(let i = 0; i < num; i++) {
		let sq = square((window.innerWidth - sqs) / 2, (window.innerHeight - sqs) / 2, sqs, sqs, i);
		sq.style.backgroundColor = randColor();
		sq.style.filter = "blur(0px)"
		sq.style["border-radius"] = "0px";
		sq.style.zIndex = i;
		document.body.appendChild(sq);
		squares.push(sq);
	}
	squares.reverse();
	
	let dur = 1 * toSec;
	
	squares.map((square, index) => {
		let coords = pointAround(window.innerWidth  / 2, window.innerHeight / 2, window.innerWidth / 2 - Math.min((window.innerWidth - sqs - 1) / 2, (window.innerHeight - sqs - 1) / 2), window.innerHeight / 2, 360 * index / squares.length * toRadians);
		TweenMax.to(square, dur * 60, {delay: dur * 40, left: coords.x - sqs / 2, top: coords.y - sqs / 2, "border-radius": sqs / 2, opacity: 1, ease: Quart.inOut});
	});
	squares.map(square => TweenMax.to(square, dur * 60, {delay: dur * 130, left: (window.innerWidth - sqs) / 2, top: (window.innerHeight - sqs) / 2, "border-radius": 0, opacity: 1, ease: Quart.inOut}));
}


async function overrideTest() {
	let sq1 = square(10, 10, 100, 100, 0);
	sq1.style.backgroundColor = "#FF0000";
	document.body.appendChild(sq1);
	
	await new Effect(sq1, {frames: 30, props: {left: "200px"}, ease: "quartInOut"}).play();
	await new Effect(sq1, {frames: 30, props: {left: "10px"}, ease: "quartInOut"}).play();
}