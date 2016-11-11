'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isEqual = exports.merge = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.serialize = serialize;
exports.retrieve = retrieve;

var _typeable = require('typeable');

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isequal');

var _lodash4 = _interopRequireDefault(_lodash3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* Returns a duplicated data object (useful to remove data bindings).
*/

function serialize(data) {
  return JSON.parse((0, _stringify2.default)(data));
}

/*
* A helper method for retrieving a value from an input which can be
* a value or a function.
*/

function retrieve(input) {
  return (0, _typeable.isFunction)(input) ? input() : input;
}

/*
* Deeply combines multiple values.
*/

exports.merge = _lodash2.default;

/*
* Deeply checks if two objects are equal.
*/

exports.isEqual = _lodash4.default;