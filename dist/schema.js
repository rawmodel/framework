'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Schema = exports.validatorDefaults = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* Validator default options.
*/

const validatorDefaults = exports.validatorDefaults = {
  errorBuilder: (validator, value, _ref) => {
    let message = _ref.message;
    return { validator, message };
  }
};

/*
* A class for defining Document structure and properties.
*/

class Schema {

  /*
  * Class constructor.
  */

  constructor() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _ref2$fields = _ref2.fields;
    let fields = _ref2$fields === undefined ? {} : _ref2$fields;
    var _ref2$strict = _ref2.strict;
    let strict = _ref2$strict === undefined ? true : _ref2$strict;
    var _ref2$validatorOption = _ref2.validatorOptions;
    let validatorOptions = _ref2$validatorOption === undefined ? {} : _ref2$validatorOption;
    var _ref2$typeOptions = _ref2.typeOptions;
    let typeOptions = _ref2$typeOptions === undefined ? {} : _ref2$typeOptions;

    Object.defineProperty(this, 'fields', { // document fields
      get: () => typeof fields === 'function' ? fields() : fields
    });
    Object.defineProperty(this, 'strict', { // document schema mode
      value: strict
    });
    Object.defineProperty(this, 'validatorOptions', { // options for validatable.js
      value: (0, _assign2.default)({}, validatorDefaults, validatorOptions)
    });
    Object.defineProperty(this, 'typeOptions', { // options for typeable.js
      value: typeOptions
    });
  }

}
exports.Schema = Schema;