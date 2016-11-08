'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Schema = undefined;

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

var _typeable = require('typeable');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* A class for defining Document structure and properties.
*/

class Schema {

  /*
  * Class constructor.
  */

  constructor() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$mixins = _ref.mixins;

    let mixins = _ref$mixins === undefined ? [] : _ref$mixins;
    var _ref$fields = _ref.fields;
    let fields = _ref$fields === undefined ? {} : _ref$fields,
        strict = _ref.strict;
    var _ref$validatorOptions = _ref.validatorOptions;
    let validatorOptions = _ref$validatorOptions === undefined ? {} : _ref$validatorOptions;
    var _ref$typeOptions = _ref.typeOptions;
    let typeOptions = _ref$typeOptions === undefined ? {} : _ref$typeOptions;


    Object.defineProperty(this, 'fields', { // document fields
      get: () => (0, _lodash2.default)(...mixins.map(s => (0, _utils.retrieve)(s.fields)), (0, _utils.retrieve)(fields)),
      enumerable: true // required for deep nesting
    });

    Object.defineProperty(this, 'strict', { // document schema mode
      get: () => [true].concat(mixins.map(s => s.strict), strict).filter(s => (0, _typeable.isBoolean)(s)).reverse()[0],
      enumerable: true // required for deep nesting
    });

    Object.defineProperty(this, 'validatorOptions', { // options for validatable.js
      get: () => (0, _lodash2.default)(...mixins.map(v => v.validatorOptions), validatorOptions),
      enumerable: true // required for deep nesting
    });

    Object.defineProperty(this, 'typeOptions', { // options for typeable.js
      get: () => (0, _lodash2.default)(...mixins.map(v => v.typeOptions), typeOptions),
      enumerable: true // required for deep nesting
    });
  }

}
exports.Schema = Schema;