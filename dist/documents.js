"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const typeable_1 = require("typeable");
const fields_1 = require("./fields");
const utils_1 = require("./utils");
/*
* The core schema object class.
*/
class Document {
    /*
    * Class constructor.
    */
    constructor(data, options) {
        Object.defineProperty(this, 'options', {
            value: Object.freeze(options || {})
        });
        Object.defineProperty(this, 'parent', {
            value: this.options.parent || null
        });
        Object.defineProperty(this, 'root', {
            get: () => this._getRootDocument()
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
    _getRootDocument() {
        let root = this;
        do {
            if (root.parent) {
                root = root.parent;
            }
            else {
                return root;
            }
        } while (true);
    }
    /*
    * Creates a new field instance. This method is especially useful when
    * extending this class.
    */
    _createField(recipe = {}) {
        let { type } = recipe;
        return new fields_1.Field(utils_1.merge(recipe, { type: this._types[type] || type }), {
            owner: this,
            validators: this._validators,
            failFast: this._failFast
        });
    }
    /*
    * Creates a new validation error instance.
    */
    _createValidationError(message = 'Validation failed', code = 422) {
        let error = new Error(message);
        error.code = code;
        return error;
    }
    /*
    * Creates a new document instance. This method is especially useful when
    * extending this class.
    */
    _createDocument(data = {}, options = {}) {
        return new this.constructor(data, options);
    }
    /*
    * Configures validator to stop validating field on the first error.
    */
    failFast(fail = true) {
        this._failFast = typeable_1.toBoolean(fail);
    }
    /*
    * Defines a new field property.
    */
    defineField(name, recipe) {
        let field = this._createField(recipe);
        Object.defineProperty(this, name, {
            get: () => field.value,
            set: (v) => field.value = v,
            enumerable: true,
            configurable: true
        });
        this._fields[name] = field;
    }
    /*
    * Defines a new custom data type.
    */
    defineType(name, converter) {
        this._types[name] = converter;
    }
    /*
    * Defines a new custom validator.
    */
    defineValidator(name, handler) {
        this._validators[name] = handler;
    }
    /*
    * Returns a value at path.
    */
    getField(...keys) {
        keys = [].concat(typeable_1.isArray(keys[0]) ? keys[0] : keys);
        let lastKey = keys.pop();
        if (keys.length === 0) {
            return this._fields[lastKey];
        }
        let field = keys.reduce((a, c) => (a[c] || {}), this);
        return field instanceof Document ? field.getField(lastKey) : undefined;
    }
    /*
    * Returns `true` if the field exists.
    */
    hasField(...keys) {
        return !typeable_1.isUndefined(this.getField(...keys));
    }
    /*
    * Deeply applies data to the fields.
    */
    populate(data = {}) {
        data = utils_1.serialize(data);
        Object.keys(data)
            .filter((n) => !!this._fields[n])
            .forEach((name) => this[name] = data[name]);
        return this;
    }
    /*
    * Converts this class into serialized data object.
    */
    serialize() {
        return utils_1.serialize(this);
    }
    /*
    * Scrolls through the document and returns an array of fields.
    */
    flatten(prefix = []) {
        let fields = [];
        Object.keys(this._fields).forEach((name) => {
            let field = this._fields[name];
            let type = field.type;
            let path = (prefix || []).concat(name);
            let value = field.value;
            fields.push({ path, field });
            if (typeable_1.isPresent(value) && typeable_1.isPresent(type)) {
                if (type.prototype instanceof Document) {
                    fields = fields.concat(value.flatten(path));
                }
                else if (typeable_1.isArray(type) && type[0].prototype instanceof Document) {
                    fields = fields.concat(value
                        .map((f, i) => (f ? f.flatten(path.concat([i])) : null))
                        .filter((f) => typeable_1.isArray(f))
                        .reduce((a, b) => a.concat(b)));
                }
            }
        });
        return fields;
    }
    /*
    * Scrolls through object fields and collects results.
    */
    collect(handler) {
        return this.flatten().map(handler);
    }
    /*
    * Scrolls through document fields and executes a handler on each field.
    */
    scroll(handler) {
        return this.flatten().map(handler).length;
    }
    /*
    * Converts this class into serialized data object with only the keys that
    * pass the provided `test`.
    */
    filter(test) {
        let data = utils_1.serialize(this);
        this.flatten()
            .sort((a, b) => b.path.length - a.path.length)
            .filter((field) => !test(field))
            .forEach((field) => {
            let names = field.path.concat();
            let lastName = names.pop();
            delete names.reduce((o, k) => o[k], data)[lastName];
        });
        return data;
    }
    /*
    * Sets each document field to its default value.
    */
    reset() {
        Object.keys(this._fields)
            .forEach((name) => this._fields[name].reset());
        return this;
    }
    /*
    * Resets fields then sets fields to their fake values.
    */
    fake() {
        Object.keys(this._fields)
            .forEach((name) => this._fields[name].fake());
        return this;
    }
    /*
    * Sets all fileds to `null`.
    */
    clear() {
        Object.keys(this._fields)
            .forEach((name) => this._fields[name].clear());
        return this;
    }
    /*
    * Resets information about changed fields by setting initial value of each field.
    */
    commit() {
        Object.keys(this._fields)
            .forEach((name) => this._fields[name].commit());
        return this;
    }
    /*
    * Sets each field to its initial value (value before last commit).
    */
    rollback() {
        Object.keys(this._fields)
            .forEach((name) => this._fields[name].rollback());
        return this;
    }
    /*
    * Returns `true` when the `value` represents an object with the
    * same field values as the original document.
    */
    equals(value) {
        return utils_1.isEqual(utils_1.serialize(this), utils_1.serialize(value));
    }
    /*
    * Returns `true` if at least one field has been changed.
    */
    isChanged() {
        return Object.keys(this._fields)
            .some((name) => this._fields[name].isChanged());
    }
    /*
    * Returns `true` if nested fields exist.
    */
    isNested() {
        return Object.keys(this._fields)
            .some((name) => this._fields[name].isNested());
    }
    /*
    * Validates fields and throws an error.
    */
    validate({ quiet = false } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let fields = this._fields;
            yield Promise.all(Object.keys(fields)
                .map((n) => fields[n].validate()));
            if (!quiet && this.hasErrors()) {
                throw this._createValidationError();
            }
            return this;
        });
    }
    /*
    * Returns a list of all fields with errors.
    */
    collectErrors() {
        return this.flatten()
            .map(({ path, field }) => ({ path, errors: field.errors }))
            .filter(({ path, errors }) => errors.length > 0);
    }
    /*
    * Sets fields errors.
    */
    applyErrors(errors = []) {
        errors.forEach((error) => {
            let field = this.getField(...error.path);
            if (field) {
                field.errors = error.errors;
            }
        });
        return this;
    }
    /*
    * Returns `true` when errors exist (inverse of `isValid`).
    */
    hasErrors() {
        return Object.keys(this._fields)
            .some((name) => this._fields[name].hasErrors());
    }
    /*
    * Returns `true` when no errors exist (inverse of `hasErrors`).
    */
    isValid() {
        return !this.hasErrors();
    }
    /*
    * Removes fields errors.
    */
    invalidate() {
        Object.keys(this._fields)
            .forEach((name) => this._fields[name].invalidate());
        return this;
    }
    /*
    * Returns a new Document instance which is the exact copy of the original.
    */
    clone() {
        return this._createDocument(this, this.options);
    }
}
exports.Document = Document;
//# sourceMappingURL=documents.js.map