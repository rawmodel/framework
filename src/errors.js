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
    super();

    this.name = this.constructor.name;
    this.paths = toArray(paths);
    this.message = message;
    this.code = code;
  }
}

/*
* A validator error class, provided by the `validatable.js`, which holds
* information about the validators which do not approve a value that has
* just been validated.
*/

export {ValidatorError};
