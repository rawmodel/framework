'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Field = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _typeable = require('typeable');

var _utils = require('./utils');

var _schemas = require('./schemas');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* Document field class.
*/

var Field = exports.Field = function () {

  /*
  * Class constructor.
  */

  function Field(owner, name) {
    (0, _classCallCheck3.default)(this, Field);

    Object.defineProperty(this, '$owner', { // reference to the Document instance which owns the field
      value: owner
    });
    Object.defineProperty(this, 'name', { // the name that a field has on the document
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

  (0, _createClass3.default)(Field, [{
    key: '_cast',


    /*
    * Converts the `value` into specified `type`.
    */

    value: function _cast(value, type) {
      var _this = this;

      var types = (0, _extends3.default)({}, this.$owner.$schema.types, {
        Schema: function Schema(value) {
          if ((0, _typeable.isArray)(type)) type = type[0]; // in case of {type: [Schema]}

          return new _this.$owner.constructor({
            data: value,
            schema: type,
            parent: _this.$owner
          });
        }
      });

      return (0, _typeable.cast)(value, type, types);
    }

    /*
    * Sets field to the default value.
    */

  }, {
    key: 'reset',
    value: function reset() {
      this.value = this.defaultValue;

      return this;
    }

    /*
    * Sets field to a generated fake value.
    */

  }, {
    key: 'fake',
    value: function fake() {
      this.value = this.fakeValue || this.defaultValue;

      return this;
    }

    /*
    * Removes field's value by setting it to null.
    */

  }, {
    key: 'clear',
    value: function clear() {
      this.value = null;

      return this;
    }

    /*
    * Deeply set's the initial values to the current value of each field.
    */

  }, {
    key: 'commit',
    value: function commit() {
      this._commitRelated(this.value);
      this._initialValue = (0, _utils.serialize)(this.value);

      return this;
    }

    /*
    * Deeply set's the initial values of the related `data` object to the current
    * value of each field.
    */

  }, {
    key: '_commitRelated',
    value: function _commitRelated(data) {
      var _this2 = this;

      // commit sub fields
      if (data && data.commit) {
        data.commit();
      } else if (data && (0, _typeable.isArray)(data)) {
        data.forEach(function (d) {
          return _this2._commitRelated(d);
        });
      }
    }

    /*
    * Sets field's value before last commit.
    */

  }, {
    key: 'rollback',
    value: function rollback() {
      this.value = this.initialValue;

      return this;
    }

    /*
    * Returns `true` when the `data` equals to the current value.
    */

  }, {
    key: 'equals',
    value: function equals(data) {
      return (0, _utils.isEqual)((0, _utils.serialize)(this.value), (0, _utils.serialize)(data));
    }

    /*
    * Returns `true` if the field or related sub-fields have been changed.
    */

  }, {
    key: 'isChanged',
    value: function isChanged() {
      return !this.equals(this.initialValue);
    }

    /*
    * Validates the field by populating the `_errors` property.
    */

  }, {
    key: 'validate',
    value: function validate() {
      var relatives, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, relative, isDocument;

      return _regenerator2.default.async(function validate$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              relatives = (0, _typeable.toArray)(this.value) || []; // validate related documents

              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context.prev = 4;
              _iterator = (0, _getIterator3.default)(relatives);

            case 6:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context.next = 15;
                break;
              }

              relative = _step.value;
              isDocument = relative instanceof this.$owner.constructor;

              if (!isDocument) {
                _context.next = 12;
                break;
              }

              _context.next = 12;
              return _regenerator2.default.awrap(relative.validate({ quiet: true }));

            case 12:
              _iteratorNormalCompletion = true;
              _context.next = 6;
              break;

            case 15:
              _context.next = 21;
              break;

            case 17:
              _context.prev = 17;
              _context.t0 = _context['catch'](4);
              _didIteratorError = true;
              _iteratorError = _context.t0;

            case 21:
              _context.prev = 21;
              _context.prev = 22;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 24:
              _context.prev = 24;

              if (!_didIteratorError) {
                _context.next = 27;
                break;
              }

              throw _iteratorError;

            case 27:
              return _context.finish(24);

            case 28:
              return _context.finish(21);

            case 29:
              _context.next = 31;
              return _regenerator2.default.awrap(this.$owner.$validator.validate( // validate this field
              this.value, this.$owner.$schema.fields[this.name].validate));

            case 31:
              this._errors = _context.sent;
              return _context.abrupt('return', this);

            case 33:
            case 'end':
              return _context.stop();
          }
        }
      }, null, this, [[4, 17, 21, 29], [22,, 24, 28]]);
    }

    /*
    * Validates the field by clearing the `_errors` property
    */

  }, {
    key: 'invalidate',
    value: function invalidate() {
      var relatives = (0, _typeable.toArray)(this.value) || []; // validate related documents
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(relatives), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var relative = _step2.value;

          var isDocument = relative instanceof this.$owner.constructor;

          if (isDocument) {
            relative.invalidate();
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      this._errors = [];

      return this;
    }

    /*
    * Returns `true` when the value is valid (inverse of `hasErrors`).
    */

  }, {
    key: 'isValid',
    value: function isValid() {
      return !this.hasErrors();
    }

    /*
    * Returns `true` when errors exist (inverse of `isValid`).
    */

  }, {
    key: 'hasErrors',
    value: function hasErrors() {
      return this.errors.length > 0;
    }
  }, {
    key: 'value',
    get: function get() {
      var get = this.$owner.$schema.fields[this.name].get;


      var value = this._value;
      if (get) {
        // transformation with custom getter
        value = get.call(this.$owner, value);
      }
      return value;
    }

    /*
    * Sets field value.
    */

    ,
    set: function set(value) {
      var _$owner$$schema$field = this.$owner.$schema.fields[this.name],
          set = _$owner$$schema$field.set,
          type = _$owner$$schema$field.type;


      value = this._cast(value, type); // value type casting
      if (set) {
        // transformation with custom setter
        value = set.call(this.$owner, value);
      }

      this.invalidate(); // remove the last memorized error because the value has changed
      this._value = value;
    }

    /*
    * Returns the default value of a field.
    */

  }, {
    key: 'defaultValue',
    get: function get() {
      var _$owner$$schema$field2 = this.$owner.$schema.fields[this.name],
          type = _$owner$$schema$field2.type,
          set = _$owner$$schema$field2.set,
          defaultValue = _$owner$$schema$field2.defaultValue;


      var value = (0, _typeable.isFunction)(defaultValue) ? defaultValue.call(this) : defaultValue;

      value = this._cast(value, type); // value type casting
      if (set) {
        // custom setter
        value = set.call(this.$owner, value);
      }

      return value;
    }

    /*
    * Returns a fake value of a field.
    */

  }, {
    key: 'fakeValue',
    get: function get() {
      var _$owner$$schema$field3 = this.$owner.$schema.fields[this.name],
          type = _$owner$$schema$field3.type,
          set = _$owner$$schema$field3.set,
          fakeValue = _$owner$$schema$field3.fakeValue;


      var value = (0, _typeable.isFunction)(fakeValue) ? fakeValue.call(this) : fakeValue;

      value = this._cast(value, type); // value type casting
      if (set) {
        // custom setter
        value = set.call(this.$owner, value);
      }

      return value;
    }

    /*
    * Returns the value of a field of the last commit.
    */

  }, {
    key: 'initialValue',
    get: function get() {
      return this._initialValue;
    }

    /*
    * Returns the last error of the field.
    */

  }, {
    key: 'errors',
    get: function get() {
      return this._errors;
    }

    /*
    * Returns the last error of the field.
    */

    ,
    set: function set(errors) {
      this._errors = errors;
    }
  }]);
  return Field;
}();