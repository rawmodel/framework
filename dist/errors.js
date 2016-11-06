'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidatorError = exports.ValidationError = undefined;

var _validatable = require('validatable');

var _typeable = require('typeable');

/*
* A validation error class which holds information about document's invalid fields.
*/

class ValidationError extends Error {

  /*
  * Creates a ValidationError from input data.
  */

  static parse(data) {}

  /*
  * Class constructor.
  */

  constructor() {
    let path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    let errors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    let related = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    let message = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'Validation failed';
    let code = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 422;

    super();

    this.name = this.constructor.name;
    this.path = (0, _typeable.toArray)(path);
    this.errors = errors;
    this.related = related;
    this.message = message;
    this.code = code;
  }

  /*
  * Returns `true` if the error represents the root field error.
  */

  isRoot() {
    return this.path.length === 0;
  }

  /*
  * Returns `true` if the error has no error messages.
  */

  isEmpty() {
    return this.errors.length === 0 && this.related.length === 0;
  }

  /*
  * Returns single-dimensional array of errors when `flatten` is `true`,
  * otherwise the original nested array is returned.
  */

  toArray() {
    var _this = this;

    let flatten = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;


    let flattenError = function (error) {
      let prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      let errors = [];

      if (error.errors.length > 0) {
        errors.push(new _this.constructor(prefix.concat(error.path), error.errors, [], error.message, error.code));
      }

      if (error.related.length > 0) {
        error.related.forEach((e, i) => {
          if ((0, _typeable.isAbsent)(e)) {
            return;
          } else if ((0, _typeable.isArray)(e)) {
            e.forEach(e => {
              errors.push(...flattenError(e, prefix.concat(error.path, [i])));
            });
          } else if (e instanceof _this.constructor) {
            errors.push(...flattenError(e, prefix.concat(error.path)));
          }
        });
      }

      return errors;
    };

    if (this.isEmpty()) {
      return [];
    } else if (flatten) {
      return flattenError(this);
    } else {
      return [this];
    }
  }

}

exports.ValidationError = ValidationError; /*
                                           * A validator error class, provided by the `validatable.js`, which holds 
                                           * information about the validators which do not approve a value that has 
                                           * just been validated.
                                           */

exports.ValidatorError = _validatable.ValidatorError;