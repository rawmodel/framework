'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Document = undefined;

var _typeable = require('typeable');

var _schema = require('./schema');

class Document {

  constructor(schema) {
    let data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (!(schema instanceof _schema.Schema)) {
      throw new Error('Document expects schema to be an instance of Schema class');
    }

    Object.defineProperty(this, '_schema', {
      get: () => schema,
      enumerable: false // do not expose as object key
    });

    this.purge();
    this.define();
    this.populate(data);
  }

  purge() {
    let names = Object.keys(this);
    this.purgeFields(names);
  }

  purgeFields() {
    let names = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    names.forEach(name => this.purgeField(name));
  }

  purgeField(name) {
    delete this[name];
  }

  define() {
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
        return data = _this.castValue(value, config);
      },
      enumerable: true,
      configurable: true
    });

    this[name] = config.defaultValue;
  }

  populate() {
    let fields = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    if (!(0, _typeable.isObject)(fields)) {
      throw new Error('Only Object can populate a Document');
    }

    let names = Object.keys(fields);

    for (let name in fields) {
      this.populateField(name, fields[name]);
    }
  }

  populateField(name, value) {
    this[name] = value;
  }

  castValue(value, config) {
    return (0, _typeable.cast)(value, config, {
      schema: (value, config) => new Document(config, value)
    });
  }

  toObject() {
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
  }

  valueToObject(value) {
    if (value && value.toObject) {
      return value.toObject();
    } else {
      return value;
    }
  }

  clone() {
    return new Document(this._schema, this.toObject());
  }

}
exports.Document = Document;