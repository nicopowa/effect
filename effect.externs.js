/**
 * @externs
 */

/**
 * @constructor constructor
 * @param {Element} target
 * @param {number} frames
 * @param {Object} props
 * @param {Function=} ease
 * @param {number=} delay
 * @param {boolean=} override
 * @param {Function=} callback
 * @return {Effect}
 */
var Effect = function(target, frames, props, ease, delay, override, callback) {};

/**
 * @method play
 * @return {Promise}
 */
Effect.prototype.play = function() {};

/**
 * @method stop
 * @return {number}
 */
Effect.prototype.stop = function() {};

/**
 * @static
 * @method no
 * @param {number} t
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @return {number}
 */
Effect.no = function(t, b, c, d) {};

/**
 * @static
 * @method quartOut
 * @param {number} t
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @return {number}
 */
Effect.quartOut = function(t, b, c, d) {};

/**
 * @static
 * @method quartIn
 * @param {number} t
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @return {number}
 */
Effect.quartIn = function(t, b, c, d) {};

/**
 * @static
 * @method quartInOut
 * @param {number} t
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @return {number}
 */
Effect.quartInOut = function(t, b, c, d) {};