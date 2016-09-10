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

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

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

    Object.defineProperty(this, 'schema', {
      get: () => schema,
      enumerable: false // do not expose as object key
    });

    Object.defineProperty(this, 'validator', {
      value: new _validatable.Validator((0, _assign2.default)({}, schema.validatorOptions, { context: this })),
      enumerable: false // do not expose as object key
    });

    this.define();
    this.populate(data);
  }

  /*
  * Defines class fields for all fields in schema.
  */

  define() {
    return this._defineFields();
  }

  /*
  * Defines all schema fields.
  */

  _defineFields() {
    let fields = this.schema.fields;


    for (let name in fields) {
      this._defineField(name);
    }

    return this;
  }

  /*
  * Defines a schema field by name.
  */

  _defineField(name) {
    var _this = this;

    let definition = this.schema.fields[name];
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

        data = _this._castValue(value, definition.type); // value type casting
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

  _castValue(value, type) {
    let options = this.schema.typeOptions;

    options.types = (0, _assign2.default)({}, options.types, {
      Schema: value => {
        if ((0, _typeable.isArray)(type)) type = type[0]; // in case of {type: [Schema]}
        return new this.constructor(type, value);
      }
    });

    return (0, _typeable.cast)(value, type, options);
  }

  /*
  * Sets field values from the provided by data object.
  */

  populate() {
    let data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    return this._populateFields(data);
  }

  /*
  * Sets field values from the provided by data object.
  */

  _populateFields() {
    let data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    if (!(0, _typeable.isObject)(data)) {
      throw new Error(`Only object can populate a ${ this.constructor.name.toLowerCase() }`);
    }

    for (let name in data) {
      this._populateField(name, data[name]);
    }

    return this;
  }

  /*
  * Sets a value of a field by name.
  */

  _populateField(name, value) {
    if (this.schema.mode === 'relaxed') {
      this[name] = value;
    } else {
      let names = (0, _keys2.default)(this.schema.fields);
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

  purge() {
    return this._purgeFields();
  }

  /*
  * Deletes all class fields.
  */

  _purgeFields() {
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
    return this._clearFields();
  }

  /*
  * Remove values of all class fields.
  */

  _clearFields() {
    let names = (0, _keys2.default)(this);

    for (let name of names) {
      this._clearField(name);
    }

    return this;
  }

  /*
  * Removes a value of a field with `name`.
  */

  _clearField(name) {
    this[name] = null;
    return this[name];
  }

  /*
  * Returns a new Document instance which is the exact
  * copy of the original instance.
  */

  clone() {
    return new this.constructor(this.schema, this.toObject());
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
      return yield _this2._validateFields();
    })();
  }

  /*
  * Validates all class fields and returns errors.
  */

  _validateFields() {
    var _this3 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      let errors = {};

      for (let name in _this3) {

        let error = yield _this3._validateField(name);
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

  _validateField(name) {
    var _this4 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      let value = _this4[name];
      let definition = _this4.schema.fields[name];

      return yield _this4._validateValue(value, definition);
    })();
  }

  /*
  * Validates a value agains the field `definition` object.
  */

  _validateValue(value, definition) {
    var _this5 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      let type = definition.type;
      let validate = definition.validate;

      let error = {};

      error.messages = yield _this5.validator.validate(value, validate);

      let related = yield _this5._validateRelatedObject(value, definition);
      if (related) {
        error.related = related;
      }

      error.isValid = error.messages.length === 0 && _this5._isRelatedObjectValid(related);

      return error.isValid ? undefined : error;
    })();
  }

  /*
  * Validates a value agains the field `definition` object.
  */

  _validateRelatedObject(value, definition) {
    var _this6 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      let type = definition.type;


      if (!value) {
        return undefined;
      } else if (type instanceof _schema.Schema) {
        return yield value._validateFields();
      } else if ((0, _typeable.isArray)(type) && (0, _typeable.isArray)(value)) {
        let aaa = [];

        for (let v of value) {
          if (type[0] instanceof _schema.Schema) {
            if (v) {
              aaa.push((yield v._validateFields()));
            } else {
              aaa.push(undefined);
            }
          } else {
            aaa.push((yield _this6._validateValue(v, definition)));
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
    var _this7 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      return (0, _typeable.isAbsent)((yield _this7._validateFields()));
    })();
  }

  /*
  * Returns `true` when the `value` represents an object with the
  * same field values as the original document.
  */

  equalsTo(value) {
    return (0, _deepEqual2.default)(this, value);
  }

}
exports.Document = Document;