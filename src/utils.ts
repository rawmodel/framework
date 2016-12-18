import {isFunction} from 'typeable';
import * as merge from 'lodash.merge';
import * as isEqual from 'lodash.isequal';

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

export function serialize (data) {
  return JSON.parse(JSON.stringify(data));
}

/*
* A helper method for retrieving a value from an input which can be
* a value or a function.
*/

export function retrieve (input) {
  return isFunction(input) ? input() : input;
}
