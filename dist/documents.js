'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Document = undefined;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _typeable = require('typeable');

var _validatable = require('validatable');

var _schemas = require('./schemas');

var _fields = require('./fields');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* The core schema-based object class.
*/

var Document = exports.Document = function () {

  /*
  * Class constructor.
  */

  function Document(data, schema) {
    var _this = this;

    var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    (0, _classCallCheck3.default)(this, Document);

    Object.defineProperty(this, '$schema', { // schema instance
      value: schema
    });
    Object.defineProperty(this, '$parent', { // parent document instance
      value: parent
    });
    Object.defineProperty(this, '$root', { // root document instance
      get: function get() {
        return _this._getRootDocument();
      }
    });
    Object.defineProperty(this, '$error', { // last document error instance
      value: null,
      writable: true
    });
    Object.defineProperty(this, '$validator', { // validatable.js instance
      value: this._createValidator()
    });

    this._defineFields();
    this._populateFields(data);
  }

  /*
  * Loops up on the tree and returns the first document in the tree.
  */

  (0, _createClass3.default)(Document, [{
    key: '_getRootDocument',
    value: function _getRootDocument() {
      var root = this;
      do {
        if (root.$parent) {
          root = root.$parent;
        } else {
          return root;
        }
      } while (true);
    }

    /*
    * Creates a new document instance. This method is especially useful when
    * extending this class.
    */

  }, {
    key: '_createDocument',
    value: function _createDocument() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var schema = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      return new this.constructor(data, schema, parent);
    }

    /*
    * Creates a new field instance. This method is especially useful when
    * extending this class.
    */

  }, {
    key: '_createField',
    value: function _createField(name) {
      return new _fields.Field(this, name);
    }

    /*
    * Returns a new instance of validator.
    */

  }, {
    key: '_createValidator',
    value: function _createValidator() {
      return new _validatable.Validator((0, _extends3.default)({}, {
        validators: this.$schema.validators,
        firstErrorOnly: this.$schema.firstErrorOnly,
        context: this
      }));
    }

    /*
    * Creates a new validation error instance.
    */

  }, {
    key: '_createValidationError',
    value: function _createValidationError(paths) {
      var error = new Error('Validation failed');
      error.code = 422;
      error.paths = paths;

      return error;
    }

    /*
    * Defines class fields from schema.
    */

  }, {
    key: '_defineFields',
    value: function _defineFields() {
      var fields = this.$schema.fields;


      for (var name in fields) {
        this._defineField(name);
      }
    }

    /*
    * Defines a schema field by name.
    */

  }, {
    key: '_defineField',
    value: function _defineField(name) {
      var field = this._createField(name);

      (0, _defineProperty2.default)(this, name, { // field definition
        get: function get() {
          return field.value;
        },
        set: function set(v) {
          return field.value = v;
        },
        enumerable: true,
        configurable: true
      });

      Object.defineProperty(this, '$' + name, { // field class instance definition
        value: field
      });
    }

    /*
    * Returns a value at path.
    */

  }, {
    key: 'getPath',
    value: function getPath() {
      for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
        keys[_key] = arguments[_key];
      }

      if ((0, _typeable.isArray)(keys[0])) {
        keys = keys[0];
      }

      return keys.reduce(function (a, b) {
        return (a || {})[b];
      }, this);
    }

    /*
    * Returns `true` if field at path exists.
    */

  }, {
    key: 'hasPath',
    value: function hasPath() {
      return this.getPath.apply(this, arguments) !== undefined;
    }

    /*
    * Scrolls through all set fields and returns an array of results.
    */

  }, {
    key: 'flatten',
    value: function flatten() {
      var _this2 = this;

      var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var fields = [];

      var _loop = function _loop(name) {
        var type = _this2.$schema.fields[name].type;

        var field = _this2['$' + name];
        var path = (prefix || []).concat(name);
        var value = field.value;

        fields.push({ path: path, field: field });

        if (!(0, _typeable.isPresent)(value)) return 'continue';

        if (type instanceof _schemas.Schema) {
          fields = fields.concat(value.flatten(path));
        } else if ((0, _typeable.isArray)(type) && type[0] instanceof _schemas.Schema) {
          fields = fields.concat(value.map(function (f, i) {
            return f ? f.flatten(path.concat([i])) : null;
          }).filter(function (f) {
            return (0, _typeable.isArray)(f);
          }).reduce(function (a, b) {
            return a.concat(b);
          }));
        }
      };

      for (var name in this.$schema.fields) {
        var _ret = _loop(name);

        if (_ret === 'continue') continue;
      }

      return fields;
    }

    /*
    * Sets field values from the provided by data object.
    */

  }, {
    key: 'populate',
    value: function populate() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return this._populateFields(data);
    }

    /*
    * Sets field values from the provided by data object.
    */

  }, {
    key: '_populateFields',
    value: function _populateFields() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      data = (0, _utils.serialize)(data);

      for (var name in data) {
        this._populateField(name, data[name]);
      }

      return this;
    }

    /*
    * Sets a value of a field by name.
    */

  }, {
    key: '_populateField',
    value: function _populateField(name, value) {
      if (!this.$schema.strict) {
        this[name] = value;
      } else {
        var names = (0, _keys2.default)(this.$schema.fields);
        var exists = names.indexOf(name) > -1;

        if (exists) {
          this[name] = value;
        }
      }
    }

    /*
    * Converts this class into serialized data object.
    */

  }, {
    key: 'serialize',
    value: function serialize() {
      return (0, _utils.serialize)(this);
    }

    /*
    * Converts this class into serialized data object having only the keys that
    * pass the `test`.
    */

  }, {
    key: 'filter',
    value: function filter(test) {
      var data = (0, _utils.serialize)(this);

      this.flatten().sort(function (a, b) {
        return a.path.length < b.path.length;
      }).filter(function (field) {
        return !test(field);
      }).forEach(function (field) {
        var names = field.path.concat();
        var lastName = names.pop();
        delete names.reduce(function (o, k) {
          return o[k];
        }, data)[lastName];
      });

      return data;
    }

    /*
    * Scrolls through object fields and collects results.
    */

  }, {
    key: 'collect',
    value: function collect(handler) {
      return this.flatten().map(handler);
    }

    /*
    * Scrolls through document fields and executes a handler on each field.
    */

  }, {
    key: 'scroll',
    value: function scroll(handler) {
      return this.flatten().map(handler).length;
    }

    /*
    * Sets each document field to its default value.
    */

  }, {
    key: 'reset',
    value: function reset() {
      var fields = this.$schema.fields;


      for (var name in fields) {
        this['$' + name].reset();
      }

      return this;
    }

    /*
    * Sets each document field to its fake value if a fake value generator
    * is registered, otherwise the default value is used.
    */

  }, {
    key: 'fake',
    value: function fake() {
      var fields = this.$schema.fields;


      for (var name in fields) {
        this['$' + name].fake();
      }

      return this;
    }

    /*
    * Removes all fileds values by setting them to `null`.
    */

  }, {
    key: 'clear',
    value: function clear() {
      var fields = this.$schema.fields;


      for (var name in fields) {
        this['$' + name].clear();
      }

      return this;
    }

    /*
    * Sets initial value of each document field to the current value of a field.
    */

  }, {
    key: 'commit',
    value: function commit() {
      var fields = this.$schema.fields;


      for (var name in fields) {
        this['$' + name].commit();
      }

      return this;
    }

    /*
    * Sets each document field to its initial value (value before last commit).
    */

  }, {
    key: 'rollback',
    value: function rollback() {
      var fields = this.$schema.fields;


      for (var name in fields) {
        this['$' + name].rollback();
      }

      return this;
    }

    /*
    * Returns `true` when the `value` represents an object with the
    * same field values as the original document.
    */

  }, {
    key: 'equals',
    value: function equals(value) {
      return (0, _utils.isEqual)((0, _utils.serialize)(this), (0, _utils.serialize)(value));
    }

    /*
    * Returns a new Document instance which is the exact copy of the original.
    */

  }, {
    key: 'clone',
    value: function clone() {
      return this._createDocument(this, this.$schema, this.$parent);
    }

    /*
    * Returns a `true` if at least one field has been changed.
    */

  }, {
    key: 'isChanged',
    value: function isChanged() {
      var _this3 = this;

      return (0, _keys2.default)(this.$schema.fields).some(function (name) {
        return _this3['$' + name].isChanged();
      });
    }

    /*
    * Validates fields and returns errors.
    */

  }, {
    key: 'validate',
    value: function validate() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$quiet = _ref.quiet,
          quiet = _ref$quiet === undefined ? false : _ref$quiet;

      var fields, _path, paths;

      return _regenerator2.default.async(function validate$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              fields = this.$schema.fields;
              _context.t0 = _regenerator2.default.keys(fields);

            case 2:
              if ((_context.t1 = _context.t0()).done) {
                _context.next = 8;
                break;
              }

              _path = _context.t1.value;
              _context.next = 6;
              return _regenerator2.default.awrap(this['$' + _path].validate());

            case 6:
              _context.next = 2;
              break;

            case 8:
              paths = this.collectErrors().map(function (e) {
                return e.path;
              });

              if (!(!quiet && paths.length > 0)) {
                _context.next = 11;
                break;
              }

              throw this._createValidationError(paths);

            case 11:
              return _context.abrupt('return', this);

            case 12:
            case 'end':
              return _context.stop();
          }
        }
      }, null, this);
    }

    /*
    * Validates fields and returns errors.
    */

  }, {
    key: 'invalidate',
    value: function invalidate() {
      var fields = this.$schema.fields;


      for (var _path2 in fields) {
        this['$' + _path2].invalidate();
      }

      return this;
    }

    /*
    * Returns `true` when all document fields are valid (inverse of `hasErrors`).
    */

  }, {
    key: 'isValid',
    value: function isValid() {
      return !this.hasErrors();
    }

    /*
    * Returns `true` if nested fields exist.
    */

  }, {
    key: 'isNested',
    value: function isNested() {
      var _this4 = this;

      return (0, _keys2.default)(this.$schema.fields).some(function (name) {
        return _this4['$' + name].isNested();
      });
    }

    /*
    * Returns `true` when errors exist (inverse of `isValid`).
    */

  }, {
    key: 'hasErrors',
    value: function hasErrors() {
      var _this5 = this;

      return (0, _keys2.default)(this.$schema.fields).some(function (name) {
        return _this5['$' + name].hasErrors();
      });
    }

    /*
    * Returns a list of all field-related errors, including those deeply nested.
    */

  }, {
    key: 'collectErrors',
    value: function collectErrors() {
      return this.flatten().map(function (_ref2) {
        var path = _ref2.path,
            field = _ref2.field;

        return { path: path, errors: field.errors };
      }).filter(function (_ref3) {
        var path = _ref3.path,
            errors = _ref3.errors;

        return errors.length > 0;
      });
    }

    /*
    * Deeply populates fields with the provided `errors`.
    */

  }, {
    key: 'applyErrors',
    value: function applyErrors() {
      var errors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(errors), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var error = _step.value;

          var _path3 = error.path.concat();
          _path3[_path3.length - 1] = '$' + _path3[_path3.length - 1];

          var field = this.getPath(_path3);
          if (field) {
            field.errors = error.errors;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return this;
    }
  }]);
  return Document;
}();