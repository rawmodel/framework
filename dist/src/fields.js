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
var handleable_1 = require("handleable");
var models_1 = require("./models");
var Field = (function () {
    function Field(recipe) {
        var _this = this;
        this.errors = [];
        Object.defineProperty(this, '_recipe', {
            value: Object.freeze(recipe || {})
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
        Object.defineProperty(this, '_handler', {
            value: this._createHandler()
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
            get: function () { return _this._recipe.type || null; },
            enumerable: true
        });
        Object.defineProperty(this, 'owner', {
            get: function () { return _this._recipe.owner || null; },
            enumerable: true
        });
    }
    Field.prototype._createValidator = function () {
        var _a = this._recipe, validators = _a.validators, failFast = _a.failFast;
        var context = this;
        return new validatable_1.Validator({ validators: validators, failFast: failFast, context: context });
    };
    Field.prototype._createHandler = function () {
        var _a = this._recipe, handlers = _a.handlers, failFast = _a.failFast;
        var context = this;
        return new handleable_1.Handler({ handlers: handlers, failFast: failFast, context: context });
    };
    Field.prototype._getValue = function () {
        var data = this._data;
        var get = this._recipe.get;
        if (typeable_1.isFunction(get)) {
            data = get.call(this, data);
        }
        return data;
    };
    Field.prototype._setValue = function (data) {
        if (typeable_1.isFunction(data)) {
            data = data.call(this);
        }
        var set = this._recipe.set;
        if (typeable_1.isFunction(set)) {
            data = set.call(this, data);
        }
        data = this._cast(data, this.type);
        this.invalidate();
        this._data = data;
    };
    Field.prototype._cast = function (data, type) {
        var _this = this;
        var converter = type;
        if (!typeable_1.isValue(data)) {
            return null;
        }
        if (this.isNested()) {
            var Klass_1 = typeable_1.isArray(type) ? type[0] : type;
            var toModel = function (d) { return new Klass_1(utils_1.merge({}, d, { parent: _this.owner })); };
            converter = typeable_1.isArray(type) ? [toModel] : toModel;
        }
        return typeable_1.cast(data, converter);
    };
    Field.prototype._getDefaultValue = function () {
        var data = null;
        var defaultValue = this._recipe.defaultValue;
        if (typeable_1.isFunction(defaultValue)) {
            data = defaultValue.call(this);
        }
        else if (!typeable_1.isUndefined(defaultValue)) {
            data = defaultValue;
        }
        return data;
    };
    Field.prototype._getFakeValue = function () {
        var data = null;
        var fakeValue = this._recipe.fakeValue;
        if (typeable_1.isFunction(fakeValue)) {
            data = fakeValue.call(this);
        }
        else if (!typeable_1.isUndefined(fakeValue)) {
            data = fakeValue;
        }
        return data;
    };
    Field.prototype.reset = function () {
        this.value = this._getDefaultValue();
        return this;
    };
    Field.prototype.fake = function () {
        this.reset();
        if (this.fakeValue) {
            this.value = this.fakeValue;
        }
        (typeable_1.toArray(this.value) || [])
            .filter(function (doc) { return doc instanceof models_1.Model; })
            .map(function (doc) { return doc.fake(); });
        return this;
    };
    Field.prototype.clear = function () {
        this.value = null;
        return this;
    };
    Field.prototype.commit = function () {
        if (typeable_1.isValue(this.value)) {
            typeable_1.toArray(this.value)
                .filter(function (v) { return v && v.commit; })
                .forEach(function (v) { return v.commit(); });
        }
        this._initialData = utils_1.serialize(this.value);
        return this;
    };
    Field.prototype.rollback = function () {
        this.value = this.initialValue;
        return this;
    };
    Field.prototype.equals = function (data) {
        var value = data instanceof Field ? data.value : data;
        return utils_1.isEqual(utils_1.serialize(this.value), utils_1.serialize(value));
    };
    Field.prototype.isChanged = function () {
        return !this.equals(this.initialValue);
    };
    Field.prototype.isNested = function () {
        var type = this.type;
        if (typeable_1.isArray(type))
            type = type[0];
        return (typeable_1.isPresent(type)
            && typeable_1.isPresent(type.prototype)
            && (type.prototype instanceof models_1.Model
                || type.prototype.constructor === models_1.Model));
    };
    Field.prototype.validate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all((typeable_1.toArray(this.value) || [])
                            .filter(function (doc) { return doc instanceof models_1.Model; })
                            .map(function (doc) { return doc.validate({ quiet: true }); }))];
                    case 1:
                        _b.sent();
                        _a = this;
                        return [4 /*yield*/, this._validator.validate(this.value, this._recipe.validate)];
                    case 2:
                        _a.errors = _b.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    Field.prototype.handle = function (error) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all((typeable_1.toArray(this.value) || [])
                            .filter(function (doc) { return doc instanceof models_1.Model; })
                            .map(function (doc) { return doc.handle(error); }))];
                    case 1:
                        _b.sent();
                        _a = this;
                        return [4 /*yield*/, this._handler.handle(error, this._recipe.handle)];
                    case 2:
                        _a.errors = _b.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    Field.prototype.invalidate = function () {
        (typeable_1.toArray(this.value) || [])
            .filter(function (doc) { return doc instanceof models_1.Model; })
            .forEach(function (doc) { return doc.invalidate(); });
        this.errors = [];
        return this;
    };
    Field.prototype.hasErrors = function () {
        if (this.errors.length > 0) {
            return true;
        }
        else if (!this.isNested()) {
            return false;
        }
        else if (typeable_1.isPresent(this.value)) {
            return typeable_1.toArray(this.value)
                .filter(function (f) { return !!f; })
                .some(function (f) { return f.hasErrors(); });
        }
        return false;
    };
    Field.prototype.isValid = function () {
        return !this.hasErrors();
    };
    return Field;
}());
exports.Field = Field;
//# sourceMappingURL=fields.js.map