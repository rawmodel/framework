/**
 * Converts the provided data to primitive data type.
 */
export function normalize(data: any) {
  if (typeof data === 'undefined') {
    return null;
  }
  try {
    return JSON.parse(JSON.stringify(data));
  }
  catch (e) {
    return null;
  }
}

/**
 * Returns `true` if the provided values are deeply equal.
 * @param a Value A.
 * @param b Value B.
 */
export function isDeepEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (a == null || typeof a != "object" || b == null || typeof b != "object") {
    return false;
  }
  var propsInA = 0;
  var propsInB = 0;
  
  for (var prop in a) {
    propsInA += 1;
  }
  
  for (let prop in b) {
    propsInB += 1;
    if (!(prop in a) || !isDeepEqual(a[prop], b[prop])) {
      return false;
    }
  }
  return propsInA == propsInB;
}

/**
 * Returns `true` if the provided value is undefined.
 * @param v Arbitrary value.
 */
export function isUndefined(v?: any) {
  return typeof v === 'undefined' || v === undefined;
}

/**
 * Returns `true` if the provided value is null.
 * @param v Arbitrary value.
 */
export function isNull(v?: any) {
  return v === null;
}

/**
 * Returns `true` if the provided value is infinite number.
 * @param v Arbitrary value.
 */
export function isInfinite(v?: any) {
  return v === Infinity;
}

/**
 * Returns `true` if the provided value represents a value.
 * @param v Arbitrary value.
 */
export function isValue(v?: any) {
  return (
    !isUndefined(v)
    && !isNull(v)
    && !(isNumber(v) && isNaN(v))
    && !isInfinite(v)
  );
}

/**
 * Returns `true` if the provided value is a string.
 * @param v Arbitrary value.
 */
export function isString(v?: any) {
  return typeof v === 'string';
}

/**
 * Returns `true` if the provided value is a boolean value.
 * @param v Arbitrary value.
 */
export function isBoolean(v?: any) {
  return typeof v === 'boolean';
}

/**
 * Returns `true` if the provided value is a number.
 * @param v Arbitrary value.
 */
export function isNumber(v?: any) {
  return typeof v === 'number';
}

/**
 * Returns `true` if the provided value represents an integer number.
 * @param v Arbitrary value.
 */
export function isInteger(v?: any) {
  return isNumber(v) ? v % 1 === 0 : false;
}

/**
 * Returns `true` if the provided value is a number.
 * @param v Arbitrary value.
 */
export function isFloat(v?: any) {
  return (
    isNumber(v)
    && isFinite(v)
  );
}

/**
 * Returns `true` if the provided value is a Date object.
 * @param v Arbitrary value.
 */
export function isDate(v?: any) {
  return (
    !isUndefined(v)
    && !isNull(v)
    && v.constructor === Date
    && isInteger(v.getTime())
  );
}

/**
 * Returns `true` if the provided value is an object.
 * @param v Arbitrary value.
 */
export function isObject(v?: any) {
  return (
    !isUndefined(v)
    && !isNull(v)
    && v.constructor === Object
  );
}

/**
 * Returns `true` if the provided value is an array.
 * @param v Arbitrary value.
 */
export function isArray(v?: any) {
  return Array.isArray(v);
}

/**
 * Returns `true` if the provided value is not empty.
 * @param v Arbitrary value.
 */
export function isPresent(v?: any) {
  return !(
    isUndefined(v)
    || isNull(v)
    || (isNumber(v) && isNaN(v))
    || isString(v) && v === ''
    || isArray(v) && v.length === 0
    || isObject(v) && Object.keys(v).length === 0
  );
}

/**
 * Returns `true` if the provided value represents a function.
 * @param v Arbitrary value.
 */
export function isFunction(v?: any) {
  return typeof v === 'function';
}

/**
 * Converts the provided value to string.
 * @param v Arbitrary value.
 */
export function toString(v?: any) {
  if (isString(v)) {
    return v;
  }
  else if (isUndefined(v) || isNull(v)) {
    return null;
  }
  else {
    return toString(v.toString());
  }
}

/**
 * Converts the provided value to boolean.
 * @param v Arbitrary value.
 */
export function toBoolean(v?: any) {
  if (isBoolean(v)) {
    return v;
  }
  else if (isUndefined(v) || isNull(v)) {
    return null;
  }
  else {
    return (
      parseFloat(v) > 0
      || isInfinite(v)
      || v === '1'
      || v === 'true'
      || v === 'yes'
      || v === '+'
    );
  }
}

/**
 * Converts the provided value to integer.
 * @param v Arbitrary value.
 */
export function toInteger(v?: any) {
  if (isInteger(v)) {
    return v;
  }
  else if (isUndefined(v) || isNull(v)) {
    return null;
  }
  else if (isFloat(v)) {
    return parseInt(v);
  }
  else {
    var pv = parseInt(v);
    if (isInteger(pv)) {
      return pv;
    }
    else if (toBoolean(v)) {
      return 1;
    }
    else {
      return 0;
    }
  }
}

/**
 * Converts the provided value to number.
 * @param v Arbitrary value.
 */
export function toFloat(v?: any) {
  if (isFloat(v)) {
    return v;
  }
  else if (isUndefined(v) || isNull(v)) {
    return null;
  }
  else {
    var pv = parseFloat(v);
    if (isFloat(pv)) {
      return pv;
    }
    else if (toBoolean(v)) {
      return 1;
    }
    else {
      return 0;
    }
  }
}

/**
 * Converts the provided value to number (alias).
 * @param v Arbitrary value.
 */
export function toNumber(v?: any) {
  return toFloat(v);
}

/**
 * Converts the provided value to date.
 * @param v Arbitrary value.
 */
export function toDate(v?: any): Date {
  var date = isDate(v) ? v : new Date(v);
  var time = date.getTime();
  var isValid = (
    isPresent(v)
    && isInteger(time)
  );

  return isValid ? date : null;
}

/**
 * Converts the provided value to array.
 * @param v Arbitrary value.
 */
export function toArray(v?: any): Array<any> {
  if (isArray(v)) {
    return v;
  }
  else if (isUndefined(v) || isNull(v)) {
    return null;
  }
  else if (!isValue(v)) {
    return [];
  }
  else {
    return [v];
  }
}
