'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Field = undefined;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _typeable = require('typeable');

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _utils = require('./utils');

var _schemas = require('./schemas');

var _errors = require('./errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* Document field class.
*/

class Field {

  /*
  * Class constructor.
  */

  constructor(document, name) {
    Object.defineProperty(this, '$document', { // reference to the Document instance which owns the field
      value: document
    });
    Object.defineProperty(this, '$name', { // the name that a field has on the document
      value: name
    });
    Object.defineProperty(this, '_value', { // current field value
      value: this.defaultValue,
      writable: true
    });
    Object.defineProperty(this, '_initialValue', { // last committed field value
      value: this._value,
      writable: true
    });
    Object.defineProperty(this, '_errors', { // last action errors
      value: [],
      writable: true
    });
  }

  /*
  * Return field value.
  */

  get value() {
    let get = this.$document.$schema.fields[this.$name].get;


    let value = this._value;
    if (get) {
      // transformation with custom getter
      value = get.call(this.$document, value);
    }
    return value;
  }

  /*
  * Sets field value.
  */

  set value(value) {
    var _$document$$schema$fi = this.$document.$schema.fields[this.$name];
    let set = _$document$$schema$fi.set,
        type = _$document$$schema$fi.type;


    value = this._cast(value, type); // value type casting
    if (set) {
      // transformation with custom setter
      value = set.call(this.$document, value);
    }

    this.invalidate(); // remove the last memorized error because the value has changed
    this._value = value;
  }

  /*
  * Returns the default value of a field.
  */

  get defaultValue() {
    var _$document$$schema$fi2 = this.$document.$schema.fields[this.$name];
    let type = _$document$$schema$fi2.type,
        set = _$document$$schema$fi2.set,
        defaultValue = _$document$$schema$fi2.defaultValue;


    let value = (0, _typeable.isFunction)(defaultValue) ? defaultValue(this._document) : defaultValue;

    value = this._cast(value, type); // value type casting
    if (set) {
      // custom setter
      value = set.call(this.$document, value);
    }

    return value;
  }

  /*
  * Returns the value of a field of the last commit.
  */

  get initialValue() {
    return this._initialValue;
  }

  /*
  * Returns the last error of the field.
  */

  get errors() {
    return this._errors;
  }

  /*
  * Returns the last error of the field.
  */

  set errors(errors) {
    this._errors = errors.map(e => this._createError(e));
  }

  /*
  * Returns the last error of the field.
  */

  _createError(data) {
    switch (data.name) {
      case 'ValidatorError':
        return new _errors.ValidatorError(data.validator, data.message, data.code);
      case 'Error':
        return new Error(data.message);
    }

    throw new Error(`Unknown document field error`);
  }

  /*
  * Converts the `value` into specified `type`.
  */

  _cast(value, type) {
    let options = this.$document.$schema.typeOptions;

    options.types = (0, _assign2.default)({}, options.types, {
      Schema: value => {
        if ((0, _typeable.isArray)(type)) type = type[0]; // in case of {type: [Schema]}

        return this.$document._createRelative(type, value);
      }
    });

    return (0, _typeable.cast)(value, type, options);
  }

  /*
  * Sets field to the default value.
  */

  reset() {
    this.value = this.defaultValue;
    this.invalidate();

    return this;
  }

  /*
  * Removes field's value by setting it to null.
  */

  clear() {
    this.value = null;

    return this;
  }

  /*
  * Deeply set's the initial values to the current value of each field.
  */

  commit() {
    this._commitRelated(this.value);
    this._initialValue = (0, _utils.cloneData)(this.value);

    return this;
  }

  /*
  * Deeply set's the initial values of the related `data` object to the current
  * value of each field.
  */

  _commitRelated(data) {
    // commit sub fields
    if (data && data.commit) {
      data.commit();
    } else if (data && (0, _typeable.isArray)(data)) {
      data.forEach(d => this._commitRelated(d));
    }
  }

  /*
  * Sets field's value before last commit.
  */

  rollback() {
    this.value = this.initialValue;

    return this;
  }

  /*
  * Returns `true` when the `data` equals to the current value.
  */

  equals(data) {
    return (0, _deepEqual2.default)(this.value, data);
  }

  /*
  * Returns `true` if the field or related sub-fields have been changed.
  */

  isChanged() {
    return !this.equals(this.initialValue);
  }

  /*
  * Validates the field by populating the `_errors` property.
  */

  validate() {
    var _this = this;

    return (0, _asyncToGenerator3.default)(function* () {
      let relatives = (0, _typeable.toArray)(_this.value) || []; // validate related documents
      for (let relative of relatives) {
        let isDocument = relative instanceof _this.$document.constructor;

        if (isDocument) {
          yield relative.validate({ quiet: true }); // don't throw
        }
      }

      _this._errors = yield _this.$document.$validator.validate( // validate this field
      _this.value, _this.$document.$schema.fields[_this.$name].validate);

      return _this;
    })();
  }

  /*
  * Validates the field by clearing the `_errors` property
  */

  invalidate() {
    let relatives = (0, _typeable.toArray)(this.value) || []; // validate related documents
    for (let relative of relatives) {
      let isDocument = relative instanceof this.$document.constructor;

      if (isDocument) {
        relative.invalidate();
      }
    }

    this._errors = [];

    return this;
  }

  /*
  * Returns `true` when the value is valid.
  */

  isValid() {
    var _this2 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      return (0, _typeable.isAbsent)(_this2.errors);
    })();
  }

}
exports.Field = Field;