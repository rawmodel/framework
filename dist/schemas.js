'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Schema = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _typeable = require('typeable');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* A class for defining Document structure and properties.
*/

var Schema =

/*
* Class constructor.
*/

exports.Schema = function Schema() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$mixins = _ref.mixins,
      mixins = _ref$mixins === undefined ? [] : _ref$mixins,
      _ref$fields = _ref.fields,
      fields = _ref$fields === undefined ? {} : _ref$fields,
      strict = _ref.strict,
      _ref$validatorOptions = _ref.validatorOptions,
      validatorOptions = _ref$validatorOptions === undefined ? {} : _ref$validatorOptions,
      _ref$typeOptions = _ref.typeOptions,
      typeOptions = _ref$typeOptions === undefined ? {} : _ref$typeOptions;

  (0, _classCallCheck3.default)(this, Schema);


  Object.defineProperty(this, 'fields', { // document fields
    get: function get() {
      return _utils.merge.apply(undefined, (0, _toConsumableArray3.default)(mixins.map(function (s) {
        return (0, _utils.retrieve)(s.fields);
      })).concat([(0, _utils.retrieve)(fields)]));
    },
    enumerable: true // required for deep nesting
  });

  Object.defineProperty(this, 'strict', { // document schema mode
    get: function get() {
      return [true].concat(mixins.map(function (s) {
        return s.strict;
      }), strict).filter(function (s) {
        return (0, _typeable.isBoolean)(s);
      }).reverse()[0];
    },
    enumerable: true // required for deep nesting
  });

  Object.defineProperty(this, 'validatorOptions', { // options for validatable.js
    get: function get() {
      return _utils.merge.apply(undefined, (0, _toConsumableArray3.default)(mixins.map(function (v) {
        return v.validatorOptions;
      })).concat([validatorOptions]));
    },
    enumerable: true // required for deep nesting
  });

  Object.defineProperty(this, 'typeOptions', { // options for typeable.js
    get: function get() {
      return _utils.merge.apply(undefined, (0, _toConsumableArray3.default)(mixins.map(function (v) {
        return v.typeOptions;
      })).concat([typeOptions]));
    },
    enumerable: true // required for deep nesting
  });
};