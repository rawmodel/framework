import merge = require('lodash.merge');
import isEqual = require('lodash.isequal');

/**
 * Deeply combines multiple values.
 */
export {merge};

/**
 * Deeply checks if two objects are equal.
 */
export {isEqual};

/**
 * Converts the provided data to primitive data type.
 */
export function normalize (data: any) {
  if (typeof data === 'undefined') {
    return undefined;
  } else {
    return JSON.parse(JSON.stringify(data));
  }
}
