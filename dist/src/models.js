"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.__esModule = true;
var typeable_1 = require("typeable");
var fields_1 = require("./fields");
var utils_1 = require("./utils");
var Model = (function () {
    function Model(recipe) {
        if (recipe === void 0) { recipe = {}; }
        var _this = this;
        Object.defineProperty(this, 'parent', {
            value: recipe.parent || this.parent || null,
            writable: true
        });
        Object.defineProperty(this, 'root', {
            get: function () { return _this._getRootModel(); }
        });
        Object.defineProperty(this, '_fields', {
            value: {},
            writable: true
        });
        Object.defineProperty(this, '_types', {
            value: {},
            writable: true
        });
        Object.defineProperty(this, '_validators', {
            value: {},
            writable: true
        });
        Object.defineProperty(this, '_handlers', {
            value: {},
            writable: true
        });
        Object.defineProperty(this, '_failFast', {
            value: false,
            writable: true
        });
    }
    Model.prototype._getRootModel = function () {
        var root = this;
        do {
            if (root.parent) {
                root = root.parent;
            }
            else {
                return root;
            }
        } while (true);
    };
    Model.prototype._getFieldType = function (recipe) {
        if (recipe === void 0) { recipe = {}; }
        var type = typeable_1.isArray(recipe.type) ? recipe.type[0] : recipe.type;
        type = this._types[type] || type;
        return typeable_1.isArray(recipe.type) ? [type] : type;
    };
    Model.prototype._createField = function (recipe) {
        if (recipe === void 0) { recipe = {}; }
        return new fields_1.Field(utils_1.merge({}, recipe, {
            type: this._getFieldType(recipe),
            owner: this,
            validators: this._validators,
            handlers: this._handlers,
            failFast: this._failFast
        }));
    };
    Model.prototype._createValidationError = function (message, code) {
        if (message === void 0) { message = 'Validation failed'; }
        if (code === void 0) { code = 422; }
        var error = new Error(message);
        error.code = code;
        return error;
    };
    Model.prototype._createModel = function (recipe) {
        if (recipe === void 0) { recipe = {}; }
        return new this.constructor(recipe);
    };
    Model.prototype.failFast = function (fail) {
        if (fail === void 0) { fail = true; }
        this._failFast = typeable_1.toBoolean(fail);
    };
    Model.prototype.defineField = function (name, recipe) {
        if (recipe === void 0) { recipe = {}; }
        var field = this._createField(recipe);
        Object.defineProperty(this, name, {
            get: function () { return field.value; },
            set: function (v) { return field.value = v; },
            enumerable: recipe.enumerable !== false,
            configurable: true
        });
        this._fields[name] = field;
    };
    Model.prototype.defineType = function (name, converter) {
        this._types[name] = converter;
    };
    Model.prototype.defineValidator = function (name, handler) {
        this._validators[name] = handler;
    };
    Model.prototype.defineHandler = function (name, handler) {
        this._handlers[name] = handler;
    };
    Model.prototype.getField = function () {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i] = arguments[_i];
        }
        keys = [].concat(typeable_1.isArray(keys[0]) ? keys[0] : keys);
        var lastKey = keys.pop();
        if (keys.length === 0) {
            return this._fields[lastKey];
        }
        var field = keys.reduce(function (a, c) { return (a[c] || {}); }, this);
        return field instanceof Model ? field.getField(lastKey) : undefined;
    };
    Model.prototype.hasField = function () {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i] = arguments[_i];
        }
        return !typeable_1.isUndefined(this.getField.apply(this, keys));
    };
    Model.prototype.populate = function (data) {
        var _this = this;
        if (data === void 0) { data = {}; }
        Object.keys(data || {})
            .filter(function (n) { return !!_this._fields[n]; })
            .forEach(function (name) { return _this[name] = utils_1.serialize(data[name]); });
        return this;
    };
    Model.prototype.serialize = function () {
        return this.filter(function (ref) { return ref.field.serializable; });
    };
    Model.prototype.flatten = function (prefix) {
        var _this = this;
        if (prefix === void 0) { prefix = []; }
        var fields = [];
        Object.keys(this._fields).forEach(function (name) {
            var field = _this._fields[name];
            var type = field.type;
            var path = (prefix || []).concat(name);
            var value = field.value;
            fields.push({ path: path, field: field });
            if (typeable_1.isPresent(value) && typeable_1.isPresent(type)) {
                if (type.prototype instanceof Model) {
                    fields = fields.concat(value.flatten(path));
                }
                else if (typeable_1.isArray(type) && type[0].prototype instanceof Model) {
                    fields = fields.concat(value
                        .map(function (f, i) { return (f ? f.flatten(path.concat([i])) : null); })
                        .filter(function (f) { return typeable_1.isArray(f); })
                        .reduce(function (a, b) { return a.concat(b); }));
                }
            }
        });
        return fields;
    };
    Model.prototype.collect = function (handler) {
        return this.flatten().map(handler);
    };
    Model.prototype.scroll = function (handler) {
        return this.flatten().map(handler).length;
    };
    Model.prototype.filter = function (test) {
        var data = utils_1.serialize(this);
        this.flatten()
            .sort(function (a, b) { return b.path.length - a.path.length; })
            .filter(function (field) { return !test(field); })
            .forEach(function (field) {
            var names = field.path.concat();
            var lastName = names.pop();
            delete names.reduce(function (o, k) { return o[k]; }, data)[lastName];
        });
        return data;
    };
    Model.prototype.reset = function () {
        var _this = this;
        Object.keys(this._fields)
            .forEach(function (name) { return _this._fields[name].reset(); });
        return this;
    };
    Model.prototype.fake = function () {
        var _this = this;
        Object.keys(this._fields)
            .forEach(function (name) { return _this._fields[name].fake(); });
        return this;
    };
    Model.prototype.clear = function () {
        var _this = this;
        Object.keys(this._fields)
            .forEach(function (name) { return _this._fields[name].clear(); });
        return this;
    };
    Model.prototype.commit = function () {
        var _this = this;
        Object.keys(this._fields)
            .forEach(function (name) { return _this._fields[name].commit(); });
        return this;
    };
    Model.prototype.rollback = function () {
        var _this = this;
        Object.keys(this._fields)
            .forEach(function (name) { return _this._fields[name].rollback(); });
        return this;
    };
    Model.prototype.equals = function (value) {
        return utils_1.isEqual(utils_1.serialize(this), utils_1.serialize(value));
    };
    Model.prototype.isChanged = function () {
        var _this = this;
        return Object.keys(this._fields)
            .some(function (name) { return _this._fields[name].isChanged(); });
    };
    Model.prototype.isNested = function () {
        var _this = this;
        return Object.keys(this._fields)
            .some(function (name) { return _this._fields[name].isNested(); });
    };
    Model.prototype.validate = function (_a) {
        var _b = (_a === void 0 ? {} : _a).quiet, quiet = _b === void 0 ? false : _b;
        return __awaiter(this, void 0, void 0, function () {
            var fields;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fields = this._fields;
                        return [4, Promise.all(Object.keys(fields)
                                .map(function (n) { return fields[n].validate(); }))];
                    case 1:
                        _a.sent();
                        if (!quiet && this.hasErrors()) {
                            throw this._createValidationError();
                        }
                        return [2, this];
                }
            });
        });
    };
    Model.prototype.handle = function (error, _a) {
        var _b = (_a === void 0 ? {} : _a).quiet, quiet = _b === void 0 ? true : _b;
        return __awaiter(this, void 0, void 0, function () {
            var fields;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!error)
                            return [2, this];
                        if (error.code === 422)
                            return [2, this];
                        fields = this._fields;
                        return [4, Promise.all(Object.keys(fields)
                                .map(function (n) { return fields[n].handle(error); }))];
                    case 1:
                        _a.sent();
                        if (!quiet && this.hasErrors()) {
                            throw this._createValidationError();
                        }
                        else if (!this.hasErrors()) {
                            throw error;
                        }
                        return [2, this];
                }
            });
        });
    };
    Model.prototype.collectErrors = function () {
        return this.flatten()
            .map(function (_a) {
            var path = _a.path, field = _a.field;
            return ({ path: path, errors: field.errors });
        })
            .filter(function (_a) {
            var path = _a.path, errors = _a.errors;
            return errors.length > 0;
        });
    };
    Model.prototype.applyErrors = function (errors) {
        var _this = this;
        if (errors === void 0) { errors = []; }
        errors.forEach(function (error) {
            var field = _this.getField.apply(_this, error.path);
            if (field) {
                field.errors = error.errors;
            }
        });
        return this;
    };
    Model.prototype.hasErrors = function () {
        var _this = this;
        return Object.keys(this._fields)
            .some(function (name) { return _this._fields[name].hasErrors(); });
    };
    Model.prototype.isValid = function () {
        return !this.hasErrors();
    };
    Model.prototype.invalidate = function () {
        var _this = this;
        Object.keys(this._fields)
            .forEach(function (name) { return _this._fields[name].invalidate(); });
        return this;
    };
    Model.prototype.clone = function (data) {
        if (data === void 0) { data = {}; }
        return this._createModel(utils_1.merge({}, this.serialize(), { parent: this.parent }, data));
    };
    return Model;
}());
exports.Model = Model;
//# sourceMappingURL=models.js.map