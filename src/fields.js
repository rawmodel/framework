import {
  cast,
  isUndefined,
  isPresent,
  isAbsent,
  isArray,
  isObject,
  isFunction
} from 'typeable';

import deeplyEquals from 'deep-equal';
import {ValidatorError} from 'validatable';
import {cloneData} from './utils';
import {Schema} from './schemas';

/**
* Exposing validatable ValidatorError.
*/

export {ValidatorError};

/*
* A validation error class.
*/

export class InvalidFieldError extends Error {

  /*
  * Class constructor.
  */

  constructor (path = null, errors = [], related = [], message = 'Field validation failed', code = 422) {
    super();

    this.name = this.constructor.name;
    this.path = path;
    this.errors = errors;
    this.related = related;
    this.message = message;
    this.code = code;
  }
}

/*
* Document field class.
*/

export class Field {

  /*
  * Class constructor.
  */

  constructor (document, name) {
    Object.defineProperty(this, '$document', {
      value: document
    });
    Object.defineProperty(this, '$name', {
      value: name,
    });
    Object.defineProperty(this, '_value', {
      value: this.defaultValue,
      writable: true
    });
    Object.defineProperty(this, '_initialValue', {
      value: this._value,
      writable: true
    });
  }

  /*
  * Return field value.
  */

  get value () {
    let {get} = this.$document.$schema.fields[this.$name];

    let value = this._value;
    if (get) { // transformation with custom getter
      value = get.call(this.$document, value);
    }
    return value;
  }

  /*
  * Sets field value.
  */

  set value (value) {
    let {set, type} = this.$document.$schema.fields[this.$name];

    value = this._cast(value, type); // value type casting
    if (set) { // transformation with custom setter
      value = set.call(this.$document, value);
    }

    this._value = value;
  }

  /*
  * Returns the default value of a field.
  */

  get defaultValue () {
    let {type, set, defaultValue} = this.$document.$schema.fields[this.$name];

    let value = isFunction(defaultValue)
      ? defaultValue(this._document)
      : defaultValue;

    value = this._cast(value, type); // value type casting
    if (set) { // custom setter
      value = set.call(this.$document, value);
    }

    return value;
  }

  /*
  * Converts the `value` into specified `type`.
  */

  _cast (value, type) {
    let options = this.$document.$schema.typeOptions;

    options.types = Object.assign({}, options.types, {
      Schema: (value) => {
        if (isArray(type)) type = type[0]; // in case of {type: [Schema]}
        return new this.$document.constructor(type, value, this.$document);
      }
    });

    return cast(value, type, options);
  }

  /*
  * Returns the value of a field before last commit.
  */

  get initialValue () {
    return this._initialValue;
  }

  /*
  * Sets field to the default value.
  */

  reset () {
    this.value = this.defaultValue;

    return this;
  }

  /*
  * Removes field's value by setting it to null.
  */

  clear () {
    this.value = null;

    return this;
  }

  /*
  * Deeply set's the initial values to the current value of each field.
  */

  commit () {
    this._commitRelated(this.value);
    this._initialValue = cloneData(this.value);

    return this;
  }

  /*
  * Deeply set's the initial values of the related `data` object to the current
  * value of each field.
  */

  _commitRelated (data) { // commit sub fields
    if (data && data.commit) {
      data.commit();
    }
    else if (data && isArray(data)) {
      data.forEach((d) => this._commitRelated(d));
    }
  }

  /*
  * Sets field's value before last commit.
  */

  rollback () {
    this.value = this.initialValue;

    return this;
  }

  /*
  * Returns `true` when the `data` equals to the current value.
  */

  equals (data) {
    return deeplyEquals(this.value, data);
  }

  /*
  * Returns `true` if the field or related sub-fields have been changed.
  */

  isChanged () {
    return !this.equals(this.initialValue);
  }

  /*
  * Creates a new instance of InvalidFieldError.
  */

  createInvalidFieldError (path, errors, related) {
    return new InvalidFieldError(path, errors, related);
  }

  /*
  * Validates the field and returns errors.
  */

  async validate() {
    let path = this.$name;
    let errors = await this._validateValue(this.value);
    let related = await this._validateRelated(this.value);

    let hasError = (
      errors.length > 0
      || !this._isRelatedValid(related)
    );

    if (hasError) {
      return this.createInvalidFieldError(path, errors, related);
    }
    return undefined;
  }

  /*
  * Validates the `value` and returns errors.
  */

  async _validateValue (value) {
    let {validate} = this.$document.$schema.fields[this.$name];

    return await this.$document.$validator.validate(value, validate);
  }

  /*
  * Validates the related fields of the `value` and returns errors.
  */

  async _validateRelated (value) {
    let {type} = this.$document.$schema.fields[this.$name];

    if (isPresent(value) && type instanceof Schema) {
      return await value.validate();
    }
    else if (isArray(value) && isArray(type)) {
      let items = [];
      for (let v of value) {
        if (type[0] instanceof Schema) {
          items.push(v ? await v.validate() : undefined);
        }
        else {
          items.push(await this._validateValue(v));
        }
      }
      return items;
    }
    return [];
  }

  /*
  * Checks if the `related` field is valid.
  */

  _isRelatedValid (related) {
    return related.every(v => {
      return isArray(v) ? this._isRelatedValid(v) : isAbsent(v);
    });
  }

  /*
  * Returns `true` when the value is valid.
  */

  async isValid () {
    return isAbsent(
      await this.validate()
    );
  }

}
