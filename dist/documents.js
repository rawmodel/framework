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
var validatable_1 = require("validatable");
var schemas_1 = require("./schemas");
var fields_1 = require("./fields");
var utils_1 = require("./utils");
/*
* The core schema-based object class.
*/
var Document = (function () {
    /*
    * Class constructor.
    */
    function Document(data, schema, parent) {
        var _this = this;
        Object.defineProperty(this, '$schema', {
            value: schema || this.$schema
        });
        Object.defineProperty(this, '$parent', {
            value: parent || null
        });
        Object.defineProperty(this, '$root', {
            get: function () { return _this._getRootDocument(); }
        });
        Object.defineProperty(this, '$validator', {
            value: this._createValidator()
        });
        this._defineFields();
        this._populateFields(data);
    }
    /*
    * Loops up on the tree and returns the first document in the tree.
    */
    Document.prototype._getRootDocument = function () {
        var root = this;
        do {
            if (root.$parent) {
                root = root.$parent;
            }
            else {
                return root;
            }
        } while (true);
    };
    /*
    * Creates a new document instance. This method is especially useful when
    * extending this class.
    */
    Document.prototype._createDocument = function (data, schema, parent) {
        if (data === void 0) { data = null; }
        if (schema === void 0) { schema = null; }
        if (parent === void 0) { parent = null; }
        return new this.constructor(data, schema, parent);
    };
    /*
    * Creates a new field instance. This method is especially useful when
    * extending this class.
    */
    Document.prototype._createField = function (name) {
        return new fields_1.Field(this, name);
    };
    /*
    * Returns a new instance of validator.
    */
    Document.prototype._createValidator = function () {
        return new validatable_1.Validator(utils_1.merge({}, {
            validators: this.$schema.validators,
            firstErrorOnly: this.$schema.firstErrorOnly,
            context: this
        }));
    };
    /*
    * Creates a new validation error instance.
    */
    Document.prototype._createValidationError = function (paths) {
        var error = new Error('Validation failed');
        error.code = 422;
        error.paths = paths;
        return error;
    };
    /*
    * Defines class fields from schema.
    */
    Document.prototype._defineFields = function () {
        var fields = this.$schema.fields;
        for (var name in fields) {
            this._defineField(name);
        }
    };
    /*
    * Defines a schema field by name.
    */
    Document.prototype._defineField = function (name) {
        var field = this._createField(name);
        Object.defineProperty(this, name, {
            get: function () { return field.value; },
            set: function (v) { return field.value = v; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(this, "$" + name, {
            value: field
        });
    };
    /*
    * Returns a value at path.
    */
    Document.prototype.getPath = function () {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i] = arguments[_i];
        }
        if (typeable_1.isArray(keys[0])) {
            keys = keys[0];
        }
        return keys.reduce(function (a, b) { return (a || {})[b]; }, this);
    };
    /*
    * Returns `true` if field at path exists.
    */
    Document.prototype.hasPath = function () {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i] = arguments[_i];
        }
        return this.getPath.apply(this, keys) !== undefined;
    };
    /*
    * Scrolls through all set fields and returns an array of results.
    */
    Document.prototype.flatten = function (prefix) {
        if (prefix === void 0) { prefix = []; }
        var fields = [];
        var _loop_1 = function (name) {
            var type = this_1.$schema.fields[name].type;
            var field = this_1["$" + name];
            var path = (prefix || []).concat(name);
            var value = field.value;
            fields.push({ path: path, field: field });
            if (!typeable_1.isPresent(value))
                return "continue";
            if (type instanceof schemas_1.Schema) {
                fields = fields.concat(value.flatten(path));
            }
            else if (typeable_1.isArray(type) && type[0] instanceof schemas_1.Schema) {
                fields = fields.concat(value
                    .map(function (f, i) { return (f ? f.flatten(path.concat([i])) : null); })
                    .filter(function (f) { return typeable_1.isArray(f); })
                    .reduce(function (a, b) { return a.concat(b); }));
            }
        };
        var this_1 = this;
        for (var name in this.$schema.fields) {
            _loop_1(name);
        }
        return fields;
    };
    /*
    * Sets field values from the provided by data object.
    */
    Document.prototype.populate = function (data) {
        if (data === void 0) { data = {}; }
        return this._populateFields(data);
    };
    /*
    * Sets field values from the provided by data object.
    */
    Document.prototype._populateFields = function (data) {
        if (data === void 0) { data = {}; }
        data = utils_1.serialize(data);
        for (var name in data) {
            this._populateField(name, data[name]);
        }
        return this;
    };
    /*
    * Sets a value of a field by name.
    */
    Document.prototype._populateField = function (name, value) {
        if (!this.$schema.strict) {
            this[name] = value;
        }
        else {
            var names = Object.keys(this.$schema.fields);
            var exists = names.indexOf(name) > -1;
            if (exists) {
                this[name] = value;
            }
        }
    };
    /*
    * Converts this class into serialized data object.
    */
    Document.prototype.serialize = function () {
        return utils_1.serialize(this);
    };
    /*
    * Converts this class into serialized data object having only the keys that
    * pass the `test`.
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
    * Sets each document field to its default value.
    */
    Document.prototype.reset = function () {
        var fields = this.$schema.fields;
        for (var name in fields) {
            this["$" + name].reset();
        }
        return this;
    };
    /*
    * Sets each document field to its fake value if a fake value generator
    * is registered, otherwise the default value is used.
    */
    Document.prototype.fake = function () {
        var fields = this.$schema.fields;
        for (var name in fields) {
            this["$" + name].fake();
        }
        return this;
    };
    /*
    * Removes all fileds values by setting them to `null`.
    */
    Document.prototype.clear = function () {
        var fields = this.$schema.fields;
        for (var name in fields) {
            this["$" + name].clear();
        }
        return this;
    };
    /*
    * Sets initial value of each document field to the current value of a field.
    */
    Document.prototype.commit = function () {
        var fields = this.$schema.fields;
        for (var name in fields) {
            this["$" + name].commit();
        }
        return this;
    };
    /*
    * Sets each document field to its initial value (value before last commit).
    */
    Document.prototype.rollback = function () {
        var fields = this.$schema.fields;
        for (var name in fields) {
            this["$" + name].rollback();
        }
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
    * Returns a new Document instance which is the exact copy of the original.
    */
    Document.prototype.clone = function () {
        return this._createDocument(this, this.$schema, this.$parent);
    };
    /*
    * Returns a `true` if at least one field has been changed.
    */
    Document.prototype.isChanged = function () {
        var _this = this;
        return Object.keys(this.$schema.fields).some(function (name) {
            return _this["$" + name].isChanged();
        });
    };
    /*
    * Validates fields and returns errors.
    */
    Document.prototype.validate = function (_a) {
        var _b = (_a === void 0 ? {} : _a).quiet, quiet = _b === void 0 ? false : _b;
        return __awaiter(this, void 0, void 0, function () {
            var fields, _a, _b, _i, path, paths;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        fields = this.$schema.fields;
                        _a = [];
                        for (_b in fields)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length))
                            return [3 /*break*/, 4];
                        path = _a[_i];
                        return [4 /*yield*/, this["$" + path].validate()];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        paths = this.collectErrors().map(function (e) { return e.path; });
                        if (!quiet && paths.length > 0) {
                            throw this._createValidationError(paths);
                        }
                        return [2 /*return*/, this];
                }
            });
        });
    };
    /*
    * Validates fields and returns errors.
    */
    Document.prototype.invalidate = function () {
        var fields = this.$schema.fields;
        for (var path in fields) {
            this["$" + path].invalidate();
        }
        return this;
    };
    /*
    * Returns `true` when all document fields are valid (inverse of `hasErrors`).
    */
    Document.prototype.isValid = function () {
        return !this.hasErrors();
    };
    /*
    * Returns `true` if nested fields exist.
    */
    Document.prototype.isNested = function () {
        var _this = this;
        return Object.keys(this.$schema.fields).some(function (name) {
            return _this["$" + name].isNested();
        });
    };
    /*
    * Returns `true` when errors exist (inverse of `isValid`).
    */
    Document.prototype.hasErrors = function () {
        var _this = this;
        return Object.keys(this.$schema.fields).some(function (name) {
            return _this["$" + name].hasErrors();
        });
    };
    /*
    * Returns a list of all field-related errors, including those deeply nested.
    */
    Document.prototype.collectErrors = function () {
        return this.flatten().map(function (_a) {
            var path = _a.path, field = _a.field;
            return { path: path, errors: field.errors };
        }).filter(function (_a) {
            var path = _a.path, errors = _a.errors;
            return errors.length > 0;
        });
    };
    /*
    * Deeply populates fields with the provided `errors`.
    */
    Document.prototype.applyErrors = function (errors) {
        if (errors === void 0) { errors = []; }
        for (var _i = 0, errors_1 = errors; _i < errors_1.length; _i++) {
            var error = errors_1[_i];
            var path = error.path.concat();
            path[path.length - 1] = "$" + path[path.length - 1];
            var field = this.getPath(path);
            if (field) {
                field.errors = error.errors;
            }
        }
        return this;
    };
    return Document;
}());
exports.Document = Document;
