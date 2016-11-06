import {ValidatorError} from 'validatable';

/*
* A validation error class which holds information about document's invalid fields.
*/

export class ValidationError extends Error {

  /*
  * Class constructor.
  */

  constructor (errors = [], message = 'Fields validation failed', code = 422) {
    super();

    this.name = this.constructor.name;
    this.errors = errors;
    this.message = message;
    this.code = code;
  }
}

/*
* A validation error class which holds information of a single invalid field.
*/

export class InvalidFieldError extends Error {

  /*
  * Class constructor.
  */

  constructor (path = null, errors = [], related = [], message = 'Field validation failed', code = 422) {
    super();

    this.name = this.constructor.name;
    this.path = path;
    this.errors = errors;
    this.related = related;
    this.message = message;
    this.code = code;
  }
}

/*
* A validator error class, provided by the `validatable.js`, which holds information about the validators which do not approve a value that has just been validated.
*/

export {ValidatorError};
