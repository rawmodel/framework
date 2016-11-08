import {isFunction} from 'typeable';

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
