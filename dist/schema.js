'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Schema = exports.modes = undefined;
exports.isValidMode = isValidMode;

var _typeable = require('typeable');

const modes = exports.modes = {
  RELAXED: 'relaxed',
  STRICT: 'strict'
};

function isValidMode(mode) {
  let keys = Object.keys(modes);

  for (let key of keys) {
    if (modes[key] === mode) return true;
  }
  return false;
}

let Schema = exports.Schema = class Schema {

  constructor(_ref) {
    var _ref$mode = _ref.mode;
    let mode = _ref$mode === undefined ? modes.RELAXED : _ref$mode;
    var _ref$fields = _ref.fields;
    let fields = _ref$fields === undefined ? {} : _ref$fields;

    if (!isValidMode(mode)) {
      throw new Error(`Unknown schema mode ${ mode }`);
    }
    if (!(0, _typeable.isObject)(fields)) {
      throw new Error(`Schema fields should be an Object`);
    }

    this.mode = mode;
    this.fields = fields;
  }

};