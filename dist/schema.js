'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Schema = exports.validatorDefaults = exports.modes = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.isValidMode = isValidMode;

var _typeable = require('typeable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* A list of available Schema modes.
*/

const modes = exports.modes = {
  RELAXED: 'relaxed',
  STRICT: 'strict'
};

/*
* Validates the `mode` value.
*/

function isValidMode(mode) {
  let keys = (0, _keys2.default)(modes);

  for (let key of keys) {
    if (modes[key] === mode) return true;
  }
  return false;
}

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
    var _ref2$mode = _ref2.mode;
    let mode = _ref2$mode === undefined ? modes.STRICT : _ref2$mode;
    var _ref2$validatorOption = _ref2.validatorOptions;
    let validatorOptions = _ref2$validatorOption === undefined ? {} : _ref2$validatorOption;
    var _ref2$typeOptions = _ref2.typeOptions;
    let typeOptions = _ref2$typeOptions === undefined ? {} : _ref2$typeOptions;

    if (!isValidMode(mode)) {
      throw new Error(`Unknown schema mode ${ mode }`);
    }
    if (!(0, _typeable.isObject)(fields)) {
      throw new Error(`Schema fields key should be an Object`);
    }
    if (!(0, _typeable.isObject)(validatorOptions)) {
      throw new Error(`Schema validatorOptions key should be an Object`);
    }
    if (!(0, _typeable.isObject)(typeOptions)) {
      throw new Error(`Schema typeOptions key should be an Object`);
    }

    this.fields = fields; // document fields
    this.mode = mode; // document schema mode
    this.validatorOptions = (0, _assign2.default)({}, validatorDefaults, validatorOptions); // options for validatable.js
    this.typeOptions = typeOptions; // options for typeable.js
  }

}
exports.Schema = Schema;