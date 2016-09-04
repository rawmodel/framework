'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Document = undefined;

var _class;

var _typeable = require('typeable');

var _schema = require('./schema');

var _structure = require('./structure');

var _serialization = require('./serialization');

let Document = exports.Document = (0, _structure.objectFields)(_class = (0, _structure.objectCloning)(_class = (0, _serialization.objectSerialization)(_class = class Document {

  constructor(schema) {
    let data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (!(schema instanceof _schema.Schema)) {
      throw new Error(`${ this.constructor.name } expects schema to be an instance of Schema class`);
    }

    Object.defineProperty(this, '_schema', {
      get: () => schema,
      enumerable: false // do not expose as object key
    });

    this.purge();
    this.define();
    this.populate(data);
  }

  // isValid() {
  //   let names = Object.keys(this);
  //
  //   for (let name of names) {
  //     if (!this.isValidField(name)) return false;
  //   }
  //   return true;
  // }
  //
  // isValidField(name) {
  //
  // }

}) || _class) || _class) || _class;