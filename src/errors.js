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

}
