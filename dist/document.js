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

var _validation = require('./validation');

let Document = exports.Document = (0, _structure.injectFieldsUtils)(_class = (0, _structure.injectCloningUtils)(_class = (0, _serialization.injectObjectSerializationUtils)(_class = (0, _validation.injectValidationUtils)(_class = class Document {

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

}) || _class) || _class) || _class) || _class;