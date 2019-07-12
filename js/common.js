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
	let styles = window.getComputedStyle(document.documentElement, ""),
		pre = (Array.prototype.slice.call(styles).join("").match(/-(moz|ms|webkit)-/) || (styles.OLink === "" && ["", "o"]))[1],
		dom = ("WebKit|Moz|MS|O").match(new RegExp("(" + pre + ")", "i"))[1];
	return {
		dom: dom,
		lowercase: pre,
		css: "-" + pre + "-",
		js: pre[0].toUpperCase() + pre.substr(1)
	};
})();

const toSec = 1 / 60;
const toMs = 1000 / 60;

const transform = prefix.css + "transform"; // prefixed transform property
const filter = prefix.css + "filter"; // prefixed filter property
const shadow = prefix.css + "box-shadow"; // prefixed shadow property

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