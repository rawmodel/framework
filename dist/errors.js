'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidatorError = exports.InvalidFieldError = exports.ValidationError = undefined;

var _validatable = require('validatable');

/*
* A validation error class which holds information about document's invalid fields.
*/

class ValidationError extends Error {

  /*
  * Class constructor.
  */

  constructor() {
    let errors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    let message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Fields validation failed';
    let code = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 422;

    super();

    this.name = this.constructor.name;
    this.errors = errors;
    this.message = message;
    this.code = code;
  }
}

exports.ValidationError = ValidationError; /*
                                           * A validation error class which holds information of a single invalid field.
                                           */

class InvalidFieldError extends Error {

  /*
  * Class constructor.
  */

  constructor() {
    let path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    let errors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    let related = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    let message = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'Field validation failed';
    let code = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 422;

    super();

    this.name = this.constructor.name;
    this.path = path;
    this.errors = errors;
    this.related = related;
    this.message = message;
    this.code = code;
  }
}

exports.InvalidFieldError = InvalidFieldError; /*
                                               * A validator error class, provided by the `validatable.js`, which holds information about the validators which do not approve a value that has just been validated.
                                               */

exports.ValidatorError = _validatable.ValidatorError;