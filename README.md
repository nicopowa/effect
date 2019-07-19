


# Effect

Tiny animation engine

https://nicopr.fr/effect

# Features

 - 2k minified JS
 - 2.3k GZIP (ノಠ益ಠ)ノ彡┻━━┻
 - no CSS
 - easing, delay, override
 - async/await animations > easy timeline

# Why ?
Playing with vanilla JS ice cream since it's hot in Paris these days.

A web page with a menu, a picture and some text doesn't require 2Mb JS code.

# Demo

https://nicopowa.github.io/effect/

# How it works
- play all effects from a single frame loop
- parse css properties
- on each frame: loop effects, properties, and numeric values
- skip frames to preserve time accuracy
- keep track of effects to override or stop (data-eff HTML attribute)

**Animated CSS properties must be initialized on HTML elements before playing effects.**


# How to make it work

    // simple effect
    myElement.style.width = "50px"; // important ! set initial value
    let myEffect = new Effect(myElement, {frames: 60, props: {width: 100}}); // or "100px"
    myEffect.play();

    // async effect
    myElement.style.left= "10px"; // important ! set initial value
    let go = new Effect(myElement, {frames: 60, props: {left: 100}}); // or "100px"
    let back = new Effect(myElement, {frames: 60, props: {left: 10}}); // or "10px"
    await go.play();
    await back.play();
	
# Easing

3 built-in easing functions : quartIn, quartOut, quartInOut

To add custom easing :

    Effect.bounceOut = function(t, b, c, d) {
		if((t /= d) < (1 / 2.75)) return c * (7.5625 * t * t) + b;
		else if(t < (2 / 2.75)) return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
		else if(t < (2.5 / 2.75)) return c * (7.5625 * (t -= (2.25 / 2.75))*t + .9375) + b;
		else return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
	}
    
# Bugs
- iOS Safari animate transform flicker fix :
		
		.animated {
			will-change: transform;
		}

