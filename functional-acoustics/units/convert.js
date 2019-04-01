/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

var lodash_keys = keys;

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
    funcTag$1 = '[object Function]',
    genTag$1 = '[object GeneratorFunction]';

/** Used to detect unsigned integer values. */
var reIsUint$1 = /^(?:0|[1-9]\d*)$/;

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes$1(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg$1(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString$1 = objectProto$1.toString;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$1.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys$1 = overArg$1(Object.keys, Object);

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys$1(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray$1(value) || isArguments$1(value))
    ? baseTimes$1(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$1.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex$1(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys$1);
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys$1(object) {
  if (!isPrototype$1(object)) {
    return nativeKeys$1(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$1.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike$1(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex$1(value, length) {
  length = length == null ? MAX_SAFE_INTEGER$1 : length;
  return !!length &&
    (typeof value == 'number' || reIsUint$1.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype$1(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$1;

  return value === proto;
}

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _([1, 2]).forEach(function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray$1(collection) ? arrayEach : baseEach;
  return func(collection, typeof iteratee == 'function' ? iteratee : identity);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments$1(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject$1(value) && hasOwnProperty$1.call(value, 'callee') &&
    (!propertyIsEnumerable$1.call(value, 'callee') || objectToString$1.call(value) == argsTag$1);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray$1 = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike$1(value) {
  return value != null && isLength$1(value.length) && !isFunction$1(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject$1(value) {
  return isObjectLike$1(value) && isArrayLike$1(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction$1(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject$1(value) ? objectToString$1.call(value) : '';
  return tag == funcTag$1 || tag == genTag$1;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength$1(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$1(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike$1(value) {
  return !!value && typeof value == 'object';
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys$1(object) {
  return isArrayLike$1(object) ? arrayLikeKeys$1(object) : baseKeys$1(object);
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

var lodash_foreach = forEach;

var metric, imperial;
metric = {
  mm: {
    name: {
      singular: 'Millimeter',
      plural: 'Millimeters'
    },
    to_anchor: 1 / 1000
  },
  cm: {
    name: {
      singular: 'Centimeter',
      plural: 'Centimeters'
    },
    to_anchor: 1 / 100
  },
  m: {
    name: {
      singular: 'Meter',
      plural: 'Meters'
    },
    to_anchor: 1
  },
  km: {
    name: {
      singular: 'Kilometer',
      plural: 'Kilometers'
    },
    to_anchor: 1000
  }
};
imperial = {
  'in': {
    name: {
      singular: 'Inch',
      plural: 'Inches'
    },
    to_anchor: 1 / 12
  },
  yd: {
    name: {
      singular: 'Yard',
      plural: 'Yards'
    },
    to_anchor: 3
  },
  'ft-us': {
    name: {
      singular: 'US Survey Foot',
      plural: 'US Survey Feet'
    },
    to_anchor: 1.000002
  },
  ft: {
    name: {
      singular: 'Foot',
      plural: 'Feet'
    },
    to_anchor: 1
  },
  fathom: {
    name: {
      singular: 'Fathom',
      plural: 'Fathoms'
    },
    to_anchor: 6
  },
  mi: {
    name: {
      singular: 'Mile',
      plural: 'Miles'
    },
    to_anchor: 5280
  },
  nMi: {
    name: {
      singular: 'Nautical Mile',
      plural: 'Nautical Miles'
    },
    to_anchor: 6076.12
  }
};
var length = {
  metric: metric,
  imperial: imperial,
  _anchors: {
    metric: {
      unit: 'm',
      ratio: 3.28084
    },
    imperial: {
      unit: 'ft',
      ratio: 1 / 3.28084
    }
  }
};

var metric$1, imperial$1;
metric$1 = {
  mm2: {
    name: {
      singular: 'Square Millimeter',
      plural: 'Square Millimeters'
    },
    to_anchor: 1 / 1000000
  },
  cm2: {
    name: {
      singular: 'Centimeter',
      plural: 'Centimeters'
    },
    to_anchor: 1 / 10000
  },
  m2: {
    name: {
      singular: 'Square Meter',
      plural: 'Square Meters'
    },
    to_anchor: 1
  },
  ha: {
    name: {
      singular: 'Hectare',
      plural: 'Hectares'
    },
    to_anchor: 10000
  },
  km2: {
    name: {
      singular: 'Square Kilometer',
      plural: 'Square Kilometers'
    },
    to_anchor: 1000000
  }
};
imperial$1 = {
  'in2': {
    name: {
      singular: 'Square Inch',
      plural: 'Square Inches'
    },
    to_anchor: 1 / 144
  },
  yd2: {
    name: {
      singular: 'Square Yard',
      plural: 'Square Yards'
    },
    to_anchor: 9
  },
  ft2: {
    name: {
      singular: 'Square Foot',
      plural: 'Square Feet'
    },
    to_anchor: 1
  },
  ac: {
    name: {
      singular: 'Acre',
      plural: 'Acres'
    },
    to_anchor: 43560
  },
  mi2: {
    name: {
      singular: 'Square Mile',
      plural: 'Square Miles'
    },
    to_anchor: 27878400
  }
};
var area = {
  metric: metric$1,
  imperial: imperial$1,
  _anchors: {
    metric: {
      unit: 'm2',
      ratio: 10.7639
    },
    imperial: {
      unit: 'ft2',
      ratio: 1 / 10.7639
    }
  }
};

var metric$2, imperial$2;
metric$2 = {
  mcg: {
    name: {
      singular: 'Microgram',
      plural: 'Micrograms'
    },
    to_anchor: 1 / 1000000
  },
  mg: {
    name: {
      singular: 'Milligram',
      plural: 'Milligrams'
    },
    to_anchor: 1 / 1000
  },
  g: {
    name: {
      singular: 'Gram',
      plural: 'Grams'
    },
    to_anchor: 1
  },
  kg: {
    name: {
      singular: 'Kilogram',
      plural: 'Kilograms'
    },
    to_anchor: 1000
  },
  mt: {
    name: {
      singular: 'Metric Tonne',
      plural: 'Metric Tonnes'
    },
    to_anchor: 1000000
  }
};
imperial$2 = {
  oz: {
    name: {
      singular: 'Ounce',
      plural: 'Ounces'
    },
    to_anchor: 1 / 16
  },
  lb: {
    name: {
      singular: 'Pound',
      plural: 'Pounds'
    },
    to_anchor: 1
  },
  t: {
    name: {
      singular: 'Ton',
      plural: 'Tons'
    },
    to_anchor: 2000
  }
};
var mass = {
  metric: metric$2,
  imperial: imperial$2,
  _anchors: {
    metric: {
      unit: 'g',
      ratio: 1 / 453.592
    },
    imperial: {
      unit: 'lb',
      ratio: 453.592
    }
  }
};

var metric$3, imperial$3;
metric$3 = {
  mm3: {
    name: {
      singular: 'Cubic Millimeter',
      plural: 'Cubic Millimeters'
    },
    to_anchor: 1 / 1000000
  },
  cm3: {
    name: {
      singular: 'Cubic Centimeter',
      plural: 'Cubic Centimeters'
    },
    to_anchor: 1 / 1000
  },
  ml: {
    name: {
      singular: 'Millilitre',
      plural: 'Millilitres'
    },
    to_anchor: 1 / 1000
  },
  cl: {
    name: {
      singular: 'Centilitre',
      plural: 'Centilitres'
    },
    to_anchor: 1 / 100
  },
  dl: {
    name: {
      singular: 'Decilitre',
      plural: 'Decilitres'
    },
    to_anchor: 1 / 10
  },
  l: {
    name: {
      singular: 'Litre',
      plural: 'Litres'
    },
    to_anchor: 1
  },
  kl: {
    name: {
      singular: 'Kilolitre',
      plural: 'Kilolitres'
    },
    to_anchor: 1000
  },
  m3: {
    name: {
      singular: 'Cubic meter',
      plural: 'Cubic meters'
    },
    to_anchor: 1000
  },
  km3: {
    name: {
      singular: 'Cubic kilometer',
      plural: 'Cubic kilometers'
    },
    to_anchor: 1000000000000 // Swedish units

  },
  krm: {
    name: {
      singular: 'Matsked',
      plural: 'Matskedar'
    },
    to_anchor: 1 / 1000
  },
  tsk: {
    name: {
      singular: 'Tesked',
      plural: 'Teskedar'
    },
    to_anchor: 5 / 1000
  },
  msk: {
    name: {
      singular: 'Matsked',
      plural: 'Matskedar'
    },
    to_anchor: 15 / 1000
  },
  kkp: {
    name: {
      singular: 'Kaffekopp',
      plural: 'Kaffekoppar'
    },
    to_anchor: 150 / 1000
  },
  glas: {
    name: {
      singular: 'Glas',
      plural: 'Glas'
    },
    to_anchor: 200 / 1000
  },
  kanna: {
    name: {
      singular: 'Kanna',
      plural: 'Kannor'
    },
    to_anchor: 2.617
  }
};
imperial$3 = {
  tsp: {
    name: {
      singular: 'Teaspoon',
      plural: 'Teaspoons'
    },
    to_anchor: 1 / 6
  },
  Tbs: {
    name: {
      singular: 'Tablespoon',
      plural: 'Tablespoons'
    },
    to_anchor: 1 / 2
  },
  in3: {
    name: {
      singular: 'Cubic inch',
      plural: 'Cubic inches'
    },
    to_anchor: 0.55411
  },
  'fl-oz': {
    name: {
      singular: 'Fluid Ounce',
      plural: 'Fluid Ounces'
    },
    to_anchor: 1
  },
  cup: {
    name: {
      singular: 'Cup',
      plural: 'Cups'
    },
    to_anchor: 8
  },
  pnt: {
    name: {
      singular: 'Pint',
      plural: 'Pints'
    },
    to_anchor: 16
  },
  qt: {
    name: {
      singular: 'Quart',
      plural: 'Quarts'
    },
    to_anchor: 32
  },
  gal: {
    name: {
      singular: 'Gallon',
      plural: 'Gallons'
    },
    to_anchor: 128
  },
  ft3: {
    name: {
      singular: 'Cubic foot',
      plural: 'Cubic feet'
    },
    to_anchor: 957.506
  },
  yd3: {
    name: {
      singular: 'Cubic yard',
      plural: 'Cubic yards'
    },
    to_anchor: 25852.7
  }
};
var volume = {
  metric: metric$3,
  imperial: imperial$3,
  _anchors: {
    metric: {
      unit: 'l',
      ratio: 33.8140226
    },
    imperial: {
      unit: 'fl-oz',
      ratio: 1 / 33.8140226
    }
  }
};

var metric$4;
metric$4 = {
  ea: {
    name: {
      singular: 'Each',
      plural: 'Each'
    },
    to_anchor: 1
  },
  dz: {
    name: {
      singular: 'Dozen',
      plural: 'Dozens'
    },
    to_anchor: 12
  }
};
var each = {
  metric: metric$4,
  imperial: {},
  _anchors: {
    metric: {
      unit: 'ea',
      ratio: 1
    }
  }
};

var metric$5, imperial$4;
metric$5 = {
  C: {
    name: {
      singular: 'degree Celsius',
      plural: 'degrees Celsius'
    },
    to_anchor: 1,
    anchor_shift: 0
  },
  K: {
    name: {
      singular: 'degree Kelvin',
      plural: 'degrees Kelvin'
    },
    to_anchor: 1,
    anchor_shift: 273.15
  }
};
imperial$4 = {
  F: {
    name: {
      singular: 'degree Fahrenheit',
      plural: 'degrees Fahrenheit'
    },
    to_anchor: 1
  },
  R: {
    name: {
      singular: 'degree Rankine',
      plural: 'degrees Rankine'
    },
    to_anchor: 1,
    anchor_shift: 459.67
  }
};
var temperature = {
  metric: metric$5,
  imperial: imperial$4,
  _anchors: {
    metric: {
      unit: 'C',
      transform: function (C) {
        return C / (5 / 9) + 32;
      }
    },
    imperial: {
      unit: 'F',
      transform: function (F) {
        return (F - 32) * (5 / 9);
      }
    }
  }
};

var time;
var daysInYear = 365.25;
time = {
  ns: {
    name: {
      singular: 'Nanosecond',
      plural: 'Nanoseconds'
    },
    to_anchor: 1 / 1000000000
  },
  mu: {
    name: {
      singular: 'Microsecond',
      plural: 'Microseconds'
    },
    to_anchor: 1 / 1000000
  },
  ms: {
    name: {
      singular: 'Millisecond',
      plural: 'Milliseconds'
    },
    to_anchor: 1 / 1000
  },
  s: {
    name: {
      singular: 'Second',
      plural: 'Seconds'
    },
    to_anchor: 1
  },
  min: {
    name: {
      singular: 'Minute',
      plural: 'Minutes'
    },
    to_anchor: 60
  },
  h: {
    name: {
      singular: 'Hour',
      plural: 'Hours'
    },
    to_anchor: 60 * 60
  },
  d: {
    name: {
      singular: 'Day',
      plural: 'Days'
    },
    to_anchor: 60 * 60 * 24
  },
  week: {
    name: {
      singular: 'Week',
      plural: 'Weeks'
    },
    to_anchor: 60 * 60 * 24 * 7
  },
  month: {
    name: {
      singular: 'Month',
      plural: 'Months'
    },
    to_anchor: 60 * 60 * 24 * daysInYear / 12
  },
  year: {
    name: {
      singular: 'Year',
      plural: 'Years'
    },
    to_anchor: 60 * 60 * 24 * daysInYear
  }
};
var time_1 = {
  metric: time,
  _anchors: {
    metric: {
      unit: 's',
      ratio: 1
    }
  }
};

var bits, bytes;
bits = {
  b: {
    name: {
      singular: 'Bit',
      plural: 'Bits'
    },
    to_anchor: 1
  },
  Kb: {
    name: {
      singular: 'Kilobit',
      plural: 'Kilobits'
    },
    to_anchor: 1024
  },
  Mb: {
    name: {
      singular: 'Megabit',
      plural: 'Megabits'
    },
    to_anchor: 1048576
  },
  Gb: {
    name: {
      singular: 'Gigabit',
      plural: 'Gigabits'
    },
    to_anchor: 1073741824
  },
  Tb: {
    name: {
      singular: 'Terabit',
      plural: 'Terabits'
    },
    to_anchor: 1099511627776
  }
};
bytes = {
  B: {
    name: {
      singular: 'Byte',
      plural: 'Bytes'
    },
    to_anchor: 1
  },
  KB: {
    name: {
      singular: 'Kilobyte',
      plural: 'Kilobytes'
    },
    to_anchor: 1024
  },
  MB: {
    name: {
      singular: 'Megabyte',
      plural: 'Megabytes'
    },
    to_anchor: 1048576
  },
  GB: {
    name: {
      singular: 'Gigabyte',
      plural: 'Gigabytes'
    },
    to_anchor: 1073741824
  },
  TB: {
    name: {
      singular: 'Terabyte',
      plural: 'Terabytes'
    },
    to_anchor: 1099511627776
  }
};
var digital = {
  bits: bits,
  bytes: bytes,
  _anchors: {
    bits: {
      unit: 'b',
      ratio: 1 / 8
    },
    bytes: {
      unit: 'B',
      ratio: 8
    }
  }
};

var metric$6;
metric$6 = {
  ppm: {
    name: {
      singular: 'Part-per Million',
      plural: 'Parts-per Million'
    },
    to_anchor: 1
  },
  ppb: {
    name: {
      singular: 'Part-per Billion',
      plural: 'Parts-per Billion'
    },
    to_anchor: .001
  },
  ppt: {
    name: {
      singular: 'Part-per Trillion',
      plural: 'Parts-per Trillion'
    },
    to_anchor: .000001
  },
  ppq: {
    name: {
      singular: 'Part-per Quadrillion',
      plural: 'Parts-per Quadrillion'
    },
    to_anchor: .000000001
  }
};
var partsPer = {
  metric: metric$6,
  imperial: {},
  _anchors: {
    metric: {
      unit: 'ppm',
      ratio: .000001
    }
  }
};

var metric$7, imperial$5;
metric$7 = {
  'm/s': {
    name: {
      singular: 'meter per second',
      plural: 'meters per second'
    },
    to_anchor: 3.6
  },
  'km/h': {
    name: {
      singular: 'Kilometer per hour',
      plural: 'Kilometers per hour'
    },
    to_anchor: 1
  }
};
imperial$5 = {
  'm/h': {
    name: {
      singular: 'Mile per hour',
      plural: 'Miles per hour'
    },
    to_anchor: 1
  },
  knot: {
    name: {
      singular: 'Knot',
      plural: 'Knots'
    },
    to_anchor: 1.150779
  },
  'ft/s': {
    name: {
      singular: 'Foot per second',
      plural: 'Feet per second'
    },
    to_anchor: 0.681818
  }
};
var speed = {
  metric: metric$7,
  imperial: imperial$5,
  _anchors: {
    metric: {
      unit: 'km/h',
      ratio: 1 / 1.609344
    },
    imperial: {
      unit: 'm/h',
      ratio: 1.609344
    }
  }
};

var metric$8, imperial$6;
metric$8 = {
  'min/km': {
    name: {
      singular: 'Minute per kilometer',
      plural: 'Minutes per kilometer'
    },
    to_anchor: 0.06
  },
  's/m': {
    name: {
      singular: 'Second per meter',
      plural: 'Seconds per meter'
    },
    to_anchor: 1
  }
};
imperial$6 = {
  'min/mi': {
    name: {
      singular: 'Minute per mile',
      plural: 'Minutes per mile'
    },
    to_anchor: 0.0113636
  },
  's/ft': {
    name: {
      singular: 'Second per foot',
      plural: 'Seconds per foot'
    },
    to_anchor: 1
  }
};
var pace = {
  metric: metric$8,
  imperial: imperial$6,
  _anchors: {
    metric: {
      unit: 's/m',
      ratio: 0.3048
    },
    imperial: {
      unit: 's/ft',
      ratio: 1 / 0.3048
    }
  }
};

var metric$9, imperial$7;
metric$9 = {
  Pa: {
    name: {
      singular: 'pascal',
      plural: 'pascals'
    },
    to_anchor: 1 / 1000
  },
  kPa: {
    name: {
      singular: 'kilopascal',
      plural: 'kilopascals'
    },
    to_anchor: 1
  },
  MPa: {
    name: {
      singular: 'megapascal',
      plural: 'megapascals'
    },
    to_anchor: 1000
  },
  hPa: {
    name: {
      singular: 'hectopascal',
      plural: 'hectopascals'
    },
    to_anchor: 1 / 10
  },
  uPa: {
    name: {
      singular: 'micropascal',
      plural: 'micropascals'
    },
    to_anchor: 1 / 1e9
  },
  bar: {
    name: {
      singular: 'bar',
      plural: 'bar'
    },
    to_anchor: 100
  },
  torr: {
    name: {
      singular: 'torr',
      plural: 'torr'
    },
    to_anchor: 101325 / 760000
  }
};
imperial$7 = {
  psi: {
    name: {
      singular: 'pound per square inch',
      plural: 'pounds per square inch'
    },
    to_anchor: 1 / 1000
  },
  ksi: {
    name: {
      singular: 'kilopound per square inch',
      plural: 'kilopound per square inch'
    },
    to_anchor: 1
  }
};
var pressure = {
  metric: metric$9,
  imperial: imperial$7,
  _anchors: {
    metric: {
      unit: 'kPa',
      ratio: 0.00014503768078
    },
    imperial: {
      unit: 'psi',
      ratio: 1 / 0.00014503768078
    }
  }
};

var current;
current = {
  A: {
    name: {
      singular: 'Ampere',
      plural: 'Amperes'
    },
    to_anchor: 1
  },
  mA: {
    name: {
      singular: 'Milliampere',
      plural: 'Milliamperes'
    },
    to_anchor: .001
  },
  kA: {
    name: {
      singular: 'Kiloampere',
      plural: 'Kiloamperes'
    },
    to_anchor: 1000
  }
};
var current_1 = {
  metric: current,
  _anchors: {
    metric: {
      unit: 'A',
      ratio: 1
    }
  }
};

var voltage;
voltage = {
  V: {
    name: {
      singular: 'Volt',
      plural: 'Volts'
    },
    to_anchor: 1
  },
  mV: {
    name: {
      singular: 'Millivolt',
      plural: 'Millivolts'
    },
    to_anchor: .001
  },
  kV: {
    name: {
      singular: 'Kilovolt',
      plural: 'Kilovolts'
    },
    to_anchor: 1000
  }
};
var voltage_1 = {
  metric: voltage,
  _anchors: {
    metric: {
      unit: 'V',
      ratio: 1
    }
  }
};

var power;
power = {
  W: {
    name: {
      singular: 'Watt',
      plural: 'Watts'
    },
    to_anchor: 1
  },
  mW: {
    name: {
      singular: 'Milliwatt',
      plural: 'Milliwatts'
    },
    to_anchor: .001
  },
  kW: {
    name: {
      singular: 'Kilowatt',
      plural: 'Kilowatts'
    },
    to_anchor: 1000
  },
  MW: {
    name: {
      singular: 'Megawatt',
      plural: 'Megawatts'
    },
    to_anchor: 1000000
  },
  GW: {
    name: {
      singular: 'Gigawatt',
      plural: 'Gigawatts'
    },
    to_anchor: 1000000000
  }
};
var power_1 = {
  metric: power,
  _anchors: {
    metric: {
      unit: 'W',
      ratio: 1
    }
  }
};

var reactivePower;
reactivePower = {
  VAR: {
    name: {
      singular: 'Volt-Ampere Reactive',
      plural: 'Volt-Amperes Reactive'
    },
    to_anchor: 1
  },
  mVAR: {
    name: {
      singular: 'Millivolt-Ampere Reactive',
      plural: 'Millivolt-Amperes Reactive'
    },
    to_anchor: .001
  },
  kVAR: {
    name: {
      singular: 'Kilovolt-Ampere Reactive',
      plural: 'Kilovolt-Amperes Reactive'
    },
    to_anchor: 1000
  },
  MVAR: {
    name: {
      singular: 'Megavolt-Ampere Reactive',
      plural: 'Megavolt-Amperes Reactive'
    },
    to_anchor: 1000000
  },
  GVAR: {
    name: {
      singular: 'Gigavolt-Ampere Reactive',
      plural: 'Gigavolt-Amperes Reactive'
    },
    to_anchor: 1000000000
  }
};
var reactivePower_1 = {
  metric: reactivePower,
  _anchors: {
    metric: {
      unit: 'VAR',
      ratio: 1
    }
  }
};

var apparentPower;
apparentPower = {
  VA: {
    name: {
      singular: 'Volt-Ampere',
      plural: 'Volt-Amperes'
    },
    to_anchor: 1
  },
  mVA: {
    name: {
      singular: 'Millivolt-Ampere',
      plural: 'Millivolt-Amperes'
    },
    to_anchor: .001
  },
  kVA: {
    name: {
      singular: 'Kilovolt-Ampere',
      plural: 'Kilovolt-Amperes'
    },
    to_anchor: 1000
  },
  MVA: {
    name: {
      singular: 'Megavolt-Ampere',
      plural: 'Megavolt-Amperes'
    },
    to_anchor: 1000000
  },
  GVA: {
    name: {
      singular: 'Gigavolt-Ampere',
      plural: 'Gigavolt-Amperes'
    },
    to_anchor: 1000000000
  }
};
var apparentPower_1 = {
  metric: apparentPower,
  _anchors: {
    metric: {
      unit: 'VA',
      ratio: 1
    }
  }
};

var energy;
energy = {
  Wh: {
    name: {
      singular: 'Watt-hour',
      plural: 'Watt-hours'
    },
    to_anchor: 3600
  },
  mWh: {
    name: {
      singular: 'Milliwatt-hour',
      plural: 'Milliwatt-hours'
    },
    to_anchor: 3.6
  },
  kWh: {
    name: {
      singular: 'Kilowatt-hour',
      plural: 'Kilowatt-hours'
    },
    to_anchor: 3600000
  },
  MWh: {
    name: {
      singular: 'Megawatt-hour',
      plural: 'Megawatt-hours'
    },
    to_anchor: 3600000000
  },
  GWh: {
    name: {
      singular: 'Gigawatt-hour',
      plural: 'Gigawatt-hours'
    },
    to_anchor: 3600000000000
  },
  J: {
    name: {
      singular: 'Joule',
      plural: 'Joules'
    },
    to_anchor: 1
  },
  kJ: {
    name: {
      singular: 'Kilojoule',
      plural: 'Kilojoules'
    },
    to_anchor: 1000
  }
};
var energy_1 = {
  metric: energy,
  _anchors: {
    metric: {
      unit: 'J',
      ratio: 1
    }
  }
};

var reactiveEnergy;
reactiveEnergy = {
  VARh: {
    name: {
      singular: 'Volt-Ampere Reactive Hour',
      plural: 'Volt-Amperes Reactive Hour'
    },
    to_anchor: 1
  },
  mVARh: {
    name: {
      singular: 'Millivolt-Ampere Reactive Hour',
      plural: 'Millivolt-Amperes Reactive Hour'
    },
    to_anchor: .001
  },
  kVARh: {
    name: {
      singular: 'Kilovolt-Ampere Reactive Hour',
      plural: 'Kilovolt-Amperes Reactive Hour'
    },
    to_anchor: 1000
  },
  MVARh: {
    name: {
      singular: 'Megavolt-Ampere Reactive Hour',
      plural: 'Megavolt-Amperes Reactive Hour'
    },
    to_anchor: 1000000
  },
  GVARh: {
    name: {
      singular: 'Gigavolt-Ampere Reactive Hour',
      plural: 'Gigavolt-Amperes Reactive Hour'
    },
    to_anchor: 1000000000
  }
};
var reactiveEnergy_1 = {
  metric: reactiveEnergy,
  _anchors: {
    metric: {
      unit: 'VARh',
      ratio: 1
    }
  }
};

var metric$a, imperial$8;
metric$a = {
  'mm3/s': {
    name: {
      singular: 'Cubic Millimeter per second',
      plural: 'Cubic Millimeters per second'
    },
    to_anchor: 1 / 1000000
  },
  'cm3/s': {
    name: {
      singular: 'Cubic Centimeter per second',
      plural: 'Cubic Centimeters per second'
    },
    to_anchor: 1 / 1000
  },
  'ml/s': {
    name: {
      singular: 'Millilitre per second',
      plural: 'Millilitres per second'
    },
    to_anchor: 1 / 1000
  },
  'cl/s': {
    name: {
      singular: 'Centilitre per second',
      plural: 'Centilitres per second'
    },
    to_anchor: 1 / 100
  },
  'dl/s': {
    name: {
      singular: 'Decilitre per second',
      plural: 'Decilitres per second'
    },
    to_anchor: 1 / 10
  },
  'l/s': {
    name: {
      singular: 'Litre per second',
      plural: 'Litres per second'
    },
    to_anchor: 1
  },
  'l/min': {
    name: {
      singular: 'Litre per minute',
      plural: 'Litres per minute'
    },
    to_anchor: 1 / 60
  },
  'l/h': {
    name: {
      singular: 'Litre per hour',
      plural: 'Litres per hour'
    },
    to_anchor: 1 / 3600
  },
  'kl/s': {
    name: {
      singular: 'Kilolitre per second',
      plural: 'Kilolitres per second'
    },
    to_anchor: 1000
  },
  'kl/min': {
    name: {
      singular: 'Kilolitre per minute',
      plural: 'Kilolitres per minute'
    },
    to_anchor: 50 / 3
  },
  'kl/h': {
    name: {
      singular: 'Kilolitre per hour',
      plural: 'Kilolitres per hour'
    },
    to_anchor: 5 / 18
  },
  'm3/s': {
    name: {
      singular: 'Cubic meter per second',
      plural: 'Cubic meters per second'
    },
    to_anchor: 1000
  },
  'm3/min': {
    name: {
      singular: 'Cubic meter per minute',
      plural: 'Cubic meters per minute'
    },
    to_anchor: 50 / 3
  },
  'm3/h': {
    name: {
      singular: 'Cubic meter per hour',
      plural: 'Cubic meters per hour'
    },
    to_anchor: 5 / 18
  },
  'km3/s': {
    name: {
      singular: 'Cubic kilometer per second',
      plural: 'Cubic kilometers per second'
    },
    to_anchor: 1000000000000
  }
};
imperial$8 = {
  'tsp/s': {
    name: {
      singular: 'Teaspoon per second',
      plural: 'Teaspoons per second'
    },
    to_anchor: 1 / 6
  },
  'Tbs/s': {
    name: {
      singular: 'Tablespoon per second',
      plural: 'Tablespoons per second'
    },
    to_anchor: 1 / 2
  },
  'in3/s': {
    name: {
      singular: 'Cubic inch per second',
      plural: 'Cubic inches per second'
    },
    to_anchor: 0.55411
  },
  'in3/min': {
    name: {
      singular: 'Cubic inch per minute',
      plural: 'Cubic inches per minute'
    },
    to_anchor: 0.55411 / 60
  },
  'in3/h': {
    name: {
      singular: 'Cubic inch per hour',
      plural: 'Cubic inches per hour'
    },
    to_anchor: 0.55411 / 3600
  },
  'fl-oz/s': {
    name: {
      singular: 'Fluid Ounce per second',
      plural: 'Fluid Ounces per second'
    },
    to_anchor: 1
  },
  'fl-oz/min': {
    name: {
      singular: 'Fluid Ounce per minute',
      plural: 'Fluid Ounces per minute'
    },
    to_anchor: 1 / 60
  },
  'fl-oz/h': {
    name: {
      singular: 'Fluid Ounce per hour',
      plural: 'Fluid Ounces per hour'
    },
    to_anchor: 1 / 3600
  },
  'cup/s': {
    name: {
      singular: 'Cup per second',
      plural: 'Cups per second'
    },
    to_anchor: 8
  },
  'pnt/s': {
    name: {
      singular: 'Pint per second',
      plural: 'Pints per second'
    },
    to_anchor: 16
  },
  'pnt/min': {
    name: {
      singular: 'Pint per minute',
      plural: 'Pints per minute'
    },
    to_anchor: 4 / 15
  },
  'pnt/h': {
    name: {
      singular: 'Pint per hour',
      plural: 'Pints per hour'
    },
    to_anchor: 1 / 225
  },
  'qt/s': {
    name: {
      singular: 'Quart per second',
      plural: 'Quarts per second'
    },
    to_anchor: 32
  },
  'gal/s': {
    name: {
      singular: 'Gallon per second',
      plural: 'Gallons per second'
    },
    to_anchor: 128
  },
  'gal/min': {
    name: {
      singular: 'Gallon per minute',
      plural: 'Gallons per minute'
    },
    to_anchor: 32 / 15
  },
  'gal/h': {
    name: {
      singular: 'Gallon per hour',
      plural: 'Gallons per hour'
    },
    to_anchor: 8 / 225
  },
  'ft3/s': {
    name: {
      singular: 'Cubic foot per second',
      plural: 'Cubic feet per second'
    },
    to_anchor: 957.506
  },
  'ft3/min': {
    name: {
      singular: 'Cubic foot per minute',
      plural: 'Cubic feet per minute'
    },
    to_anchor: 957.506 / 60
  },
  'ft3/h': {
    name: {
      singular: 'Cubic foot per hour',
      plural: 'Cubic feet per hour'
    },
    to_anchor: 957.506 / 3600
  },
  'yd3/s': {
    name: {
      singular: 'Cubic yard per second',
      plural: 'Cubic yards per second'
    },
    to_anchor: 25852.7
  },
  'yd3/min': {
    name: {
      singular: 'Cubic yard per minute',
      plural: 'Cubic yards per minute'
    },
    to_anchor: 25852.7 / 60
  },
  'yd3/h': {
    name: {
      singular: 'Cubic yard per hour',
      plural: 'Cubic yards per hour'
    },
    to_anchor: 25852.7 / 3600
  }
};
var volumeFlowRate = {
  metric: metric$a,
  imperial: imperial$8,
  _anchors: {
    metric: {
      unit: 'l/s',
      ratio: 33.8140227
    },
    imperial: {
      unit: 'fl-oz/s',
      ratio: 1 / 33.8140227
    }
  }
};

var metric$b, imperial$9;
metric$b = {
  'lx': {
    name: {
      singular: 'Lux',
      plural: 'Lux'
    },
    to_anchor: 1
  }
};
imperial$9 = {
  'ft-cd': {
    name: {
      singular: 'Foot-candle',
      plural: 'Foot-candles'
    },
    to_anchor: 1
  }
};
var illuminance = {
  metric: metric$b,
  imperial: imperial$9,
  _anchors: {
    metric: {
      unit: 'lx',
      ratio: 1 / 10.76391
    },
    imperial: {
      unit: 'ft-cd',
      ratio: 10.76391
    }
  }
};

var frequency;
frequency = {
  mHz: {
    name: {
      singular: 'millihertz',
      plural: 'millihertz'
    },
    to_anchor: 1 / 1000
  },
  Hz: {
    name: {
      singular: 'hertz',
      plural: 'hertz'
    },
    to_anchor: 1
  },
  kHz: {
    name: {
      singular: 'kilohertz',
      plural: 'kilohertz'
    },
    to_anchor: 1000
  },
  MHz: {
    name: {
      singular: 'megahertz',
      plural: 'megahertz'
    },
    to_anchor: 1000 * 1000
  },
  GHz: {
    name: {
      singular: 'gigahertz',
      plural: 'gigahertz'
    },
    to_anchor: 1000 * 1000 * 1000
  },
  THz: {
    name: {
      singular: 'terahertz',
      plural: 'terahertz'
    },
    to_anchor: 1000 * 1000 * 1000 * 1000
  },
  rpm: {
    name: {
      singular: 'rotation per minute',
      plural: 'rotations per minute'
    },
    to_anchor: 1 / 60
  },
  "deg/s": {
    name: {
      singular: 'degree per second',
      plural: 'degrees per second'
    },
    to_anchor: 1 / 360
  },
  "rad/s": {
    name: {
      singular: 'radian per second',
      plural: 'radians per second'
    },
    to_anchor: 1 / (Math.PI * 2)
  }
};
var frequency_1 = {
  metric: frequency,
  _anchors: {
    frequency: {
      unit: 'hz',
      ratio: 1
    }
  }
};

var angle;
angle = {
  rad: {
    name: {
      singular: 'radian',
      plural: 'radians'
    },
    to_anchor: 180 / Math.PI
  },
  deg: {
    name: {
      singular: 'degree',
      plural: 'degrees'
    },
    to_anchor: 1
  },
  grad: {
    name: {
      singular: 'gradian',
      plural: 'gradians'
    },
    to_anchor: 9 / 10
  },
  arcmin: {
    name: {
      singular: 'arcminute',
      plural: 'arcminutes'
    },
    to_anchor: 1 / 60
  },
  arcsec: {
    name: {
      singular: 'arcsecond',
      plural: 'arcseconds'
    },
    to_anchor: 1 / 3600
  }
};
var angle_1 = {
  metric: angle,
  _anchors: {
    metric: {
      unit: 'deg',
      ratio: 1
    }
  }
};

var metric$c;
metric$c = {
  c: {
    name: {
      singular: 'Coulomb',
      plural: 'Coulombs'
    },
    to_anchor: 1
  },
  mC: {
    name: {
      singular: 'Millicoulomb',
      plural: 'Millicoulombs'
    },
    to_anchor: 1 / 1000
  },
  μC: {
    name: {
      singular: 'Microcoulomb',
      plural: 'Microcoulombs'
    },
    to_anchor: 1 / 1000000
  },
  nC: {
    name: {
      singular: 'Nanocoulomb',
      plural: 'Nanocoulombs'
    },
    to_anchor: 1e-9
  },
  pC: {
    name: {
      singular: 'Picocoulomb',
      plural: 'Picocoulombs'
    },
    to_anchor: 1e-12
  }
};
var charge = {
  metric: metric$c,
  imperial: {},
  _anchors: {
    metric: {
      unit: 'c',
      ratio: 1
    }
  }
};

var metric$d;
metric$d = {
  N: {
    name: {
      singular: 'Newton',
      plural: 'Newtons'
    },
    to_anchor: 1
  },
  kN: {
    name: {
      singular: 'Kilonewton',
      plural: 'Kilonewtons'
    },
    to_anchor: 1000
  },
  lbf: {
    name: {
      singular: 'Pound-force',
      plural: 'Pound-forces'
    },
    to_anchor: 4.44822
  }
};
var force = {
  metric: metric$d,
  imperial: {},
  _anchors: {
    metric: {
      unit: 'N',
      ratio: 1
    }
  }
};

var metric$e;
metric$e = {
  'g-force': {
    name: {
      singular: 'g-force',
      plural: 'g-forces'
    },
    to_anchor: 9.80665
  },
  'm/s2': {
    name: {
      singular: 'meter per second squared',
      plural: 'meters per second squared'
    },
    to_anchor: 1
  }
};
var acceleration = {
  metric: metric$e,
  imperial: {},
  _anchors: {
    metric: {
      unit: 'g-force',
      ratio: 1
    }
  }
};

var intensity;
intensity = {
  'W/m2': {
    name: {
      singular: 'watt per meter squared',
      plural: 'watts per meters squared'
    },
    to_anchor: 1
  }
};
var intensity_1 = {
  metric: intensity,
  _anchors: {
    metric: {
      unit: 'W/m2',
      ratio: 1
    }
  }
};

/**
 * Modified version of 'convert-units' which was written by Ben Ng 
 * @see http://benng.me
 * @see https://www.npmjs.com/package/convert-units
 */

var convert,
    measures = {
  length: length,
  area: area,
  mass: mass,
  volume: volume,
  each: each,
  temperature: temperature,
  time: time_1,
  digital: digital,
  partsPer: partsPer,
  speed: speed,
  pace: pace,
  pressure: pressure,
  current: current_1,
  voltage: voltage_1,
  power: power_1,
  reactivePower: reactivePower_1,
  apparentPower: apparentPower_1,
  energy: energy_1,
  reactiveEnergy: reactiveEnergy_1,
  volumeFlowRate: volumeFlowRate,
  illuminance: illuminance,
  frequency: frequency_1,
  angle: angle_1,
  charge: charge,
  force: force,
  acceleration: acceleration,
  intensity: intensity_1
},
    Converter;

Converter = function (numerator, denominator) {
  if (denominator) this.val = numerator / denominator;else this.val = numerator;
};
/**
 * Lets the converter know the source unit abbreviation
 */


Converter.prototype.from = function (from) {
  if (this.destination) throw new Error('.from must be called before .to');
  this.origin = this.getUnit(from);

  if (!this.origin) {
    this.throwUnsupportedUnitError(from);
  }

  return this;
};
/**
 * Converts the unit and returns the value
 */


Converter.prototype.to = function (to) {
  if (!this.origin) throw new Error('.to must be called after .from');
  this.destination = this.getUnit(to);
  var result, transform;

  if (!this.destination) {
    this.throwUnsupportedUnitError(to);
  } // Don't change the value if origin and destination are the same


  if (this.origin.abbr === this.destination.abbr) {
    return this.val;
  } // You can't go from liquid to mass, for example


  if (this.destination.measure != this.origin.measure) {
    throw new Error('Cannot convert incompatible measures of ' + this.destination.measure + ' and ' + this.origin.measure);
  }
  /**
   * Convert from the source value to its anchor inside the system
   */


  result = this.val * this.origin.unit.to_anchor;
  /**
   * For some changes it's a simple shift (C to K)
   * So we'll add it when convering into the unit (later)
   * and subtract it when converting from the unit
   */

  if (this.origin.unit.anchor_shift) {
    result -= this.origin.unit.anchor_shift;
  }
  /**
   * Convert from one system to another through the anchor ratio. Some conversions
   * aren't ratio based or require more than a simple shift. We can provide a custom
   * transform here to provide the direct result
   */


  if (this.origin.system != this.destination.system) {
    transform = measures[this.origin.measure]._anchors[this.origin.system].transform;

    if (typeof transform === 'function') {
      result = transform(result);
    } else {
      result *= measures[this.origin.measure]._anchors[this.origin.system].ratio;
    }
  }
  /**
   * This shift has to be done after the system conversion business
   */


  if (this.destination.unit.anchor_shift) {
    result += this.destination.unit.anchor_shift;
  }
  /**
   * Convert to another unit inside the destination system
   */


  return result / this.destination.unit.to_anchor;
};
/**
 * Converts the unit to the best available unit.
 */


Converter.prototype.toBest = function (options) {
  if (!this.origin) throw new Error('.toBest must be called after .from');
  var options = Object.assign({
    exclude: [],
    cutOffNumber: 1
  }, options);
  var best;
  /**
    Looks through every possibility for the 'best' available unit.
    i.e. Where the value has the fewest numbers before the decimal point,
    but is still higher than 1.
  */

  lodash_foreach(this.possibilities(), function (possibility) {
    var unit = this.describe(possibility);
    var isIncluded = options.exclude.indexOf(possibility) === -1;

    if (isIncluded && unit.system === this.origin.system) {
      var result = this.to(possibility);

      if (!best || result >= options.cutOffNumber && result < best.val) {
        best = {
          val: result,
          unit: possibility,
          singular: unit.singular,
          plural: unit.plural
        };
      }
    }
  }.bind(this));
  return best;
};
/**
 * Finds the unit
 */


Converter.prototype.getUnit = function (abbr) {
  var found;
  lodash_foreach(measures, function (systems, measure) {
    lodash_foreach(systems, function (units, system) {
      if (system == '_anchors') return false;
      lodash_foreach(units, function (unit, testAbbr) {
        if (testAbbr == abbr) {
          found = {
            abbr: abbr,
            measure: measure,
            system: system,
            unit: unit
          };
          return false;
        }
      });
      if (found) return false;
    });
    if (found) return false;
  });
  return found;
};

var describe = function (resp) {
  return {
    abbr: resp.abbr,
    measure: resp.measure,
    system: resp.system,
    singular: resp.unit.name.singular,
    plural: resp.unit.name.plural
  };
};
/**
 * An alias for getUnit
 */


Converter.prototype.describe = function (abbr) {
  var resp = Converter.prototype.getUnit(abbr);
  var desc = null;

  try {
    desc = describe(resp);
  } catch (err) {
    this.throwUnsupportedUnitError(abbr);
  }

  return desc;
};
/**
 * Detailed list of all supported units
 */


Converter.prototype.list = function (measure) {
  var list = [];
  lodash_foreach(measures, function (systems, testMeasure) {
    if (measure && measure !== testMeasure) return;
    lodash_foreach(systems, function (units, system) {
      if (system == '_anchors') return false;
      lodash_foreach(units, function (unit, abbr) {
        list = list.concat(describe({
          abbr: abbr,
          measure: testMeasure,
          system: system,
          unit: unit
        }));
      });
    });
  });
  return list;
};

Converter.prototype.throwUnsupportedUnitError = function (what) {
  var validUnits = [];
  lodash_foreach(measures, function (systems, measure) {
    lodash_foreach(systems, function (units, system) {
      if (system == '_anchors') return false;
      validUnits = validUnits.concat(lodash_keys(units));
    });
  });
  throw new Error('Unsupported unit ' + what + ', use one of: ' + validUnits.join(', '));
};
/**
 * Returns the abbreviated measures that the value can be
 * converted to.
 */


Converter.prototype.possibilities = function (measure) {
  var possibilities = [];

  if (!this.origin && !measure) {
    lodash_foreach(lodash_keys(measures), function (measure) {
      lodash_foreach(measures[measure], function (units, system) {
        if (system == '_anchors') return false;
        possibilities = possibilities.concat(lodash_keys(units));
      });
    });
  } else {
    measure = measure || this.origin.measure;
    lodash_foreach(measures[measure], function (units, system) {
      if (system == '_anchors') return false;
      possibilities = possibilities.concat(lodash_keys(units));
    });
  }

  return possibilities;
};
/**
 * Returns the abbreviated measures that the value can be
 * converted to.
 */


Converter.prototype.measures = function () {
  return lodash_keys(measures);
};

convert = function (value) {
  return new Converter(value);
};

var lib = convert;

export default lib;
