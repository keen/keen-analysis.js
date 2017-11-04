(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global['keen-analysis'] = factory());
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var each_1 = each;

function each(o, cb, s) {
  var n;
  if (!o) {
    return 0;
  }
  s = !s ? o : s;
  if (o instanceof Array) {
    // Indexed arrays, needed for Safari
    for (n = 0; n < o.length; n++) {
      if (cb.call(s, o[n], n, o) === false) {
        return 0;
      }
    }
  } else {
    // Hashtables
    for (n in o) {
      if (o.hasOwnProperty(n)) {
        if (cb.call(s, o[n], n, o) === false) {
          return 0;
        }
      }
    }
  }
  return 1;
}

var extend_1 = extend;

function extend(target) {
  for (var i = 1; i < arguments.length; i++) {
    for (var prop in arguments[i]) {
      target[prop] = arguments[i][prop];
    }
  }
  return target;
}

var parseParams_1 = parseParams;

function parseParams(str) {
  // via: http://stackoverflow.com/a/2880929/2511985
  var urlParams = {},
      match,
      pl = /\+/g,
      // Regex for replacing addition symbol with a space
  search = /([^&=]+)=?([^&]*)/g,
      decode = function decode(s) {
    return decodeURIComponent(s.replace(pl, " "));
  },
      query = str.split("?")[1];

  while (!!(match = search.exec(query))) {
    urlParams[decode(match[1])] = decode(match[2]);
  }
  return urlParams;
}

var serialize_1 = serialize;

function serialize(data) {
  var query = [];
  each_1(data, function (value, key) {
    if ('string' !== typeof value) {
      value = JSON.stringify(value);
    }
    query.push(key + '=' + encodeURIComponent(value));
  });
  return query.join('&');
}

var componentEmitter = createCommonjsModule(function (module) {
  /**
   * Expose `Emitter`.
   */

  {
    module.exports = Emitter;
  }

  /**
   * Initialize a new `Emitter`.
   *
   * @api public
   */

  function Emitter(obj) {
    if (obj) return mixin(obj);
  }

  /**
   * Mixin the emitter properties.
   *
   * @param {Object} obj
   * @return {Object}
   * @api private
   */

  function mixin(obj) {
    for (var key in Emitter.prototype) {
      obj[key] = Emitter.prototype[key];
    }
    return obj;
  }

  /**
   * Listen on the given `event` with `fn`.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */

  Emitter.prototype.on = Emitter.prototype.addEventListener = function (event, fn) {
    this._callbacks = this._callbacks || {};
    (this._callbacks['$' + event] = this._callbacks['$' + event] || []).push(fn);
    return this;
  };

  /**
   * Adds an `event` listener that will be invoked a single
   * time then automatically removed.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */

  Emitter.prototype.once = function (event, fn) {
    function on() {
      this.off(event, on);
      fn.apply(this, arguments);
    }

    on.fn = fn;
    this.on(event, on);
    return this;
  };

  /**
   * Remove the given callback for `event` or all
   * registered callbacks.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */

  Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function (event, fn) {
    this._callbacks = this._callbacks || {};

    // all
    if (0 == arguments.length) {
      this._callbacks = {};
      return this;
    }

    // specific event
    var callbacks = this._callbacks['$' + event];
    if (!callbacks) return this;

    // remove all handlers
    if (1 == arguments.length) {
      delete this._callbacks['$' + event];
      return this;
    }

    // remove specific handler
    var cb;
    for (var i = 0; i < callbacks.length; i++) {
      cb = callbacks[i];
      if (cb === fn || cb.fn === fn) {
        callbacks.splice(i, 1);
        break;
      }
    }
    return this;
  };

  /**
   * Emit `event` with the given args.
   *
   * @param {String} event
   * @param {Mixed} ...
   * @return {Emitter}
   */

  Emitter.prototype.emit = function (event) {
    this._callbacks = this._callbacks || {};
    var args = [].slice.call(arguments, 1),
        callbacks = this._callbacks['$' + event];

    if (callbacks) {
      callbacks = callbacks.slice(0);
      for (var i = 0, len = callbacks.length; i < len; ++i) {
        callbacks[i].apply(this, args);
      }
    }

    return this;
  };

  /**
   * Return array of callbacks for `event`.
   *
   * @param {String} event
   * @return {Array}
   * @api public
   */

  Emitter.prototype.listeners = function (event) {
    this._callbacks = this._callbacks || {};
    return this._callbacks['$' + event] || [];
  };

  /**
   * Check if this emitter has `event` handlers.
   *
   * @param {String} event
   * @return {Boolean}
   * @api public
   */

  Emitter.prototype.hasListeners = function (event) {
    return !!this.listeners(event).length;
  };
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var lib = createCommonjsModule(function (module) {
  (function (env) {
    var previousKeen = env.Keen || undefined;
    var each = each_1,
        extend = extend_1,
        parseParams = parseParams_1,
        serialize = serialize_1;

    var Emitter = componentEmitter;

    function Client(props) {
      if (this instanceof Client === false) {
        return new Client(props);
      }
      this.configure(props);

      // Set up event handling
      if (Client.debug) {
        this.on('error', Client.log);
      }
      this.emit('ready');
      Client.emit('client', this);
    }

    if (previousKeen && typeof previousKeen.resources === 'undefined') {
      Client.legacyVersion = previousKeen;
    }

    Emitter(Client);
    Emitter(Client.prototype);

    extend(Client, {
      debug: false,
      enabled: true,
      loaded: false,
      version: '1.3.0'
    });

    // Set or extend helpers
    Client.helpers = Client.helpers || {};

    // Set or extend resources
    Client.resources = Client.resources || {};
    extend(Client.resources, {
      'base': '{protocol}://{host}',
      'version': '{protocol}://{host}/3.0',
      'projects': '{protocol}://{host}/3.0/projects',
      'projectId': '{protocol}://{host}/3.0/projects/{projectId}',
      'events': '{protocol}://{host}/3.0/projects/{projectId}/events',
      'queries': '{protocol}://{host}/3.0/projects/{projectId}/queries',
      'datasets': '{protocol}://{host}/3.0/projects/{projectId}/datasets'
    });

    // Set or extend utils
    Client.utils = Client.utils || {};
    extend(Client.utils, {
      'each': each,
      'extend': extend,
      'parseParams': parseParams,
      'serialize': serialize
    });

    Client.extendLibrary = function (target, source) {
      var previous = previousKeen || source;
      if (isDefined(previous) && isDefined(previous.resources)) {
        each(previous, function (value, key) {
          if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
            target[key] = target[key] || {};
            extend(target[key], value);
          } else {
            target[key] = target[key] || value;
          }
        });
        extend(target.prototype, previous.prototype);
      }
      return target;
    };

    Client.log = function (str) {
      if (Client.debug && (typeof console === 'undefined' ? 'undefined' : _typeof(console)) === 'object') {
        console.log('[Keen]', str);
      }
    };

    Client.noConflict = function () {
      if (typeof env.Keen !== 'undefined') {
        env.Keen = Client.legacyVersion || previousKeen;
      }
      return Client;
    };

    Client.ready = function (fn) {
      if (Client.loaded) {
        fn();
      } else {
        Client.once('ready', fn);
      }
    };

    Client.prototype.configure = function (obj) {
      var config = obj || {};
      this.config = this.config || {
        projectId: undefined,
        writeKey: undefined,
        host: 'api.keen.io',
        protocol: 'https',
        requestType: 'jsonp',
        resources: extend({}, Client.resources)
      };

      // IE<10 request shim
      if (typeof window !== 'undefined' && window.navigator && window.navigator.userAgent && window.navigator.userAgent.indexOf('MSIE') > -1) {
        config.protocol = document.location.protocol.replace(':', '');
      }

      if (config.host) {
        config.host.replace(/.*?:\/\//g, '');
      }

      extend(this.config, config);
      return this;
    };

    Client.prototype.masterKey = function (str) {
      if (!arguments.length) return this.config.masterKey;
      this.config.masterKey = str ? String(str) : null;
      return this;
    };

    Client.prototype.projectId = function (str) {
      if (!arguments.length) return this.config.projectId;
      this.config.projectId = str ? String(str) : null;
      return this;
    };

    Client.prototype.resources = function (obj) {
      if (!arguments.length) return this.config.resources;
      var self = this;
      if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
        each(obj, function (value, key) {
          self.config.resources[key] = value ? value : null;
        });
      }
      return self;
    };

    Client.prototype.url = function (name) {
      var args = Array.prototype.slice.call(arguments, 1),
          baseUrl = this.config.resources.base || '{protocol}://{host}',
          path;

      if (name && typeof name === 'string') {
        if (this.config.resources[name]) {
          path = this.config.resources[name];
        } else {
          path = baseUrl + name;
        }
      } else {
        path = baseUrl;
      }

      each(this.config, function (value, key) {
        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
          path = path.replace('{' + key + '}', value);
        }
      });

      each(args, function (arg, i) {
        if (typeof arg === 'string') {
          path += '/' + arg;
        } else if ((typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object') {
          path += '?';
          each(arg, function (value, key) {
            path += key + '=' + value + '&';
          });
          path = path.slice(0, -1);
        }
      });

      return path;
    };

    domReady(function () {
      Client.loaded = true;
      Client.emit('ready');
    });

    function domReady(fn) {
      if (Client.loaded || typeof document === 'undefined') {
        fn();
        return;
      }
      // Firefox 3.5 shim
      if (document.readyState == null && document.addEventListener) {
        document.addEventListener('DOMContentLoaded', function DOMContentLoaded() {
          document.removeEventListener('DOMContentLoaded', DOMContentLoaded, false);
          document.readyState = 'complete';
        }, false);
        document.readyState = 'loading';
      }
      testDom(fn);
    }

    function testDom(fn) {
      if (/in/.test(document.readyState)) {
        setTimeout(function () {
          testDom(fn);
        }, 9);
      } else {
        fn();
      }
    }

    function isDefined(target) {
      return typeof target !== 'undefined';
    }

    module.exports = Client;
  }).call(commonjsGlobal, typeof window !== 'undefined' ? window : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof self !== 'undefined' ? self : {});
});

var bluebird_core = createCommonjsModule(function (module, exports) {
    /* @preserve
     * The MIT License (MIT)
     * 
     * Copyright (c) 2013-2017 Petka Antonov
     * 
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     * 
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     * 
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     * 
     */
    /**
     * bluebird build version 3.5.1
     * Features enabled: core
     * Features disabled: race, call_get, generators, map, nodeify, promisify, props, reduce, settle, some, using, timers, filter, any, each
    */
    !function (e) {
        module.exports = e();
    }(function () {
        return function e(t, n, r) {
            function s(o, u) {
                if (!n[o]) {
                    if (!t[o]) {
                        var a = typeof _dereq_ == "function" && _dereq_;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
                    }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
                        var n = t[o][1][e];return s(n ? n : e);
                    }, l, l.exports, e, t, n, r);
                }return n[o].exports;
            }var i = typeof _dereq_ == "function" && _dereq_;for (var o = 0; o < r.length; o++) {
                s(r[o]);
            }return s;
        }({ 1: [function (_dereq_, module, exports) {
                "use strict";

                var firstLineError;
                try {
                    throw new Error();
                } catch (e) {
                    firstLineError = e;
                }
                var schedule = _dereq_("./schedule");
                var Queue = _dereq_("./queue");
                var util = _dereq_("./util");

                function Async() {
                    this._customScheduler = false;
                    this._isTickUsed = false;
                    this._lateQueue = new Queue(16);
                    this._normalQueue = new Queue(16);
                    this._haveDrainedQueues = false;
                    this._trampolineEnabled = true;
                    var self = this;
                    this.drainQueues = function () {
                        self._drainQueues();
                    };
                    this._schedule = schedule;
                }

                Async.prototype.setScheduler = function (fn) {
                    var prev = this._schedule;
                    this._schedule = fn;
                    this._customScheduler = true;
                    return prev;
                };

                Async.prototype.hasCustomScheduler = function () {
                    return this._customScheduler;
                };

                Async.prototype.enableTrampoline = function () {
                    this._trampolineEnabled = true;
                };

                Async.prototype.disableTrampolineIfNecessary = function () {
                    if (util.hasDevTools) {
                        this._trampolineEnabled = false;
                    }
                };

                Async.prototype.haveItemsQueued = function () {
                    return this._isTickUsed || this._haveDrainedQueues;
                };

                Async.prototype.fatalError = function (e, isNode) {
                    if (isNode) {
                        process.stderr.write("Fatal " + (e instanceof Error ? e.stack : e) + "\n");
                        process.exit(2);
                    } else {
                        this.throwLater(e);
                    }
                };

                Async.prototype.throwLater = function (fn, arg) {
                    if (arguments.length === 1) {
                        arg = fn;
                        fn = function fn() {
                            throw arg;
                        };
                    }
                    if (typeof setTimeout !== "undefined") {
                        setTimeout(function () {
                            fn(arg);
                        }, 0);
                    } else try {
                        this._schedule(function () {
                            fn(arg);
                        });
                    } catch (e) {
                        throw new Error('No async scheduler available\n\n    See http://goo.gl/MqrFmX\n');
                    }
                };

                function AsyncInvokeLater(fn, receiver, arg) {
                    this._lateQueue.push(fn, receiver, arg);
                    this._queueTick();
                }

                function AsyncInvoke(fn, receiver, arg) {
                    this._normalQueue.push(fn, receiver, arg);
                    this._queueTick();
                }

                function AsyncSettlePromises(promise) {
                    this._normalQueue._pushOne(promise);
                    this._queueTick();
                }

                if (!util.hasDevTools) {
                    Async.prototype.invokeLater = AsyncInvokeLater;
                    Async.prototype.invoke = AsyncInvoke;
                    Async.prototype.settlePromises = AsyncSettlePromises;
                } else {
                    Async.prototype.invokeLater = function (fn, receiver, arg) {
                        if (this._trampolineEnabled) {
                            AsyncInvokeLater.call(this, fn, receiver, arg);
                        } else {
                            this._schedule(function () {
                                setTimeout(function () {
                                    fn.call(receiver, arg);
                                }, 100);
                            });
                        }
                    };

                    Async.prototype.invoke = function (fn, receiver, arg) {
                        if (this._trampolineEnabled) {
                            AsyncInvoke.call(this, fn, receiver, arg);
                        } else {
                            this._schedule(function () {
                                fn.call(receiver, arg);
                            });
                        }
                    };

                    Async.prototype.settlePromises = function (promise) {
                        if (this._trampolineEnabled) {
                            AsyncSettlePromises.call(this, promise);
                        } else {
                            this._schedule(function () {
                                promise._settlePromises();
                            });
                        }
                    };
                }

                Async.prototype._drainQueue = function (queue) {
                    while (queue.length() > 0) {
                        var fn = queue.shift();
                        if (typeof fn !== "function") {
                            fn._settlePromises();
                            continue;
                        }
                        var receiver = queue.shift();
                        var arg = queue.shift();
                        fn.call(receiver, arg);
                    }
                };

                Async.prototype._drainQueues = function () {
                    this._drainQueue(this._normalQueue);
                    this._reset();
                    this._haveDrainedQueues = true;
                    this._drainQueue(this._lateQueue);
                };

                Async.prototype._queueTick = function () {
                    if (!this._isTickUsed) {
                        this._isTickUsed = true;
                        this._schedule(this.drainQueues);
                    }
                };

                Async.prototype._reset = function () {
                    this._isTickUsed = false;
                };

                module.exports = Async;
                module.exports.firstLineError = firstLineError;
            }, { "./queue": 17, "./schedule": 18, "./util": 21 }], 2: [function (_dereq_, module, exports) {
                "use strict";

                module.exports = function (Promise, INTERNAL, tryConvertToPromise, debug) {
                    var calledBind = false;
                    var rejectThis = function rejectThis(_, e) {
                        this._reject(e);
                    };

                    var targetRejected = function targetRejected(e, context) {
                        context.promiseRejectionQueued = true;
                        context.bindingPromise._then(rejectThis, rejectThis, null, this, e);
                    };

                    var bindingResolved = function bindingResolved(thisArg, context) {
                        if ((this._bitField & 50397184) === 0) {
                            this._resolveCallback(context.target);
                        }
                    };

                    var bindingRejected = function bindingRejected(e, context) {
                        if (!context.promiseRejectionQueued) this._reject(e);
                    };

                    Promise.prototype.bind = function (thisArg) {
                        if (!calledBind) {
                            calledBind = true;
                            Promise.prototype._propagateFrom = debug.propagateFromFunction();
                            Promise.prototype._boundValue = debug.boundValueFunction();
                        }
                        var maybePromise = tryConvertToPromise(thisArg);
                        var ret = new Promise(INTERNAL);
                        ret._propagateFrom(this, 1);
                        var target = this._target();
                        ret._setBoundTo(maybePromise);
                        if (maybePromise instanceof Promise) {
                            var context = {
                                promiseRejectionQueued: false,
                                promise: ret,
                                target: target,
                                bindingPromise: maybePromise
                            };
                            target._then(INTERNAL, targetRejected, undefined, ret, context);
                            maybePromise._then(bindingResolved, bindingRejected, undefined, ret, context);
                            ret._setOnCancel(maybePromise);
                        } else {
                            ret._resolveCallback(target);
                        }
                        return ret;
                    };

                    Promise.prototype._setBoundTo = function (obj) {
                        if (obj !== undefined) {
                            this._bitField = this._bitField | 2097152;
                            this._boundTo = obj;
                        } else {
                            this._bitField = this._bitField & ~2097152;
                        }
                    };

                    Promise.prototype._isBound = function () {
                        return (this._bitField & 2097152) === 2097152;
                    };

                    Promise.bind = function (thisArg, value) {
                        return Promise.resolve(value).bind(thisArg);
                    };
                };
            }, {}], 3: [function (_dereq_, module, exports) {
                "use strict";

                var old;
                if (typeof Promise !== "undefined") old = Promise;
                function noConflict() {
                    try {
                        if (Promise === bluebird) Promise = old;
                    } catch (e) {}
                    return bluebird;
                }
                var bluebird = _dereq_("./promise")();
                bluebird.noConflict = noConflict;
                module.exports = bluebird;
            }, { "./promise": 15 }], 4: [function (_dereq_, module, exports) {
                "use strict";

                module.exports = function (Promise, PromiseArray, apiRejection, debug) {
                    var util = _dereq_("./util");
                    var tryCatch = util.tryCatch;
                    var errorObj = util.errorObj;
                    var async = Promise._async;

                    Promise.prototype["break"] = Promise.prototype.cancel = function () {
                        if (!debug.cancellation()) return this._warn("cancellation is disabled");

                        var promise = this;
                        var child = promise;
                        while (promise._isCancellable()) {
                            if (!promise._cancelBy(child)) {
                                if (child._isFollowing()) {
                                    child._followee().cancel();
                                } else {
                                    child._cancelBranched();
                                }
                                break;
                            }

                            var parent = promise._cancellationParent;
                            if (parent == null || !parent._isCancellable()) {
                                if (promise._isFollowing()) {
                                    promise._followee().cancel();
                                } else {
                                    promise._cancelBranched();
                                }
                                break;
                            } else {
                                if (promise._isFollowing()) promise._followee().cancel();
                                promise._setWillBeCancelled();
                                child = promise;
                                promise = parent;
                            }
                        }
                    };

                    Promise.prototype._branchHasCancelled = function () {
                        this._branchesRemainingToCancel--;
                    };

                    Promise.prototype._enoughBranchesHaveCancelled = function () {
                        return this._branchesRemainingToCancel === undefined || this._branchesRemainingToCancel <= 0;
                    };

                    Promise.prototype._cancelBy = function (canceller) {
                        if (canceller === this) {
                            this._branchesRemainingToCancel = 0;
                            this._invokeOnCancel();
                            return true;
                        } else {
                            this._branchHasCancelled();
                            if (this._enoughBranchesHaveCancelled()) {
                                this._invokeOnCancel();
                                return true;
                            }
                        }
                        return false;
                    };

                    Promise.prototype._cancelBranched = function () {
                        if (this._enoughBranchesHaveCancelled()) {
                            this._cancel();
                        }
                    };

                    Promise.prototype._cancel = function () {
                        if (!this._isCancellable()) return;
                        this._setCancelled();
                        async.invoke(this._cancelPromises, this, undefined);
                    };

                    Promise.prototype._cancelPromises = function () {
                        if (this._length() > 0) this._settlePromises();
                    };

                    Promise.prototype._unsetOnCancel = function () {
                        this._onCancelField = undefined;
                    };

                    Promise.prototype._isCancellable = function () {
                        return this.isPending() && !this._isCancelled();
                    };

                    Promise.prototype.isCancellable = function () {
                        return this.isPending() && !this.isCancelled();
                    };

                    Promise.prototype._doInvokeOnCancel = function (onCancelCallback, internalOnly) {
                        if (util.isArray(onCancelCallback)) {
                            for (var i = 0; i < onCancelCallback.length; ++i) {
                                this._doInvokeOnCancel(onCancelCallback[i], internalOnly);
                            }
                        } else if (onCancelCallback !== undefined) {
                            if (typeof onCancelCallback === "function") {
                                if (!internalOnly) {
                                    var e = tryCatch(onCancelCallback).call(this._boundValue());
                                    if (e === errorObj) {
                                        this._attachExtraTrace(e.e);
                                        async.throwLater(e.e);
                                    }
                                }
                            } else {
                                onCancelCallback._resultCancelled(this);
                            }
                        }
                    };

                    Promise.prototype._invokeOnCancel = function () {
                        var onCancelCallback = this._onCancel();
                        this._unsetOnCancel();
                        async.invoke(this._doInvokeOnCancel, this, onCancelCallback);
                    };

                    Promise.prototype._invokeInternalOnCancel = function () {
                        if (this._isCancellable()) {
                            this._doInvokeOnCancel(this._onCancel(), true);
                            this._unsetOnCancel();
                        }
                    };

                    Promise.prototype._resultCancelled = function () {
                        this.cancel();
                    };
                };
            }, { "./util": 21 }], 5: [function (_dereq_, module, exports) {
                "use strict";

                module.exports = function (NEXT_FILTER) {
                    var util = _dereq_("./util");
                    var getKeys = _dereq_("./es5").keys;
                    var tryCatch = util.tryCatch;
                    var errorObj = util.errorObj;

                    function catchFilter(instances, cb, promise) {
                        return function (e) {
                            var boundTo = promise._boundValue();
                            predicateLoop: for (var i = 0; i < instances.length; ++i) {
                                var item = instances[i];

                                if (item === Error || item != null && item.prototype instanceof Error) {
                                    if (e instanceof item) {
                                        return tryCatch(cb).call(boundTo, e);
                                    }
                                } else if (typeof item === "function") {
                                    var matchesPredicate = tryCatch(item).call(boundTo, e);
                                    if (matchesPredicate === errorObj) {
                                        return matchesPredicate;
                                    } else if (matchesPredicate) {
                                        return tryCatch(cb).call(boundTo, e);
                                    }
                                } else if (util.isObject(e)) {
                                    var keys = getKeys(item);
                                    for (var j = 0; j < keys.length; ++j) {
                                        var key = keys[j];
                                        if (item[key] != e[key]) {
                                            continue predicateLoop;
                                        }
                                    }
                                    return tryCatch(cb).call(boundTo, e);
                                }
                            }
                            return NEXT_FILTER;
                        };
                    }

                    return catchFilter;
                };
            }, { "./es5": 10, "./util": 21 }], 6: [function (_dereq_, module, exports) {
                "use strict";

                module.exports = function (Promise) {
                    var longStackTraces = false;
                    var contextStack = [];

                    Promise.prototype._promiseCreated = function () {};
                    Promise.prototype._pushContext = function () {};
                    Promise.prototype._popContext = function () {
                        return null;
                    };
                    Promise._peekContext = Promise.prototype._peekContext = function () {};

                    function Context() {
                        this._trace = new Context.CapturedTrace(peekContext());
                    }
                    Context.prototype._pushContext = function () {
                        if (this._trace !== undefined) {
                            this._trace._promiseCreated = null;
                            contextStack.push(this._trace);
                        }
                    };

                    Context.prototype._popContext = function () {
                        if (this._trace !== undefined) {
                            var trace = contextStack.pop();
                            var ret = trace._promiseCreated;
                            trace._promiseCreated = null;
                            return ret;
                        }
                        return null;
                    };

                    function createContext() {
                        if (longStackTraces) return new Context();
                    }

                    function peekContext() {
                        var lastIndex = contextStack.length - 1;
                        if (lastIndex >= 0) {
                            return contextStack[lastIndex];
                        }
                        return undefined;
                    }
                    Context.CapturedTrace = null;
                    Context.create = createContext;
                    Context.deactivateLongStackTraces = function () {};
                    Context.activateLongStackTraces = function () {
                        var Promise_pushContext = Promise.prototype._pushContext;
                        var Promise_popContext = Promise.prototype._popContext;
                        var Promise_PeekContext = Promise._peekContext;
                        var Promise_peekContext = Promise.prototype._peekContext;
                        var Promise_promiseCreated = Promise.prototype._promiseCreated;
                        Context.deactivateLongStackTraces = function () {
                            Promise.prototype._pushContext = Promise_pushContext;
                            Promise.prototype._popContext = Promise_popContext;
                            Promise._peekContext = Promise_PeekContext;
                            Promise.prototype._peekContext = Promise_peekContext;
                            Promise.prototype._promiseCreated = Promise_promiseCreated;
                            longStackTraces = false;
                        };
                        longStackTraces = true;
                        Promise.prototype._pushContext = Context.prototype._pushContext;
                        Promise.prototype._popContext = Context.prototype._popContext;
                        Promise._peekContext = Promise.prototype._peekContext = peekContext;
                        Promise.prototype._promiseCreated = function () {
                            var ctx = this._peekContext();
                            if (ctx && ctx._promiseCreated == null) ctx._promiseCreated = this;
                        };
                    };
                    return Context;
                };
            }, {}], 7: [function (_dereq_, module, exports) {
                "use strict";

                module.exports = function (Promise, Context) {
                    var getDomain = Promise._getDomain;
                    var async = Promise._async;
                    var Warning = _dereq_("./errors").Warning;
                    var util = _dereq_("./util");
                    var canAttachTrace = util.canAttachTrace;
                    var unhandledRejectionHandled;
                    var possiblyUnhandledRejection;
                    var bluebirdFramePattern = /[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/;
                    var nodeFramePattern = /\((?:timers\.js):\d+:\d+\)/;
                    var parseLinePattern = /[\/<\(](.+?):(\d+):(\d+)\)?\s*$/;
                    var stackFramePattern = null;
                    var formatStack = null;
                    var indentStackFrames = false;
                    var printWarning;
                    var debugging = !!(util.env("BLUEBIRD_DEBUG") != 0 && (true || util.env("BLUEBIRD_DEBUG") || util.env("NODE_ENV") === "development"));

                    var warnings = !!(util.env("BLUEBIRD_WARNINGS") != 0 && (debugging || util.env("BLUEBIRD_WARNINGS")));

                    var longStackTraces = !!(util.env("BLUEBIRD_LONG_STACK_TRACES") != 0 && (debugging || util.env("BLUEBIRD_LONG_STACK_TRACES")));

                    var wForgottenReturn = util.env("BLUEBIRD_W_FORGOTTEN_RETURN") != 0 && (warnings || !!util.env("BLUEBIRD_W_FORGOTTEN_RETURN"));

                    Promise.prototype.suppressUnhandledRejections = function () {
                        var target = this._target();
                        target._bitField = target._bitField & ~1048576 | 524288;
                    };

                    Promise.prototype._ensurePossibleRejectionHandled = function () {
                        if ((this._bitField & 524288) !== 0) return;
                        this._setRejectionIsUnhandled();
                        var self = this;
                        setTimeout(function () {
                            self._notifyUnhandledRejection();
                        }, 1);
                    };

                    Promise.prototype._notifyUnhandledRejectionIsHandled = function () {
                        fireRejectionEvent("rejectionHandled", unhandledRejectionHandled, undefined, this);
                    };

                    Promise.prototype._setReturnedNonUndefined = function () {
                        this._bitField = this._bitField | 268435456;
                    };

                    Promise.prototype._returnedNonUndefined = function () {
                        return (this._bitField & 268435456) !== 0;
                    };

                    Promise.prototype._notifyUnhandledRejection = function () {
                        if (this._isRejectionUnhandled()) {
                            var reason = this._settledValue();
                            this._setUnhandledRejectionIsNotified();
                            fireRejectionEvent("unhandledRejection", possiblyUnhandledRejection, reason, this);
                        }
                    };

                    Promise.prototype._setUnhandledRejectionIsNotified = function () {
                        this._bitField = this._bitField | 262144;
                    };

                    Promise.prototype._unsetUnhandledRejectionIsNotified = function () {
                        this._bitField = this._bitField & ~262144;
                    };

                    Promise.prototype._isUnhandledRejectionNotified = function () {
                        return (this._bitField & 262144) > 0;
                    };

                    Promise.prototype._setRejectionIsUnhandled = function () {
                        this._bitField = this._bitField | 1048576;
                    };

                    Promise.prototype._unsetRejectionIsUnhandled = function () {
                        this._bitField = this._bitField & ~1048576;
                        if (this._isUnhandledRejectionNotified()) {
                            this._unsetUnhandledRejectionIsNotified();
                            this._notifyUnhandledRejectionIsHandled();
                        }
                    };

                    Promise.prototype._isRejectionUnhandled = function () {
                        return (this._bitField & 1048576) > 0;
                    };

                    Promise.prototype._warn = function (message, shouldUseOwnTrace, promise) {
                        return warn(message, shouldUseOwnTrace, promise || this);
                    };

                    Promise.onPossiblyUnhandledRejection = function (fn) {
                        var domain = getDomain();
                        possiblyUnhandledRejection = typeof fn === "function" ? domain === null ? fn : util.domainBind(domain, fn) : undefined;
                    };

                    Promise.onUnhandledRejectionHandled = function (fn) {
                        var domain = getDomain();
                        unhandledRejectionHandled = typeof fn === "function" ? domain === null ? fn : util.domainBind(domain, fn) : undefined;
                    };

                    var disableLongStackTraces = function disableLongStackTraces() {};
                    Promise.longStackTraces = function () {
                        if (async.haveItemsQueued() && !config.longStackTraces) {
                            throw new Error('cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n');
                        }
                        if (!config.longStackTraces && longStackTracesIsSupported()) {
                            var Promise_captureStackTrace = Promise.prototype._captureStackTrace;
                            var Promise_attachExtraTrace = Promise.prototype._attachExtraTrace;
                            config.longStackTraces = true;
                            disableLongStackTraces = function disableLongStackTraces() {
                                if (async.haveItemsQueued() && !config.longStackTraces) {
                                    throw new Error('cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n');
                                }
                                Promise.prototype._captureStackTrace = Promise_captureStackTrace;
                                Promise.prototype._attachExtraTrace = Promise_attachExtraTrace;
                                Context.deactivateLongStackTraces();
                                async.enableTrampoline();
                                config.longStackTraces = false;
                            };
                            Promise.prototype._captureStackTrace = longStackTracesCaptureStackTrace;
                            Promise.prototype._attachExtraTrace = longStackTracesAttachExtraTrace;
                            Context.activateLongStackTraces();
                            async.disableTrampolineIfNecessary();
                        }
                    };

                    Promise.hasLongStackTraces = function () {
                        return config.longStackTraces && longStackTracesIsSupported();
                    };

                    var fireDomEvent = function () {
                        try {
                            if (typeof CustomEvent === "function") {
                                var event = new CustomEvent("CustomEvent");
                                util.global.dispatchEvent(event);
                                return function (name, event) {
                                    var domEvent = new CustomEvent(name.toLowerCase(), {
                                        detail: event,
                                        cancelable: true
                                    });
                                    return !util.global.dispatchEvent(domEvent);
                                };
                            } else if (typeof Event === "function") {
                                var event = new Event("CustomEvent");
                                util.global.dispatchEvent(event);
                                return function (name, event) {
                                    var domEvent = new Event(name.toLowerCase(), {
                                        cancelable: true
                                    });
                                    domEvent.detail = event;
                                    return !util.global.dispatchEvent(domEvent);
                                };
                            } else {
                                var event = document.createEvent("CustomEvent");
                                event.initCustomEvent("testingtheevent", false, true, {});
                                util.global.dispatchEvent(event);
                                return function (name, event) {
                                    var domEvent = document.createEvent("CustomEvent");
                                    domEvent.initCustomEvent(name.toLowerCase(), false, true, event);
                                    return !util.global.dispatchEvent(domEvent);
                                };
                            }
                        } catch (e) {}
                        return function () {
                            return false;
                        };
                    }();

                    var fireGlobalEvent = function () {
                        if (util.isNode) {
                            return function () {
                                return process.emit.apply(process, arguments);
                            };
                        } else {
                            if (!util.global) {
                                return function () {
                                    return false;
                                };
                            }
                            return function (name) {
                                var methodName = "on" + name.toLowerCase();
                                var method = util.global[methodName];
                                if (!method) return false;
                                method.apply(util.global, [].slice.call(arguments, 1));
                                return true;
                            };
                        }
                    }();

                    function generatePromiseLifecycleEventObject(name, promise) {
                        return { promise: promise };
                    }

                    var eventToObjectGenerator = {
                        promiseCreated: generatePromiseLifecycleEventObject,
                        promiseFulfilled: generatePromiseLifecycleEventObject,
                        promiseRejected: generatePromiseLifecycleEventObject,
                        promiseResolved: generatePromiseLifecycleEventObject,
                        promiseCancelled: generatePromiseLifecycleEventObject,
                        promiseChained: function promiseChained(name, promise, child) {
                            return { promise: promise, child: child };
                        },
                        warning: function warning(name, _warning) {
                            return { warning: _warning };
                        },
                        unhandledRejection: function unhandledRejection(name, reason, promise) {
                            return { reason: reason, promise: promise };
                        },
                        rejectionHandled: generatePromiseLifecycleEventObject
                    };

                    var activeFireEvent = function activeFireEvent(name) {
                        var globalEventFired = false;
                        try {
                            globalEventFired = fireGlobalEvent.apply(null, arguments);
                        } catch (e) {
                            async.throwLater(e);
                            globalEventFired = true;
                        }

                        var domEventFired = false;
                        try {
                            domEventFired = fireDomEvent(name, eventToObjectGenerator[name].apply(null, arguments));
                        } catch (e) {
                            async.throwLater(e);
                            domEventFired = true;
                        }

                        return domEventFired || globalEventFired;
                    };

                    Promise.config = function (opts) {
                        opts = Object(opts);
                        if ("longStackTraces" in opts) {
                            if (opts.longStackTraces) {
                                Promise.longStackTraces();
                            } else if (!opts.longStackTraces && Promise.hasLongStackTraces()) {
                                disableLongStackTraces();
                            }
                        }
                        if ("warnings" in opts) {
                            var warningsOption = opts.warnings;
                            config.warnings = !!warningsOption;
                            wForgottenReturn = config.warnings;

                            if (util.isObject(warningsOption)) {
                                if ("wForgottenReturn" in warningsOption) {
                                    wForgottenReturn = !!warningsOption.wForgottenReturn;
                                }
                            }
                        }
                        if ("cancellation" in opts && opts.cancellation && !config.cancellation) {
                            if (async.haveItemsQueued()) {
                                throw new Error("cannot enable cancellation after promises are in use");
                            }
                            Promise.prototype._clearCancellationData = cancellationClearCancellationData;
                            Promise.prototype._propagateFrom = cancellationPropagateFrom;
                            Promise.prototype._onCancel = cancellationOnCancel;
                            Promise.prototype._setOnCancel = cancellationSetOnCancel;
                            Promise.prototype._attachCancellationCallback = cancellationAttachCancellationCallback;
                            Promise.prototype._execute = cancellationExecute;
                            _propagateFromFunction = cancellationPropagateFrom;
                            config.cancellation = true;
                        }
                        if ("monitoring" in opts) {
                            if (opts.monitoring && !config.monitoring) {
                                config.monitoring = true;
                                Promise.prototype._fireEvent = activeFireEvent;
                            } else if (!opts.monitoring && config.monitoring) {
                                config.monitoring = false;
                                Promise.prototype._fireEvent = defaultFireEvent;
                            }
                        }
                        return Promise;
                    };

                    function defaultFireEvent() {
                        return false;
                    }

                    Promise.prototype._fireEvent = defaultFireEvent;
                    Promise.prototype._execute = function (executor, resolve, reject) {
                        try {
                            executor(resolve, reject);
                        } catch (e) {
                            return e;
                        }
                    };
                    Promise.prototype._onCancel = function () {};
                    Promise.prototype._setOnCancel = function (handler) {
                        
                    };
                    Promise.prototype._attachCancellationCallback = function (onCancel) {
                        
                    };
                    Promise.prototype._captureStackTrace = function () {};
                    Promise.prototype._attachExtraTrace = function () {};
                    Promise.prototype._clearCancellationData = function () {};
                    Promise.prototype._propagateFrom = function (parent, flags) {
                        
                        
                    };

                    function cancellationExecute(executor, resolve, reject) {
                        var promise = this;
                        try {
                            executor(resolve, reject, function (onCancel) {
                                if (typeof onCancel !== "function") {
                                    throw new TypeError("onCancel must be a function, got: " + util.toString(onCancel));
                                }
                                promise._attachCancellationCallback(onCancel);
                            });
                        } catch (e) {
                            return e;
                        }
                    }

                    function cancellationAttachCancellationCallback(onCancel) {
                        if (!this._isCancellable()) return this;

                        var previousOnCancel = this._onCancel();
                        if (previousOnCancel !== undefined) {
                            if (util.isArray(previousOnCancel)) {
                                previousOnCancel.push(onCancel);
                            } else {
                                this._setOnCancel([previousOnCancel, onCancel]);
                            }
                        } else {
                            this._setOnCancel(onCancel);
                        }
                    }

                    function cancellationOnCancel() {
                        return this._onCancelField;
                    }

                    function cancellationSetOnCancel(onCancel) {
                        this._onCancelField = onCancel;
                    }

                    function cancellationClearCancellationData() {
                        this._cancellationParent = undefined;
                        this._onCancelField = undefined;
                    }

                    function cancellationPropagateFrom(parent, flags) {
                        if ((flags & 1) !== 0) {
                            this._cancellationParent = parent;
                            var branchesRemainingToCancel = parent._branchesRemainingToCancel;
                            if (branchesRemainingToCancel === undefined) {
                                branchesRemainingToCancel = 0;
                            }
                            parent._branchesRemainingToCancel = branchesRemainingToCancel + 1;
                        }
                        if ((flags & 2) !== 0 && parent._isBound()) {
                            this._setBoundTo(parent._boundTo);
                        }
                    }

                    function bindingPropagateFrom(parent, flags) {
                        if ((flags & 2) !== 0 && parent._isBound()) {
                            this._setBoundTo(parent._boundTo);
                        }
                    }
                    var _propagateFromFunction = bindingPropagateFrom;

                    function _boundValueFunction() {
                        var ret = this._boundTo;
                        if (ret !== undefined) {
                            if (ret instanceof Promise) {
                                if (ret.isFulfilled()) {
                                    return ret.value();
                                } else {
                                    return undefined;
                                }
                            }
                        }
                        return ret;
                    }

                    function longStackTracesCaptureStackTrace() {
                        this._trace = new CapturedTrace(this._peekContext());
                    }

                    function longStackTracesAttachExtraTrace(error, ignoreSelf) {
                        if (canAttachTrace(error)) {
                            var trace = this._trace;
                            if (trace !== undefined) {
                                if (ignoreSelf) trace = trace._parent;
                            }
                            if (trace !== undefined) {
                                trace.attachExtraTrace(error);
                            } else if (!error.__stackCleaned__) {
                                var parsed = parseStackAndMessage(error);
                                util.notEnumerableProp(error, "stack", parsed.message + "\n" + parsed.stack.join("\n"));
                                util.notEnumerableProp(error, "__stackCleaned__", true);
                            }
                        }
                    }

                    function checkForgottenReturns(returnValue, promiseCreated, name, promise, parent) {
                        if (returnValue === undefined && promiseCreated !== null && wForgottenReturn) {
                            if (parent !== undefined && parent._returnedNonUndefined()) return;
                            if ((promise._bitField & 65535) === 0) return;

                            if (name) name = name + " ";
                            var handlerLine = "";
                            var creatorLine = "";
                            if (promiseCreated._trace) {
                                var traceLines = promiseCreated._trace.stack.split("\n");
                                var stack = cleanStack(traceLines);
                                for (var i = stack.length - 1; i >= 0; --i) {
                                    var line = stack[i];
                                    if (!nodeFramePattern.test(line)) {
                                        var lineMatches = line.match(parseLinePattern);
                                        if (lineMatches) {
                                            handlerLine = "at " + lineMatches[1] + ":" + lineMatches[2] + ":" + lineMatches[3] + " ";
                                        }
                                        break;
                                    }
                                }

                                if (stack.length > 0) {
                                    var firstUserLine = stack[0];
                                    for (var i = 0; i < traceLines.length; ++i) {

                                        if (traceLines[i] === firstUserLine) {
                                            if (i > 0) {
                                                creatorLine = "\n" + traceLines[i - 1];
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                            var msg = "a promise was created in a " + name + "handler " + handlerLine + "but was not returned from it, " + "see http://goo.gl/rRqMUw" + creatorLine;
                            promise._warn(msg, true, promiseCreated);
                        }
                    }

                    function deprecated(name, replacement) {
                        var message = name + " is deprecated and will be removed in a future version.";
                        if (replacement) message += " Use " + replacement + " instead.";
                        return warn(message);
                    }

                    function warn(message, shouldUseOwnTrace, promise) {
                        if (!config.warnings) return;
                        var warning = new Warning(message);
                        var ctx;
                        if (shouldUseOwnTrace) {
                            promise._attachExtraTrace(warning);
                        } else if (config.longStackTraces && (ctx = Promise._peekContext())) {
                            ctx.attachExtraTrace(warning);
                        } else {
                            var parsed = parseStackAndMessage(warning);
                            warning.stack = parsed.message + "\n" + parsed.stack.join("\n");
                        }

                        if (!activeFireEvent("warning", warning)) {
                            formatAndLogError(warning, "", true);
                        }
                    }

                    function reconstructStack(message, stacks) {
                        for (var i = 0; i < stacks.length - 1; ++i) {
                            stacks[i].push("From previous event:");
                            stacks[i] = stacks[i].join("\n");
                        }
                        if (i < stacks.length) {
                            stacks[i] = stacks[i].join("\n");
                        }
                        return message + "\n" + stacks.join("\n");
                    }

                    function removeDuplicateOrEmptyJumps(stacks) {
                        for (var i = 0; i < stacks.length; ++i) {
                            if (stacks[i].length === 0 || i + 1 < stacks.length && stacks[i][0] === stacks[i + 1][0]) {
                                stacks.splice(i, 1);
                                i--;
                            }
                        }
                    }

                    function removeCommonRoots(stacks) {
                        var current = stacks[0];
                        for (var i = 1; i < stacks.length; ++i) {
                            var prev = stacks[i];
                            var currentLastIndex = current.length - 1;
                            var currentLastLine = current[currentLastIndex];
                            var commonRootMeetPoint = -1;

                            for (var j = prev.length - 1; j >= 0; --j) {
                                if (prev[j] === currentLastLine) {
                                    commonRootMeetPoint = j;
                                    break;
                                }
                            }

                            for (var j = commonRootMeetPoint; j >= 0; --j) {
                                var line = prev[j];
                                if (current[currentLastIndex] === line) {
                                    current.pop();
                                    currentLastIndex--;
                                } else {
                                    break;
                                }
                            }
                            current = prev;
                        }
                    }

                    function cleanStack(stack) {
                        var ret = [];
                        for (var i = 0; i < stack.length; ++i) {
                            var line = stack[i];
                            var isTraceLine = "    (No stack trace)" === line || stackFramePattern.test(line);
                            var isInternalFrame = isTraceLine && shouldIgnore(line);
                            if (isTraceLine && !isInternalFrame) {
                                if (indentStackFrames && line.charAt(0) !== " ") {
                                    line = "    " + line;
                                }
                                ret.push(line);
                            }
                        }
                        return ret;
                    }

                    function stackFramesAsArray(error) {
                        var stack = error.stack.replace(/\s+$/g, "").split("\n");
                        for (var i = 0; i < stack.length; ++i) {
                            var line = stack[i];
                            if ("    (No stack trace)" === line || stackFramePattern.test(line)) {
                                break;
                            }
                        }
                        if (i > 0 && error.name != "SyntaxError") {
                            stack = stack.slice(i);
                        }
                        return stack;
                    }

                    function parseStackAndMessage(error) {
                        var stack = error.stack;
                        var message = error.toString();
                        stack = typeof stack === "string" && stack.length > 0 ? stackFramesAsArray(error) : ["    (No stack trace)"];
                        return {
                            message: message,
                            stack: error.name == "SyntaxError" ? stack : cleanStack(stack)
                        };
                    }

                    function formatAndLogError(error, title, isSoft) {
                        if (typeof console !== "undefined") {
                            var message;
                            if (util.isObject(error)) {
                                var stack = error.stack;
                                message = title + formatStack(stack, error);
                            } else {
                                message = title + String(error);
                            }
                            if (typeof printWarning === "function") {
                                printWarning(message, isSoft);
                            } else if (typeof console.log === "function" || _typeof(console.log) === "object") {
                                console.log(message);
                            }
                        }
                    }

                    function fireRejectionEvent(name, localHandler, reason, promise) {
                        var localEventFired = false;
                        try {
                            if (typeof localHandler === "function") {
                                localEventFired = true;
                                if (name === "rejectionHandled") {
                                    localHandler(promise);
                                } else {
                                    localHandler(reason, promise);
                                }
                            }
                        } catch (e) {
                            async.throwLater(e);
                        }

                        if (name === "unhandledRejection") {
                            if (!activeFireEvent(name, reason, promise) && !localEventFired) {
                                formatAndLogError(reason, "Unhandled rejection ");
                            }
                        } else {
                            activeFireEvent(name, promise);
                        }
                    }

                    function formatNonError(obj) {
                        var str;
                        if (typeof obj === "function") {
                            str = "[function " + (obj.name || "anonymous") + "]";
                        } else {
                            str = obj && typeof obj.toString === "function" ? obj.toString() : util.toString(obj);
                            var ruselessToString = /\[object [a-zA-Z0-9$_]+\]/;
                            if (ruselessToString.test(str)) {
                                try {
                                    var newStr = JSON.stringify(obj);
                                    str = newStr;
                                } catch (e) {}
                            }
                            if (str.length === 0) {
                                str = "(empty array)";
                            }
                        }
                        return "(<" + snip(str) + ">, no stack trace)";
                    }

                    function snip(str) {
                        var maxChars = 41;
                        if (str.length < maxChars) {
                            return str;
                        }
                        return str.substr(0, maxChars - 3) + "...";
                    }

                    function longStackTracesIsSupported() {
                        return typeof captureStackTrace === "function";
                    }

                    var shouldIgnore = function shouldIgnore() {
                        return false;
                    };
                    var parseLineInfoRegex = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
                    function parseLineInfo(line) {
                        var matches = line.match(parseLineInfoRegex);
                        if (matches) {
                            return {
                                fileName: matches[1],
                                line: parseInt(matches[2], 10)
                            };
                        }
                    }

                    function setBounds(firstLineError, lastLineError) {
                        if (!longStackTracesIsSupported()) return;
                        var firstStackLines = firstLineError.stack.split("\n");
                        var lastStackLines = lastLineError.stack.split("\n");
                        var firstIndex = -1;
                        var lastIndex = -1;
                        var firstFileName;
                        var lastFileName;
                        for (var i = 0; i < firstStackLines.length; ++i) {
                            var result = parseLineInfo(firstStackLines[i]);
                            if (result) {
                                firstFileName = result.fileName;
                                firstIndex = result.line;
                                break;
                            }
                        }
                        for (var i = 0; i < lastStackLines.length; ++i) {
                            var result = parseLineInfo(lastStackLines[i]);
                            if (result) {
                                lastFileName = result.fileName;
                                lastIndex = result.line;
                                break;
                            }
                        }
                        if (firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName || firstFileName !== lastFileName || firstIndex >= lastIndex) {
                            return;
                        }

                        shouldIgnore = function shouldIgnore(line) {
                            if (bluebirdFramePattern.test(line)) return true;
                            var info = parseLineInfo(line);
                            if (info) {
                                if (info.fileName === firstFileName && firstIndex <= info.line && info.line <= lastIndex) {
                                    return true;
                                }
                            }
                            return false;
                        };
                    }

                    function CapturedTrace(parent) {
                        this._parent = parent;
                        this._promisesCreated = 0;
                        var length = this._length = 1 + (parent === undefined ? 0 : parent._length);
                        captureStackTrace(this, CapturedTrace);
                        if (length > 32) this.uncycle();
                    }
                    util.inherits(CapturedTrace, Error);
                    Context.CapturedTrace = CapturedTrace;

                    CapturedTrace.prototype.uncycle = function () {
                        var length = this._length;
                        if (length < 2) return;
                        var nodes = [];
                        var stackToIndex = {};

                        for (var i = 0, node = this; node !== undefined; ++i) {
                            nodes.push(node);
                            node = node._parent;
                        }
                        length = this._length = i;
                        for (var i = length - 1; i >= 0; --i) {
                            var stack = nodes[i].stack;
                            if (stackToIndex[stack] === undefined) {
                                stackToIndex[stack] = i;
                            }
                        }
                        for (var i = 0; i < length; ++i) {
                            var currentStack = nodes[i].stack;
                            var index = stackToIndex[currentStack];
                            if (index !== undefined && index !== i) {
                                if (index > 0) {
                                    nodes[index - 1]._parent = undefined;
                                    nodes[index - 1]._length = 1;
                                }
                                nodes[i]._parent = undefined;
                                nodes[i]._length = 1;
                                var cycleEdgeNode = i > 0 ? nodes[i - 1] : this;

                                if (index < length - 1) {
                                    cycleEdgeNode._parent = nodes[index + 1];
                                    cycleEdgeNode._parent.uncycle();
                                    cycleEdgeNode._length = cycleEdgeNode._parent._length + 1;
                                } else {
                                    cycleEdgeNode._parent = undefined;
                                    cycleEdgeNode._length = 1;
                                }
                                var currentChildLength = cycleEdgeNode._length + 1;
                                for (var j = i - 2; j >= 0; --j) {
                                    nodes[j]._length = currentChildLength;
                                    currentChildLength++;
                                }
                                return;
                            }
                        }
                    };

                    CapturedTrace.prototype.attachExtraTrace = function (error) {
                        if (error.__stackCleaned__) return;
                        this.uncycle();
                        var parsed = parseStackAndMessage(error);
                        var message = parsed.message;
                        var stacks = [parsed.stack];

                        var trace = this;
                        while (trace !== undefined) {
                            stacks.push(cleanStack(trace.stack.split("\n")));
                            trace = trace._parent;
                        }
                        removeCommonRoots(stacks);
                        removeDuplicateOrEmptyJumps(stacks);
                        util.notEnumerableProp(error, "stack", reconstructStack(message, stacks));
                        util.notEnumerableProp(error, "__stackCleaned__", true);
                    };

                    var captureStackTrace = function stackDetection() {
                        var v8stackFramePattern = /^\s*at\s*/;
                        var v8stackFormatter = function v8stackFormatter(stack, error) {
                            if (typeof stack === "string") return stack;

                            if (error.name !== undefined && error.message !== undefined) {
                                return error.toString();
                            }
                            return formatNonError(error);
                        };

                        if (typeof Error.stackTraceLimit === "number" && typeof Error.captureStackTrace === "function") {
                            Error.stackTraceLimit += 6;
                            stackFramePattern = v8stackFramePattern;
                            formatStack = v8stackFormatter;
                            var captureStackTrace = Error.captureStackTrace;

                            shouldIgnore = function shouldIgnore(line) {
                                return bluebirdFramePattern.test(line);
                            };
                            return function (receiver, ignoreUntil) {
                                Error.stackTraceLimit += 6;
                                captureStackTrace(receiver, ignoreUntil);
                                Error.stackTraceLimit -= 6;
                            };
                        }
                        var err = new Error();

                        if (typeof err.stack === "string" && err.stack.split("\n")[0].indexOf("stackDetection@") >= 0) {
                            stackFramePattern = /@/;
                            formatStack = v8stackFormatter;
                            indentStackFrames = true;
                            return function captureStackTrace(o) {
                                o.stack = new Error().stack;
                            };
                        }

                        var hasStackAfterThrow;
                        try {
                            throw new Error();
                        } catch (e) {
                            hasStackAfterThrow = "stack" in e;
                        }
                        if (!("stack" in err) && hasStackAfterThrow && typeof Error.stackTraceLimit === "number") {
                            stackFramePattern = v8stackFramePattern;
                            formatStack = v8stackFormatter;
                            return function captureStackTrace(o) {
                                Error.stackTraceLimit += 6;
                                try {
                                    throw new Error();
                                } catch (e) {
                                    o.stack = e.stack;
                                }
                                Error.stackTraceLimit -= 6;
                            };
                        }

                        formatStack = function formatStack(stack, error) {
                            if (typeof stack === "string") return stack;

                            if (((typeof error === 'undefined' ? 'undefined' : _typeof(error)) === "object" || typeof error === "function") && error.name !== undefined && error.message !== undefined) {
                                return error.toString();
                            }
                            return formatNonError(error);
                        };

                        return null;
                    }([]);

                    if (typeof console !== "undefined" && typeof console.warn !== "undefined") {
                        printWarning = function printWarning(message) {
                            console.warn(message);
                        };
                        if (util.isNode && process.stderr.isTTY) {
                            printWarning = function printWarning(message, isSoft) {
                                var color = isSoft ? '\x1B[33m' : '\x1B[31m';
                                console.warn(color + message + '\x1B[0m\n');
                            };
                        } else if (!util.isNode && typeof new Error().stack === "string") {
                            printWarning = function printWarning(message, isSoft) {
                                console.warn("%c" + message, isSoft ? "color: darkorange" : "color: red");
                            };
                        }
                    }

                    var config = {
                        warnings: warnings,
                        longStackTraces: false,
                        cancellation: false,
                        monitoring: false
                    };

                    if (longStackTraces) Promise.longStackTraces();

                    return {
                        longStackTraces: function longStackTraces() {
                            return config.longStackTraces;
                        },
                        warnings: function warnings() {
                            return config.warnings;
                        },
                        cancellation: function cancellation() {
                            return config.cancellation;
                        },
                        monitoring: function monitoring() {
                            return config.monitoring;
                        },
                        propagateFromFunction: function propagateFromFunction() {
                            return _propagateFromFunction;
                        },
                        boundValueFunction: function boundValueFunction() {
                            return _boundValueFunction;
                        },
                        checkForgottenReturns: checkForgottenReturns,
                        setBounds: setBounds,
                        warn: warn,
                        deprecated: deprecated,
                        CapturedTrace: CapturedTrace,
                        fireDomEvent: fireDomEvent,
                        fireGlobalEvent: fireGlobalEvent
                    };
                };
            }, { "./errors": 9, "./util": 21 }], 8: [function (_dereq_, module, exports) {
                "use strict";

                module.exports = function (Promise) {
                    function returner() {
                        return this.value;
                    }
                    function thrower() {
                        throw this.reason;
                    }

                    Promise.prototype["return"] = Promise.prototype.thenReturn = function (value) {
                        if (value instanceof Promise) value.suppressUnhandledRejections();
                        return this._then(returner, undefined, undefined, { value: value }, undefined);
                    };

                    Promise.prototype["throw"] = Promise.prototype.thenThrow = function (reason) {
                        return this._then(thrower, undefined, undefined, { reason: reason }, undefined);
                    };

                    Promise.prototype.catchThrow = function (reason) {
                        if (arguments.length <= 1) {
                            return this._then(undefined, thrower, undefined, { reason: reason }, undefined);
                        } else {
                            var _reason = arguments[1];
                            var handler = function handler() {
                                throw _reason;
                            };
                            return this.caught(reason, handler);
                        }
                    };

                    Promise.prototype.catchReturn = function (value) {
                        if (arguments.length <= 1) {
                            if (value instanceof Promise) value.suppressUnhandledRejections();
                            return this._then(undefined, returner, undefined, { value: value }, undefined);
                        } else {
                            var _value = arguments[1];
                            if (_value instanceof Promise) _value.suppressUnhandledRejections();
                            var handler = function handler() {
                                return _value;
                            };
                            return this.caught(value, handler);
                        }
                    };
                };
            }, {}], 9: [function (_dereq_, module, exports) {
                "use strict";

                var es5 = _dereq_("./es5");
                var Objectfreeze = es5.freeze;
                var util = _dereq_("./util");
                var inherits$$1 = util.inherits;
                var notEnumerableProp = util.notEnumerableProp;

                function subError(nameProperty, defaultMessage) {
                    function SubError(message) {
                        if (!(this instanceof SubError)) return new SubError(message);
                        notEnumerableProp(this, "message", typeof message === "string" ? message : defaultMessage);
                        notEnumerableProp(this, "name", nameProperty);
                        if (Error.captureStackTrace) {
                            Error.captureStackTrace(this, this.constructor);
                        } else {
                            Error.call(this);
                        }
                    }
                    inherits$$1(SubError, Error);
                    return SubError;
                }

                var _TypeError, _RangeError;
                var Warning = subError("Warning", "warning");
                var CancellationError = subError("CancellationError", "cancellation error");
                var TimeoutError = subError("TimeoutError", "timeout error");
                var AggregateError = subError("AggregateError", "aggregate error");
                try {
                    _TypeError = TypeError;
                    _RangeError = RangeError;
                } catch (e) {
                    _TypeError = subError("TypeError", "type error");
                    _RangeError = subError("RangeError", "range error");
                }

                var methods = ("join pop push shift unshift slice filter forEach some " + "every map indexOf lastIndexOf reduce reduceRight sort reverse").split(" ");

                for (var i = 0; i < methods.length; ++i) {
                    if (typeof Array.prototype[methods[i]] === "function") {
                        AggregateError.prototype[methods[i]] = Array.prototype[methods[i]];
                    }
                }

                es5.defineProperty(AggregateError.prototype, "length", {
                    value: 0,
                    configurable: false,
                    writable: true,
                    enumerable: true
                });
                AggregateError.prototype["isOperational"] = true;
                var level = 0;
                AggregateError.prototype.toString = function () {
                    var indent = Array(level * 4 + 1).join(" ");
                    var ret = "\n" + indent + "AggregateError of:" + "\n";
                    level++;
                    indent = Array(level * 4 + 1).join(" ");
                    for (var i = 0; i < this.length; ++i) {
                        var str = this[i] === this ? "[Circular AggregateError]" : this[i] + "";
                        var lines = str.split("\n");
                        for (var j = 0; j < lines.length; ++j) {
                            lines[j] = indent + lines[j];
                        }
                        str = lines.join("\n");
                        ret += str + "\n";
                    }
                    level--;
                    return ret;
                };

                function OperationalError(message) {
                    if (!(this instanceof OperationalError)) return new OperationalError(message);
                    notEnumerableProp(this, "name", "OperationalError");
                    notEnumerableProp(this, "message", message);
                    this.cause = message;
                    this["isOperational"] = true;

                    if (message instanceof Error) {
                        notEnumerableProp(this, "message", message.message);
                        notEnumerableProp(this, "stack", message.stack);
                    } else if (Error.captureStackTrace) {
                        Error.captureStackTrace(this, this.constructor);
                    }
                }
                inherits$$1(OperationalError, Error);

                var errorTypes = Error["__BluebirdErrorTypes__"];
                if (!errorTypes) {
                    errorTypes = Objectfreeze({
                        CancellationError: CancellationError,
                        TimeoutError: TimeoutError,
                        OperationalError: OperationalError,
                        RejectionError: OperationalError,
                        AggregateError: AggregateError
                    });
                    es5.defineProperty(Error, "__BluebirdErrorTypes__", {
                        value: errorTypes,
                        writable: false,
                        enumerable: false,
                        configurable: false
                    });
                }

                module.exports = {
                    Error: Error,
                    TypeError: _TypeError,
                    RangeError: _RangeError,
                    CancellationError: errorTypes.CancellationError,
                    OperationalError: errorTypes.OperationalError,
                    TimeoutError: errorTypes.TimeoutError,
                    AggregateError: errorTypes.AggregateError,
                    Warning: Warning
                };
            }, { "./es5": 10, "./util": 21 }], 10: [function (_dereq_, module, exports) {
                var isES5 = function () {
                    "use strict";

                    return this === undefined;
                }();

                if (isES5) {
                    module.exports = {
                        freeze: Object.freeze,
                        defineProperty: Object.defineProperty,
                        getDescriptor: Object.getOwnPropertyDescriptor,
                        keys: Object.keys,
                        names: Object.getOwnPropertyNames,
                        getPrototypeOf: Object.getPrototypeOf,
                        isArray: Array.isArray,
                        isES5: isES5,
                        propertyIsWritable: function propertyIsWritable(obj, prop) {
                            var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
                            return !!(!descriptor || descriptor.writable || descriptor.set);
                        }
                    };
                } else {
                    var has = {}.hasOwnProperty;
                    var str = {}.toString;
                    var proto = {}.constructor.prototype;

                    var ObjectKeys = function ObjectKeys(o) {
                        var ret = [];
                        for (var key in o) {
                            if (has.call(o, key)) {
                                ret.push(key);
                            }
                        }
                        return ret;
                    };

                    var ObjectGetDescriptor = function ObjectGetDescriptor(o, key) {
                        return { value: o[key] };
                    };

                    var ObjectDefineProperty = function ObjectDefineProperty(o, key, desc) {
                        o[key] = desc.value;
                        return o;
                    };

                    var ObjectFreeze = function ObjectFreeze(obj) {
                        return obj;
                    };

                    var ObjectGetPrototypeOf = function ObjectGetPrototypeOf(obj) {
                        try {
                            return Object(obj).constructor.prototype;
                        } catch (e) {
                            return proto;
                        }
                    };

                    var ArrayIsArray = function ArrayIsArray(obj) {
                        try {
                            return str.call(obj) === "[object Array]";
                        } catch (e) {
                            return false;
                        }
                    };

                    module.exports = {
                        isArray: ArrayIsArray,
                        keys: ObjectKeys,
                        names: ObjectKeys,
                        defineProperty: ObjectDefineProperty,
                        getDescriptor: ObjectGetDescriptor,
                        freeze: ObjectFreeze,
                        getPrototypeOf: ObjectGetPrototypeOf,
                        isES5: isES5,
                        propertyIsWritable: function propertyIsWritable() {
                            return true;
                        }
                    };
                }
            }, {}], 11: [function (_dereq_, module, exports) {
                "use strict";

                module.exports = function (Promise, tryConvertToPromise, NEXT_FILTER) {
                    var util = _dereq_("./util");
                    var CancellationError = Promise.CancellationError;
                    var errorObj = util.errorObj;
                    var catchFilter = _dereq_("./catch_filter")(NEXT_FILTER);

                    function PassThroughHandlerContext(promise, type, handler) {
                        this.promise = promise;
                        this.type = type;
                        this.handler = handler;
                        this.called = false;
                        this.cancelPromise = null;
                    }

                    PassThroughHandlerContext.prototype.isFinallyHandler = function () {
                        return this.type === 0;
                    };

                    function FinallyHandlerCancelReaction(finallyHandler) {
                        this.finallyHandler = finallyHandler;
                    }

                    FinallyHandlerCancelReaction.prototype._resultCancelled = function () {
                        checkCancel(this.finallyHandler);
                    };

                    function checkCancel(ctx, reason) {
                        if (ctx.cancelPromise != null) {
                            if (arguments.length > 1) {
                                ctx.cancelPromise._reject(reason);
                            } else {
                                ctx.cancelPromise._cancel();
                            }
                            ctx.cancelPromise = null;
                            return true;
                        }
                        return false;
                    }

                    function succeed() {
                        return finallyHandler.call(this, this.promise._target()._settledValue());
                    }
                    function fail(reason) {
                        if (checkCancel(this, reason)) return;
                        errorObj.e = reason;
                        return errorObj;
                    }
                    function finallyHandler(reasonOrValue) {
                        var promise = this.promise;
                        var handler = this.handler;

                        if (!this.called) {
                            this.called = true;
                            var ret = this.isFinallyHandler() ? handler.call(promise._boundValue()) : handler.call(promise._boundValue(), reasonOrValue);
                            if (ret === NEXT_FILTER) {
                                return ret;
                            } else if (ret !== undefined) {
                                promise._setReturnedNonUndefined();
                                var maybePromise = tryConvertToPromise(ret, promise);
                                if (maybePromise instanceof Promise) {
                                    if (this.cancelPromise != null) {
                                        if (maybePromise._isCancelled()) {
                                            var reason = new CancellationError("late cancellation observer");
                                            promise._attachExtraTrace(reason);
                                            errorObj.e = reason;
                                            return errorObj;
                                        } else if (maybePromise.isPending()) {
                                            maybePromise._attachCancellationCallback(new FinallyHandlerCancelReaction(this));
                                        }
                                    }
                                    return maybePromise._then(succeed, fail, undefined, this, undefined);
                                }
                            }
                        }

                        if (promise.isRejected()) {
                            checkCancel(this);
                            errorObj.e = reasonOrValue;
                            return errorObj;
                        } else {
                            checkCancel(this);
                            return reasonOrValue;
                        }
                    }

                    Promise.prototype._passThrough = function (handler, type, success, fail) {
                        if (typeof handler !== "function") return this.then();
                        return this._then(success, fail, undefined, new PassThroughHandlerContext(this, type, handler), undefined);
                    };

                    Promise.prototype.lastly = Promise.prototype["finally"] = function (handler) {
                        return this._passThrough(handler, 0, finallyHandler, finallyHandler);
                    };

                    Promise.prototype.tap = function (handler) {
                        return this._passThrough(handler, 1, finallyHandler);
                    };

                    Promise.prototype.tapCatch = function (handlerOrPredicate) {
                        var len = arguments.length;
                        if (len === 1) {
                            return this._passThrough(handlerOrPredicate, 1, undefined, finallyHandler);
                        } else {
                            var catchInstances = new Array(len - 1),
                                j = 0,
                                i;
                            for (i = 0; i < len - 1; ++i) {
                                var item = arguments[i];
                                if (util.isObject(item)) {
                                    catchInstances[j++] = item;
                                } else {
                                    return Promise.reject(new TypeError("tapCatch statement predicate: " + "expecting an object but got " + util.classString(item)));
                                }
                            }
                            catchInstances.length = j;
                            var handler = arguments[i];
                            return this._passThrough(catchFilter(catchInstances, handler, this), 1, undefined, finallyHandler);
                        }
                    };

                    return PassThroughHandlerContext;
                };
            }, { "./catch_filter": 5, "./util": 21 }], 12: [function (_dereq_, module, exports) {
                "use strict";

                module.exports = function (Promise, PromiseArray, tryConvertToPromise, INTERNAL, async, getDomain) {
                    var util = _dereq_("./util");
                    Promise.join = function () {
                        var last = arguments.length - 1;
                        var fn;
                        if (last > 0 && typeof arguments[last] === "function") {
                            fn = arguments[last];
                            var ret;


                        }
                        var args = [].slice.call(arguments);
                        if (fn) args.pop();
                        var ret = new PromiseArray(args).promise();
                        return fn !== undefined ? ret.spread(fn) : ret;
                    };
                };
            }, { "./util": 21 }], 13: [function (_dereq_, module, exports) {
                "use strict";

                module.exports = function (Promise, INTERNAL, tryConvertToPromise, apiRejection, debug) {
                    var util = _dereq_("./util");
                    var tryCatch = util.tryCatch;

                    Promise.method = function (fn) {
                        if (typeof fn !== "function") {
                            throw new Promise.TypeError("expecting a function but got " + util.classString(fn));
                        }
                        return function () {
                            var ret = new Promise(INTERNAL);
                            ret._captureStackTrace();
                            ret._pushContext();
                            var value = tryCatch(fn).apply(this, arguments);
                            var promiseCreated = ret._popContext();
                            debug.checkForgottenReturns(value, promiseCreated, "Promise.method", ret);
                            ret._resolveFromSyncValue(value);
                            return ret;
                        };
                    };

                    Promise.attempt = Promise["try"] = function (fn) {
                        if (typeof fn !== "function") {
                            return apiRejection("expecting a function but got " + util.classString(fn));
                        }
                        var ret = new Promise(INTERNAL);
                        ret._captureStackTrace();
                        ret._pushContext();
                        var value;
                        if (arguments.length > 1) {
                            debug.deprecated("calling Promise.try with more than 1 argument");
                            var arg = arguments[1];
                            var ctx = arguments[2];
                            value = util.isArray(arg) ? tryCatch(fn).apply(ctx, arg) : tryCatch(fn).call(ctx, arg);
                        } else {
                            value = tryCatch(fn)();
                        }
                        var promiseCreated = ret._popContext();
                        debug.checkForgottenReturns(value, promiseCreated, "Promise.try", ret);
                        ret._resolveFromSyncValue(value);
                        return ret;
                    };

                    Promise.prototype._resolveFromSyncValue = function (value) {
                        if (value === util.errorObj) {
                            this._rejectCallback(value.e, false);
                        } else {
                            this._resolveCallback(value, true);
                        }
                    };
                };
            }, { "./util": 21 }], 14: [function (_dereq_, module, exports) {
                "use strict";

                var util = _dereq_("./util");
                var maybeWrapAsError = util.maybeWrapAsError;
                var errors = _dereq_("./errors");
                var OperationalError = errors.OperationalError;
                var es5 = _dereq_("./es5");

                function isUntypedError(obj) {
                    return obj instanceof Error && es5.getPrototypeOf(obj) === Error.prototype;
                }

                var rErrorKey = /^(?:name|message|stack|cause)$/;
                function wrapAsOperationalError(obj) {
                    var ret;
                    if (isUntypedError(obj)) {
                        ret = new OperationalError(obj);
                        ret.name = obj.name;
                        ret.message = obj.message;
                        ret.stack = obj.stack;
                        var keys = es5.keys(obj);
                        for (var i = 0; i < keys.length; ++i) {
                            var key = keys[i];
                            if (!rErrorKey.test(key)) {
                                ret[key] = obj[key];
                            }
                        }
                        return ret;
                    }
                    util.markAsOriginatingFromRejection(obj);
                    return obj;
                }

                function nodebackForPromise(promise, multiArgs) {
                    return function (err, value) {
                        if (promise === null) return;
                        if (err) {
                            var wrapped = wrapAsOperationalError(maybeWrapAsError(err));
                            promise._attachExtraTrace(wrapped);
                            promise._reject(wrapped);
                        } else if (!multiArgs) {
                            promise._fulfill(value);
                        } else {
                            var args = [].slice.call(arguments, 1);
                            promise._fulfill(args);
                        }
                        promise = null;
                    };
                }

                module.exports = nodebackForPromise;
            }, { "./errors": 9, "./es5": 10, "./util": 21 }], 15: [function (_dereq_, module, exports) {
                "use strict";

                module.exports = function () {
                    var makeSelfResolutionError = function makeSelfResolutionError() {
                        return new TypeError('circular promise resolution chain\n\n    See http://goo.gl/MqrFmX\n');
                    };
                    var reflectHandler = function reflectHandler() {
                        return new Promise.PromiseInspection(this._target());
                    };
                    var apiRejection = function apiRejection(msg) {
                        return Promise.reject(new TypeError(msg));
                    };
                    function Proxyable() {}
                    var UNDEFINED_BINDING = {};
                    var util = _dereq_("./util");

                    var getDomain;
                    if (util.isNode) {
                        getDomain = function getDomain() {
                            var ret = process.domain;
                            if (ret === undefined) ret = null;
                            return ret;
                        };
                    } else {
                        getDomain = function getDomain() {
                            return null;
                        };
                    }
                    util.notEnumerableProp(Promise, "_getDomain", getDomain);

                    var es5 = _dereq_("./es5");
                    var Async = _dereq_("./async");
                    var async = new Async();
                    es5.defineProperty(Promise, "_async", { value: async });
                    var errors = _dereq_("./errors");
                    var TypeError = Promise.TypeError = errors.TypeError;
                    Promise.RangeError = errors.RangeError;
                    var CancellationError = Promise.CancellationError = errors.CancellationError;
                    Promise.TimeoutError = errors.TimeoutError;
                    Promise.OperationalError = errors.OperationalError;
                    Promise.RejectionError = errors.OperationalError;
                    Promise.AggregateError = errors.AggregateError;
                    var INTERNAL = function INTERNAL() {};
                    var APPLY = {};
                    var NEXT_FILTER = {};
                    var tryConvertToPromise = _dereq_("./thenables")(Promise, INTERNAL);
                    var PromiseArray = _dereq_("./promise_array")(Promise, INTERNAL, tryConvertToPromise, apiRejection, Proxyable);
                    var Context = _dereq_("./context")(Promise);
                    /*jshint unused:false*/
                    var debug = _dereq_("./debuggability")(Promise, Context);
                    var PassThroughHandlerContext = _dereq_("./finally")(Promise, tryConvertToPromise, NEXT_FILTER);
                    var catchFilter = _dereq_("./catch_filter")(NEXT_FILTER);
                    var nodebackForPromise = _dereq_("./nodeback");
                    var errorObj = util.errorObj;
                    var tryCatch = util.tryCatch;
                    function check(self, executor) {
                        if (self == null || self.constructor !== Promise) {
                            throw new TypeError('the promise constructor cannot be invoked directly\n\n    See http://goo.gl/MqrFmX\n');
                        }
                        if (typeof executor !== "function") {
                            throw new TypeError("expecting a function but got " + util.classString(executor));
                        }
                    }

                    function Promise(executor) {
                        if (executor !== INTERNAL) {
                            check(this, executor);
                        }
                        this._bitField = 0;
                        this._fulfillmentHandler0 = undefined;
                        this._rejectionHandler0 = undefined;
                        this._promise0 = undefined;
                        this._receiver0 = undefined;
                        this._resolveFromExecutor(executor);
                        this._promiseCreated();
                        this._fireEvent("promiseCreated", this);
                    }

                    Promise.prototype.toString = function () {
                        return "[object Promise]";
                    };

                    Promise.prototype.caught = Promise.prototype["catch"] = function (fn) {
                        var len = arguments.length;
                        if (len > 1) {
                            var catchInstances = new Array(len - 1),
                                j = 0,
                                i;
                            for (i = 0; i < len - 1; ++i) {
                                var item = arguments[i];
                                if (util.isObject(item)) {
                                    catchInstances[j++] = item;
                                } else {
                                    return apiRejection("Catch statement predicate: " + "expecting an object but got " + util.classString(item));
                                }
                            }
                            catchInstances.length = j;
                            fn = arguments[i];
                            return this.then(undefined, catchFilter(catchInstances, fn, this));
                        }
                        return this.then(undefined, fn);
                    };

                    Promise.prototype.reflect = function () {
                        return this._then(reflectHandler, reflectHandler, undefined, this, undefined);
                    };

                    Promise.prototype.then = function (didFulfill, didReject) {
                        if (debug.warnings() && arguments.length > 0 && typeof didFulfill !== "function" && typeof didReject !== "function") {
                            var msg = ".then() only accepts functions but was passed: " + util.classString(didFulfill);
                            if (arguments.length > 1) {
                                msg += ", " + util.classString(didReject);
                            }
                            this._warn(msg);
                        }
                        return this._then(didFulfill, didReject, undefined, undefined, undefined);
                    };

                    Promise.prototype.done = function (didFulfill, didReject) {
                        var promise = this._then(didFulfill, didReject, undefined, undefined, undefined);
                        promise._setIsFinal();
                    };

                    Promise.prototype.spread = function (fn) {
                        if (typeof fn !== "function") {
                            return apiRejection("expecting a function but got " + util.classString(fn));
                        }
                        return this.all()._then(fn, undefined, undefined, APPLY, undefined);
                    };

                    Promise.prototype.toJSON = function () {
                        var ret = {
                            isFulfilled: false,
                            isRejected: false,
                            fulfillmentValue: undefined,
                            rejectionReason: undefined
                        };
                        if (this.isFulfilled()) {
                            ret.fulfillmentValue = this.value();
                            ret.isFulfilled = true;
                        } else if (this.isRejected()) {
                            ret.rejectionReason = this.reason();
                            ret.isRejected = true;
                        }
                        return ret;
                    };

                    Promise.prototype.all = function () {
                        if (arguments.length > 0) {
                            this._warn(".all() was passed arguments but it does not take any");
                        }
                        return new PromiseArray(this).promise();
                    };

                    Promise.prototype.error = function (fn) {
                        return this.caught(util.originatesFromRejection, fn);
                    };

                    Promise.getNewLibraryCopy = module.exports;

                    Promise.is = function (val) {
                        return val instanceof Promise;
                    };

                    Promise.fromNode = Promise.fromCallback = function (fn) {
                        var ret = new Promise(INTERNAL);
                        ret._captureStackTrace();
                        var multiArgs = arguments.length > 1 ? !!Object(arguments[1]).multiArgs : false;
                        var result = tryCatch(fn)(nodebackForPromise(ret, multiArgs));
                        if (result === errorObj) {
                            ret._rejectCallback(result.e, true);
                        }
                        if (!ret._isFateSealed()) ret._setAsyncGuaranteed();
                        return ret;
                    };

                    Promise.all = function (promises) {
                        return new PromiseArray(promises).promise();
                    };

                    Promise.cast = function (obj) {
                        var ret = tryConvertToPromise(obj);
                        if (!(ret instanceof Promise)) {
                            ret = new Promise(INTERNAL);
                            ret._captureStackTrace();
                            ret._setFulfilled();
                            ret._rejectionHandler0 = obj;
                        }
                        return ret;
                    };

                    Promise.resolve = Promise.fulfilled = Promise.cast;

                    Promise.reject = Promise.rejected = function (reason) {
                        var ret = new Promise(INTERNAL);
                        ret._captureStackTrace();
                        ret._rejectCallback(reason, true);
                        return ret;
                    };

                    Promise.setScheduler = function (fn) {
                        if (typeof fn !== "function") {
                            throw new TypeError("expecting a function but got " + util.classString(fn));
                        }
                        return async.setScheduler(fn);
                    };

                    Promise.prototype._then = function (didFulfill, didReject, _, receiver, internalData) {
                        var haveInternalData = internalData !== undefined;
                        var promise = haveInternalData ? internalData : new Promise(INTERNAL);
                        var target = this._target();
                        var bitField = target._bitField;

                        if (!haveInternalData) {
                            promise._propagateFrom(this, 3);
                            promise._captureStackTrace();
                            if (receiver === undefined && (this._bitField & 2097152) !== 0) {
                                if (!((bitField & 50397184) === 0)) {
                                    receiver = this._boundValue();
                                } else {
                                    receiver = target === this ? undefined : this._boundTo;
                                }
                            }
                            this._fireEvent("promiseChained", this, promise);
                        }

                        var domain = getDomain();
                        if (!((bitField & 50397184) === 0)) {
                            var handler,
                                value,
                                settler = target._settlePromiseCtx;
                            if ((bitField & 33554432) !== 0) {
                                value = target._rejectionHandler0;
                                handler = didFulfill;
                            } else if ((bitField & 16777216) !== 0) {
                                value = target._fulfillmentHandler0;
                                handler = didReject;
                                target._unsetRejectionIsUnhandled();
                            } else {
                                settler = target._settlePromiseLateCancellationObserver;
                                value = new CancellationError("late cancellation observer");
                                target._attachExtraTrace(value);
                                handler = didReject;
                            }

                            async.invoke(settler, target, {
                                handler: domain === null ? handler : typeof handler === "function" && util.domainBind(domain, handler),
                                promise: promise,
                                receiver: receiver,
                                value: value
                            });
                        } else {
                            target._addCallbacks(didFulfill, didReject, promise, receiver, domain);
                        }

                        return promise;
                    };

                    Promise.prototype._length = function () {
                        return this._bitField & 65535;
                    };

                    Promise.prototype._isFateSealed = function () {
                        return (this._bitField & 117506048) !== 0;
                    };

                    Promise.prototype._isFollowing = function () {
                        return (this._bitField & 67108864) === 67108864;
                    };

                    Promise.prototype._setLength = function (len) {
                        this._bitField = this._bitField & -65536 | len & 65535;
                    };

                    Promise.prototype._setFulfilled = function () {
                        this._bitField = this._bitField | 33554432;
                        this._fireEvent("promiseFulfilled", this);
                    };

                    Promise.prototype._setRejected = function () {
                        this._bitField = this._bitField | 16777216;
                        this._fireEvent("promiseRejected", this);
                    };

                    Promise.prototype._setFollowing = function () {
                        this._bitField = this._bitField | 67108864;
                        this._fireEvent("promiseResolved", this);
                    };

                    Promise.prototype._setIsFinal = function () {
                        this._bitField = this._bitField | 4194304;
                    };

                    Promise.prototype._isFinal = function () {
                        return (this._bitField & 4194304) > 0;
                    };

                    Promise.prototype._unsetCancelled = function () {
                        this._bitField = this._bitField & ~65536;
                    };

                    Promise.prototype._setCancelled = function () {
                        this._bitField = this._bitField | 65536;
                        this._fireEvent("promiseCancelled", this);
                    };

                    Promise.prototype._setWillBeCancelled = function () {
                        this._bitField = this._bitField | 8388608;
                    };

                    Promise.prototype._setAsyncGuaranteed = function () {
                        if (async.hasCustomScheduler()) return;
                        this._bitField = this._bitField | 134217728;
                    };

                    Promise.prototype._receiverAt = function (index) {
                        var ret = index === 0 ? this._receiver0 : this[index * 4 - 4 + 3];
                        if (ret === UNDEFINED_BINDING) {
                            return undefined;
                        } else if (ret === undefined && this._isBound()) {
                            return this._boundValue();
                        }
                        return ret;
                    };

                    Promise.prototype._promiseAt = function (index) {
                        return this[index * 4 - 4 + 2];
                    };

                    Promise.prototype._fulfillmentHandlerAt = function (index) {
                        return this[index * 4 - 4 + 0];
                    };

                    Promise.prototype._rejectionHandlerAt = function (index) {
                        return this[index * 4 - 4 + 1];
                    };

                    Promise.prototype._boundValue = function () {};

                    Promise.prototype._migrateCallback0 = function (follower) {
                        var fulfill = follower._fulfillmentHandler0;
                        var reject = follower._rejectionHandler0;
                        var promise = follower._promise0;
                        var receiver = follower._receiverAt(0);
                        if (receiver === undefined) receiver = UNDEFINED_BINDING;
                        this._addCallbacks(fulfill, reject, promise, receiver, null);
                    };

                    Promise.prototype._migrateCallbackAt = function (follower, index) {
                        var fulfill = follower._fulfillmentHandlerAt(index);
                        var reject = follower._rejectionHandlerAt(index);
                        var promise = follower._promiseAt(index);
                        var receiver = follower._receiverAt(index);
                        if (receiver === undefined) receiver = UNDEFINED_BINDING;
                        this._addCallbacks(fulfill, reject, promise, receiver, null);
                    };

                    Promise.prototype._addCallbacks = function (fulfill, reject, promise, receiver, domain) {
                        var index = this._length();

                        if (index >= 65535 - 4) {
                            index = 0;
                            this._setLength(0);
                        }

                        if (index === 0) {
                            this._promise0 = promise;
                            this._receiver0 = receiver;
                            if (typeof fulfill === "function") {
                                this._fulfillmentHandler0 = domain === null ? fulfill : util.domainBind(domain, fulfill);
                            }
                            if (typeof reject === "function") {
                                this._rejectionHandler0 = domain === null ? reject : util.domainBind(domain, reject);
                            }
                        } else {
                            var base = index * 4 - 4;
                            this[base + 2] = promise;
                            this[base + 3] = receiver;
                            if (typeof fulfill === "function") {
                                this[base + 0] = domain === null ? fulfill : util.domainBind(domain, fulfill);
                            }
                            if (typeof reject === "function") {
                                this[base + 1] = domain === null ? reject : util.domainBind(domain, reject);
                            }
                        }
                        this._setLength(index + 1);
                        return index;
                    };

                    Promise.prototype._proxy = function (proxyable, arg) {
                        this._addCallbacks(undefined, undefined, arg, proxyable, null);
                    };

                    Promise.prototype._resolveCallback = function (value, shouldBind) {
                        if ((this._bitField & 117506048) !== 0) return;
                        if (value === this) return this._rejectCallback(makeSelfResolutionError(), false);
                        var maybePromise = tryConvertToPromise(value, this);
                        if (!(maybePromise instanceof Promise)) return this._fulfill(value);

                        if (shouldBind) this._propagateFrom(maybePromise, 2);

                        var promise = maybePromise._target();

                        if (promise === this) {
                            this._reject(makeSelfResolutionError());
                            return;
                        }

                        var bitField = promise._bitField;
                        if ((bitField & 50397184) === 0) {
                            var len = this._length();
                            if (len > 0) promise._migrateCallback0(this);
                            for (var i = 1; i < len; ++i) {
                                promise._migrateCallbackAt(this, i);
                            }
                            this._setFollowing();
                            this._setLength(0);
                            this._setFollowee(promise);
                        } else if ((bitField & 33554432) !== 0) {
                            this._fulfill(promise._value());
                        } else if ((bitField & 16777216) !== 0) {
                            this._reject(promise._reason());
                        } else {
                            var reason = new CancellationError("late cancellation observer");
                            promise._attachExtraTrace(reason);
                            this._reject(reason);
                        }
                    };

                    Promise.prototype._rejectCallback = function (reason, synchronous, ignoreNonErrorWarnings) {
                        var trace = util.ensureErrorObject(reason);
                        var hasStack = trace === reason;
                        if (!hasStack && !ignoreNonErrorWarnings && debug.warnings()) {
                            var message = "a promise was rejected with a non-error: " + util.classString(reason);
                            this._warn(message, true);
                        }
                        this._attachExtraTrace(trace, synchronous ? hasStack : false);
                        this._reject(reason);
                    };

                    Promise.prototype._resolveFromExecutor = function (executor) {
                        if (executor === INTERNAL) return;
                        var promise = this;
                        this._captureStackTrace();
                        this._pushContext();
                        var synchronous = true;
                        var r = this._execute(executor, function (value) {
                            promise._resolveCallback(value);
                        }, function (reason) {
                            promise._rejectCallback(reason, synchronous);
                        });
                        synchronous = false;
                        this._popContext();

                        if (r !== undefined) {
                            promise._rejectCallback(r, true);
                        }
                    };

                    Promise.prototype._settlePromiseFromHandler = function (handler, receiver, value, promise) {
                        var bitField = promise._bitField;
                        if ((bitField & 65536) !== 0) return;
                        promise._pushContext();
                        var x;
                        if (receiver === APPLY) {
                            if (!value || typeof value.length !== "number") {
                                x = errorObj;
                                x.e = new TypeError("cannot .spread() a non-array: " + util.classString(value));
                            } else {
                                x = tryCatch(handler).apply(this._boundValue(), value);
                            }
                        } else {
                            x = tryCatch(handler).call(receiver, value);
                        }
                        var promiseCreated = promise._popContext();
                        bitField = promise._bitField;
                        if ((bitField & 65536) !== 0) return;

                        if (x === NEXT_FILTER) {
                            promise._reject(value);
                        } else if (x === errorObj) {
                            promise._rejectCallback(x.e, false);
                        } else {
                            debug.checkForgottenReturns(x, promiseCreated, "", promise, this);
                            promise._resolveCallback(x);
                        }
                    };

                    Promise.prototype._target = function () {
                        var ret = this;
                        while (ret._isFollowing()) {
                            ret = ret._followee();
                        }return ret;
                    };

                    Promise.prototype._followee = function () {
                        return this._rejectionHandler0;
                    };

                    Promise.prototype._setFollowee = function (promise) {
                        this._rejectionHandler0 = promise;
                    };

                    Promise.prototype._settlePromise = function (promise, handler, receiver, value) {
                        var isPromise = promise instanceof Promise;
                        var bitField = this._bitField;
                        var asyncGuaranteed = (bitField & 134217728) !== 0;
                        if ((bitField & 65536) !== 0) {
                            if (isPromise) promise._invokeInternalOnCancel();

                            if (receiver instanceof PassThroughHandlerContext && receiver.isFinallyHandler()) {
                                receiver.cancelPromise = promise;
                                if (tryCatch(handler).call(receiver, value) === errorObj) {
                                    promise._reject(errorObj.e);
                                }
                            } else if (handler === reflectHandler) {
                                promise._fulfill(reflectHandler.call(receiver));
                            } else if (receiver instanceof Proxyable) {
                                receiver._promiseCancelled(promise);
                            } else if (isPromise || promise instanceof PromiseArray) {
                                promise._cancel();
                            } else {
                                receiver.cancel();
                            }
                        } else if (typeof handler === "function") {
                            if (!isPromise) {
                                handler.call(receiver, value, promise);
                            } else {
                                if (asyncGuaranteed) promise._setAsyncGuaranteed();
                                this._settlePromiseFromHandler(handler, receiver, value, promise);
                            }
                        } else if (receiver instanceof Proxyable) {
                            if (!receiver._isResolved()) {
                                if ((bitField & 33554432) !== 0) {
                                    receiver._promiseFulfilled(value, promise);
                                } else {
                                    receiver._promiseRejected(value, promise);
                                }
                            }
                        } else if (isPromise) {
                            if (asyncGuaranteed) promise._setAsyncGuaranteed();
                            if ((bitField & 33554432) !== 0) {
                                promise._fulfill(value);
                            } else {
                                promise._reject(value);
                            }
                        }
                    };

                    Promise.prototype._settlePromiseLateCancellationObserver = function (ctx) {
                        var handler = ctx.handler;
                        var promise = ctx.promise;
                        var receiver = ctx.receiver;
                        var value = ctx.value;
                        if (typeof handler === "function") {
                            if (!(promise instanceof Promise)) {
                                handler.call(receiver, value, promise);
                            } else {
                                this._settlePromiseFromHandler(handler, receiver, value, promise);
                            }
                        } else if (promise instanceof Promise) {
                            promise._reject(value);
                        }
                    };

                    Promise.prototype._settlePromiseCtx = function (ctx) {
                        this._settlePromise(ctx.promise, ctx.handler, ctx.receiver, ctx.value);
                    };

                    Promise.prototype._settlePromise0 = function (handler, value, bitField) {
                        var promise = this._promise0;
                        var receiver = this._receiverAt(0);
                        this._promise0 = undefined;
                        this._receiver0 = undefined;
                        this._settlePromise(promise, handler, receiver, value);
                    };

                    Promise.prototype._clearCallbackDataAtIndex = function (index) {
                        var base = index * 4 - 4;
                        this[base + 2] = this[base + 3] = this[base + 0] = this[base + 1] = undefined;
                    };

                    Promise.prototype._fulfill = function (value) {
                        var bitField = this._bitField;
                        if ((bitField & 117506048) >>> 16) return;
                        if (value === this) {
                            var err = makeSelfResolutionError();
                            this._attachExtraTrace(err);
                            return this._reject(err);
                        }
                        this._setFulfilled();
                        this._rejectionHandler0 = value;

                        if ((bitField & 65535) > 0) {
                            if ((bitField & 134217728) !== 0) {
                                this._settlePromises();
                            } else {
                                async.settlePromises(this);
                            }
                        }
                    };

                    Promise.prototype._reject = function (reason) {
                        var bitField = this._bitField;
                        if ((bitField & 117506048) >>> 16) return;
                        this._setRejected();
                        this._fulfillmentHandler0 = reason;

                        if (this._isFinal()) {
                            return async.fatalError(reason, util.isNode);
                        }

                        if ((bitField & 65535) > 0) {
                            async.settlePromises(this);
                        } else {
                            this._ensurePossibleRejectionHandled();
                        }
                    };

                    Promise.prototype._fulfillPromises = function (len, value) {
                        for (var i = 1; i < len; i++) {
                            var handler = this._fulfillmentHandlerAt(i);
                            var promise = this._promiseAt(i);
                            var receiver = this._receiverAt(i);
                            this._clearCallbackDataAtIndex(i);
                            this._settlePromise(promise, handler, receiver, value);
                        }
                    };

                    Promise.prototype._rejectPromises = function (len, reason) {
                        for (var i = 1; i < len; i++) {
                            var handler = this._rejectionHandlerAt(i);
                            var promise = this._promiseAt(i);
                            var receiver = this._receiverAt(i);
                            this._clearCallbackDataAtIndex(i);
                            this._settlePromise(promise, handler, receiver, reason);
                        }
                    };

                    Promise.prototype._settlePromises = function () {
                        var bitField = this._bitField;
                        var len = bitField & 65535;

                        if (len > 0) {
                            if ((bitField & 16842752) !== 0) {
                                var reason = this._fulfillmentHandler0;
                                this._settlePromise0(this._rejectionHandler0, reason, bitField);
                                this._rejectPromises(len, reason);
                            } else {
                                var value = this._rejectionHandler0;
                                this._settlePromise0(this._fulfillmentHandler0, value, bitField);
                                this._fulfillPromises(len, value);
                            }
                            this._setLength(0);
                        }
                        this._clearCancellationData();
                    };

                    Promise.prototype._settledValue = function () {
                        var bitField = this._bitField;
                        if ((bitField & 33554432) !== 0) {
                            return this._rejectionHandler0;
                        } else if ((bitField & 16777216) !== 0) {
                            return this._fulfillmentHandler0;
                        }
                    };

                    function deferResolve(v) {
                        this.promise._resolveCallback(v);
                    }
                    function deferReject(v) {
                        this.promise._rejectCallback(v, false);
                    }

                    Promise.defer = Promise.pending = function () {
                        debug.deprecated("Promise.defer", "new Promise");
                        var promise = new Promise(INTERNAL);
                        return {
                            promise: promise,
                            resolve: deferResolve,
                            reject: deferReject
                        };
                    };

                    util.notEnumerableProp(Promise, "_makeSelfResolutionError", makeSelfResolutionError);

                    _dereq_("./method")(Promise, INTERNAL, tryConvertToPromise, apiRejection, debug);
                    _dereq_("./bind")(Promise, INTERNAL, tryConvertToPromise, debug);
                    _dereq_("./cancel")(Promise, PromiseArray, apiRejection, debug);
                    _dereq_("./direct_resolve")(Promise);
                    _dereq_("./synchronous_inspection")(Promise);
                    _dereq_("./join")(Promise, PromiseArray, tryConvertToPromise, INTERNAL, async, getDomain);
                    Promise.Promise = Promise;
                    Promise.version = "3.5.1";

                    util.toFastProperties(Promise);
                    util.toFastProperties(Promise.prototype);
                    function fillTypes(value) {
                        var p = new Promise(INTERNAL);
                        p._fulfillmentHandler0 = value;
                        p._rejectionHandler0 = value;
                        p._promise0 = value;
                        p._receiver0 = value;
                    }
                    // Complete slack tracking, opt out of field-type tracking and           
                    // stabilize map                                                         
                    fillTypes({ a: 1 });
                    fillTypes({ b: 2 });
                    fillTypes({ c: 3 });
                    fillTypes(1);
                    fillTypes(function () {});
                    fillTypes(undefined);
                    fillTypes(false);
                    fillTypes(new Promise(INTERNAL));
                    debug.setBounds(Async.firstLineError, util.lastLineError);
                    return Promise;
                };
            }, { "./async": 1, "./bind": 2, "./cancel": 4, "./catch_filter": 5, "./context": 6, "./debuggability": 7, "./direct_resolve": 8, "./errors": 9, "./es5": 10, "./finally": 11, "./join": 12, "./method": 13, "./nodeback": 14, "./promise_array": 16, "./synchronous_inspection": 19, "./thenables": 20, "./util": 21 }], 16: [function (_dereq_, module, exports) {
                "use strict";

                module.exports = function (Promise, INTERNAL, tryConvertToPromise, apiRejection, Proxyable) {
                    var util = _dereq_("./util");
                    function toResolutionValue(val) {
                        switch (val) {
                            case -2:
                                return [];
                            case -3:
                                return {};
                            case -6:
                                return new Map();
                        }
                    }

                    function PromiseArray(values) {
                        var promise = this._promise = new Promise(INTERNAL);
                        if (values instanceof Promise) {
                            promise._propagateFrom(values, 3);
                        }
                        promise._setOnCancel(this);
                        this._values = values;
                        this._length = 0;
                        this._totalResolved = 0;
                        this._init(undefined, -2);
                    }
                    util.inherits(PromiseArray, Proxyable);

                    PromiseArray.prototype.length = function () {
                        return this._length;
                    };

                    PromiseArray.prototype.promise = function () {
                        return this._promise;
                    };

                    PromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {
                        var values = tryConvertToPromise(this._values, this._promise);
                        if (values instanceof Promise) {
                            values = values._target();
                            var bitField = values._bitField;
                            
                            this._values = values;

                            if ((bitField & 50397184) === 0) {
                                this._promise._setAsyncGuaranteed();
                                return values._then(init, this._reject, undefined, this, resolveValueIfEmpty);
                            } else if ((bitField & 33554432) !== 0) {
                                values = values._value();
                            } else if ((bitField & 16777216) !== 0) {
                                return this._reject(values._reason());
                            } else {
                                return this._cancel();
                            }
                        }
                        values = util.asArray(values);
                        if (values === null) {
                            var err = apiRejection("expecting an array or an iterable object but got " + util.classString(values)).reason();
                            this._promise._rejectCallback(err, false);
                            return;
                        }

                        if (values.length === 0) {
                            if (resolveValueIfEmpty === -5) {
                                this._resolveEmptyArray();
                            } else {
                                this._resolve(toResolutionValue(resolveValueIfEmpty));
                            }
                            return;
                        }
                        this._iterate(values);
                    };

                    PromiseArray.prototype._iterate = function (values) {
                        var len = this.getActualLength(values.length);
                        this._length = len;
                        this._values = this.shouldCopyValues() ? new Array(len) : this._values;
                        var result = this._promise;
                        var isResolved = false;
                        var bitField = null;
                        for (var i = 0; i < len; ++i) {
                            var maybePromise = tryConvertToPromise(values[i], result);

                            if (maybePromise instanceof Promise) {
                                maybePromise = maybePromise._target();
                                bitField = maybePromise._bitField;
                            } else {
                                bitField = null;
                            }

                            if (isResolved) {
                                if (bitField !== null) {
                                    maybePromise.suppressUnhandledRejections();
                                }
                            } else if (bitField !== null) {
                                if ((bitField & 50397184) === 0) {
                                    maybePromise._proxy(this, i);
                                    this._values[i] = maybePromise;
                                } else if ((bitField & 33554432) !== 0) {
                                    isResolved = this._promiseFulfilled(maybePromise._value(), i);
                                } else if ((bitField & 16777216) !== 0) {
                                    isResolved = this._promiseRejected(maybePromise._reason(), i);
                                } else {
                                    isResolved = this._promiseCancelled(i);
                                }
                            } else {
                                isResolved = this._promiseFulfilled(maybePromise, i);
                            }
                        }
                        if (!isResolved) result._setAsyncGuaranteed();
                    };

                    PromiseArray.prototype._isResolved = function () {
                        return this._values === null;
                    };

                    PromiseArray.prototype._resolve = function (value) {
                        this._values = null;
                        this._promise._fulfill(value);
                    };

                    PromiseArray.prototype._cancel = function () {
                        if (this._isResolved() || !this._promise._isCancellable()) return;
                        this._values = null;
                        this._promise._cancel();
                    };

                    PromiseArray.prototype._reject = function (reason) {
                        this._values = null;
                        this._promise._rejectCallback(reason, false);
                    };

                    PromiseArray.prototype._promiseFulfilled = function (value, index) {
                        this._values[index] = value;
                        var totalResolved = ++this._totalResolved;
                        if (totalResolved >= this._length) {
                            this._resolve(this._values);
                            return true;
                        }
                        return false;
                    };

                    PromiseArray.prototype._promiseCancelled = function () {
                        this._cancel();
                        return true;
                    };

                    PromiseArray.prototype._promiseRejected = function (reason) {
                        this._totalResolved++;
                        this._reject(reason);
                        return true;
                    };

                    PromiseArray.prototype._resultCancelled = function () {
                        if (this._isResolved()) return;
                        var values = this._values;
                        this._cancel();
                        if (values instanceof Promise) {
                            values.cancel();
                        } else {
                            for (var i = 0; i < values.length; ++i) {
                                if (values[i] instanceof Promise) {
                                    values[i].cancel();
                                }
                            }
                        }
                    };

                    PromiseArray.prototype.shouldCopyValues = function () {
                        return true;
                    };

                    PromiseArray.prototype.getActualLength = function (len) {
                        return len;
                    };

                    return PromiseArray;
                };
            }, { "./util": 21 }], 17: [function (_dereq_, module, exports) {
                "use strict";

                function arrayMove(src, srcIndex, dst, dstIndex, len) {
                    for (var j = 0; j < len; ++j) {
                        dst[j + dstIndex] = src[j + srcIndex];
                        src[j + srcIndex] = void 0;
                    }
                }

                function Queue(capacity) {
                    this._capacity = capacity;
                    this._length = 0;
                    this._front = 0;
                }

                Queue.prototype._willBeOverCapacity = function (size) {
                    return this._capacity < size;
                };

                Queue.prototype._pushOne = function (arg) {
                    var length = this.length();
                    this._checkCapacity(length + 1);
                    var i = this._front + length & this._capacity - 1;
                    this[i] = arg;
                    this._length = length + 1;
                };

                Queue.prototype.push = function (fn, receiver, arg) {
                    var length = this.length() + 3;
                    if (this._willBeOverCapacity(length)) {
                        this._pushOne(fn);
                        this._pushOne(receiver);
                        this._pushOne(arg);
                        return;
                    }
                    var j = this._front + length - 3;
                    this._checkCapacity(length);
                    var wrapMask = this._capacity - 1;
                    this[j + 0 & wrapMask] = fn;
                    this[j + 1 & wrapMask] = receiver;
                    this[j + 2 & wrapMask] = arg;
                    this._length = length;
                };

                Queue.prototype.shift = function () {
                    var front = this._front,
                        ret = this[front];

                    this[front] = undefined;
                    this._front = front + 1 & this._capacity - 1;
                    this._length--;
                    return ret;
                };

                Queue.prototype.length = function () {
                    return this._length;
                };

                Queue.prototype._checkCapacity = function (size) {
                    if (this._capacity < size) {
                        this._resizeTo(this._capacity << 1);
                    }
                };

                Queue.prototype._resizeTo = function (capacity) {
                    var oldCapacity = this._capacity;
                    this._capacity = capacity;
                    var front = this._front;
                    var length = this._length;
                    var moveItemsCount = front + length & oldCapacity - 1;
                    arrayMove(this, 0, this, oldCapacity, moveItemsCount);
                };

                module.exports = Queue;
            }, {}], 18: [function (_dereq_, module, exports) {
                "use strict";

                var util = _dereq_("./util");
                var schedule;
                var noAsyncScheduler = function noAsyncScheduler() {
                    throw new Error('No async scheduler available\n\n    See http://goo.gl/MqrFmX\n');
                };
                var NativePromise = util.getNativePromise();
                if (util.isNode && typeof MutationObserver === "undefined") {
                    var GlobalSetImmediate = commonjsGlobal.setImmediate;
                    var ProcessNextTick = process.nextTick;
                    schedule = util.isRecentNode ? function (fn) {
                        GlobalSetImmediate.call(commonjsGlobal, fn);
                    } : function (fn) {
                        ProcessNextTick.call(process, fn);
                    };
                } else if (typeof NativePromise === "function" && typeof NativePromise.resolve === "function") {
                    var nativePromise = NativePromise.resolve();
                    schedule = function schedule(fn) {
                        nativePromise.then(fn);
                    };
                } else if (typeof MutationObserver !== "undefined" && !(typeof window !== "undefined" && window.navigator && (window.navigator.standalone || window.cordova))) {
                    schedule = function () {
                        var div = document.createElement("div");
                        var opts = { attributes: true };
                        var toggleScheduled = false;
                        var div2 = document.createElement("div");
                        var o2 = new MutationObserver(function () {
                            div.classList.toggle("foo");
                            toggleScheduled = false;
                        });
                        o2.observe(div2, opts);

                        var scheduleToggle = function scheduleToggle() {
                            if (toggleScheduled) return;
                            toggleScheduled = true;
                            div2.classList.toggle("foo");
                        };

                        return function schedule(fn) {
                            var o = new MutationObserver(function () {
                                o.disconnect();
                                fn();
                            });
                            o.observe(div, opts);
                            scheduleToggle();
                        };
                    }();
                } else if (typeof setImmediate !== "undefined") {
                    schedule = function schedule(fn) {
                        setImmediate(fn);
                    };
                } else if (typeof setTimeout !== "undefined") {
                    schedule = function schedule(fn) {
                        setTimeout(fn, 0);
                    };
                } else {
                    schedule = noAsyncScheduler;
                }
                module.exports = schedule;
            }, { "./util": 21 }], 19: [function (_dereq_, module, exports) {
                "use strict";

                module.exports = function (Promise) {
                    function PromiseInspection(promise) {
                        if (promise !== undefined) {
                            promise = promise._target();
                            this._bitField = promise._bitField;
                            this._settledValueField = promise._isFateSealed() ? promise._settledValue() : undefined;
                        } else {
                            this._bitField = 0;
                            this._settledValueField = undefined;
                        }
                    }

                    PromiseInspection.prototype._settledValue = function () {
                        return this._settledValueField;
                    };

                    var value = PromiseInspection.prototype.value = function () {
                        if (!this.isFulfilled()) {
                            throw new TypeError('cannot get fulfillment value of a non-fulfilled promise\n\n    See http://goo.gl/MqrFmX\n');
                        }
                        return this._settledValue();
                    };

                    var reason = PromiseInspection.prototype.error = PromiseInspection.prototype.reason = function () {
                        if (!this.isRejected()) {
                            throw new TypeError('cannot get rejection reason of a non-rejected promise\n\n    See http://goo.gl/MqrFmX\n');
                        }
                        return this._settledValue();
                    };

                    var isFulfilled = PromiseInspection.prototype.isFulfilled = function () {
                        return (this._bitField & 33554432) !== 0;
                    };

                    var isRejected = PromiseInspection.prototype.isRejected = function () {
                        return (this._bitField & 16777216) !== 0;
                    };

                    var isPending = PromiseInspection.prototype.isPending = function () {
                        return (this._bitField & 50397184) === 0;
                    };

                    var isResolved = PromiseInspection.prototype.isResolved = function () {
                        return (this._bitField & 50331648) !== 0;
                    };

                    PromiseInspection.prototype.isCancelled = function () {
                        return (this._bitField & 8454144) !== 0;
                    };

                    Promise.prototype.__isCancelled = function () {
                        return (this._bitField & 65536) === 65536;
                    };

                    Promise.prototype._isCancelled = function () {
                        return this._target().__isCancelled();
                    };

                    Promise.prototype.isCancelled = function () {
                        return (this._target()._bitField & 8454144) !== 0;
                    };

                    Promise.prototype.isPending = function () {
                        return isPending.call(this._target());
                    };

                    Promise.prototype.isRejected = function () {
                        return isRejected.call(this._target());
                    };

                    Promise.prototype.isFulfilled = function () {
                        return isFulfilled.call(this._target());
                    };

                    Promise.prototype.isResolved = function () {
                        return isResolved.call(this._target());
                    };

                    Promise.prototype.value = function () {
                        return value.call(this._target());
                    };

                    Promise.prototype.reason = function () {
                        var target = this._target();
                        target._unsetRejectionIsUnhandled();
                        return reason.call(target);
                    };

                    Promise.prototype._value = function () {
                        return this._settledValue();
                    };

                    Promise.prototype._reason = function () {
                        this._unsetRejectionIsUnhandled();
                        return this._settledValue();
                    };

                    Promise.PromiseInspection = PromiseInspection;
                };
            }, {}], 20: [function (_dereq_, module, exports) {
                "use strict";

                module.exports = function (Promise, INTERNAL) {
                    var util = _dereq_("./util");
                    var errorObj = util.errorObj;
                    var isObject = util.isObject;

                    function tryConvertToPromise(obj, context) {
                        if (isObject(obj)) {
                            if (obj instanceof Promise) return obj;
                            var then = getThen(obj);
                            if (then === errorObj) {
                                if (context) context._pushContext();
                                var ret = Promise.reject(then.e);
                                if (context) context._popContext();
                                return ret;
                            } else if (typeof then === "function") {
                                if (isAnyBluebirdPromise(obj)) {
                                    var ret = new Promise(INTERNAL);
                                    obj._then(ret._fulfill, ret._reject, undefined, ret, null);
                                    return ret;
                                }
                                return doThenable(obj, then, context);
                            }
                        }
                        return obj;
                    }

                    function doGetThen(obj) {
                        return obj.then;
                    }

                    function getThen(obj) {
                        try {
                            return doGetThen(obj);
                        } catch (e) {
                            errorObj.e = e;
                            return errorObj;
                        }
                    }

                    var hasProp = {}.hasOwnProperty;
                    function isAnyBluebirdPromise(obj) {
                        try {
                            return hasProp.call(obj, "_promise0");
                        } catch (e) {
                            return false;
                        }
                    }

                    function doThenable(x, then, context) {
                        var promise = new Promise(INTERNAL);
                        var ret = promise;
                        if (context) context._pushContext();
                        promise._captureStackTrace();
                        if (context) context._popContext();
                        var synchronous = true;
                        var result = util.tryCatch(then).call(x, resolve, reject);
                        synchronous = false;

                        if (promise && result === errorObj) {
                            promise._rejectCallback(result.e, true, true);
                            promise = null;
                        }

                        function resolve(value) {
                            if (!promise) return;
                            promise._resolveCallback(value);
                            promise = null;
                        }

                        function reject(reason) {
                            if (!promise) return;
                            promise._rejectCallback(reason, synchronous, true);
                            promise = null;
                        }
                        return ret;
                    }

                    return tryConvertToPromise;
                };
            }, { "./util": 21 }], 21: [function (_dereq_, module, exports) {
                "use strict";

                var es5 = _dereq_("./es5");
                var canEvaluate = typeof navigator == "undefined";

                var errorObj = { e: {} };
                var tryCatchTarget;
                var globalObject = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof commonjsGlobal !== "undefined" ? commonjsGlobal : this !== undefined ? this : null;

                function tryCatcher() {
                    try {
                        var target = tryCatchTarget;
                        tryCatchTarget = null;
                        return target.apply(this, arguments);
                    } catch (e) {
                        errorObj.e = e;
                        return errorObj;
                    }
                }
                function tryCatch(fn) {
                    tryCatchTarget = fn;
                    return tryCatcher;
                }

                var inherits$$1 = function inherits$$1(Child, Parent) {
                    var hasProp = {}.hasOwnProperty;

                    function T() {
                        this.constructor = Child;
                        this.constructor$ = Parent;
                        for (var propertyName in Parent.prototype) {
                            if (hasProp.call(Parent.prototype, propertyName) && propertyName.charAt(propertyName.length - 1) !== "$") {
                                this[propertyName + "$"] = Parent.prototype[propertyName];
                            }
                        }
                    }
                    T.prototype = Parent.prototype;
                    Child.prototype = new T();
                    return Child.prototype;
                };

                function isPrimitive(val) {
                    return val == null || val === true || val === false || typeof val === "string" || typeof val === "number";
                }

                function isObject(value) {
                    return typeof value === "function" || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === "object" && value !== null;
                }

                function maybeWrapAsError(maybeError) {
                    if (!isPrimitive(maybeError)) return maybeError;

                    return new Error(safeToString(maybeError));
                }

                function withAppended(target, appendee) {
                    var len = target.length;
                    var ret = new Array(len + 1);
                    var i;
                    for (i = 0; i < len; ++i) {
                        ret[i] = target[i];
                    }
                    ret[i] = appendee;
                    return ret;
                }

                function getDataPropertyOrDefault(obj, key, defaultValue) {
                    if (es5.isES5) {
                        var desc = Object.getOwnPropertyDescriptor(obj, key);

                        if (desc != null) {
                            return desc.get == null && desc.set == null ? desc.value : defaultValue;
                        }
                    } else {
                        return {}.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
                    }
                }

                function notEnumerableProp(obj, name, value) {
                    if (isPrimitive(obj)) return obj;
                    var descriptor = {
                        value: value,
                        configurable: true,
                        enumerable: false,
                        writable: true
                    };
                    es5.defineProperty(obj, name, descriptor);
                    return obj;
                }

                function thrower(r) {
                    throw r;
                }

                var inheritedDataKeys = function () {
                    var excludedPrototypes = [Array.prototype, Object.prototype, Function.prototype];

                    var isExcludedProto = function isExcludedProto(val) {
                        for (var i = 0; i < excludedPrototypes.length; ++i) {
                            if (excludedPrototypes[i] === val) {
                                return true;
                            }
                        }
                        return false;
                    };

                    if (es5.isES5) {
                        var getKeys = Object.getOwnPropertyNames;
                        return function (obj) {
                            var ret = [];
                            var visitedKeys = Object.create(null);
                            while (obj != null && !isExcludedProto(obj)) {
                                var keys;
                                try {
                                    keys = getKeys(obj);
                                } catch (e) {
                                    return ret;
                                }
                                for (var i = 0; i < keys.length; ++i) {
                                    var key = keys[i];
                                    if (visitedKeys[key]) continue;
                                    visitedKeys[key] = true;
                                    var desc = Object.getOwnPropertyDescriptor(obj, key);
                                    if (desc != null && desc.get == null && desc.set == null) {
                                        ret.push(key);
                                    }
                                }
                                obj = es5.getPrototypeOf(obj);
                            }
                            return ret;
                        };
                    } else {
                        var hasProp = {}.hasOwnProperty;
                        return function (obj) {
                            if (isExcludedProto(obj)) return [];
                            var ret = [];

                            /*jshint forin:false */
                            enumeration: for (var key in obj) {
                                if (hasProp.call(obj, key)) {
                                    ret.push(key);
                                } else {
                                    for (var i = 0; i < excludedPrototypes.length; ++i) {
                                        if (hasProp.call(excludedPrototypes[i], key)) {
                                            continue enumeration;
                                        }
                                    }
                                    ret.push(key);
                                }
                            }
                            return ret;
                        };
                    }
                }();

                var thisAssignmentPattern = /this\s*\.\s*\S+\s*=/;
                function isClass(fn) {
                    try {
                        if (typeof fn === "function") {
                            var keys = es5.names(fn.prototype);

                            var hasMethods = es5.isES5 && keys.length > 1;
                            var hasMethodsOtherThanConstructor = keys.length > 0 && !(keys.length === 1 && keys[0] === "constructor");
                            var hasThisAssignmentAndStaticMethods = thisAssignmentPattern.test(fn + "") && es5.names(fn).length > 0;

                            if (hasMethods || hasMethodsOtherThanConstructor || hasThisAssignmentAndStaticMethods) {
                                return true;
                            }
                        }
                        return false;
                    } catch (e) {
                        return false;
                    }
                }

                function toFastProperties(obj) {
                    /*jshint -W027,-W055,-W031*/
                    function FakeConstructor() {}
                    FakeConstructor.prototype = obj;
                    var l = 8;
                    while (l--) {
                        new FakeConstructor();
                    }return obj;
                    eval(obj);
                }

                var rident = /^[a-z$_][a-z$_0-9]*$/i;
                function isIdentifier(str) {
                    return rident.test(str);
                }

                function filledRange(count, prefix, suffix) {
                    var ret = new Array(count);
                    for (var i = 0; i < count; ++i) {
                        ret[i] = prefix + i + suffix;
                    }
                    return ret;
                }

                function safeToString(obj) {
                    try {
                        return obj + "";
                    } catch (e) {
                        return "[no string representation]";
                    }
                }

                function isError(obj) {
                    return obj instanceof Error || obj !== null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === "object" && typeof obj.message === "string" && typeof obj.name === "string";
                }

                function markAsOriginatingFromRejection(e) {
                    try {
                        notEnumerableProp(e, "isOperational", true);
                    } catch (ignore) {}
                }

                function originatesFromRejection(e) {
                    if (e == null) return false;
                    return e instanceof Error["__BluebirdErrorTypes__"].OperationalError || e["isOperational"] === true;
                }

                function canAttachTrace(obj) {
                    return isError(obj) && es5.propertyIsWritable(obj, "stack");
                }

                var ensureErrorObject = function () {
                    if (!("stack" in new Error())) {
                        return function (value) {
                            if (canAttachTrace(value)) return value;
                            try {
                                throw new Error(safeToString(value));
                            } catch (err) {
                                return err;
                            }
                        };
                    } else {
                        return function (value) {
                            if (canAttachTrace(value)) return value;
                            return new Error(safeToString(value));
                        };
                    }
                }();

                function classString(obj) {
                    return {}.toString.call(obj);
                }

                function copyDescriptors(from, to, filter) {
                    var keys = es5.names(from);
                    for (var i = 0; i < keys.length; ++i) {
                        var key = keys[i];
                        if (filter(key)) {
                            try {
                                es5.defineProperty(to, key, es5.getDescriptor(from, key));
                            } catch (ignore) {}
                        }
                    }
                }

                var asArray = function asArray(v) {
                    if (es5.isArray(v)) {
                        return v;
                    }
                    return null;
                };

                if (typeof Symbol !== "undefined" && Symbol.iterator) {
                    var ArrayFrom = typeof Array.from === "function" ? function (v) {
                        return Array.from(v);
                    } : function (v) {
                        var ret = [];
                        var it = v[Symbol.iterator]();
                        var itResult;
                        while (!(itResult = it.next()).done) {
                            ret.push(itResult.value);
                        }
                        return ret;
                    };

                    asArray = function asArray(v) {
                        if (es5.isArray(v)) {
                            return v;
                        } else if (v != null && typeof v[Symbol.iterator] === "function") {
                            return ArrayFrom(v);
                        }
                        return null;
                    };
                }

                var isNode = typeof process !== "undefined" && classString(process).toLowerCase() === "[object process]";

                var hasEnvVariables = typeof process !== "undefined" && typeof process.env !== "undefined";

                function env(key) {
                    return hasEnvVariables ? process.env[key] : undefined;
                }

                function getNativePromise() {
                    if (typeof Promise === "function") {
                        try {
                            var promise = new Promise(function () {});
                            if ({}.toString.call(promise) === "[object Promise]") {
                                return Promise;
                            }
                        } catch (e) {}
                    }
                }

                function domainBind(self, cb) {
                    return self.bind(cb);
                }

                var ret = {
                    isClass: isClass,
                    isIdentifier: isIdentifier,
                    inheritedDataKeys: inheritedDataKeys,
                    getDataPropertyOrDefault: getDataPropertyOrDefault,
                    thrower: thrower,
                    isArray: es5.isArray,
                    asArray: asArray,
                    notEnumerableProp: notEnumerableProp,
                    isPrimitive: isPrimitive,
                    isObject: isObject,
                    isError: isError,
                    canEvaluate: canEvaluate,
                    errorObj: errorObj,
                    tryCatch: tryCatch,
                    inherits: inherits$$1,
                    withAppended: withAppended,
                    maybeWrapAsError: maybeWrapAsError,
                    toFastProperties: toFastProperties,
                    filledRange: filledRange,
                    toString: safeToString,
                    canAttachTrace: canAttachTrace,
                    ensureErrorObject: ensureErrorObject,
                    originatesFromRejection: originatesFromRejection,
                    markAsOriginatingFromRejection: markAsOriginatingFromRejection,
                    classString: classString,
                    copyDescriptors: copyDescriptors,
                    hasDevTools: typeof chrome !== "undefined" && chrome && typeof chrome.loadTimes === "function",
                    isNode: isNode,
                    hasEnvVariables: hasEnvVariables,
                    env: env,
                    global: globalObject,
                    getNativePromise: getNativePromise,
                    domainBind: domainBind
                };
                ret.isRecentNode = ret.isNode && function () {
                    var version = process.versions.node.split(".").map(Number);
                    return version[0] === 0 && version[1] > 10 || version[0] > 0;
                }();

                if (ret.isNode) ret.toFastProperties(process);

                try {
                    throw new Error();
                } catch (e) {
                    ret.lastLineError = e;
                }
                module.exports = ret;
            }, { "./es5": 10 }] }, {}, [3])(3);
    });if (typeof window !== 'undefined' && window !== null) {
        window.P = window.Promise;
    } else if (typeof self !== 'undefined' && self !== null) {
        self.P = self.Promise;
    }
});

bluebird_core.config({
  cancellation: true,
  longStackTraces: false,
  warnings: false
});

var Query = function () {
  function Query(analysisType, params) {
    classCallCheck(this, Query);

    this.analysis = analysisType;
    this.params = {};
    this.set(params);

    // Localize timezone if none is set
    if (this.params.timezone === void 0) {
      this.params.timezone = new Date().getTimezoneOffset() * -60;
    }
  }

  createClass(Query, [{
    key: 'set',
    value: function set$$1(attributes) {
      var self = this;
      each_1(attributes, function (v, k) {
        var key = k,
            value = v;
        if (k.match(new RegExp('[A-Z]'))) {
          key = k.replace(/([A-Z])/g, function ($1) {
            return '_' + $1.toLowerCase();
          });
        }
        self.params[key] = value;
        if (value instanceof Array) {
          each_1(value, function (dv, index) {
            if (dv instanceof Array == false && (typeof dv === 'undefined' ? 'undefined' : _typeof(dv)) === 'object') {
              each_1(dv, function (deepValue, deepKey) {
                if (deepKey.match(new RegExp('[A-Z]'))) {
                  var _deepKey = deepKey.replace(/([A-Z])/g, function ($1) {
                    return '_' + $1.toLowerCase();
                  });
                  delete self.params[key][index][deepKey];
                  self.params[key][index][_deepKey] = deepValue;
                }
              });
            }
          });
        }
      });
      return self;
    }
  }, {
    key: 'get',
    value: function get$$1(attribute) {
      var key = attribute;
      if (key.match(new RegExp('[A-Z]'))) {
        key = key.replace(/([A-Z])/g, function ($1) {
          return '_' + $1.toLowerCase();
        });
      }
      if (this.params) {
        return this.params[key] || null;
      }
    }
  }, {
    key: 'addFilter',
    value: function addFilter(property, operator, value) {
      this.params.filters = this.params.filters || [];
      this.params.filters.push({
        'property_name': property,
        'operator': operator,
        'property_value': value
      });
      return this;
    }
  }]);
  return Query;
}();

var Keen$1 = function (_KeenCore) {
  inherits(Keen, _KeenCore);

  function Keen() {
    classCallCheck(this, Keen);
    return possibleConstructorReturn(this, (Keen.__proto__ || Object.getPrototypeOf(Keen)).apply(this, arguments));
  }

  createClass(Keen, [{
    key: 'get',
    value: function get$$1(str) {
      return new this.constructor.Request('GET', str);
    }
  }, {
    key: 'post',
    value: function post(str) {
      return new this.constructor.Request('POST', str);
    }
  }, {
    key: 'put',
    value: function put(str) {
      return new this.constructor.Request('PUT', str);
    }
  }, {
    key: 'del',
    value: function del(str) {
      return new this.constructor.Request('DELETE', str);
    }
  }, {
    key: 'readKey',
    value: function readKey(str) {
      if (!arguments.length) return this.config.readKey;
      this.config.readKey = str ? String(str) : null;
      return this;
    }
  }, {
    key: 'query',
    value: function query(a, b) {
      if (a && b && typeof b === 'string') {
        if (b.indexOf('/result') < 0) {
          b += '/result';
        }
        return this.get(this.url('queries', a, b)).auth(this.readKey()).send();
      } else if (a === 'dataset' && (typeof b === 'undefined' ? 'undefined' : _typeof(b)) === 'object') {
        return this.get(this.url('datasets', b.name, 'results')).auth(this.readKey()).send(b);
      } else if (a && b && (typeof b === 'undefined' ? 'undefined' : _typeof(b)) === 'object') {
        // Include analysis_type for downstream use
        var q = extend_1({ analysis_type: a }, b);
        return this.post(this.url('queries', a)).auth(this.readKey()).send(q);
      } else if (a && !b) {
        return bluebird_core.reject({
          error_code: 'SDKError',
          message: ".query() called with incorrect arguments"
        });
      }
    }
  }, {
    key: 'run',
    value: function run(q, callback) {
      var self = this,
          cb = callback,
          queries,
          promises,
          output;

      callback = null;
      queries = q instanceof Array ? q : [q];
      promises = [];

      each_1(queries, function (query, i) {
        if (typeof query === 'string') {
          promises.push(self.query('saved', query + '/result'));
        } else if (query instanceof Query) {
          // Include analysis_type for downstream use
          promises.push(self.query(query.analysis, extend_1({ analysis_type: query.analysis }, query.params)));
        }
      });

      if (promises.length > 1) {
        output = bluebird_core.all(promises);
      } else {
        // Only return single
        output = promises[0];
      }

      if (cb) {
        // Manually handle callback, as
        // Promise.nodeify drops nulls
        output.then(function (res) {
          cb(null, res);
        });
        output['catch'](function (err) {
          cb(err, null);
        });
      }

      return output;
    }
  }]);
  return Keen;
}(lib);

Keen$1.Query = Query;

var Request = function () {
  function Request(method, str) {
    classCallCheck(this, Request);

    this.config = {
      'api_key': undefined,
      'method': method,
      'params': undefined,
      'timeout': 300 * 1000,
      'url': str,
      'headers': {
        'Authorization': '',
        'Content-type': 'application/json'
      }
    };
  }

  createClass(Request, [{
    key: 'auth',
    value: function auth(str) {
      if (typeof str === 'string') {
        this.config.api_key = typeof str === 'string' ? str : undefined;
        this.headers({
          'Authorization': str
        });
      }
      return this;
    }
  }, {
    key: 'timeout',
    value: function timeout(num) {
      this.config.timeout = typeof num === 'number' ? num : 300 * 1000;
      return this;
    }
  }, {
    key: 'headers',
    value: function headers(obj) {
      if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
        each_1(obj, function (value, key) {
          this.config['headers'][key] = value;
        }.bind(this));
      }
      return this;
    }
  }, {
    key: 'timeout',
    value: function timeout(num) {
      this.config.timeout = typeof num === 'number' ? num : 300 * 1000;
      return this;
    }
  }, {
    key: 'send',
    value: function send(obj) {
      var httpHandler, httpOptions;

      this.config.params = obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' ? obj : {};
      httpHandler = this.constructor.httpHandlers[this.config['method']], httpOptions = extend_1({}, this.config);

      // Temporary mod to append analysis_type to responses
      // for generic HTTP requests to known query resources
      if (typeof httpOptions.params.analysis_type === 'undefined') {
        if (httpOptions.url.indexOf('/queries/') > -1 && httpOptions.url.indexOf('/saved/') < 0) {
          httpOptions.params.analysis_type = getAnalysisType(httpOptions.url);
        }
      }

      return new bluebird_core(function (resolve, reject, onCancel) {
        var httpRequest = httpHandler(httpOptions, function (err, res) {
          var augmentedResponse = res;
          if (err) {
            reject(err);
          } else {
            // Append query object to ad-hoc query results
            if (typeof httpOptions.params.event_collection !== 'undefined' && typeof res.query === 'undefined') {
              augmentedResponse = extend_1({ query: httpOptions.params }, res);
            }
            resolve(augmentedResponse);
          }
        });
        onCancel(function () {
          if (httpRequest.abort) {
            httpRequest.abort();
          }
        });
        return httpRequest;
      });
    }
  }]);
  return Request;
}();

function getAnalysisType(str) {
  var split = str.split('/queries/');
  return split[split.length - 1];
}

var GET = get$1;
var POST = post;
var PUT = put;
var DELETE = del;

// HTTP Handlers
// ------------------------------

function get$1(config, callback) {
  if (xhrObject()) {
    return sendXhr('GET', config, callback);
  } else if (xdrObject()) {
    return sendXdr('GET', config, callback);
  } else {
    return sendJsonp(config, callback);
  }
}

function post(config, callback) {
  if (xhrObject()) {
    return sendXhr('POST', config, callback);
  } else if (xdrObject()) {
    return sendXdr('POST', config, callback);
  } else {
    callback('XHR POST not supported', null);
  }
}

function put(config, callback) {
  if (xhrObject()) {
    return sendXhr('PUT', config, callback);
  } else {
    callback('XHR PUT not supported', null);
  }
}

function del(config, callback) {
  if (xhrObject()) {
    return sendXhr('DELETE', config, callback);
  } else {
    callback('XHR DELETE not supported', null);
  }
}

// XMLHttpRequest Support
// ------------------------------

function xhrObject() {
  var root = 'undefined' == typeof window ? this : window;
  if (root.XMLHttpRequest && ('file:' != root.location.protocol || !root.ActiveXObject)) {
    return new XMLHttpRequest();
  } else {
    try {
      return new ActiveXObject('Microsoft.XMLHTTP');
    } catch (e) {}
    try {
      return new ActiveXObject('Msxml2.XMLHTTP.6.0');
    } catch (e) {}
    try {
      return new ActiveXObject('Msxml2.XMLHTTP.3.0');
    } catch (e) {}
    try {
      return new ActiveXObject('Msxml2.XMLHTTP');
    } catch (e) {}
  }
  return false;
}

function sendXhr(method, config, callback) {
  var xhr = xhrObject(),
      cb = callback,
      url = config.url;

  callback = null;

  xhr.onreadystatechange = function () {
    var response;
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (xhr.status === 204) {
          if (cb) {
            cb(null, xhr);
          }
        } else {
          try {
            response = JSON.parse(xhr.responseText);
            if (cb && response) {
              cb(null, response);
            }
          } catch (e) {
            if (cb) {
              cb(xhr, null);
            }
          }
        }
      } else {
        try {
          response = JSON.parse(xhr.responseText);
          if (cb && response) {
            cb(response, null);
          }
        } catch (e) {
          if (cb) {
            cb(xhr, null);
          }
        }
      }
    }
  };

  if (method !== 'GET') {
    xhr.open(method, url, true);
    each_1(config.headers, function (value, key) {
      if (typeof value === 'string') {
        xhr.setRequestHeader(key, value);
      }
    });
    if (config.params) {
      xhr.send(JSON.stringify(config.params));
    } else {
      xhr.send();
    }
  } else {
    url += '?';
    if (config.api_key) {
      url += 'api_key=' + config.api_key + '&';
    }
    if (config.params) {
      url += serialize_1(config.params);
    }
    xhr.open(method, url, true);
    each_1(config.headers, function (value, key) {
      if (typeof value === 'string') {
        xhr.setRequestHeader(key, value);
      }
    });
    xhr.send();
  }

  return xhr;
}

// XDomainRequest Support
// ------------------------------

function xdrObject() {
  var root = 'undefined' == typeof window ? this : window;
  if (root.XDomainRequest) {
    return new root.XDomainRequest();
  }
  return false;
}

function sendXdr(method, config, callback) {
  var xdr = xdrObject(),
      cb = callback;

  if (xdr) {
    xdr.timeout = config.timeout || 300 * 1000;

    xdr.ontimeout = function () {
      handleResponse(xdr, null);
    };

    xdr.onerror = function () {
      handleResponse(xdr, null);
    };

    xdr.onload = function () {
      var response = JSON.parse(xdr.responseText);
      handleResponse(null, response);
    };

    xdr.open(method.toLowerCase(), config.url);

    setTimeout(function () {
      if (config['params']) {
        xdr.send(serialize_1(config['params']));
      } else {
        xdr.send();
      }
    }, 0);
  }

  function handleResponse(a, b) {
    if (cb && typeof cb === 'function') {
      cb(a, b);
      callback = cb = void 0;
    }
  }

  return xdr;
}

// JSON-P Support
// ------------------------------

function sendJsonp(config, callback) {
  var url = config.url,
      cb = callback,
      timestamp = new Date().getTime(),
      script = document.createElement('script'),
      parent = document.getElementsByTagName('head')[0],
      callbackName = 'keenJSONPCallback',
      loaded = false;

  callbackName += timestamp;
  while (callbackName in window) {
    callbackName += 'a';
  }

  window[callbackName] = function (response) {
    if (loaded === true) {
      return;
    }
    handleResponse(null, response);
  };

  if (config.params) {
    url += serialize_1(config.params);
  }

  // Early IE (no onerror event)
  script.onreadystatechange = function () {
    if (loaded === false && this.readyState === 'loaded') {
      handleResponse('An error occurred', null);
    }
  };

  // Not IE
  script.onerror = function () {
    // on IE9 both onerror and onreadystatechange are called
    if (loaded === false) {
      handleResponse('An error occurred', null);
    }
  };

  script.src = url + '&jsonp=' + callbackName;
  parent.appendChild(script);

  function handleResponse(a, b) {
    loaded = true;
    if (cb && typeof cb === 'function') {
      cb(a, b);
      callback = cb = void 0;
    }
    window[callbackName] = undefined;
    try {
      delete window[callbackName];
    } catch (e) {}
    parent.removeChild(script);
  }
}

var httpHandlers = Object.freeze({
	GET: GET,
	POST: POST,
	PUT: PUT,
	DELETE: DELETE
});

Request.httpHandlers = httpHandlers;
Keen$1.Request = Request;

return Keen$1;

})));
