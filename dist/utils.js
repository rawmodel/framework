"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

exports.serialize = serialize;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* Returns a duplicated data object (useful to remove data bindings).
*/

function serialize(data) {
  return JSON.parse((0, _stringify2.default)(data));
}