'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.objectFields = objectFields;
exports.objectCloning = objectCloning;

var _typeable = require('typeable');

function objectFields(target, name, descriptor) {

  target.prototype.define = function () {
    let fields = this._schema.fields;

    this.defineFields(fields);

    return this;
  };

  target.prototype.defineFields = function (fields) {
    for (let name in fields) {
      this.defineField(name, fields[name]);
    }

    return this;
  };

  target.prototype.defineField = function (name) {
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
  };

  target.prototype.castValue = function (value, config) {
    return (0, _typeable.cast)(value, config, {
      schema: (value, config) => new this.constructor(config, value)
    });
  };

  target.prototype.populate = function () {
    let fields = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    if (!(0, _typeable.isObject)(fields)) {
      throw new Error(`Only Object can populate a ${ this.constructor.name }`);
    }

    let names = Object.keys(fields);

    for (let name in fields) {
      this.populateField(name, fields[name]);
    }

    return this;
  };

  target.prototype.populateField = function (name, value) {
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
  };

  target.prototype.purge = function () {
    let names = Object.keys(this);
    this.purgeFields(names);

    return this;
  };

  target.prototype.purgeFields = function () {
    let names = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    names.forEach(name => this.purgeField(name));

    return this;
  };

  target.prototype.purgeField = function (name) {
    return delete this[name];
  };

  target.prototype.clear = function () {
    let names = Object.keys(this);

    for (let name of names) {
      this.clearField(name);
    }

    return this;
  };

  target.prototype.clearField = function (name) {
    this[name] = null;
    return this[name];
  };
}

function objectCloning(target, name, descriptor) {

  target.prototype.clone = function () {
    return new this.constructor(this._schema, this.toObject());
  };
}