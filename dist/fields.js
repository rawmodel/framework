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
const utils_1 = require("./utils");
const validatable_1 = require("validatable");
const documents_1 = require("./documents");
/*
* Field class.
*/
class Field {
    /*
    * Class constructor.
    */
    constructor(recipe, options) {
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
            get: () => this._getValue(),
            set: (v) => this._setValue(v),
            enumerable: true
        });
        Object.defineProperty(this, 'defaultValue', {
            get: () => this._getDefaultValue(),
            enumerable: true
        });
        Object.defineProperty(this, 'fakeValue', {
            get: () => this._getFakeValue(),
            enumerable: true
        });
        Object.defineProperty(this, 'initialValue', {
            get: () => this._initialData,
            enumerable: true
        });
        Object.defineProperty(this, 'type', {
            get: () => this.recipe.type || null,
            enumerable: true
        });
        Object.defineProperty(this, 'owner', {
            get: () => this.options.owner || null,
            enumerable: true
        });
    }
    /*
    * Returns a new instance of validator.
    */
    _createValidator() {
        let { validators, firstErrorOnly } = this.options;
        let context = this;
        return new validatable_1.Validator({ validators, firstErrorOnly, context });
    }
    /*
    * Returns current field value.
    */
    _getValue() {
        let data = this._data;
        let { get } = this.recipe;
        if (typeable_1.isFunction(get)) {
            data = get.call(this, data);
        }
        return data;
    }
    /*
    * Sets current field value.
    */
    _setValue(data) {
        if (typeable_1.isFunction(data)) {
            data = data.call(this);
        }
        let { set } = this.recipe;
        if (typeable_1.isFunction(set)) {
            data = set.call(this, data);
        }
        data = this._cast(data, this.type);
        this.invalidate();
        this._data = data;
    }
    /*
    * Converts a `value` into specified `type`.
    */
    _cast(data, type) {
        let converter = type;
        if (!typeable_1.isValue(data)) {
            return null;
        }
        if (this.isNested()) {
            let Klass = typeable_1.isArray(type) ? type[0] : type;
            let options = utils_1.merge({}, this.owner.options, { parent: this.owner });
            let toDocument = (d) => new Klass(d, options);
            converter = typeable_1.isArray(type) ? [toDocument] : toDocument;
        }
        return typeable_1.cast(data, converter);
    }
    /*
    * Returns the default value of a field.
    */
    _getDefaultValue() {
        let data = null;
        let { defaultValue } = this.recipe;
        if (typeable_1.isFunction(defaultValue)) {
            data = defaultValue.call(this);
        }
        else if (!typeable_1.isUndefined(defaultValue)) {
            data = defaultValue;
        }
        return data;
    }
    /*
    * Returns the fake value of a field.
    */
    _getFakeValue() {
        let data = null;
        let { fakeValue } = this.recipe;
        if (typeable_1.isFunction(fakeValue)) {
            data = fakeValue.call(this);
        }
        else if (!typeable_1.isUndefined(fakeValue)) {
            data = fakeValue;
        }
        return data;
    }
    /*
    * Sets data to the default value.
    */
    reset() {
        this.value = this._getDefaultValue();
        return this;
    }
    /*
    * Resets the value then sets data to the fake value.
    */
    fake() {
        this.reset();
        if (this.fakeValue) {
            this.value = this.fakeValue;
        }
        (typeable_1.toArray(this.value) || []) // related fake values
            .filter((doc) => doc instanceof documents_1.Document)
            .map((doc) => doc.fake());
        return this;
    }
    /*
    * Sets data to `null`.
    */
    clear() {
        this.value = null;
        return this;
    }
    /*
    * Set's the initial value to the current value.
    */
    commit() {
        if (typeable_1.isValue(this.value)) {
            typeable_1.toArray(this.value)
                .filter((v) => v && v.commit)
                .forEach((v) => v.commit());
        }
        this._initialData = utils_1.serialize(this.value);
        return this;
    }
    /*
    * Sets value to the initial value.
    */
    rollback() {
        this.value = this.initialValue;
        return this;
    }
    /*
    * Returns `true` when `data` equals to the current value.
    */
    equals(data) {
        let value = data instanceof Field ? data.value : data;
        return utils_1.isEqual(utils_1.serialize(this.value), utils_1.serialize(value));
    }
    /*
    * Returns `true` if the value has been changed.
    */
    isChanged() {
        return !this.equals(this.initialValue);
    }
    /*
    * Returns `true` if the data is a Document.
    */
    isNested() {
        let type = this.type;
        if (typeable_1.isArray(type))
            type = type[0];
        return (typeable_1.isPresent(type)
            && typeable_1.isPresent(type.prototype)
            && (type.prototype instanceof documents_1.Document
                || type.prototype.constructor === documents_1.Document));
    }
    /*
    * Validates the field by populating the `errors` property.
    *
    * IMPORTANT: Array null values for nested objects are not treated as an object
    * but as an empty item thus isValid() for [null] succeeds.
    */
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(// invalidate related documents
            (typeable_1.toArray(this.value) || [])
                .filter((doc) => doc instanceof documents_1.Document)
                .map((doc) => doc.validate({ quiet: true })));
            this.errors = yield this._validator.validate(this.value, this.recipe.validate);
            return this;
        });
    }
    /*
    * Clears errors.
    */
    invalidate() {
        (typeable_1.toArray(this.value) || []) // invalidate related documents
            .filter((doc) => doc instanceof documents_1.Document)
            .forEach((doc) => doc.invalidate());
        this.errors = [];
        return this;
    }
    /*
    * Returns `true` when errors exist (inverse of `isValid`).
    */
    hasErrors() {
        if (this.errors.length > 0) {
            return true;
        }
        else if (!this.isNested()) {
            return false;
        }
        else {
            return typeable_1.toArray(this.value)
                .filter((f) => !!f)
                .some((f) => f.hasErrors());
        }
    }
    /*
    * Returns `true` when the value is valid (inverse of `hasErrors`).
    */
    isValid() {
        return !this.hasErrors();
    }
}
exports.Field = Field;
//# sourceMappingURL=fields.js.map