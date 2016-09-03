'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Document = undefined;

var _typeable = require('typeable');

var _schema = require('./schema');

class Document {

  constructor() {
    let schema = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    let data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (!(schema instanceof _schema.Schema)) {
      throw new Error('Document expects schema to be an instance of Schema class');
    }

    Object.defineProperty(this, '_schema', {
      get: () => schema,
      enumerable: false // do not expose as object key
    });

    this.deleteAllFields();
    this.defineAllFields();
    this.assignFields(data);
  }

  deleteAllFields() {
    let names = Object.keys(this);
    this.deleteFields(names);
  }

  deleteFields() {
    let names = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    names.forEach(name => this.deleteField(name));
  }

  deleteField(name) {
    delete this[name];
  }

  defineAllFields() {
    let fields = this._schema.fields;

    this.defineFields(fields);
  }

  defineFields(fields) {
    for (let name in fields) {
      this.defineField(name, fields[name]);
    }
  }

  defineField(name) {
    var _this = this;

    let config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    let data;

    Object.defineProperty(this, name, {
      get: () => data,
      set: function () {
        let value = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
        return data = _this.castFieldValue(value, config);
      },
      enumerable: true,
      configurable: true
    });

    this[name] = config.defaultValue;
  }

  assignFields() {
    let fields = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    if (!(0, _typeable.isObject)(fields)) {
      throw new Error('Only Object can be assigned to a Document');
    }

    let names = Object.keys(fields);

    for (let name in fields) {
      this.assignField(name, fields[name]);
    }
  }

  assignField(name, value) {
    this[name] = value;
  }

  castFieldValue(value, config) {
    return (0, _typeable.cast)(value, config, {
      schema: (value, config) => new Document(config, value)
    });
  }

  toObject() {
    let data = {};
    let names = Object.keys(this);

    for (let name of names) {
      let value = this[name];

      if (value instanceof Document) {
        data[name] = value.toObject();
      } else {
        data[name] = value;
      }
    }

    return data;
  }

}
exports.Document = Document;