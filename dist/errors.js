'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationError = undefined;

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
      value: (0, _typeable.toArray)(paths),
      writable: true
    });
    Object.defineProperty(this, 'code', { // error code
      value: code,
      writable: true
    });
  }

}
exports.ValidationError = ValidationError;