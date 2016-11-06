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
  * Class constructor.
  */

  constructor() {
    let paths = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    let message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Validation failed';
    let code = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 422;

    super();

    this.name = this.constructor.name;
    this.paths = (0, _typeable.toArray)(paths);
    this.message = message;
    this.code = code;
  }
}

exports.ValidationError = ValidationError; /*
                                           * A validator error class, provided by the `validatable.js`, which holds
                                           * information about the validators which do not approve a value that has
                                           * just been validated.
                                           */

exports.ValidatorError = _validatable.ValidatorError;