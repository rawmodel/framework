'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Document = undefined;

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

var _utils = require('./utils');

var _schemas = require('./schemas');

var _fields = require('./fields');

var _errors = require('./errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* The core schema-based object class.
*/

class Document {

  /*
  * Class constructor.
  */

  constructor(schema) {
    let data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    Object.defineProperty(this, '$schema', { // schema instance
      value: schema
    });
    Object.defineProperty(this, '$parent', { // parent document instance
      value: parent
    });
    Object.defineProperty(this, '$root', { // root document instance
      get: () => this._getRootDocument()
    });
    Object.defineProperty(this, '$validator', { // validatable.js instance
      value: this._createValidator()
    });
    Object.defineProperty(this, '$error', { // last document error instance
      value: null,
      writable: true
    });

    this._defineFields();
    this._populateFields(data);
  }

  /*
  * Loops up on the tree and returns the first document in the tree.
  */

  _getRootDocument() {
    let root = this;
    do {
      if (root.$parent) {
        root = root.$parent;
      } else {
        return root;
      }
    } while (true);
  }

  /*
  * Returns a new instance of validator.
  */

  _createValidator() {
    return new _validatable.Validator((0, _assign2.default)({}, this.$schema.validatorOptions, { context: this }));
  }

  /*
  * Creates a new Field instance.
  */

  _createField(name) {
    return new _fields.Field(this, name);
  }

  /*
  * Creates a new sub-document instance (a nested document).
  */

  _createRelative(schema) {
    let data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return new this.constructor(schema, data, this);
  }

  /*
  * Creates a new ValidationError instance.
  */

  _createValidationError(paths) {
    return new _errors.ValidationError(paths);
  }

  /*
  * Defines class fields from schema.
  */

  _defineFields() {
    let fields = this.$schema.fields;


    for (let name in fields) {
      this._defineField(name);
    }
  }

  /*
  * Defines a schema field by name.
  */

  _defineField(name) {
    let field = this._createField(name);

    (0, _defineProperty2.default)(this, name, { // field definition
      get: () => field.value,
      set: v => field.value = v,
      enumerable: true,
      configurable: true
    });

    Object.defineProperty(this, `$${ name }`, { // field class instance definition
      value: field
    });
  }

  /*
  * Returns a value at path.
  */

  getPath() {
    for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
      keys[_key] = arguments[_key];
    }

    if ((0, _typeable.isArray)(keys[0])) {
      keys = keys[0];
    }

    return keys.reduce((a, b) => (a || {})[b], this);
  }

  /*
  * Returns `true` if field at path exists.
  */

  hasPath() {
    return this.getPath(...arguments) !== undefined;
  }

  /*
  * Sets field values from the provided by data object.
  */

  populate() {
    let data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return this._populateFields(data);
  }

  /*
  * Sets field values from the provided by data object.
  */

  _populateFields() {
    let data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    data = (0, _utils.cloneData)(data);

    for (let name in data) {
      this._populateField(name, data[name]);
    }

    return this;
  }

  /*
  * Sets a value of a field by name.
  */

  _populateField(name, value) {
    if (!this.$schema.strict) {
      this[name] = value;
    } else {
      let names = (0, _keys2.default)(this.$schema.fields);
      let exists = names.indexOf(name) > -1;

      if (exists) {
        this[name] = value;
      }
    }
  }

  /*
  * Converts this class into serialized data object.
  */

  toObject() {
    let data = {};
    let names = (0, _keys2.default)(this);

    for (let name of names) {
      data[name] = this._serializeValue(this[name]);
    }

    return data;
  }

  /*
  * Serializes a value recursivelly and returns a serialized data object.
  */

  _serializeValue(value) {
    if (value && value.toObject) {
      return value.toObject();
    } else if (value && (0, _typeable.isArray)(value)) {
      return value.map(value => this._serializeValue(value));
    } else {
      return value;
    }
  }

  /*
  * Sets each document field to its default value.
  */

  reset() {
    let fields = this.$schema.fields;


    for (let name in fields) {
      this[`$${ name }`].reset();
    }

    return this;
  }

  /*
  * Removes all fileds values by setting them to `null`.
  */

  clear() {
    let fields = this.$schema.fields;


    for (let name in fields) {
      this[`$${ name }`].clear();
    }

    return this;
  }

  /*
  * Sets initial value of each document field to the current value of a field.
  */

  commit() {
    let fields = this.$schema.fields;


    for (let name in fields) {
      this[`$${ name }`].commit();
    }

    return this;
  }

  /*
  * Sets each document field to its initial value (value before last commit).
  */

  rollback() {
    let fields = this.$schema.fields;


    for (let name in fields) {
      this[`$${ name }`].rollback();
    }

    return this;
  }

  /*
  * Returns `true` when the `value` represents an object with the
  * same field values as the original document.
  */

  equals(value) {
    return (0, _deepEqual2.default)(this, value);
  }

  /*
  * Returns a new Document instance which is the exact copy of the original.
  */

  clone() {
    return new this.constructor(this.$schema, this.toObject());
  }

  /*
  * Returns a `true` if at least one field has been changed.
  */

  isChanged() {
    return (0, _keys2.default)(this.$schema.fields).some(name => {
      return this[`$${ name }`].isChanged();
    });
  }

  /*
  * Validates fields and returns errors.
  */

  validate() {
    var _this = this,
        _arguments = arguments;

    return (0, _asyncToGenerator3.default)(function* () {
      var _ref = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : {},
          _ref$quiet = _ref.quiet;

      let quiet = _ref$quiet === undefined ? false : _ref$quiet;
      let fields = _this.$schema.fields;


      for (let path in fields) {
        yield _this[`$${ path }`].validate();
      }

      let paths = _this.collectErrors().map(function (e) {
        return e.path;
      });
      if (!quiet && paths.length > 0) {
        let error = _this._createValidationError(paths);
        throw error;
      }

      return _this;
    })();
  }

  /*
  * Validates fields and returns errors.
  */

  invalidate() {
    let fields = this.$schema.fields;


    for (let path in fields) {
      this[`$${ path }`].invalidate();
    }

    return this;
  }

  /*
  * Returns `true` when all document fields are valid (inverse of `hasErrors`).
  */

  isValid() {
    return !this.hasErrors();
  }

  /*
  * Returns `true` when errors exist (inverse of `isValid`).
  */

  hasErrors() {
    return this.collectErrors().length > 0;
  }

  /*
  * Returns a list of all field-related errors, including those deeply nested.
  */

  collectErrors() {
    var _this2 = this;

    let getErrors = function (doc) {
      let prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      let errors = [];

      for (let name in doc.$schema.fields) {
        let field = doc[`$${ name }`];

        if (field.errors.length > 0) {
          errors.push({
            path: prefix.concat([field.name]),
            errors: field.errors
          });
        }

        if (field.value instanceof _this2.constructor) {
          errors.push(...getErrors(field.value, prefix.concat(field.name)));
        } else if ((0, _typeable.isArray)(field.value)) {
          field.value.forEach((d, i) => {
            if (d instanceof _this2.constructor) {
              errors.push(...getErrors(d, prefix.concat([field.name, i])));
            }
          });
        }
      }

      return errors;
    };

    return getErrors(this);
  }

  /*
  * Deeply populates fields with the provided `errors`.
  */

  applyErrors() {
    let errors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    for (let error of errors) {
      let path = error.path.concat();
      path[path.length - 1] = `$${ path[path.length - 1] }`;

      let field = this.getPath(path);
      if (field) {
        field.errors = error.errors;
      }
    }

    return this;
  }

}
exports.Document = Document;