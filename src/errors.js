import {ValidatorError} from 'validatable';
import {toArray} from 'typeable';

/*
* A validation error class which holds information about document's invalid fields.
*/

export class ValidationError extends Error {

  /*
  * Class constructor.
  */

  constructor (paths = [], message = 'Validation failed', code = 422) {
    super(message);

    Object.defineProperty(this, 'name', { // class name
      value: this.constructor.name,
      writable: true
    });
    Object.defineProperty(this, 'message', { // validation error message
      value: message,
      writable: true
    });
    Object.defineProperty(this, 'paths', { // validator name
      value: toArray(paths),
      writable: true
    });
    Object.defineProperty(this, 'code', { // error code
      value: code,
      writable: true
    });
  }

  /*
  * Returns error data.
  */

  toObject () {
    let {name, message, paths, code} = this;
    return {name, message, paths, code};
  }
}

/*
* A validator error class, provided by the `validatable.js`, which holds
* information about the validators which do not approve a value that has
* just been validated.
*/

export {ValidatorError};
