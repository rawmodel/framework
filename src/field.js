import {
  cast,
  isAbsent,
  isArray,
  isObject,
  isFunction
} from 'typeable';

import deeplyEquals from 'deep-equal';
import {cloneData} from './utils';
import {Schema} from './schema';

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
  * Validates the field and returns errors.
  */

  async validate() {
    let data = {}

    let errors = await this._validateValue(this.value);
    data.errors = errors;

    let related = await this._validateRelated(this.value);
    if (related) {
      data.related = related;
    }

    let isValid = (
      errors.length === 0
      && this._isRelatedValid(related)
    );
    return !isValid ? data : undefined;
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

    if (!value) {
      return undefined;
    }
    else if (type instanceof Schema) {
      return await value.validate();
    }
    else if (isArray(type) && isArray(value)) {
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
    else {
      return undefined;
    }
  }

  /*
  * Checks if the `related` field is valid.
  */

  _isRelatedValid (related) {
    if (isObject(related)) {
      return Object.values(related).every(v => v.errors.length === 0 && !v.related);
    }
    else if (isArray(related)) {
      return related.every(v => this._isRelatedValid(v));
    }
    else {
      return true;
    }
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
