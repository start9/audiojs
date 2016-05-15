(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Audiojs"] = factory();
	else
		root["Audiojs"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var req = __webpack_require__(2);

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
	    for (var _iterator = req.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	        var name = _step.value;


	        var filtered = name.replace(/^.\/|\.js$/g, "");

	        if (filtered === "index") continue;

	        var _module = req(name);
	        var parts = filtered.split("/");

	        var target = exports;

	        for (var t = 0; t < parts.length - 1; ++t) {
	            target = target[parts[t]] = target[parts[t]] || {};
	        }target[parts[parts.length - 1]] = _module[parts[parts.length - 1]];
	    }
	} catch (err) {
	    _didIteratorError = true;
	    _iteratorError = err;
	} finally {
	    try {
	        if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	        }
	    } finally {
	        if (_didIteratorError) {
	            throw _iteratorError;
	        }
	    }
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./AudioServer.js": 3,
		"./Resampler.js": 4,
		"./createAudioServer.js": 5,
		"./extra/AudiojsAudio.js": 7,
		"./implementations/WebAudioServer.js": 6,
		"./index.js": 1
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 2;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.AudioServer = exports.MAGIC_NUM = exports.DEFAULT_SAMPLE_COUNT_PER_CALLBACK = exports.DEFAULT_CHANNEL_COUNT = exports.MAX_SAMPLE_COUNT_PER_CALLBACK = exports.MIN_SAMPLE_COUNT_PER_CALLBACK = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Resampler = __webpack_require__(4);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var MIN_SAMPLE_COUNT_PER_CALLBACK = exports.MIN_SAMPLE_COUNT_PER_CALLBACK = 2048;
	var MAX_SAMPLE_COUNT_PER_CALLBACK = exports.MAX_SAMPLE_COUNT_PER_CALLBACK = 4096;

	var DEFAULT_CHANNEL_COUNT = exports.DEFAULT_CHANNEL_COUNT = 1;
	var DEFAULT_SAMPLE_COUNT_PER_CALLBACK = exports.DEFAULT_SAMPLE_COUNT_PER_CALLBACK = MIN_SAMPLE_COUNT_PER_CALLBACK;

	// https://github.com/taisel/XAudioJS/commit/12116b160d67d736c75388a7780d05311c77774a#diff-8440541ee2e9f7bc08b588c334d05df9R164
	// https://github.com/taisel/XAudioJS/commit/6dd5f53774705c60ca6215ec8ca4937f360a09bc
	var MAGIC_NUM = exports.MAGIC_NUM = 1.000000476837158203125;

	var AudioServer = exports.AudioServer = function () {
	    function AudioServer() {
	        var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	        var inputSampleRate = _ref.inputSampleRate;
	        var outputSampleRate = _ref.outputSampleRate;
	        var _ref$channelCount = _ref.channelCount;
	        var channelCount = _ref$channelCount === undefined ? 1 : _ref$channelCount;
	        var _ref$minBufferSize = _ref.minBufferSize;
	        var minBufferSize = _ref$minBufferSize === undefined ? null : _ref$minBufferSize;
	        var _ref$maxBufferSize = _ref.maxBufferSize;
	        var maxBufferSize = _ref$maxBufferSize === undefined ? null : _ref$maxBufferSize;
	        var _ref$sampleCountPerCa = _ref.sampleCountPerCallback;
	        var sampleCountPerCallback = _ref$sampleCountPerCa === undefined ? MIN_SAMPLE_COUNT_PER_CALLBACK : _ref$sampleCountPerCa;
	        var _ref$formatCallback = _ref.formatCallback;
	        var formatCallback = _ref$formatCallback === undefined ? null : _ref$formatCallback;
	        var _ref$underrunCallback = _ref.underrunCallback;
	        var underrunCallback = _ref$underrunCallback === undefined ? null : _ref$underrunCallback;

	        _classCallCheck(this, AudioServer);

	        if (channelCount < 1) throw new Error('channelCount (' + channelCount + ') shouldn\'t be lower than 1');

	        if (sampleCountPerCallback < MIN_SAMPLE_COUNT_PER_CALLBACK) // eslint-disable-next-line no-console
	            console.warn('sampleCountPerCallback (' + sampleCountPerCallback + ') shouldn\'t be lower than ' + MIN_SAMPLE_COUNT_PER_CALLBACK + ' - silence will be added');

	        if (sampleCountPerCallback > MAX_SAMPLE_COUNT_PER_CALLBACK) // eslint-disable-next-line no-console
	            console.warn('sampleCountPerCallback (' + sampleCountPerCallback + ') shouldn\'t be greater or equal than ' + MAX_SAMPLE_COUNT_PER_CALLBACK + ' - extra samples will be ignored');

	        if (minBufferSize === null) minBufferSize = sampleCountPerCallback * channelCount;

	        if (maxBufferSize === null) maxBufferSize = minBufferSize * channelCount;

	        if (minBufferSize >= maxBufferSize) throw new Error('minBufferSize (' + minBufferSize + ') should be greater than maxBufferSize (' + maxBufferSize + ')');

	        if (isNaN(inputSampleRate)) throw new Error('inputSampleRate cannot be NaN');

	        if (isNaN(outputSampleRate)) throw new Error('outputSampleRate cannot be NaN');

	        this.inputSampleRate = Math.abs(inputSampleRate);
	        this.outputSampleRate = Math.abs(outputSampleRate);

	        this.inputRatio = this.inputSampleRate / this.outputSampleRate;
	        this.outputRatio = this.outputSampleRate / this.inputSampleRate;

	        this.channelCount = channelCount;

	        this.minBufferSize = minBufferSize;
	        this.maxBufferSize = maxBufferSize;

	        this.sampleCountPerCallback = sampleCountPerCallback;

	        this.audioBuffer = new Float32Array(this.maxBufferSize);
	        this.audioBufferSize = 0;

	        this.resampleBufferStart = this.resampleBufferEnd = 0;
	        this.resampleBufferSize = Math.ceil(this.maxBufferSize * this.outputRatio / this.channelCount * MAGIC_NUM) * this.channelCount + this.channelCount;

	        this.resampleBuffer = new Float32Array(this.resampleBufferSize);
	        this.resampleControl = new _Resampler.Resampler({ inputSampleRate: this.inputSampleRate, outputSampleRate: this.outputSampleRate, channelCount: this.channelCount, outputBufferSize: this.resampleBufferSize, returnSlice: false });

	        this.formatCallback = formatCallback;
	        this.underrunCallback = underrunCallback;

	        this.volume = 1.0;
	    }

	    _createClass(AudioServer, [{
	        key: 'setVolume',
	        value: function setVolume(volume) {

	            this.volume = Math.max(0.0, Math.min(volume, 1.0));
	        }
	    }, {
	        key: 'writeAudio',
	        value: function writeAudio(samples) {

	            throw new Error('Not implemented');
	        }
	    }, {
	        key: 'writeAudioNoCallback',
	        value: function writeAudioNoCallback(samples) {

	            throw new Error('Not implemented');
	        }
	    }, {
	        key: 'remainingBuffer',
	        value: function remainingBuffer() {

	            throw new Error('Not implemented');
	        }
	    }, {
	        key: 'executeCallback',
	        value: function executeCallback() {

	            throw new Error('Not implemented');
	        }
	    }, {
	        key: 'refillResampleBuffer',
	        value: function refillResampleBuffer() {

	            if (this.audioBufferSize === 0) return;

	            var resampleLength = this.resampleControl.resample(this.audioBuffer.subarray(0, this.audioBufferSize));
	            var resampleResult = this.resampleControl.outputBuffer;

	            for (var t = 0; t < resampleLength;) {

	                this.resampleBuffer[this.resampleBufferEnd++] = resampleResult[t++];

	                if (this.resampleBufferEnd === this.resampleBufferSize) this.resampleBufferEnd = 0;

	                if (this.resampleBufferStart === this.resampleBufferEnd) {
	                    this.resampleBufferStart += this.channelCount;
	                    if (this.resampleBufferStart === this.resampleBufferSize) {
	                        this.resampleBufferStart = 0;
	                    }
	                }
	            }

	            this.audioBufferSize = 0;
	        }
	    }]);

	    return AudioServer;
	}();

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function range(from, to) {

	    return Array.from(new Array(to - from), function (x, i) {
	        return from + i;
	    });
	}

	function compilePassthroughResampler() {
	    var _this = this;

	    return this.returnSlice ? function (buffer) {

	        return buffer;
	    } : function (buffer) {

	        _this.outputBuffer = buffer;

	        return _this.outputBuffer.length;
	    };
	}

	function compileLinearInterpolationResampler() {
	    var _this2 = this;

	    // eslint-disable-next-line no-new-func
	    return Function("buffer", "\n\n        var bufferLength = buffer.length;\n        var outputLength = this.outputBufferSize;\n\n        if ( bufferLength > 0 ) {\n\n            var weight = this.lastWeight;\n\n            var firstWeight = 0;\n            var secondWeight = 0;\n\n            var inputOffset = 0;\n            var outputOffset = 0;\n\n            for ( ; weight < 1; weight += " + this.ratioWeight + " ) {\n\n                secondWeight = weight % 1;\n                firstWeight = 1 - secondWeight;\n\n                " + range(0, this.channelCount).map(function (t) {
	        return "\n                    this.outputBuffer[ outputOffset ++ ] = ( this.lastOutput[ " + t + " ] * firstWeight ) + ( buffer[ " + t + " ] * secondWeight );\n                ";
	    }).join("") + "\n\n            }\n\n            weight -= 1;\n\n            bufferLength -= " + this.channelCount + ";\n            inputOffset = Math.floor( weight ) * " + this.channelCount + ";\n\n            while ( outputOffset < outputLength && inputOffset < bufferLength ) {\n\n                secondWeight = weight % 1;\n                firstWeight = 1 - secondWeight;\n\n                " + range(0, this.channelCount).map(function (t) {
	        return "\n                    this.outputBuffer[ outputOffset ++ ] = ( buffer[ inputOffset" + (t > 0 ? " + " + t : "") + " ] * firstWeight ) + ( buffer[ inputOffset + " + (_this2.channelCount + t) + " ] * secondWeight );\n                ";
	    }).join("") + "\n\n                weight += " + this.ratioWeight + ";\n                inputOffset = Math.floor( weight ) * " + this.channelCount + ";\n\n            }\n\n            " + range(0, this.channelCount).map(function (t) {
	        return "\n                this.lastOutput[ " + t + " ] = buffer[ inputOffset ++ ];\n            ";
	    }).join("") + "\n\n            this.lastWeight = weight % 1;\n\n            " + (this.returnSlice ? "\n                return this.outputBuffer.subarray( 0, outputOffset );\n            " : "\n                return outputOffset;\n            ") + "\n\n        } else {\n\n            " + (this.returnSlice ? "\n                return this.outputBuffer.subarray( 0, 0 );\n            " : "\n                return 0;\n            ") + "\n\n        }\n\n    ");
	}

	function compileMultiTapResampler() {
	    var _this3 = this;

	    // eslint-disable-next-line no-new-func
	    return Function("buffer", "\n\n        var bufferLength = buffer.length;\n        var outputLength = this.outputBufferSize;\n\n        if ( bufferLength > 0 ) {\n\n            var weight = 0;\n\n            " + range(0, this.channelCount).map(function (t) {
	        return "\n                var output" + t + " = 0;\n            ";
	    }).join("") + "\n\n            var actualPosition = 0;\n            var amountToNext = 0;\n            var alreadyProcessedTail = !this.tailExists;\n            var outputBuffer = this.outputBuffer;\n            var outputOffset = 0;\n            var currentPosition = 0;\n\n            this.tailExists = false;\n\n            do {\n\n                if ( alreadyProcessedTail ) {\n\n                    weight = " + this.ratioWeight + ";\n\n                    " + range(0, this.channelCount).map(function (t) {
	        return "\n                        output" + t + " = 0;\n                    ";
	    }).join("") + "\n\n                } else {\n\n                    alreadyProcessedTail = true;\n                    weight = this.lastWeight;\n\n                    " + range(0, this.channelCount).map(function (t) {
	        return "\n                        output" + t + " = this.lastOutput[ " + t + " ];\n                    ";
	    }).join("") + "\n\n                }\n\n                while ( weight > 0 && actualPosition < bufferLength ) {\n\n                    amountToNext = 1 + actualPosition - currentPosition;\n\n                    if ( weight >= amountToNext ) {\n\n                        " + range(0, this.channelCount).map(function (t) {
	        return "\n                            output" + t + " += buffer[ actualPoition ++ ] * amountToNext;\n                        ";
	    }).join("") + "\n\n                        currentPosition = actualPosition;\n                        weight -= amountToNext;\n\n                    } else {\n\n                        " + range(0, this.channelCount).map(function (t) {
	        return "\n                            output" + t + " += buffer[ actualPosition" + (t > 0 ? " + " + t : "") + " ] * weight;\n                        ";
	    }).join("") + "\n\n                        currentPosition += weight;\n                        weight = 0;\n\n                        break ;\n\n                    }\n\n                    if ( weight <= 0 ) {\n\n                        " + range(0, this.channelCount).map(function (t) {
	        return "\n                            outputBuffer[ outputOffset ++ ] = output" + t + " / " + _this3.ratioWeight + ";\n                        ";
	    }).join("") + "\n\n                    } else {\n\n                        this.lastWeight = weight;\n\n                        " + range(0, this.channelCount).map(function (t) {
	        return "\n                            this.lastOutput[ " + t + " ] = output" + t + ";\n                        ";
	    }).join("") + "\n\n                        this.tailExists = true;\n\n                        break ;\n\n                    }\n\n                }\n\n            } while ( actualPosition < bufferLength && outputOffset < outputLength );\n\n            " + (this.returnSlice ? "\n                return this.outputBuffer.subarray( 0, outputOffset );\n            " : "\n                return outputOffset;\n            ") + "\n\n        } else {\n\n            " + (this.returnSlice ? "\n                return this.outputBuffer.subarray( 0, 0 );\n            " : "\n                return 0;\n            ") + "\n\n        }\n\n    ");
	}

	var Resampler = exports.Resampler = function Resampler() {
	    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    var inputSampleRate = _ref.inputSampleRate;
	    var outputSampleRate = _ref.outputSampleRate;
	    var channelCount = _ref.channelCount;
	    var outputBufferSize = _ref.outputBufferSize;
	    var _ref$returnSlice = _ref.returnSlice;
	    var returnSlice = _ref$returnSlice === undefined ? true : _ref$returnSlice;

	    _classCallCheck(this, Resampler);

	    this.inputSampleRate = inputSampleRate;
	    this.outputSampleRate = outputSampleRate;

	    this.channelCount = channelCount;

	    this.outputBufferSize = outputBufferSize;

	    this.outputBuffer = new Float32Array(this.outputBufferSize);
	    this.lastOutput = new Float32Array(this.channelCount);

	    this.returnSlice = returnSlice;

	    if (this.inputSampleRate === this.outputSampleRate) {

	        this.resample = Reflect.apply(compilePassthroughResampler, this, []);

	        this.ratioWeight = 1;
	    } else {

	        this.ratioWeight = this.inputSampleRate / this.outputSampleRate;

	        if (this.inputSampleRate < this.outputSampleRate) {

	            this.resample = Reflect.apply(compileLinearInterpolationResampler, this, []);

	            this.lastWeight = 1;
	        } else if (this.inputSampleRate > this.outputSampleRate) {

	            this.resample = Reflect.apply(compileMultiTapResampler, this, []);

	            this.tailExists = false;
	            this.lastWeight = 0;
	        }
	    }
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.createAudioServer = createAudioServer;

	var _WebAudioServer = __webpack_require__(6);

	function createAudioServer(options) {

	    return _WebAudioServer.WebAudioServer.create(options);
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.WebAudioServer = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _AudioServer2 = __webpack_require__(3);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var WebAudioServer = exports.WebAudioServer = function (_AudioServer) {
	    _inherits(WebAudioServer, _AudioServer);

	    _createClass(WebAudioServer, null, [{
	        key: 'create',
	        value: function create() {
	            var _arguments = arguments;

	            var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	            var _ref$channelCount = _ref.channelCount;
	            var channelCount = _ref$channelCount === undefined ? _AudioServer2.DEFAULT_CHANNEL_COUNT : _ref$channelCount;
	            var _ref$sampleCountPerCa = _ref.sampleCountPerCallback;
	            var sampleCountPerCallback = _ref$sampleCountPerCa === undefined ? _AudioServer2.DEFAULT_SAMPLE_COUNT_PER_CALLBACK : _ref$sampleCountPerCa;


	            return new Promise(function (resolve, reject) {

	                var context = null;
	                var node = null;

	                try {
	                    context = new AudioContext();
	                } catch (error) {
	                    try {
	                        context = new webkitAudioContext(); // eslint-disable-line new-cap, no-undef
	                    } catch (err) {
	                        return reject(new Error('Cannot initialize context'));
	                    }
	                }

	                try {
	                    node = context.createScriptProcessor(sampleCountPerCallback, 0, channelCount);
	                    node.connect(context.destination);
	                } catch (err) {
	                    try {
	                        node = context.createJavascriptNode(sampleCountPerCallback, 0, channelCount);
	                        node.connect(context.destination);
	                    } catch (err2) {
	                        return reject(new Error('Cannot initialize audio node'));
	                    }
	                }

	                // eslint-disable-next-line prefer-rest-params
	                return resolve(new WebAudioServer(Object.assign({}, _arguments[0], {

	                    webAudioContext: context,
	                    webAudioNode: node,

	                    outputSampleRate: context.sampleRate,

	                    channelCount: channelCount,

	                    sampleCountPerCallback: sampleCountPerCallback

	                })));
	            });
	        }
	    }]);

	    function WebAudioServer(options) {
	        _classCallCheck(this, WebAudioServer);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(WebAudioServer).call(this, options));

	        var webAudioContext = options.webAudioContext;
	        var webAudioNode = options.webAudioNode;


	        _this.webAudioContext = null;
	        _this.webAudioNode = null;

	        _this.webAudioListener = null;

	        _this.attachWebAudioApi(webAudioContext, webAudioNode);

	        return _this;
	    }

	    _createClass(WebAudioServer, [{
	        key: 'attachWebAudioApi',
	        value: function attachWebAudioApi(context, node) {
	            var _this2 = this;

	            this.webAudioContext = context;
	            this.webAudioNode = node;

	            this.webAudioNode.addEventListener('audioprocess', this.webAudioListener = function (e) {

	                var buffers = new Array(_this2.channelCount);

	                for (var t = 0; t < buffers.length; ++t) {
	                    buffers[t] = e.outputBuffer.getChannelData(t);
	                }_this2.refillResampleBuffer();

	                var written = 0;

	                for (; written < _this2.sampleCountPerCallback && _this2.resampleBufferStart !== _this2.resampleBufferEnd; ++written) {

	                    for (var _t = 0; _t < _this2.channelCount; ++_t) {
	                        buffers[_t][written] = _this2.resampleBuffer[_this2.resampleBufferStart++] * _this2.volume;
	                    }if (_this2.resampleBufferStart === _this2.resampleBufferSize) {
	                        _this2.resampleBufferStart = 0;
	                    }
	                }

	                for (; written < _this2.sampleCountPerCallback; ++written) {

	                    for (var _t2 = 0; _t2 < _this2.channelCount; ++_t2) {
	                        buffers[_t2][written] = 0;
	                    }
	                }
	            });
	        }
	    }, {
	        key: 'detachWebAudioApi',
	        value: function detachWebAudioApi() {

	            if (this.webAudioNode) this.webAudioNode.removeEventListener('audioprocess', this.webAudioListener);

	            this.webAudioContext = null;
	            this.webAudioNode = null;
	            this.webAudioListener = null;
	        }
	    }, {
	        key: 'writeAudio',
	        value: function writeAudio(samples) {

	            this.writeAudioNoCallback(samples);
	            this.executeCallback();
	        }
	    }, {
	        key: 'writeAudioNoCallback',
	        value: function writeAudioNoCallback(samples) {

	            var t = 0;

	            if (this.formatCallback) {

	                while (t < samples.length && this.audioBufferSize < this.maxBufferSize) {
	                    this.audioBuffer[this.audioBufferSize++] = this.formatCallback(samples[t++]);
	                }
	            } else {

	                while (t < samples.length && this.audioBufferSize < this.maxBufferSize) {
	                    this.audioBuffer[this.audioBufferSize++] = samples[t++];
	                }
	            }
	        }
	    }, {
	        key: 'remainingBuffer',
	        value: function remainingBuffer() {

	            var resampledSamplesLeft = (this.resampleBufferStart <= this.resampleBufferEnd ? 0 : this.resampleBufferSize) + this.resampleBufferEnd - this.resampleBufferStart;

	            return Math.floor(resampledSamplesLeft * this.resampleControl.ratioWeight / this.channelCount) * this.channelCount + this.audioBufferSize;
	        }
	    }, {
	        key: 'executeCallback',
	        value: function executeCallback() {

	            if (!this.underrunCallback) return;

	            var requestedSampleCount = this.minBufferSize - this.remainingBuffer();

	            if (requestedSampleCount === 0) return;

	            this.writeAudioNoCallback(this.underrunCallback(requestedSampleCount));
	        }
	    }]);

	    return WebAudioServer;
	}(_AudioServer2.AudioServer);

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.AudiojsAudio = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _createAudioServer = __webpack_require__(5);

	function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// Virtjs-compatible
	// http://arcanis.github.io/virtjs/documentation/Audio.html

	var AudiojsAudio = exports.AudiojsAudio = function () {
	    function AudiojsAudio() {
	        var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	        _objectDestructuringEmpty(_ref);

	        _classCallCheck(this, AudiojsAudio);

	        this.volume = 1.0;

	        this.flagstone = null;
	        this.server = null;
	    }

	    _createClass(AudiojsAudio, [{
	        key: 'setVolume',
	        value: function setVolume(volume) {

	            if (this.server) this.server.setVolume(volume);

	            this.volume = volume;
	        }
	    }, {
	        key: 'validateInputFormat',
	        value: function validateInputFormat() {

	            return true;
	        }
	    }, {
	        key: 'setInputFormat',
	        value: function setInputFormat(_ref2) {
	            var _this = this;

	            var sampleRate = _ref2.sampleRate;
	            var channelCount = _ref2.channelCount;
	            var formatCallback = _ref2.formatCallback;


	            var flagstone = this.flagstone = {};

	            (0, _createAudioServer.createAudioServer)({

	                inputSampleRate: sampleRate,

	                channelCount: channelCount,

	                formatCallback: formatCallback

	            }).then(function (server) {

	                if (_this.flagstone !== flagstone) return;

	                _this.server = server;

	                _this.server.setVolume(_this.volume);
	            });
	        }
	    }, {
	        key: 'pushSampleBatch',
	        value: function pushSampleBatch(samples) {

	            if (!this.server) return;

	            this.server.writeAudioNoCallback(samples);
	        }
	    }]);

	    return AudiojsAudio;
	}();

/***/ }
/******/ ])
});
;