"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var typeable_1 = require("typeable");
var utils_1 = require("./utils");
var validatable_1 = require("validatable");
var documents_1 = require("./documents");
/*
* Field class.
*/
var Field = (function () {
    /*
    * Class constructor.
    */
    function Field(recipe, options) {
        var _this = this;
        this.errors = [];
        Object.defineProperty(this, 'recipe', {
            value: Object.freeze(recipe || {})
        });
        Object.defineProperty(this, 'options', {
            value: Object.freeze(options || {})
        });
        Object.defineProperty(this, '_data', {
            value: this._getDefaultValue(),
            writable: true
        });
        Object.defineProperty(this, '_initialData', {
            value: this._getDefaultValue(),
            writable: true
        });
        Object.defineProperty(this, '_validator', {
            value: this._createValidator()
        });
        Object.defineProperty(this, 'value', {
            get: function () { return _this._getValue(); },
            set: function (v) { return _this._setValue(v); },
            enumerable: true
        });
        Object.defineProperty(this, 'defaultValue', {
            get: function () { return _this._getDefaultValue(); },
            enumerable: true
        });
        Object.defineProperty(this, 'fakeValue', {
            get: function () { return _this._getFakeValue(); },
            enumerable: true
        });
        Object.defineProperty(this, 'initialValue', {
            get: function () { return _this._initialData; },
            enumerable: true
        });
        Object.defineProperty(this, 'type', {
            get: function () { return _this.recipe.type || null; },
            enumerable: true
        });
        Object.defineProperty(this, 'owner', {
            get: function () { return _this.options.owner || null; },
            enumerable: true
        });
    }
    /*
    * Returns a new instance of validator.
    */
    Field.prototype._createValidator = function () {
        var _a = this.options, validators = _a.validators, failFast = _a.failFast;
        var context = this;
        return new validatable_1.Validator({ validators: validators, failFast: failFast, context: context });
    };
    /*
    * Returns current field value.
    */
    Field.prototype._getValue = function () {
        var data = this._data;
        var get = this.recipe.get;
        if (typeable_1.isFunction(get)) {
            data = get.call(this, data);
        }
        return data;
    };
    /*
    * Sets current field value.
    */
    Field.prototype._setValue = function (data) {
        if (typeable_1.isFunction(data)) {
            data = data.call(this);
        }
        var set = this.recipe.set;
        if (typeable_1.isFunction(set)) {
            data = set.call(this, data);
        }
        data = this._cast(data, this.type);
        this.invalidate();
        this._data = data;
    };
    /*
    * Converts a `value` into specified `type`.
    */
    Field.prototype._cast = function (data, type) {
        var converter = type;
        if (!typeable_1.isValue(data)) {
            return null;
        }
        if (this.isNested()) {
            var Klass_1 = typeable_1.isArray(type) ? type[0] : type;
            var options_1 = utils_1.merge({}, this.owner.options, { parent: this.owner });
            var toDocument = function (d) { return new Klass_1(d, options_1); };
            converter = typeable_1.isArray(type) ? [toDocument] : toDocument;
        }
        return typeable_1.cast(data, converter);
    };
    /*
    * Returns the default value of a field.
    */
    Field.prototype._getDefaultValue = function () {
        var data = null;
        var defaultValue = this.recipe.defaultValue;
        if (typeable_1.isFunction(defaultValue)) {
            data = defaultValue.call(this);
        }
        else if (!typeable_1.isUndefined(defaultValue)) {
            data = defaultValue;
        }
        return data;
    };
    /*
    * Returns the fake value of a field.
    */
    Field.prototype._getFakeValue = function () {
        var data = null;
        var fakeValue = this.recipe.fakeValue;
        if (typeable_1.isFunction(fakeValue)) {
            data = fakeValue.call(this);
        }
        else if (!typeable_1.isUndefined(fakeValue)) {
            data = fakeValue;
        }
        return data;
    };
    /*
    * Sets data to the default value.
    */
    Field.prototype.reset = function () {
        this.value = this._getDefaultValue();
        return this;
    };
    /*
    * Resets the value then sets data to the fake value.
    */
    Field.prototype.fake = function () {
        this.reset();
        if (this.fakeValue) {
            this.value = this.fakeValue;
        }
        (typeable_1.toArray(this.value) || []) // related fake values
            .filter(function (doc) { return doc instanceof documents_1.Document; })
            .map(function (doc) { return doc.fake(); });
        return this;
    };
    /*
    * Sets data to `null`.
    */
    Field.prototype.clear = function () {
        this.value = null;
        return this;
    };
    /*
    * Set's the initial value to the current value.
    */
    Field.prototype.commit = function () {
        if (typeable_1.isValue(this.value)) {
            typeable_1.toArray(this.value)
                .filter(function (v) { return v && v.commit; })
                .forEach(function (v) { return v.commit(); });
        }
        this._initialData = utils_1.serialize(this.value);
        return this;
    };
    /*
    * Sets value to the initial value.
    */
    Field.prototype.rollback = function () {
        this.value = this.initialValue;
        return this;
    };
    /*
    * Returns `true` when `data` equals to the current value.
    */
    Field.prototype.equals = function (data) {
        var value = data instanceof Field ? data.value : data;
        return utils_1.isEqual(utils_1.serialize(this.value), utils_1.serialize(value));
    };
    /*
    * Returns `true` if the value has been changed.
    */
    Field.prototype.isChanged = function () {
        return !this.equals(this.initialValue);
    };
    /*
    * Returns `true` if the data is a Document.
    */
    Field.prototype.isNested = function () {
        var type = this.type;
        if (typeable_1.isArray(type))
            type = type[0];
        return (typeable_1.isPresent(type)
            && typeable_1.isPresent(type.prototype)
            && (type.prototype instanceof documents_1.Document
                || type.prototype.constructor === documents_1.Document));
    };
    /*
    * Validates the field by populating the `errors` property.
    *
    * IMPORTANT: Array null values for nested objects are not treated as an object
    * but as an empty item thus isValid() for [null] succeeds.
    */
    Field.prototype.validate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all(// invalidate related documents
                        (typeable_1.toArray(this.value) || [])
                            .filter(function (doc) { return doc instanceof documents_1.Document; })
                            .map(function (doc) { return doc.validate({ quiet: true }); }))];
                    case 1:
                        _b.sent();
                        _a = this;
                        return [4 /*yield*/, this._validator.validate(this.value, this.recipe.validate)];
                    case 2:
                        _a.errors = _b.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    /*
    * Clears errors.
    */
    Field.prototype.invalidate = function () {
        (typeable_1.toArray(this.value) || []) // invalidate related documents
            .filter(function (doc) { return doc instanceof documents_1.Document; })
            .forEach(function (doc) { return doc.invalidate(); });
        this.errors = [];
        return this;
    };
    /*
    * Returns `true` when errors exist (inverse of `isValid`).
    */
    Field.prototype.hasErrors = function () {
        if (this.errors.length > 0) {
            return true;
        }
        else if (!this.isNested()) {
            return false;
        }
        else {
            return typeable_1.toArray(this.value)
                .filter(function (f) { return !!f; })
                .some(function (f) { return f.hasErrors(); });
        }
    };
    /*
    * Returns `true` when the value is valid (inverse of `hasErrors`).
    */
    Field.prototype.isValid = function () {
        return !this.hasErrors();
    };
    return Field;
}());
exports.Field = Field;
