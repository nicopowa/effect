window.onload = main;

const asyncForEach = async (array, callback) => {
	for(let index = 0; index < array.length; index++) await callback(array[index], index, array);
};

const wait = (ms) => new Promise(r => setTimeout(r, ms));

const toRadians = Math.PI / 180;

function pointAround(centerx, centery, x, y, angle) {
	let x1 = x - centerx;
	let y1 = y - centery;
	let x2 = x1 * Math.cos(angle) - y1 * Math.sin(angle);
	let y2 = x1 * Math.sin(angle) + y1 * Math.cos(angle);
	return {x: x2 + centerx, y: y2 + centery};
}

let sqs = Math.min(window.innerWidth, window.innerHeight) / 10;

var prefix = (function () {
	var styles = window.getComputedStyle(document.documentElement, ""),
		pre = (Array.prototype.slice
			.call(styles)
			.join("")
			.match(/-(moz|ms|webkit)-/) || (styles.OLink === "" && ["", "o"])
		)[1],
		dom = ("WebKit|Moz|MS|O").match(new RegExp("(" + pre + ")", "i"))[1];
	return {
		dom: dom,
		lowercase: pre,
		css: "-" + pre + "-",
		js: pre[0].toUpperCase() + pre.substr(1)
	};
})();

let transform = prefix.css + "transform";

async function main() {
	simple();
	//notSimple();
	//notSimple2();
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

function simple() {
	console.log("main");
	
	let sq1 = square(10, 10, 100, 100, 0);
	sq1.style.backgroundColor = "#FF0000";
	document.body.appendChild(sq1);
	
	let sq2 = square(10, 120, 100, 100, 1);
	sq2.style.backgroundColor = "#00FF00";
	document.body.appendChild(sq2);
	sq2.style.transform = "scale(1)";
	
	let sq3 = square(10, 230, 100, 100, 2);
	sq3.style.backgroundColor = "#0000FF";
	document.body.appendChild(sq3);
	sq3.style.transform = "rotate(0deg)";
	sq3.style.filter = "blur(0px)";
	
	let sq4 = square(10, 340, 100, 100, 2);
	sq4.style.backgroundColor = "#000000";
	document.body.appendChild(sq4);
	
	let dur = 60;
	let maxLeft = Math.min(window.innerWidth - sqs - 10, 500);
	
	new Effect(sq1, {frames: dur, props: {left: maxLeft}, ease: "quartInOut"}).play();
	new Effect(sq2, {frames: dur, props: {left: maxLeft, opacity: 0, [transform]: "scale(0.5)", "transform": "scale(0.5)"}, ease: "quartInOut"}).play();
	new Effect(sq3, {frames: dur, props: {left: maxLeft, filter: "blur(10px)", [transform]: "rotate(360deg)", "transform": "rotate(360deg)"}, ease: "quartInOut"}).play();
	
	new Effect(sq1, {frames: dur, delay: dur, props: {left: 10}, ease: "quartInOut"}).play();
	new Effect(sq2, {frames: dur, delay: dur, props: {left: 10, opacity: 1, [transform]: "scale(1)", "transform": "scale(1)"}, ease: "quartInOut"}).play();
	new Effect(sq3, {frames: dur, delay: dur, props: {left: 10, filter: "blur(0px)", [transform]: "rotate(0deg)", "transform": "rotate(0deg)"}, ease: "quartInOut"}).play();
	
	setTimeout(async function() {
		
		await new Effect(sq1, {frames: dur, props: {left: maxLeft}, ease: "quartInOut"}).play();
		await new Effect(sq2, {frames: dur, props: {left: maxLeft, opacity: 0, [transform]: "scale(0.5)", "transform": "scale(0.5)"}, ease: "quartInOut"}).play();
		await new Effect(sq3, {frames: dur, props: {left: maxLeft, filter: "blur(10px)", [transform]: "rotate(360deg)", "transform": "rotate(360deg)"}, ease: "quartInOut"}).play();
		
		await new Effect(sq1, {frames: dur, props: {left: 10}, ease: "quartInOut"}).play();
		await new Effect(sq2, {frames: dur, props: {left: 10, opacity: 1, [transform]: "scale(1)", "transform": "scale(1)"}, ease: "quartInOut"}).play();
		await new Effect(sq3, {frames: dur, props: {left: 10, filter: "blur(0px)", [transform]: "rotate(0deg)", "transform": "rotate(0deg)"}, ease: "quartInOut"}).play();
		
		new Effect(sq4, {frames: dur * 1.5, props: {left: Math.min(700, window.innerWidth - sqs - 10)}, ease: "no"}).play();
		new Effect(sq4, {frames: dur * 1.5, props: {top: window.innerHeight - sqs}, ease: "bounceOut"}).play();
		
		console.log("done");
		
	}, 120 * 16.6);
}

function randXCoord() {
	return Math.round(Math.random() * (window.innerWidth - sqs));
}

function randYCoord() {
	return Math.round(Math.random() * (window.innerHeight - sqs));
}

function randColor() {
	let color = Math.floor(Math.random() * 16777216).toString(16);
	return "#000000".slice(0, -color.length) + color;
}

async function notSimple() {
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
	
	await asyncForEach(squares, async (square, index) => {
		let coords = pointAround(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 2 - sqs, window.innerHeight / 2, 360 * index / squares.length * toRadians);
		return new Effect(square, {frames: 2, props: {left: coords.x - sqs / 2, top: coords.y - sqs / 2, "border-radius": sqs / 2}, ease: "quartInOut"}).play();
	});
	await wait(60 * 20);
	squares.map((square, index) => new Effect(square, {frames: 90, props: {left: index % nsqw * sqs, top: Math.floor(index / nsqw) * sqs, "border-radius": 0}, ease: "quartInOut"}).play());
	squares.map((square, index) => new Effect(square, {delay: 90, frames: 30, props: {filter: "blur(10px)"}, ease: "quartInOut"}).play());
	squares.map((square, index) => new Effect(square, {delay: 150, frames: 30, props: {filter: "blur(0px)"}, ease: "quartInOut"}).play());
	squares.map((square, index) => new Effect(square, {delay: 210, frames: 60, props: {left: randXCoord(), top: randYCoord(), "border-radius": sqs / 2}, ease: "quartInOut"}).play());
	squares.map((square, index) => new Effect(square, {delay: 300, frames: 60, props: {left: (window.innerWidth - sqs) / 2, top: (window.innerHeight - sqs) / 2, "border-radius": 0, opacity: 0.05}, ease: "quartInOut"}).play());
	squares.map((square, index) => {
		let coords = pointAround(window.innerWidth  / 2, window.innerHeight / 2, window.innerWidth / 2 - Math.min((window.innerWidth - sqs) / 2, (window.innerHeight - sqs) / 2), window.innerHeight / 2, 360 * index / squares.length * toRadians);
		new Effect(square, {delay: 400, frames: 60, props: {left: coords.x - sqs / 2, top: coords.y - sqs / 2, "border-radius": sqs / 2, opacity: 1}, ease: "quartInOut"}).play();
	});
	
}

async function notSimple2() {
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
	
	squares.map((square, index) => {
		let coords = pointAround(window.innerWidth  / 2, window.innerHeight / 2, window.innerWidth / 2 - Math.min((window.innerWidth - sqs - 1) / 2, (window.innerHeight - sqs - 1) / 2), window.innerHeight / 2, 360 * index / squares.length * toRadians);
		new Effect(square, {delay: 40, frames: 60, props: {left: coords.x - sqs / 2, top: coords.y - sqs / 2, "border-radius": sqs / 2, opacity: 1}, ease: "quartInOut"}).play();
	});
	squares.map((square, index) => new Effect(square, {delay: 130, frames: 60, props: {left: (window.innerWidth - sqs) / 2, top: (window.innerHeight - sqs) / 2, "border-radius": 0, opacity: 1}, ease: "quartInOut"}).play());

}