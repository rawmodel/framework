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

    return this;
  }

  purgeFields() {
    let names = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    names.forEach(name => this.purgeField(name));

    return this;
  }

  purgeField(name) {
    return delete this[name];
  }

  define() {
    let fields = this._schema.fields;

    this.defineFields(fields);

    return this;
  }

  defineFields(fields) {
    for (let name in fields) {
      this.defineField(name, fields[name]);
    }

    return this;
  }

  defineField(name) {
    var _this = this;

    let config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    let data;

    Object.defineProperty(this, name, {
      get: () => {
        if (config.get) {
          return config.get(data, this);
        } else {
          return data;
        }
      },
      set: function () {
        let value = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

        data = _this.castValue(value, config);
        if (config.set) {
          return data = config.set(data, _this);
        } else {
          return data;
        }
      },
      enumerable: true,
      configurable: true
    });

    if ((0, _typeable.isFunction)(config.defaultValue)) {
      this[name] = config.defaultValue(this);
    } else {
      this[name] = config.defaultValue;
    }

    return this[name];
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

    return this;
  }

  populateField(name, value) {
    if (this._schema.mode === 'relaxed') {
      this[name] = value;
    } else {
      let names = Object.keys(this._schema.fields);
      let exists = names.indexOf(name) > -1;

      if (exists) {
        this[name] = value;
      }
    }

    return this[name];
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

  clear() {
    let names = Object.keys(this);

    for (let name of names) {
      this.clearField(name);
    }

    return this;
  }

  clearField(name) {
    this[name] = null;
    return this[name];
  }

}
exports.Document = Document;