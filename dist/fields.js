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
/*
* Field class.
*/
class Field {
    /*
    * Class constructor.
    */
    constructor(recipe = {}, options = {}) {
        this.recipe = Object.freeze(recipe);
        this.options = Object.freeze(options);
        this.errors = [];
        Object.defineProperty(this, '_data', {
            value: this._getDefaultValue.bind(this),
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
        if (typeable_1.isFunction(data)) {
            data = data.call(this);
        }
        let { get } = this.recipe;
        if (typeable_1.isFunction(get)) {
            data = get.call(this, data);
        }
        let { type } = this.recipe;
        data = this._cast(data, type);
        return data;
    }
    /*
    * Sets current field value.
    */
    _setValue(data) {
        let { set } = this.recipe;
        if (typeable_1.isFunction(set)) {
            data = set.call(this, data);
        }
        this.invalidate();
        this._data = data;
    }
    /*
    * Converts a `value` into specified `type`.
    */
    _cast(data, type) {
        if (typeable_1.isUndefined(type)) {
            return data;
        }
        return typeable_1.cast(data, type);
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
        this.value = this._getDefaultValue.bind(this);
        return this;
    }
    /*
    * Sets data to the fake value.
    */
    fake() {
        this.value = this._getFakeValue.bind(this);
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
        // this._commitRelated(this.value);
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
        let { type } = this.recipe;
        if (typeable_1.isArray(type))
            type = type[0];
        // TODO !!!!!
        // if (type instanceof this.constructor.owner) {
        //   return true;
        // }
        return false;
    }
    /*
    * Validates the field by populating the `errors` property.
    *
    * IMPORTANT: Array null values for nested objects are not treated as an object
    * but as an empty item thus isValid() for [null] succeeds.
    */
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            // let relatives = toArray(this.value) || []; // validate related documents
            // for (let relative of relatives) {
            //   let isDocument = relative instanceof this.$owner.constructor;
            //   if (isDocument) {
            //     await relative.validate({quiet: true}); // don't throw
            //   }
            // }
            this.errors = yield this._validator.validate(this.value, this.recipe.validate);
            return this;
        });
    }
    /*
    * Clears errors.
    */
    invalidate() {
        // let relatives = toArray(this.value) || []; // validate related documents
        // for (let relative of relatives) {
        //   let isDocument = relative instanceof this.$owner.constructor;
        //   if (isDocument) {
        //     relative.invalidate();
        //   }
        // }
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
        // else {
        //   return toArray(this.value).filter((f) => !!f).some((f) => f.hasErrors())
        // }
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