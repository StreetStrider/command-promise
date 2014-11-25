!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.deps=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseFlatten = require('../internals/baseFlatten'),
    map = require('../collections/map');

/**
 * Flattens a nested array (the nesting can be to any depth). If `isShallow`
 * is truey, the array will only be flattened a single level. If a callback
 * is provided each element of the array is passed through the callback before
 * flattening. The callback is bound to `thisArg` and invoked with three
 * arguments; (value, index, array).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to flatten.
 * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a new flattened array.
 * @example
 *
 * _.flatten([1, [2], [3, [[4]]]]);
 * // => [1, 2, 3, 4];
 *
 * _.flatten([1, [2], [3, [[4]]]], true);
 * // => [1, 2, 3, [[4]]];
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 30, 'pets': ['hoppy'] },
 *   { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.flatten(characters, 'pets');
 * // => ['hoppy', 'baby puss', 'dino']
 */
function flatten(array, isShallow, callback, thisArg) {
  // juggle arguments
  if (typeof isShallow != 'boolean' && isShallow != null) {
    thisArg = callback;
    callback = (typeof isShallow != 'function' && thisArg && thisArg[isShallow] === array) ? null : isShallow;
    isShallow = false;
  }
  if (callback != null) {
    array = map(array, callback, thisArg);
  }
  return baseFlatten(array, isShallow);
}

module.exports = flatten;

},{"../collections/map":2,"../internals/baseFlatten":11}],2:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = require('../functions/createCallback'),
    forOwn = require('../objects/forOwn');

/**
 * Creates an array of values by running each element in the collection
 * through the callback. The callback is bound to `thisArg` and invoked with
 * three arguments; (value, index|key, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @alias collect
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a new array of the results of each `callback` execution.
 * @example
 *
 * _.map([1, 2, 3], function(num) { return num * 3; });
 * // => [3, 6, 9]
 *
 * _.map({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { return num * 3; });
 * // => [3, 6, 9] (property order is not guaranteed across environments)
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.map(characters, 'name');
 * // => ['barney', 'fred']
 */
function map(collection, callback, thisArg) {
  var index = -1,
      length = collection ? collection.length : 0;

  callback = createCallback(callback, thisArg, 3);
  if (typeof length == 'number') {
    var result = Array(length);
    while (++index < length) {
      result[index] = callback(collection[index], index, collection);
    }
  } else {
    result = [];
    forOwn(collection, function(value, key, collection) {
      result[++index] = callback(value, key, collection);
    });
  }
  return result;
}

module.exports = map;

},{"../functions/createCallback":5,"../objects/forOwn":25}],3:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = require('../functions/createCallback'),
    forOwn = require('../objects/forOwn');

/**
 * Reduces a collection to a value which is the accumulated result of running
 * each element in the collection through the callback, where each successive
 * callback execution consumes the return value of the previous execution. If
 * `accumulator` is not provided the first element of the collection will be
 * used as the initial `accumulator` value. The callback is bound to `thisArg`
 * and invoked with four arguments; (accumulator, value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @alias foldl, inject
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [accumulator] Initial value of the accumulator.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the accumulated value.
 * @example
 *
 * var sum = _.reduce([1, 2, 3], function(sum, num) {
 *   return sum + num;
 * });
 * // => 6
 *
 * var mapped = _.reduce({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
 *   result[key] = num * 3;
 *   return result;
 * }, {});
 * // => { 'a': 3, 'b': 6, 'c': 9 }
 */
function reduce(collection, callback, accumulator, thisArg) {
  if (!collection) return accumulator;
  var noaccum = arguments.length < 3;
  callback = createCallback(callback, thisArg, 4);

  var index = -1,
      length = collection.length;

  if (typeof length == 'number') {
    if (noaccum) {
      accumulator = collection[++index];
    }
    while (++index < length) {
      accumulator = callback(accumulator, collection[index], index, collection);
    }
  } else {
    forOwn(collection, function(value, index, collection) {
      accumulator = noaccum
        ? (noaccum = false, value)
        : callback(accumulator, value, index, collection)
    });
  }
  return accumulator;
}

module.exports = reduce;

},{"../functions/createCallback":5,"../objects/forOwn":25}],4:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createWrapper = require('../internals/createWrapper'),
    slice = require('../internals/slice');

/**
 * Creates a function that, when called, invokes `func` with the `this`
 * binding of `thisArg` and prepends any additional `bind` arguments to those
 * provided to the bound function.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to bind.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {...*} [arg] Arguments to be partially applied.
 * @returns {Function} Returns the new bound function.
 * @example
 *
 * var func = function(greeting) {
 *   return greeting + ' ' + this.name;
 * };
 *
 * func = _.bind(func, { 'name': 'fred' }, 'hi');
 * func();
 * // => 'hi fred'
 */
function bind(func, thisArg) {
  return arguments.length > 2
    ? createWrapper(func, 17, slice(arguments, 2), null, thisArg)
    : createWrapper(func, 1, null, null, thisArg);
}

module.exports = bind;

},{"../internals/createWrapper":13,"../internals/slice":22}],5:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = require('../internals/baseCreateCallback'),
    baseIsEqual = require('../internals/baseIsEqual'),
    isObject = require('../objects/isObject'),
    keys = require('../objects/keys'),
    property = require('../utilities/property');

/**
 * Produces a callback bound to an optional `thisArg`. If `func` is a property
 * name the created callback will return the property value for a given element.
 * If `func` is an object the created callback will return `true` for elements
 * that contain the equivalent object properties, otherwise it will return `false`.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {*} [func=identity] The value to convert to a callback.
 * @param {*} [thisArg] The `this` binding of the created callback.
 * @param {number} [argCount] The number of arguments the callback accepts.
 * @returns {Function} Returns a callback function.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * // wrap to create custom callback shorthands
 * _.createCallback = _.wrap(_.createCallback, function(func, callback, thisArg) {
 *   var match = /^(.+?)__([gl]t)(.+)$/.exec(callback);
 *   return !match ? func(callback, thisArg) : function(object) {
 *     return match[2] == 'gt' ? object[match[1]] > match[3] : object[match[1]] < match[3];
 *   };
 * });
 *
 * _.filter(characters, 'age__gt38');
 * // => [{ 'name': 'fred', 'age': 40 }]
 */
function createCallback(func, thisArg, argCount) {
  var type = typeof func;
  if (func == null || type == 'function') {
    return baseCreateCallback(func, thisArg, argCount);
  }
  // handle "_.pluck" style callback shorthands
  if (type != 'object') {
    return property(func);
  }
  var props = keys(func),
      key = props[0],
      a = func[key];

  // handle "_.where" style callback shorthands
  if (props.length == 1 && a === a && !isObject(a)) {
    // fast path the common case of providing an object with a single
    // property containing a primitive value
    return function(object) {
      var b = object[key];
      return a === b && (a !== 0 || (1 / a == 1 / b));
    };
  }
  return function(object) {
    var length = props.length,
        result = false;

    while (length--) {
      if (!(result = baseIsEqual(object[props[length]], func[props[length]], null, true))) {
        break;
      }
    }
    return result;
  };
}

module.exports = createCallback;

},{"../internals/baseCreateCallback":9,"../internals/baseIsEqual":12,"../objects/isObject":29,"../objects/keys":31,"../utilities/property":35}],6:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to pool arrays and objects used internally */
var arrayPool = [];

module.exports = arrayPool;

},{}],7:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreate = require('./baseCreate'),
    isObject = require('../objects/isObject'),
    setBindData = require('./setBindData'),
    slice = require('./slice');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var push = arrayRef.push;

/**
 * The base implementation of `_.bind` that creates the bound function and
 * sets its meta data.
 *
 * @private
 * @param {Array} bindData The bind data array.
 * @returns {Function} Returns the new bound function.
 */
function baseBind(bindData) {
  var func = bindData[0],
      partialArgs = bindData[2],
      thisArg = bindData[4];

  function bound() {
    // `Function#bind` spec
    // http://es5.github.io/#x15.3.4.5
    if (partialArgs) {
      // avoid `arguments` object deoptimizations by using `slice` instead
      // of `Array.prototype.slice.call` and not assigning `arguments` to a
      // variable as a ternary expression
      var args = slice(partialArgs);
      push.apply(args, arguments);
    }
    // mimic the constructor's `return` behavior
    // http://es5.github.io/#x13.2.2
    if (this instanceof bound) {
      // ensure `new bound` is an instance of `func`
      var thisBinding = baseCreate(func.prototype),
          result = func.apply(thisBinding, args || arguments);
      return isObject(result) ? result : thisBinding;
    }
    return func.apply(thisArg, args || arguments);
  }
  setBindData(bound, bindData);
  return bound;
}

module.exports = baseBind;

},{"../objects/isObject":29,"./baseCreate":8,"./setBindData":19,"./slice":22}],8:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = require('./isNative'),
    isObject = require('../objects/isObject'),
    noop = require('../utilities/noop');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(prototype, properties) {
  return isObject(prototype) ? nativeCreate(prototype) : {};
}
// fallback for browsers without `Object.create`
if (!nativeCreate) {
  baseCreate = (function() {
    function Object() {}
    return function(prototype) {
      if (isObject(prototype)) {
        Object.prototype = prototype;
        var result = new Object;
        Object.prototype = null;
      }
      return result || global.Object();
    };
  }());
}

module.exports = baseCreate;

},{"../objects/isObject":29,"../utilities/noop":34,"./isNative":15}],9:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var bind = require('../functions/bind'),
    identity = require('../utilities/identity'),
    setBindData = require('./setBindData'),
    support = require('../support');

/** Used to detected named functions */
var reFuncName = /^\s*function[ \n\r\t]+\w/;

/** Used to detect functions containing a `this` reference */
var reThis = /\bthis\b/;

/** Native method shortcuts */
var fnToString = Function.prototype.toString;

/**
 * The base implementation of `_.createCallback` without support for creating
 * "_.pluck" or "_.where" style callbacks.
 *
 * @private
 * @param {*} [func=identity] The value to convert to a callback.
 * @param {*} [thisArg] The `this` binding of the created callback.
 * @param {number} [argCount] The number of arguments the callback accepts.
 * @returns {Function} Returns a callback function.
 */
function baseCreateCallback(func, thisArg, argCount) {
  if (typeof func != 'function') {
    return identity;
  }
  // exit early for no `thisArg` or already bound by `Function#bind`
  if (typeof thisArg == 'undefined' || !('prototype' in func)) {
    return func;
  }
  var bindData = func.__bindData__;
  if (typeof bindData == 'undefined') {
    if (support.funcNames) {
      bindData = !func.name;
    }
    bindData = bindData || !support.funcDecomp;
    if (!bindData) {
      var source = fnToString.call(func);
      if (!support.funcNames) {
        bindData = !reFuncName.test(source);
      }
      if (!bindData) {
        // checks if `func` references the `this` keyword and stores the result
        bindData = reThis.test(source);
        setBindData(func, bindData);
      }
    }
  }
  // exit early if there are no `this` references or `func` is bound
  if (bindData === false || (bindData !== true && bindData[1] & 1)) {
    return func;
  }
  switch (argCount) {
    case 1: return function(value) {
      return func.call(thisArg, value);
    };
    case 2: return function(a, b) {
      return func.call(thisArg, a, b);
    };
    case 3: return function(value, index, collection) {
      return func.call(thisArg, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(thisArg, accumulator, value, index, collection);
    };
  }
  return bind(func, thisArg);
}

module.exports = baseCreateCallback;

},{"../functions/bind":4,"../support":32,"../utilities/identity":33,"./setBindData":19}],10:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreate = require('./baseCreate'),
    isObject = require('../objects/isObject'),
    setBindData = require('./setBindData'),
    slice = require('./slice');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var push = arrayRef.push;

/**
 * The base implementation of `createWrapper` that creates the wrapper and
 * sets its meta data.
 *
 * @private
 * @param {Array} bindData The bind data array.
 * @returns {Function} Returns the new function.
 */
function baseCreateWrapper(bindData) {
  var func = bindData[0],
      bitmask = bindData[1],
      partialArgs = bindData[2],
      partialRightArgs = bindData[3],
      thisArg = bindData[4],
      arity = bindData[5];

  var isBind = bitmask & 1,
      isBindKey = bitmask & 2,
      isCurry = bitmask & 4,
      isCurryBound = bitmask & 8,
      key = func;

  function bound() {
    var thisBinding = isBind ? thisArg : this;
    if (partialArgs) {
      var args = slice(partialArgs);
      push.apply(args, arguments);
    }
    if (partialRightArgs || isCurry) {
      args || (args = slice(arguments));
      if (partialRightArgs) {
        push.apply(args, partialRightArgs);
      }
      if (isCurry && args.length < arity) {
        bitmask |= 16 & ~32;
        return baseCreateWrapper([func, (isCurryBound ? bitmask : bitmask & ~3), args, null, thisArg, arity]);
      }
    }
    args || (args = arguments);
    if (isBindKey) {
      func = thisBinding[key];
    }
    if (this instanceof bound) {
      thisBinding = baseCreate(func.prototype);
      var result = func.apply(thisBinding, args);
      return isObject(result) ? result : thisBinding;
    }
    return func.apply(thisBinding, args);
  }
  setBindData(bound, bindData);
  return bound;
}

module.exports = baseCreateWrapper;

},{"../objects/isObject":29,"./baseCreate":8,"./setBindData":19,"./slice":22}],11:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isArguments = require('../objects/isArguments'),
    isArray = require('../objects/isArray');

/**
 * The base implementation of `_.flatten` without support for callback
 * shorthands or `thisArg` binding.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
 * @param {boolean} [isStrict=false] A flag to restrict flattening to arrays and `arguments` objects.
 * @param {number} [fromIndex=0] The index to start from.
 * @returns {Array} Returns a new flattened array.
 */
function baseFlatten(array, isShallow, isStrict, fromIndex) {
  var index = (fromIndex || 0) - 1,
      length = array ? array.length : 0,
      result = [];

  while (++index < length) {
    var value = array[index];

    if (value && typeof value == 'object' && typeof value.length == 'number'
        && (isArray(value) || isArguments(value))) {
      // recursively flatten arrays (susceptible to call stack limits)
      if (!isShallow) {
        value = baseFlatten(value, isShallow, isStrict);
      }
      var valIndex = -1,
          valLength = value.length,
          resIndex = result.length;

      result.length += valLength;
      while (++valIndex < valLength) {
        result[resIndex++] = value[valIndex];
      }
    } else if (!isStrict) {
      result.push(value);
    }
  }
  return result;
}

module.exports = baseFlatten;

},{"../objects/isArguments":26,"../objects/isArray":27}],12:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var forIn = require('../objects/forIn'),
    getArray = require('./getArray'),
    isFunction = require('../objects/isFunction'),
    objectTypes = require('./objectTypes'),
    releaseArray = require('./releaseArray');

/** `Object#toString` result shortcuts */
var argsClass = '[object Arguments]',
    arrayClass = '[object Array]',
    boolClass = '[object Boolean]',
    dateClass = '[object Date]',
    numberClass = '[object Number]',
    objectClass = '[object Object]',
    regexpClass = '[object RegExp]',
    stringClass = '[object String]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.isEqual`, without support for `thisArg` binding,
 * that allows partial "_.where" style comparisons.
 *
 * @private
 * @param {*} a The value to compare.
 * @param {*} b The other value to compare.
 * @param {Function} [callback] The function to customize comparing values.
 * @param {Function} [isWhere=false] A flag to indicate performing partial comparisons.
 * @param {Array} [stackA=[]] Tracks traversed `a` objects.
 * @param {Array} [stackB=[]] Tracks traversed `b` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(a, b, callback, isWhere, stackA, stackB) {
  // used to indicate that when comparing objects, `a` has at least the properties of `b`
  if (callback) {
    var result = callback(a, b);
    if (typeof result != 'undefined') {
      return !!result;
    }
  }
  // exit early for identical values
  if (a === b) {
    // treat `+0` vs. `-0` as not equal
    return a !== 0 || (1 / a == 1 / b);
  }
  var type = typeof a,
      otherType = typeof b;

  // exit early for unlike primitive values
  if (a === a &&
      !(a && objectTypes[type]) &&
      !(b && objectTypes[otherType])) {
    return false;
  }
  // exit early for `null` and `undefined` avoiding ES3's Function#call behavior
  // http://es5.github.io/#x15.3.4.4
  if (a == null || b == null) {
    return a === b;
  }
  // compare [[Class]] names
  var className = toString.call(a),
      otherClass = toString.call(b);

  if (className == argsClass) {
    className = objectClass;
  }
  if (otherClass == argsClass) {
    otherClass = objectClass;
  }
  if (className != otherClass) {
    return false;
  }
  switch (className) {
    case boolClass:
    case dateClass:
      // coerce dates and booleans to numbers, dates to milliseconds and booleans
      // to `1` or `0` treating invalid dates coerced to `NaN` as not equal
      return +a == +b;

    case numberClass:
      // treat `NaN` vs. `NaN` as equal
      return (a != +a)
        ? b != +b
        // but treat `+0` vs. `-0` as not equal
        : (a == 0 ? (1 / a == 1 / b) : a == +b);

    case regexpClass:
    case stringClass:
      // coerce regexes to strings (http://es5.github.io/#x15.10.6.4)
      // treat string primitives and their corresponding object instances as equal
      return a == String(b);
  }
  var isArr = className == arrayClass;
  if (!isArr) {
    // unwrap any `lodash` wrapped values
    var aWrapped = hasOwnProperty.call(a, '__wrapped__'),
        bWrapped = hasOwnProperty.call(b, '__wrapped__');

    if (aWrapped || bWrapped) {
      return baseIsEqual(aWrapped ? a.__wrapped__ : a, bWrapped ? b.__wrapped__ : b, callback, isWhere, stackA, stackB);
    }
    // exit for functions and DOM nodes
    if (className != objectClass) {
      return false;
    }
    // in older versions of Opera, `arguments` objects have `Array` constructors
    var ctorA = a.constructor,
        ctorB = b.constructor;

    // non `Object` object instances with different constructors are not equal
    if (ctorA != ctorB &&
          !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) &&
          ('constructor' in a && 'constructor' in b)
        ) {
      return false;
    }
  }
  // assume cyclic structures are equal
  // the algorithm for detecting cyclic structures is adapted from ES 5.1
  // section 15.12.3, abstract operation `JO` (http://es5.github.io/#x15.12.3)
  var initedStack = !stackA;
  stackA || (stackA = getArray());
  stackB || (stackB = getArray());

  var length = stackA.length;
  while (length--) {
    if (stackA[length] == a) {
      return stackB[length] == b;
    }
  }
  var size = 0;
  result = true;

  // add `a` and `b` to the stack of traversed objects
  stackA.push(a);
  stackB.push(b);

  // recursively compare objects and arrays (susceptible to call stack limits)
  if (isArr) {
    // compare lengths to determine if a deep comparison is necessary
    length = a.length;
    size = b.length;
    result = size == length;

    if (result || isWhere) {
      // deep compare the contents, ignoring non-numeric properties
      while (size--) {
        var index = length,
            value = b[size];

        if (isWhere) {
          while (index--) {
            if ((result = baseIsEqual(a[index], value, callback, isWhere, stackA, stackB))) {
              break;
            }
          }
        } else if (!(result = baseIsEqual(a[size], value, callback, isWhere, stackA, stackB))) {
          break;
        }
      }
    }
  }
  else {
    // deep compare objects using `forIn`, instead of `forOwn`, to avoid `Object.keys`
    // which, in this case, is more costly
    forIn(b, function(value, key, b) {
      if (hasOwnProperty.call(b, key)) {
        // count the number of properties.
        size++;
        // deep compare each property value.
        return (result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, callback, isWhere, stackA, stackB));
      }
    });

    if (result && !isWhere) {
      // ensure both objects have the same number of properties
      forIn(a, function(value, key, a) {
        if (hasOwnProperty.call(a, key)) {
          // `size` will be `-1` if `a` has more properties than `b`
          return (result = --size > -1);
        }
      });
    }
  }
  stackA.pop();
  stackB.pop();

  if (initedStack) {
    releaseArray(stackA);
    releaseArray(stackB);
  }
  return result;
}

module.exports = baseIsEqual;

},{"../objects/forIn":24,"../objects/isFunction":28,"./getArray":14,"./objectTypes":17,"./releaseArray":18}],13:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseBind = require('./baseBind'),
    baseCreateWrapper = require('./baseCreateWrapper'),
    isFunction = require('../objects/isFunction'),
    slice = require('./slice');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var push = arrayRef.push,
    unshift = arrayRef.unshift;

/**
 * Creates a function that, when called, either curries or invokes `func`
 * with an optional `this` binding and partially applied arguments.
 *
 * @private
 * @param {Function|string} func The function or method name to reference.
 * @param {number} bitmask The bitmask of method flags to compose.
 *  The bitmask may be composed of the following flags:
 *  1 - `_.bind`
 *  2 - `_.bindKey`
 *  4 - `_.curry`
 *  8 - `_.curry` (bound)
 *  16 - `_.partial`
 *  32 - `_.partialRight`
 * @param {Array} [partialArgs] An array of arguments to prepend to those
 *  provided to the new function.
 * @param {Array} [partialRightArgs] An array of arguments to append to those
 *  provided to the new function.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new function.
 */
function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
  var isBind = bitmask & 1,
      isBindKey = bitmask & 2,
      isCurry = bitmask & 4,
      isCurryBound = bitmask & 8,
      isPartial = bitmask & 16,
      isPartialRight = bitmask & 32;

  if (!isBindKey && !isFunction(func)) {
    throw new TypeError;
  }
  if (isPartial && !partialArgs.length) {
    bitmask &= ~16;
    isPartial = partialArgs = false;
  }
  if (isPartialRight && !partialRightArgs.length) {
    bitmask &= ~32;
    isPartialRight = partialRightArgs = false;
  }
  var bindData = func && func.__bindData__;
  if (bindData && bindData !== true) {
    // clone `bindData`
    bindData = slice(bindData);
    if (bindData[2]) {
      bindData[2] = slice(bindData[2]);
    }
    if (bindData[3]) {
      bindData[3] = slice(bindData[3]);
    }
    // set `thisBinding` is not previously bound
    if (isBind && !(bindData[1] & 1)) {
      bindData[4] = thisArg;
    }
    // set if previously bound but not currently (subsequent curried functions)
    if (!isBind && bindData[1] & 1) {
      bitmask |= 8;
    }
    // set curried arity if not yet set
    if (isCurry && !(bindData[1] & 4)) {
      bindData[5] = arity;
    }
    // append partial left arguments
    if (isPartial) {
      push.apply(bindData[2] || (bindData[2] = []), partialArgs);
    }
    // append partial right arguments
    if (isPartialRight) {
      unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs);
    }
    // merge flags
    bindData[1] |= bitmask;
    return createWrapper.apply(null, bindData);
  }
  // fast path for `_.bind`
  var creater = (bitmask == 1 || bitmask === 17) ? baseBind : baseCreateWrapper;
  return creater([func, bitmask, partialArgs, partialRightArgs, thisArg, arity]);
}

module.exports = createWrapper;

},{"../objects/isFunction":28,"./baseBind":7,"./baseCreateWrapper":10,"./slice":22}],14:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var arrayPool = require('./arrayPool');

/**
 * Gets an array from the array pool or creates a new one if the pool is empty.
 *
 * @private
 * @returns {Array} The array from the pool.
 */
function getArray() {
  return arrayPool.pop() || [];
}

module.exports = getArray;

},{"./arrayPool":6}],15:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/** Used to detect if a method is native */
var reNative = RegExp('^' +
  String(toString)
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/toString| for [^\]]+/g, '.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a native function, else `false`.
 */
function isNative(value) {
  return typeof value == 'function' && reNative.test(value);
}

module.exports = isNative;

},{}],16:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used as the max size of the `arrayPool` and `objectPool` */
var maxPoolSize = 40;

module.exports = maxPoolSize;

},{}],17:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to determine if values are of the language type Object */
var objectTypes = {
  'boolean': false,
  'function': true,
  'object': true,
  'number': false,
  'string': false,
  'undefined': false
};

module.exports = objectTypes;

},{}],18:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var arrayPool = require('./arrayPool'),
    maxPoolSize = require('./maxPoolSize');

/**
 * Releases the given array back to the array pool.
 *
 * @private
 * @param {Array} [array] The array to release.
 */
function releaseArray(array) {
  array.length = 0;
  if (arrayPool.length < maxPoolSize) {
    arrayPool.push(array);
  }
}

module.exports = releaseArray;

},{"./arrayPool":6,"./maxPoolSize":16}],19:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = require('./isNative'),
    noop = require('../utilities/noop');

/** Used as the property descriptor for `__bindData__` */
var descriptor = {
  'configurable': false,
  'enumerable': false,
  'value': null,
  'writable': false
};

/** Used to set meta data on functions */
var defineProperty = (function() {
  // IE 8 only accepts DOM elements
  try {
    var o = {},
        func = isNative(func = Object.defineProperty) && func,
        result = func(o, o, o) && func;
  } catch(e) { }
  return result;
}());

/**
 * Sets `this` binding data on a given function.
 *
 * @private
 * @param {Function} func The function to set data on.
 * @param {Array} value The data array to set.
 */
var setBindData = !defineProperty ? noop : function(func, value) {
  descriptor.value = value;
  defineProperty(func, '__bindData__', descriptor);
};

module.exports = setBindData;

},{"../utilities/noop":34,"./isNative":15}],20:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var forIn = require('../objects/forIn'),
    isFunction = require('../objects/isFunction');

/** `Object#toString` result shortcuts */
var objectClass = '[object Object]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A fallback implementation of `isPlainObject` which checks if a given value
 * is an object created by the `Object` constructor, assuming objects created
 * by the `Object` constructor have no inherited enumerable properties and that
 * there are no `Object.prototype` extensions.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 */
function shimIsPlainObject(value) {
  var ctor,
      result;

  // avoid non Object objects, `arguments` objects, and DOM elements
  if (!(value && toString.call(value) == objectClass) ||
      (ctor = value.constructor, isFunction(ctor) && !(ctor instanceof ctor))) {
    return false;
  }
  // In most environments an object's own properties are iterated before
  // its inherited properties. If the last iterated property is an object's
  // own property then there are no inherited enumerable properties.
  forIn(value, function(value, key) {
    result = key;
  });
  return typeof result == 'undefined' || hasOwnProperty.call(value, result);
}

module.exports = shimIsPlainObject;

},{"../objects/forIn":24,"../objects/isFunction":28}],21:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var objectTypes = require('./objectTypes');

/** Used for native method references */
var objectProto = Object.prototype;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A fallback implementation of `Object.keys` which produces an array of the
 * given object's own enumerable property names.
 *
 * @private
 * @type Function
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns an array of property names.
 */
var shimKeys = function(object) {
  var index, iterable = object, result = [];
  if (!iterable) return result;
  if (!(objectTypes[typeof object])) return result;
    for (index in iterable) {
      if (hasOwnProperty.call(iterable, index)) {
        result.push(index);
      }
    }
  return result
};

module.exports = shimKeys;

},{"./objectTypes":17}],22:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Slices the `collection` from the `start` index up to, but not including,
 * the `end` index.
 *
 * Note: This function is used instead of `Array#slice` to support node lists
 * in IE < 9 and to ensure dense arrays are returned.
 *
 * @private
 * @param {Array|Object|string} collection The collection to slice.
 * @param {number} start The start index.
 * @param {number} end The end index.
 * @returns {Array} Returns the new array.
 */
function slice(array, start, end) {
  start || (start = 0);
  if (typeof end == 'undefined') {
    end = array ? array.length : 0;
  }
  var index = -1,
      length = end - start || 0,
      result = Array(length < 0 ? 0 : length);

  while (++index < length) {
    result[index] = array[start + index];
  }
  return result;
}

module.exports = slice;

},{}],23:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = require('../internals/baseCreateCallback'),
    keys = require('./keys'),
    objectTypes = require('../internals/objectTypes');

/**
 * Assigns own enumerable properties of source object(s) to the destination
 * object. Subsequent sources will overwrite property assignments of previous
 * sources. If a callback is provided it will be executed to produce the
 * assigned values. The callback is bound to `thisArg` and invoked with two
 * arguments; (objectValue, sourceValue).
 *
 * @static
 * @memberOf _
 * @type Function
 * @alias extend
 * @category Objects
 * @param {Object} object The destination object.
 * @param {...Object} [source] The source objects.
 * @param {Function} [callback] The function to customize assigning values.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns the destination object.
 * @example
 *
 * _.assign({ 'name': 'fred' }, { 'employer': 'slate' });
 * // => { 'name': 'fred', 'employer': 'slate' }
 *
 * var defaults = _.partialRight(_.assign, function(a, b) {
 *   return typeof a == 'undefined' ? b : a;
 * });
 *
 * var object = { 'name': 'barney' };
 * defaults(object, { 'name': 'fred', 'employer': 'slate' });
 * // => { 'name': 'barney', 'employer': 'slate' }
 */
var assign = function(object, source, guard) {
  var index, iterable = object, result = iterable;
  if (!iterable) return result;
  var args = arguments,
      argsIndex = 0,
      argsLength = typeof guard == 'number' ? 2 : args.length;
  if (argsLength > 3 && typeof args[argsLength - 2] == 'function') {
    var callback = baseCreateCallback(args[--argsLength - 1], args[argsLength--], 2);
  } else if (argsLength > 2 && typeof args[argsLength - 1] == 'function') {
    callback = args[--argsLength];
  }
  while (++argsIndex < argsLength) {
    iterable = args[argsIndex];
    if (iterable && objectTypes[typeof iterable]) {
    var ownIndex = -1,
        ownProps = objectTypes[typeof iterable] && keys(iterable),
        length = ownProps ? ownProps.length : 0;

    while (++ownIndex < length) {
      index = ownProps[ownIndex];
      result[index] = callback ? callback(result[index], iterable[index]) : iterable[index];
    }
    }
  }
  return result
};

module.exports = assign;

},{"../internals/baseCreateCallback":9,"../internals/objectTypes":17,"./keys":31}],24:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = require('../internals/baseCreateCallback'),
    objectTypes = require('../internals/objectTypes');

/**
 * Iterates over own and inherited enumerable properties of an object,
 * executing the callback for each property. The callback is bound to `thisArg`
 * and invoked with three arguments; (value, key, object). Callbacks may exit
 * iteration early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Objects
 * @param {Object} object The object to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function Shape() {
 *   this.x = 0;
 *   this.y = 0;
 * }
 *
 * Shape.prototype.move = function(x, y) {
 *   this.x += x;
 *   this.y += y;
 * };
 *
 * _.forIn(new Shape, function(value, key) {
 *   console.log(key);
 * });
 * // => logs 'x', 'y', and 'move' (property order is not guaranteed across environments)
 */
var forIn = function(collection, callback, thisArg) {
  var index, iterable = collection, result = iterable;
  if (!iterable) return result;
  if (!objectTypes[typeof iterable]) return result;
  callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
    for (index in iterable) {
      if (callback(iterable[index], index, collection) === false) return result;
    }
  return result
};

module.exports = forIn;

},{"../internals/baseCreateCallback":9,"../internals/objectTypes":17}],25:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = require('../internals/baseCreateCallback'),
    keys = require('./keys'),
    objectTypes = require('../internals/objectTypes');

/**
 * Iterates over own enumerable properties of an object, executing the callback
 * for each property. The callback is bound to `thisArg` and invoked with three
 * arguments; (value, key, object). Callbacks may exit iteration early by
 * explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Objects
 * @param {Object} object The object to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * _.forOwn({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
 *   console.log(key);
 * });
 * // => logs '0', '1', and 'length' (property order is not guaranteed across environments)
 */
var forOwn = function(collection, callback, thisArg) {
  var index, iterable = collection, result = iterable;
  if (!iterable) return result;
  if (!objectTypes[typeof iterable]) return result;
  callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
    var ownIndex = -1,
        ownProps = objectTypes[typeof iterable] && keys(iterable),
        length = ownProps ? ownProps.length : 0;

    while (++ownIndex < length) {
      index = ownProps[ownIndex];
      if (callback(iterable[index], index, collection) === false) return result;
    }
  return result
};

module.exports = forOwn;

},{"../internals/baseCreateCallback":9,"../internals/objectTypes":17,"./keys":31}],26:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** `Object#toString` result shortcuts */
var argsClass = '[object Arguments]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/**
 * Checks if `value` is an `arguments` object.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is an `arguments` object, else `false`.
 * @example
 *
 * (function() { return _.isArguments(arguments); })(1, 2, 3);
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  return value && typeof value == 'object' && typeof value.length == 'number' &&
    toString.call(value) == argsClass || false;
}

module.exports = isArguments;

},{}],27:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = require('../internals/isNative');

/** `Object#toString` result shortcuts */
var arrayClass = '[object Array]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray;

/**
 * Checks if `value` is an array.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is an array, else `false`.
 * @example
 *
 * (function() { return _.isArray(arguments); })();
 * // => false
 *
 * _.isArray([1, 2, 3]);
 * // => true
 */
var isArray = nativeIsArray || function(value) {
  return value && typeof value == 'object' && typeof value.length == 'number' &&
    toString.call(value) == arrayClass || false;
};

module.exports = isArray;

},{"../internals/isNative":15}],28:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Checks if `value` is a function.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 */
function isFunction(value) {
  return typeof value == 'function';
}

module.exports = isFunction;

},{}],29:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var objectTypes = require('../internals/objectTypes');

/**
 * Checks if `value` is the language type of Object.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // check if the value is the ECMAScript language type of Object
  // http://es5.github.io/#x8
  // and avoid a V8 bug
  // http://code.google.com/p/v8/issues/detail?id=2291
  return !!(value && objectTypes[typeof value]);
}

module.exports = isObject;

},{"../internals/objectTypes":17}],30:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = require('../internals/isNative'),
    shimIsPlainObject = require('../internals/shimIsPlainObject');

/** `Object#toString` result shortcuts */
var objectClass = '[object Object]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/** Native method shortcuts */
var getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf;

/**
 * Checks if `value` is an object created by the `Object` constructor.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Shape() {
 *   this.x = 0;
 *   this.y = 0;
 * }
 *
 * _.isPlainObject(new Shape);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 */
var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function(value) {
  if (!(value && toString.call(value) == objectClass)) {
    return false;
  }
  var valueOf = value.valueOf,
      objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);

  return objProto
    ? (value == objProto || getPrototypeOf(value) == objProto)
    : shimIsPlainObject(value);
};

module.exports = isPlainObject;

},{"../internals/isNative":15,"../internals/shimIsPlainObject":20}],31:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = require('../internals/isNative'),
    isObject = require('./isObject'),
    shimKeys = require('../internals/shimKeys');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;

/**
 * Creates an array composed of the own enumerable property names of an object.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns an array of property names.
 * @example
 *
 * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
 * // => ['one', 'two', 'three'] (property order is not guaranteed across environments)
 */
var keys = !nativeKeys ? shimKeys : function(object) {
  if (!isObject(object)) {
    return [];
  }
  return nativeKeys(object);
};

module.exports = keys;

},{"../internals/isNative":15,"../internals/shimKeys":21,"./isObject":29}],32:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = require('./internals/isNative');

/** Used to detect functions containing a `this` reference */
var reThis = /\bthis\b/;

/**
 * An object used to flag environments features.
 *
 * @static
 * @memberOf _
 * @type Object
 */
var support = {};

/**
 * Detect if functions can be decompiled by `Function#toString`
 * (all but PS3 and older Opera mobile browsers & avoided in Windows 8 apps).
 *
 * @memberOf _.support
 * @type boolean
 */
support.funcDecomp = !isNative(global.WinRTError) && reThis.test(function() { return this; });

/**
 * Detect if `Function#name` is supported (all but IE).
 *
 * @memberOf _.support
 * @type boolean
 */
support.funcNames = typeof Function.name == 'string';

module.exports = support;

},{"./internals/isNative":15}],33:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * This method returns the first argument provided to it.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'name': 'fred' };
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],34:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * A no-operation function.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @example
 *
 * var object = { 'name': 'fred' };
 * _.noop(object) === undefined;
 * // => true
 */
function noop() {
  // no operation performed
}

module.exports = noop;

},{}],35:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Creates a "_.pluck" style function, which returns the `key` value of a
 * given object.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {string} key The name of the property to retrieve.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var characters = [
 *   { 'name': 'fred',   'age': 40 },
 *   { 'name': 'barney', 'age': 36 }
 * ];
 *
 * var getName = _.property('name');
 *
 * _.map(characters, getName);
 * // => ['barney', 'fred']
 *
 * _.sortBy(characters, getName);
 * // => [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred',   'age': 40 }]
 */
function property(key) {
  return function(object) {
    return object[key];
  };
}

module.exports = property;

},{}],36:[function(require,module,exports){
'use strict';

module.exports = require('./lib/core.js')
require('./lib/done.js')
require('./lib/es6-extensions.js')
require('./lib/node-extensions.js')
},{"./lib/core.js":37,"./lib/done.js":38,"./lib/es6-extensions.js":39,"./lib/node-extensions.js":40}],37:[function(require,module,exports){
'use strict';

var asap = require('asap')

module.exports = Promise;
function Promise(fn) {
  if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new')
  if (typeof fn !== 'function') throw new TypeError('not a function')
  var state = null
  var value = null
  var deferreds = []
  var self = this

  this.then = function(onFulfilled, onRejected) {
    return new self.constructor(function(resolve, reject) {
      handle(new Handler(onFulfilled, onRejected, resolve, reject))
    })
  }

  function handle(deferred) {
    if (state === null) {
      deferreds.push(deferred)
      return
    }
    asap(function() {
      var cb = state ? deferred.onFulfilled : deferred.onRejected
      if (cb === null) {
        (state ? deferred.resolve : deferred.reject)(value)
        return
      }
      var ret
      try {
        ret = cb(value)
      }
      catch (e) {
        deferred.reject(e)
        return
      }
      deferred.resolve(ret)
    })
  }

  function resolve(newValue) {
    try { //Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.')
      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
        var then = newValue.then
        if (typeof then === 'function') {
          doResolve(then.bind(newValue), resolve, reject)
          return
        }
      }
      state = true
      value = newValue
      finale()
    } catch (e) { reject(e) }
  }

  function reject(newValue) {
    state = false
    value = newValue
    finale()
  }

  function finale() {
    for (var i = 0, len = deferreds.length; i < len; i++)
      handle(deferreds[i])
    deferreds = null
  }

  doResolve(fn, resolve, reject)
}


function Handler(onFulfilled, onRejected, resolve, reject){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null
  this.onRejected = typeof onRejected === 'function' ? onRejected : null
  this.resolve = resolve
  this.reject = reject
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, onFulfilled, onRejected) {
  var done = false;
  try {
    fn(function (value) {
      if (done) return
      done = true
      onFulfilled(value)
    }, function (reason) {
      if (done) return
      done = true
      onRejected(reason)
    })
  } catch (ex) {
    if (done) return
    done = true
    onRejected(ex)
  }
}

},{"asap":41}],38:[function(require,module,exports){
'use strict';

var Promise = require('./core.js')
var asap = require('asap')

module.exports = Promise
Promise.prototype.done = function (onFulfilled, onRejected) {
  var self = arguments.length ? this.then.apply(this, arguments) : this
  self.then(null, function (err) {
    asap(function () {
      throw err
    })
  })
}
},{"./core.js":37,"asap":41}],39:[function(require,module,exports){
'use strict';

//This file contains the ES6 extensions to the core Promises/A+ API

var Promise = require('./core.js')
var asap = require('asap')

module.exports = Promise

/* Static Functions */

function ValuePromise(value) {
  this.then = function (onFulfilled) {
    if (typeof onFulfilled !== 'function') return this
    return new Promise(function (resolve, reject) {
      asap(function () {
        try {
          resolve(onFulfilled(value))
        } catch (ex) {
          reject(ex);
        }
      })
    })
  }
}
ValuePromise.prototype = Promise.prototype

var TRUE = new ValuePromise(true)
var FALSE = new ValuePromise(false)
var NULL = new ValuePromise(null)
var UNDEFINED = new ValuePromise(undefined)
var ZERO = new ValuePromise(0)
var EMPTYSTRING = new ValuePromise('')

Promise.resolve = function (value) {
  if (value instanceof Promise) return value

  if (value === null) return NULL
  if (value === undefined) return UNDEFINED
  if (value === true) return TRUE
  if (value === false) return FALSE
  if (value === 0) return ZERO
  if (value === '') return EMPTYSTRING

  if (typeof value === 'object' || typeof value === 'function') {
    try {
      var then = value.then
      if (typeof then === 'function') {
        return new Promise(then.bind(value))
      }
    } catch (ex) {
      return new Promise(function (resolve, reject) {
        reject(ex)
      })
    }
  }

  return new ValuePromise(value)
}

Promise.all = function (arr) {
  var args = Array.prototype.slice.call(arr)

  return new Promise(function (resolve, reject) {
    if (args.length === 0) return resolve([])
    var remaining = args.length
    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then
          if (typeof then === 'function') {
            then.call(val, function (val) { res(i, val) }, reject)
            return
          }
        }
        args[i] = val
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex)
      }
    }
    for (var i = 0; i < args.length; i++) {
      res(i, args[i])
    }
  })
}

Promise.reject = function (value) {
  return new Promise(function (resolve, reject) { 
    reject(value);
  });
}

Promise.race = function (values) {
  return new Promise(function (resolve, reject) { 
    values.forEach(function(value){
      Promise.resolve(value).then(resolve, reject);
    })
  });
}

/* Prototype Methods */

Promise.prototype['catch'] = function (onRejected) {
  return this.then(null, onRejected);
}

},{"./core.js":37,"asap":41}],40:[function(require,module,exports){
'use strict';

//This file contains then/promise specific extensions that are only useful for node.js interop

var Promise = require('./core.js')
var asap = require('asap')

module.exports = Promise

/* Static Functions */

Promise.denodeify = function (fn, argumentCount) {
  argumentCount = argumentCount || Infinity
  return function () {
    var self = this
    var args = Array.prototype.slice.call(arguments)
    return new Promise(function (resolve, reject) {
      while (args.length && args.length > argumentCount) {
        args.pop()
      }
      args.push(function (err, res) {
        if (err) reject(err)
        else resolve(res)
      })
      fn.apply(self, args)
    })
  }
}
Promise.nodeify = function (fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments)
    var callback = typeof args[args.length - 1] === 'function' ? args.pop() : null
    var ctx = this
    try {
      return fn.apply(this, arguments).nodeify(callback, ctx)
    } catch (ex) {
      if (callback === null || typeof callback == 'undefined') {
        return new Promise(function (resolve, reject) { reject(ex) })
      } else {
        asap(function () {
          callback.call(ctx, ex)
        })
      }
    }
  }
}

Promise.prototype.nodeify = function (callback, ctx) {
  if (typeof callback != 'function') return this

  this.then(function (value) {
    asap(function () {
      callback.call(ctx, null, value)
    })
  }, function (err) {
    asap(function () {
      callback.call(ctx, err)
    })
  })
}

},{"./core.js":37,"asap":41}],41:[function(require,module,exports){

// Use the fastest possible means to execute a task in a future turn
// of the event loop.

// linked list of tasks (single, with head node)
var head = {task: void 0, next: null};
var tail = head;
var flushing = false;
var requestFlush = void 0;
var isNodeJS = false;

function flush() {
    /* jshint loopfunc: true */

    while (head.next) {
        head = head.next;
        var task = head.task;
        head.task = void 0;
        var domain = head.domain;

        if (domain) {
            head.domain = void 0;
            domain.enter();
        }

        try {
            task();

        } catch (e) {
            if (isNodeJS) {
                // In node, uncaught exceptions are considered fatal errors.
                // Re-throw them synchronously to interrupt flushing!

                // Ensure continuation if the uncaught exception is suppressed
                // listening "uncaughtException" events (as domains does).
                // Continue in next event to avoid tick recursion.
                if (domain) {
                    domain.exit();
                }
                setTimeout(flush, 0);
                if (domain) {
                    domain.enter();
                }

                throw e;

            } else {
                // In browsers, uncaught exceptions are not fatal.
                // Re-throw them asynchronously to avoid slow-downs.
                setTimeout(function() {
                   throw e;
                }, 0);
            }
        }

        if (domain) {
            domain.exit();
        }
    }

    flushing = false;
}

if (typeof process !== "undefined" && process.nextTick) {
    // Node.js before 0.9. Note that some fake-Node environments, like the
    // Mocha test runner, introduce a `process` global without a `nextTick`.
    isNodeJS = true;

    requestFlush = function () {
        process.nextTick(flush);
    };

} else if (typeof setImmediate === "function") {
    // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
    if (typeof window !== "undefined") {
        requestFlush = setImmediate.bind(window, flush);
    } else {
        requestFlush = function () {
            setImmediate(flush);
        };
    }

} else if (typeof MessageChannel !== "undefined") {
    // modern browsers
    // http://www.nonblocking.io/2011/06/windownexttick.html
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    requestFlush = function () {
        channel.port2.postMessage(0);
    };

} else {
    // old browsers
    requestFlush = function () {
        setTimeout(flush, 0);
    };
}

function asap(task) {
    tail = tail.next = {
        task: task,
        domain: isNodeJS && process.domain,
        next: null
    };

    if (!flushing) {
        flushing = true;
        requestFlush();
    }
};

module.exports = asap;


},{}],42:[function(require,module,exports){



module.exports =
{
	flat: require('lodash-node/modern/arrays/flatten'),
	reduce: require('lodash-node/modern/collections/reduce'),
	isPlain: require('lodash-node/modern/objects/isPlainObject'),
	extend: require('lodash-node/modern/objects/assign'),

	promise: require('promise')
}

},{"lodash-node/modern/arrays/flatten":1,"lodash-node/modern/collections/reduce":3,"lodash-node/modern/objects/assign":23,"lodash-node/modern/objects/isPlainObject":30,"promise":36}]},{},[42])(42)
});