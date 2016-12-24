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
var fields_1 = require("./fields");
var utils_1 = require("./utils");
/*
* The core schema object class.
*/
var Document = (function () {
    /*
    * Class constructor.
    */
    function Document(data, options) {
        var _this = this;
        Object.defineProperty(this, 'options', {
            value: Object.freeze(options || {})
        });
        Object.defineProperty(this, 'parent', {
            value: this.options.parent || null
        });
        Object.defineProperty(this, 'root', {
            get: function () { return _this._getRootDocument(); }
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
        Object.defineProperty(this, '_failFast', {
            value: false,
            writable: true
        });
        this.populate(data);
    }
    /*
    * Loops up on the tree and returns the first document in the tree.
    */
    Document.prototype._getRootDocument = function () {
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
    /*
    * Creates a new field instance. This method is especially useful when
    * extending this class.
    */
    Document.prototype._createField = function (recipe) {
        if (recipe === void 0) { recipe = {}; }
        var type = recipe.type;
        return new fields_1.Field(utils_1.merge(recipe, { type: this._types[type] || type }), {
            owner: this,
            validators: this._validators,
            failFast: this._failFast
        });
    };
    /*
    * Creates a new validation error instance.
    */
    Document.prototype._createValidationError = function (message, code) {
        if (message === void 0) { message = 'Validation failed'; }
        if (code === void 0) { code = 422; }
        var error = new Error(message);
        error.code = code;
        return error;
    };
    /*
    * Creates a new document instance. This method is especially useful when
    * extending this class.
    */
    Document.prototype._createDocument = function (data, options) {
        if (data === void 0) { data = {}; }
        if (options === void 0) { options = {}; }
        return new this.constructor(data, options);
    };
    /*
    * Configures validator to stop validating field on the first error.
    */
    Document.prototype.failFast = function (fail) {
        if (fail === void 0) { fail = true; }
        this._failFast = typeable_1.toBoolean(fail);
    };
    /*
    * Defines a new field property.
    */
    Document.prototype.defineField = function (name, recipe) {
        var field = this._createField(recipe);
        Object.defineProperty(this, name, {
            get: function () { return field.value; },
            set: function (v) { return field.value = v; },
            enumerable: true,
            configurable: true
        });
        this._fields[name] = field;
    };
    /*
    * Defines a new custom data type.
    */
    Document.prototype.defineType = function (name, converter) {
        this._types[name] = converter;
    };
    /*
    * Defines a new custom validator.
    */
    Document.prototype.defineValidator = function (name, handler) {
        this._validators[name] = handler;
    };
    /*
    * Returns a value at path.
    */
    Document.prototype.getField = function () {
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
        return field instanceof Document ? field.getField(lastKey) : undefined;
    };
    /*
    * Returns `true` if the field exists.
    */
    Document.prototype.hasField = function () {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i] = arguments[_i];
        }
        return !typeable_1.isUndefined(this.getField.apply(this, keys));
    };
    /*
    * Deeply applies data to the fields.
    */
    Document.prototype.populate = function (data) {
        var _this = this;
        if (data === void 0) { data = {}; }
        data = utils_1.serialize(data);
        Object.keys(data)
            .filter(function (n) { return !!_this._fields[n]; })
            .forEach(function (name) { return _this[name] = data[name]; });
        return this;
    };
    /*
    * Converts this class into serialized data object.
    */
    Document.prototype.serialize = function () {
        return utils_1.serialize(this);
    };
    /*
    * Scrolls through the document and returns an array of fields.
    */
    Document.prototype.flatten = function (prefix) {
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
                if (type.prototype instanceof Document) {
                    fields = fields.concat(value.flatten(path));
                }
                else if (typeable_1.isArray(type) && type[0].prototype instanceof Document) {
                    fields = fields.concat(value
                        .map(function (f, i) { return (f ? f.flatten(path.concat([i])) : null); })
                        .filter(function (f) { return typeable_1.isArray(f); })
                        .reduce(function (a, b) { return a.concat(b); }));
                }
            }
        });
        return fields;
    };
    /*
    * Scrolls through object fields and collects results.
    */
    Document.prototype.collect = function (handler) {
        return this.flatten().map(handler);
    };
    /*
    * Scrolls through document fields and executes a handler on each field.
    */
    Document.prototype.scroll = function (handler) {
        return this.flatten().map(handler).length;
    };
    /*
    * Converts this class into serialized data object with only the keys that
    * pass the provided `test`.
    */
    Document.prototype.filter = function (test) {
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
    /*
    * Sets each document field to its default value.
    */
    Document.prototype.reset = function () {
        var _this = this;
        Object.keys(this._fields)
            .forEach(function (name) { return _this._fields[name].reset(); });
        return this;
    };
    /*
    * Resets fields then sets fields to their fake values.
    */
    Document.prototype.fake = function () {
        var _this = this;
        Object.keys(this._fields)
            .forEach(function (name) { return _this._fields[name].fake(); });
        return this;
    };
    /*
    * Sets all fileds to `null`.
    */
    Document.prototype.clear = function () {
        var _this = this;
        Object.keys(this._fields)
            .forEach(function (name) { return _this._fields[name].clear(); });
        return this;
    };
    /*
    * Resets information about changed fields by setting initial value of each field.
    */
    Document.prototype.commit = function () {
        var _this = this;
        Object.keys(this._fields)
            .forEach(function (name) { return _this._fields[name].commit(); });
        return this;
    };
    /*
    * Sets each field to its initial value (value before last commit).
    */
    Document.prototype.rollback = function () {
        var _this = this;
        Object.keys(this._fields)
            .forEach(function (name) { return _this._fields[name].rollback(); });
        return this;
    };
    /*
    * Returns `true` when the `value` represents an object with the
    * same field values as the original document.
    */
    Document.prototype.equals = function (value) {
        return utils_1.isEqual(utils_1.serialize(this), utils_1.serialize(value));
    };
    /*
    * Returns `true` if at least one field has been changed.
    */
    Document.prototype.isChanged = function () {
        var _this = this;
        return Object.keys(this._fields)
            .some(function (name) { return _this._fields[name].isChanged(); });
    };
    /*
    * Returns `true` if nested fields exist.
    */
    Document.prototype.isNested = function () {
        var _this = this;
        return Object.keys(this._fields)
            .some(function (name) { return _this._fields[name].isNested(); });
    };
    /*
    * Validates fields and throws an error.
    */
    Document.prototype.validate = function (_a) {
        var _b = (_a === void 0 ? {} : _a).quiet, quiet = _b === void 0 ? false : _b;
        return __awaiter(this, void 0, void 0, function () {
            var fields;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fields = this._fields;
                        return [4 /*yield*/, Promise.all(Object.keys(fields)
                                .map(function (n) { return fields[n].validate(); }))];
                    case 1:
                        _a.sent();
                        if (!quiet && this.hasErrors()) {
                            throw this._createValidationError();
                        }
                        return [2 /*return*/, this];
                }
            });
        });
    };
    /*
    * Returns a list of all fields with errors.
    */
    Document.prototype.collectErrors = function () {
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
    /*
    * Sets fields errors.
    */
    Document.prototype.applyErrors = function (errors) {
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
    /*
    * Returns `true` when errors exist (inverse of `isValid`).
    */
    Document.prototype.hasErrors = function () {
        var _this = this;
        return Object.keys(this._fields)
            .some(function (name) { return _this._fields[name].hasErrors(); });
    };
    /*
    * Returns `true` when no errors exist (inverse of `hasErrors`).
    */
    Document.prototype.isValid = function () {
        return !this.hasErrors();
    };
    /*
    * Removes fields errors.
    */
    Document.prototype.invalidate = function () {
        var _this = this;
        Object.keys(this._fields)
            .forEach(function (name) { return _this._fields[name].invalidate(); });
        return this;
    };
    /*
    * Returns a new Document instance which is the exact copy of the original.
    */
    Document.prototype.clone = function () {
        return this._createDocument(this, this.options);
    };
    return Document;
}());
exports.Document = Document;
