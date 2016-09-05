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

/*
* The core schema-based object class.
*/

class Document {

  /*
  * Class constructor.
  */

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

    this._purge();
    this.define();
    this.populate(data);
  }

  /*
  * Defines class fields for all fields in schema.
  */

  define() {
    let fields = this._schema.fields;


    for (let name in fields) {
      this._defineField(name, fields[name]);
    }

    return this;
  }

  /*
  * Defines a class field from the provided `name` and
  * field definition object.
  */

  _defineField(name) {
    var _this = this;

    let definition = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    let data;

    (0, _defineProperty2.default)(this, name, { // field definition
      get: () => {
        if (definition.get) {
          // value transformation
          return definition.get(data, this);
        } else {
          return data;
        }
      },
      set: function () {
        let value = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

        data = _this._castValue(value, definition); // value type casting
        if (definition.set) {
          // value transformation
          data = definition.set(data, _this);
        }
      },
      enumerable: true,
      configurable: true
    });

    if ((0, _typeable.isFunction)(definition.defaultValue)) {
      // setting default value
      this[name] = definition.defaultValue(this);
    } else {
      this[name] = definition.defaultValue;
    }

    return this[name];
  }

  /*
  * Converts the `value` into specified `type`.
  */

  _castValue(value, _ref) {
    let type = _ref.type;

    return (0, _typeable.cast)(value, type, {
      schema: value => {
        if ((0, _typeable.isArray)(type)) type = type[0]; // in case of {type: [Schema]}
        return new this.constructor(type, value);
      }
    });
  }

  /*
  * Sets values of class properties with values provided by
  * the `data` object.
  */

  populate() {
    let data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    if (!(0, _typeable.isObject)(data)) {
      throw new Error(`Only Object can populate a ${ this.constructor.name }`);
    }

    for (let name in data) {
      this.populateField(name, data[name]);
    }

    return this;
  }

  /*
  * Sets a value of a single class property.
  */

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

  /*
  * Deletes all class fields.
  */

  _purge() {
    let names = (0, _keys2.default)(this);
    names.forEach(name => this._purgeField(name));

    return this;
  }

  /*
  * Deletes specified class field.
  */

  _purgeField(name) {
    return delete this[name];
  }

  /*
  * Remove values of all class fields.
  */

  clear() {
    let names = (0, _keys2.default)(this);

    for (let name of names) {
      this.clearField(name);
    }

    return this;
  }

  /*
  * Removes a value of a field with `name`.
  */

  clearField(name) {
    this[name] = null;
    return this[name];
  }

  /*
  * Returns a new Document instance which is the exact
  * copy of the original instance.
  */

  clone() {
    return new this.constructor(this._schema, this.toObject());
  }

  /*
  * Converts this class into serialized data object.
  */

  toObject() {
    let data = {};
    let names = (0, _keys2.default)(this);

    for (let name of names) {
      data[name] = this._toObjectValue(this[name]);
    }

    return data;
  }

  /*
  * Reads a value recursivelly and returns a serialized data object.
  */

  _toObjectValue(value) {
    if (value && value.toObject) {
      return value.toObject();
    } else if (value && (0, _typeable.isArray)(value)) {
      return value.map(value => this._toObjectValue(value));
    } else {
      return value;
    }
  }

  /*
  * Validates all class fields and returns errors.
  */

  validate() {
    var _this2 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      let errors = {};

      for (let name in _this2) {

        let error = yield _this2.validateField(name);
        if (!(0, _typeable.isUndefined)(error)) {
          errors[name] = error;
        }
      }

      return errors;
    })();
  }

  /*
  * Validates a single class field with `name` and returns errors.
  */

  validateField(name) {
    var _this3 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      let value = _this3[name];
      let definition = _this3._schema.fields[name];

      return yield _this3._validateValue(value, definition);
    })();
  }

  /*
  * Validates a value agains the field `definition` object.
  */

  _validateValue(value, definition) {
    var _this4 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      let type = definition.type;
      let validations = definition.validations;

      let error = {};

      error.messages = yield _this4._validator.validate(value, validations);

      let related = yield _this4._validateRelatedObject(value, definition);
      if (related) {
        error.related = related;
      }

      error.isValid = error.messages.length === 0 && _this4._isRelatedObjectValid(related);

      return error.isValid ? undefined : error;
    })();
  }

  /*
  * Validates a value agains the field `definition` object.
  */

  _validateRelatedObject(value, definition) {
    var _this5 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      let type = definition.type;
      let validations = definition.validations;


      if (!value) {
        return undefined;
      } else if (type instanceof _schema.Schema) {
        return yield value.validate();
      } else if ((0, _typeable.isArray)(type) && (0, _typeable.isArray)(value)) {
        let aaa = [];

        for (let v of value) {
          if (type[0] instanceof _schema.Schema) {
            if (v) {
              aaa.push((yield v.validate()));
            } else {
              aaa.push(undefined);
            }
          } else {
            aaa.push((yield _this5._validateValue(v, definition)));
          }
        }
        return aaa;
      } else {
        return undefined;
      }
    })();
  }

  /*
  * Validates a related object of a field (a sub schema).
  */

  _isRelatedObjectValid(value) {
    if (!value) {
      return true;
    } else if ((0, _typeable.isObject)(value)) {
      return (0, _values2.default)(value).map(v => v.isValid).indexOf(false) === -1;
    } else if ((0, _typeable.isArray)(value)) {
      return value.map(v => this._isRelatedObjectValid(v)).indexOf(false) === -1;
    }
  }

  /*
  * Returns `true` when all document fields are valid.
  */

  isValid() {
    var _this6 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      let errors = yield _this6.validate();
      return (0, _typeable.isAbsent)(errors);
    })();
  }

}
exports.Document = Document;