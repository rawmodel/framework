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
var schemas_1 = require("./schemas");
/*
* Document field class.
*/
var Field = (function () {
    /*
    * Class constructor.
    */
    function Field(owner, name) {
        var _this = this;
        Object.defineProperty(this, '$owner', {
            value: owner
        });
        Object.defineProperty(this, 'name', {
            value: name
        });
        Object.defineProperty(this, 'defaultValue', {
            get: function () { return _this._getDefaultValue(); },
            enumerable: true
        });
        Object.defineProperty(this, '_value', {
            value: this.defaultValue,
            writable: true
        });
        Object.defineProperty(this, 'value', {
            get: function () { return _this._getValue(); },
            set: function (v) { return _this._setValue(v); },
            enumerable: true
        });
        Object.defineProperty(this, '_initialValue', {
            value: this._value,
            writable: true
        });
        Object.defineProperty(this, 'initialValue', {
            get: function () { return _this._initialValue; },
            enumerable: true
        });
        Object.defineProperty(this, 'fakeValue', {
            get: function () { return _this._getFakeValue(); },
            enumerable: true
        });
        Object.defineProperty(this, 'errors', {
            value: [],
            writable: true
        });
    }
    /*
    * Return field value.
    */
    Field.prototype._getValue = function () {
        var get = this.$owner.$schema.fields[this.name].get;
        var value = this._value;
        if (get) {
            value = get.call(this.$owner, value);
        }
        return value;
    };
    /*
    * Sets field value.
    */
    Field.prototype._setValue = function (value) {
        var _a = this.$owner.$schema.fields[this.name], set = _a.set, type = _a.type;
        value = this._cast(value, type); // value type casting
        if (set) {
            value = set.call(this.$owner, value);
        }
        this.invalidate(); // remove the last memorized error because the value has changed
        this._value = value;
    };
    /*
    * Returns the default value of a field.
    */
    Field.prototype._getDefaultValue = function () {
        var _a = this.$owner.$schema.fields[this.name], type = _a.type, set = _a.set, defaultValue = _a.defaultValue;
        var value = typeable_1.isFunction(defaultValue)
            ? defaultValue.call(this)
            : defaultValue;
        value = this._cast(value, type); // value type casting
        if (set) {
            value = set.call(this.$owner, value);
        }
        return value;
    };
    /*
    * Returns a fake value of a field.
    */
    Field.prototype._getFakeValue = function () {
        var _a = this.$owner.$schema.fields[this.name], type = _a.type, set = _a.set, fakeValue = _a.fakeValue;
        var value = typeable_1.isFunction(fakeValue)
            ? fakeValue.call(this)
            : fakeValue;
        value = this._cast(value, type); // value type casting
        if (set) {
            value = set.call(this.$owner, value);
        }
        return value;
    };
    /*
    * Converts the `value` into specified `type`.
    */
    Field.prototype._cast = function (value, type) {
        var _this = this;
        var types = utils_1.merge(this.$owner.$schema.types, {
            Schema: function (value) {
                if (typeable_1.isArray(type))
                    type = type[0]; // in case of {type: [Schema]}
                return _this.$owner._createDocument(value, type, _this.$owner);
            }
        });
        return typeable_1.cast(value, type, types);
    };
    /*
    * Sets field to the default value.
    */
    Field.prototype.reset = function () {
        this.value = this.defaultValue;
        return this;
    };
    /*
    * Sets field to a generated fake value.
    */
    Field.prototype.fake = function () {
        this.value = this.fakeValue || this.defaultValue;
        return this;
    };
    /*
    * Removes field's value by setting it to null.
    */
    Field.prototype.clear = function () {
        this.value = null;
        return this;
    };
    /*
    * Deeply set's the initial values to the current value of each field.
    */
    Field.prototype.commit = function () {
        this._commitRelated(this.value);
        this._initialValue = utils_1.serialize(this.value);
        return this;
    };
    /*
    * Deeply set's the initial values of the related `data` object to the current
    * value of each field.
    */
    Field.prototype._commitRelated = function (data) {
        var _this = this;
        if (data && data.commit) {
            data.commit();
        }
        else if (data && typeable_1.isArray(data)) {
            data.forEach(function (d) { return _this._commitRelated(d); });
        }
    };
    /*
    * Sets field's value before last commit.
    */
    Field.prototype.rollback = function () {
        this.value = this.initialValue;
        return this;
    };
    /*
    * Returns `true` when the `data` equals to the current value.
    */
    Field.prototype.equals = function (data) {
        return utils_1.isEqual(utils_1.serialize(this.value), utils_1.serialize(data));
    };
    /*
    * Returns `true` if the field or related sub-fields have been changed.
    */
    Field.prototype.isChanged = function () {
        return !this.equals(this.initialValue);
    };
    /*
    * Returns `true` if the field is a Document field.
    */
    Field.prototype.isNested = function () {
        var type = this.$owner.$schema.fields[this.name].type;
        if (typeable_1.isArray(type))
            type = type[0];
        if (type.fields) {
            return type instanceof schemas_1.Schema;
        }
        return false;
    };
    /*
    * Validates the field by populating the `errors` property.
    *
    * IMPORTANT: Array null values for nested objects are not treated as an object
    * but as an empty item thus isValid() for [null] succeeds.
    */
    Field.prototype.validate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var relatives, _i, relatives_1, relative, isDocument, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        relatives = typeable_1.toArray(this.value) || [];
                        _i = 0, relatives_1 = relatives;
                        _b.label = 1;
                    case 1:
                        if (!(_i < relatives_1.length))
                            return [3 /*break*/, 4];
                        relative = relatives_1[_i];
                        isDocument = relative instanceof this.$owner.constructor;
                        if (!isDocument)
                            return [3 /*break*/, 3];
                        return [4 /*yield*/, relative.validate({ quiet: true })];
                    case 2:
                        _b.sent(); // don't throw
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        _a = this;
                        return [4 /*yield*/, this.$owner.$validator.validate(// validate this field
                            this.value, this.$owner.$schema.fields[this.name].validate)];
                    case 5:
                        _a.errors = _b.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    /*
    * Validates the field by clearing the `errors` property
    */
    Field.prototype.invalidate = function () {
        var relatives = typeable_1.toArray(this.value) || []; // validate related documents
        for (var _i = 0, relatives_2 = relatives; _i < relatives_2.length; _i++) {
            var relative = relatives_2[_i];
            var isDocument = relative instanceof this.$owner.constructor;
            if (isDocument) {
                relative.invalidate();
            }
        }
        this.errors = [];
        return this;
    };
    /*
    * Returns `true` when the value is valid (inverse of `hasErrors`).
    */
    Field.prototype.isValid = function () {
        return !this.hasErrors();
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
            return typeable_1.toArray(this.value).filter(function (f) { return !!f; }).some(function (f) { return f.hasErrors(); });
        }
    };
    return Field;
}());
exports.Field = Field;
