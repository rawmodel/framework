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
      _ref$validators = _ref.validators,
      validators = _ref$validators === undefined ? {} : _ref$validators,
      _ref$types = _ref.types,
      types = _ref$types === undefined ? {} : _ref$types,
      firstErrorOnly = _ref.firstErrorOnly;

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

  Object.defineProperty(this, 'validators', { // validatable.js configuration option
    get: function get() {
      return _utils.merge.apply(undefined, (0, _toConsumableArray3.default)(mixins.map(function (v) {
        return v.validators;
      })).concat([validators]));
    },
    enumerable: true // required for deep nesting
  });

  Object.defineProperty(this, 'types', { // typeable.js configuration option
    get: function get() {
      return _utils.merge.apply(undefined, (0, _toConsumableArray3.default)(mixins.map(function (v) {
        return v.types;
      })).concat([types]));
    },
    enumerable: true // required for deep nesting
  });

  Object.defineProperty(this, 'firstErrorOnly', { // validatable.js configuration option
    get: function get() {
      return [false].concat(mixins.map(function (s) {
        return s.firstErrorOnly;
      }), firstErrorOnly).filter(function (s) {
        return (0, _typeable.isBoolean)(s);
      }).reverse()[0];
    },
    enumerable: true // required for deep nesting
  });
};