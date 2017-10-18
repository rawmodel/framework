import merge = require('lodash.merge');
import isEqual = require('lodash.isequal');

/*
* Deeply combines multiple values.
*/

export {merge};

/*
* Deeply checks if two objects are equal.
*/

export {isEqual};

/*
* Returns a duplicated data object (useful to remove data bindings).
*/

export function serialize (data: any) {
  return JSON.parse(JSON.stringify(data));
}
