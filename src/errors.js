import {ValidatorError} from 'validatable';
import {
  toArray,
  isArray,
  isAbsent
} from 'typeable';

/*
* A validation error class which holds information about document's invalid fields.
*/

export class ValidationError extends Error {

  /*
  * Creates a ValidationError from input data.
  */

  static parse (data) {

  }

  /*
  * Class constructor.
  */

  constructor (path = [], errors = [], related = [], message = 'Validation failed', code = 422) {
    super();

    this.name = this.constructor.name;
    this.path = toArray(path);
    this.errors = errors;
    this.related = related;
    this.message = message;
    this.code = code;
  }

  /*
  * Returns `true` if the error represents the root field error.
  */

  isRoot () {
    return this.path.length === 0;
  }

  /*
  * Returns `true` if the error has no error messages.
  */

  isEmpty () {
    return (
      this.errors.length === 0
      && this.related.length === 0
    );
  }

  /*
  * Returns single-dimensional array of errors when `flatten` is `true`,
  * otherwise the original nested array is returned.
  */

  toArray (flatten = true) {

    let flattenError = (error, prefix = []) => {
      let errors = [];

      if (error.errors.length > 0) {
        errors.push(
          new this.constructor(
            prefix.concat(error.path),
            error.errors,
            [],
            error.message,
            error.code
          )
        );
      }

      if (error.related.length > 0) {
        error.related.forEach((e, i) => {
          if (isAbsent(e)) {
            return;
          }
          else if (isArray(e)) {
            e.forEach((e) => {
              errors.push(
                ...flattenError(e, prefix.concat(error.path, [i]))
              );
            });
          }
          else if (e instanceof this.constructor) {
            errors.push(
              ...flattenError(e, prefix.concat(error.path))
            );
          }
        });
      }

      return errors;
    }

    if (this.isEmpty()) {
      return [];
    }
    else if (flatten) {
      return flattenError(this);
    }
    else {
      return [this];
    }
  }

}

/*
* A validator error class, provided by the `validatable.js`, which holds 
* information about the validators which do not approve a value that has 
* just been validated.
*/

export {ValidatorError};
