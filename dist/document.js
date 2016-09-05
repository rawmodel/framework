'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Document = undefined;

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _typeable = require('typeable');

var _validatable = require('validatable');

var _schema = require('./schema');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Document {

  constructor(schema) {
    let data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (!(schema instanceof _schema.Schema)) {
      throw new Error(`${ this.constructor.name } expects schema to be an instance of Schema class`);
    }

    Object.defineProperty(this, '_schema', {
      get: () => schema,
      enumerable: false // do not expose as object key
    });

    Object.defineProperty(this, '_validator', {
      value: new _validatable.Validator((0, _assign2.default)({}, schema.validator, { context: this })),
      enumerable: false // do not expose as object key
    });

    this.purge();
    this.define();
    this.populate(data);
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

    let definition = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    let data;

    (0, _defineProperty2.default)(this, name, {
      get: () => {
        if (definition.get) {
          return definition.get(data, this);
        } else {
          return data;
        }
      },
      set: function () {
        let value = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

        data = _this.castValue(value, definition);
        if (definition.set) {
          data = definition.set(data, _this);
        }
      },
      enumerable: true,
      configurable: true
    });

    if ((0, _typeable.isFunction)(definition.defaultValue)) {
      this[name] = definition.defaultValue(this);
    } else {
      this[name] = definition.defaultValue;
    }

    return this[name];
  }

  castValue(value, _ref) {
    let type = _ref.type;

    return (0, _typeable.cast)(value, type, {
      schema: value => {
        if ((0, _typeable.isArray)(type)) type = type[0];
        return new this.constructor(type, value);
      }
    });
  }

  populate() {
    let fields = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    if (!(0, _typeable.isObject)(fields)) {
      throw new Error(`Only Object can populate a ${ this.constructor.name }`);
    }

    for (let name in fields) {
      this.populateField(name, fields[name]);
    }

    return this;
  }

  populateField(name, value) {
    if (this._schema.mode === 'relaxed') {
      this[name] = value;
    } else {
      let names = (0, _keys2.default)(this._schema.fields);
      let exists = names.indexOf(name) > -1;

      if (exists) {
        this[name] = value;
      }
    }

    return this[name];
  }

  purge() {
    let names = (0, _keys2.default)(this);
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

  clear() {
    let names = (0, _keys2.default)(this);

    for (let name of names) {
      this.clearField(name);
    }

    return this;
  }

  clearField(name) {
    this[name] = null;
    return this[name];
  }

  clone() {
    return new this.constructor(this._schema, this.toObject());
  }

  toObject() {
    let valueToObject = v => {
      if (v && v.toObject) {
        return v.toObject();
      } else if (v && (0, _typeable.isArray)(v)) {
        return v.map(v => valueToObject(v));
      } else {
        return v;
      }
    };

    let data = {};
    let names = (0, _keys2.default)(this);
    for (let name of names) {
      data[name] = valueToObject(this[name]);
    }
    return data;
  }

  // async validate() {
  //   let errors = {};
  //
  //   let {fields} = this._schema;
  //   for (let name in fields) {
  //     errors[name] = await this.validateField(name);
  //   }
  //
  //   return errors;
  // }
  //
  // async validateField(name) {
  //   let definition = this._schema.fields[name];
  //   let value = this[name];
  //
  //   return await this.validateValue(value, definition);
  // }

  validate() {
    var _this2 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      let errors = {};

      for (let name in _this2) {
        let value = _this2[name];
        let definition = _this2._schema.fields[name];

        let error = yield _this2.validateField(value, definition);
        if (!(0, _typeable.isUndefined)(error)) {
          errors[name] = error;
        }
      }

      return errors;
    })();
  }

  validateField(value, definition) {
    var _this3 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      let type = definition.type;
      let validations = definition.validations;


      let messages = yield _this3._validator.validate(value, validations);

      let related = null;
      if (type instanceof _schema.Schema && value) {
        related = yield value.validate();
      } else if ((0, _typeable.isArray)(type) && (0, _typeable.isArray)(value)) {
        related = [];
        for (let v of value) {
          if (type[0] instanceof _schema.Schema) {
            if (v) {
              related.push((yield v.validate()));
            } else {
              related.push(undefined);
            }
          } else {
            related.push((yield _this3.validateField(v, definition)));
          }
        }
      }

      let isValid = messages.length === 0;
      if (related && (0, _typeable.isObject)(related)) {
        isValid = !(0, _values2.default)(related).map(function (v) {
          return v.isValid;
        }).includes(false);
      } else if (related && (0, _typeable.isArray)(related)) {
        isValid = related.map(function (v) {
          return !v || v.isValid;
        }).includes(false);
      }

      return isValid ? undefined : { isValid, messages, related };
    })();
  }

}
exports.Document = Document;