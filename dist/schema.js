'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Schema = exports.modes = undefined;

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
* A class for defining Document structure and properties.
*/

class Schema {

  /*
  * Class constructor.
  */

  constructor() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$fields = _ref.fields;
    let fields = _ref$fields === undefined ? {} : _ref$fields;
    var _ref$mode = _ref.mode;
    let mode = _ref$mode === undefined ? modes.STRICT : _ref$mode;
    var _ref$validator = _ref.validator;
    let validator = _ref$validator === undefined ? {} : _ref$validator;
    var _ref$type = _ref.type;
    let type = _ref$type === undefined ? {} : _ref$type;

    if (!isValidMode(mode)) {
      throw new Error(`Unknown schema mode ${ mode }`);
    }
    if (!(0, _typeable.isObject)(fields)) {
      throw new Error(`Schema fields key should be an Object`);
    }
    if (!(0, _typeable.isObject)(validator)) {
      throw new Error(`Schema validator key should be an Object`);
    }
    if (!(0, _typeable.isObject)(type)) {
      throw new Error(`Schema type key should be an Object`);
    }

    this.fields = fields; // document fields
    this.mode = mode; // document schema mode
    this.validator = validator; // document validator configuration options for validatable.js
    this.type = type; // document type configuration options for typeable.js
  }

}
exports.Schema = Schema;