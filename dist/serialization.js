'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.objectSerialization = objectSerialization;

var _typeable = require('typeable');

function objectSerialization(target, name, descriptor) {

  target.prototype.toObject = function () {
    let data = {};
    let names = Object.keys(this);

    for (let name of names) {
      let value = this[name];

      if ((0, _typeable.isArray)(value)) {
        data[name] = value.map(i => this.valueToObject(i));
      } else {
        data[name] = this.valueToObject(value);
      }
    }

    return data;
  };

  target.prototype.valueToObject = function (value) {
    if (value && value.toObject) {
      return value.toObject();
    } else {
      return value;
    }
  };
}