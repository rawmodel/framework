import {
  cast,
  isAbsent,
  isArray,
  toArray,
  isFunction
} from 'typeable';
import deeplyEquals from 'deep-equal';
import {cloneData} from './utils';
import {Schema} from './schemas';
import {ValidatorError} from './errors';

/*
* Document field class.
*/

export class Field {

  /*
  * Class constructor.
  */

  constructor (owner, name) {
    Object.defineProperty(this, '$owner', { // reference to the Document instance which owns the field
      value: owner
    });
    Object.defineProperty(this, 'name', { // the name that a field has on the document
      value: name,
    });
    Object.defineProperty(this, '_value', { // current field value
      value: this.defaultValue,
      writable: true
    });
    Object.defineProperty(this, '_initialValue', { // last committed field value
      value: this._value,
      writable: true
    });
    Object.defineProperty(this, '_errors', { // last action errors
      value: [],
      writable: true
    });
  }

  /*
  * Return field value.
  */

  get value () {
    let {get} = this.$owner.$schema.fields[this.name];

    let value = this._value;
    if (get) { // transformation with custom getter
      value = get.call(this.$owner, value);
    }
    return value;
  }

  /*
  * Sets field value.
  */

  set value (value) {
    let {set, type} = this.$owner.$schema.fields[this.name];

    value = this._cast(value, type); // value type casting
    if (set) { // transformation with custom setter
      value = set.call(this.$owner, value);
    }

    this.invalidate(); // remove the last memorized error because the value has changed
    this._value = value;
  }

  /*
  * Returns the default value of a field.
  */

  get defaultValue () {
    let {type, set, defaultValue} = this.$owner.$schema.fields[this.name];

    let value = isFunction(defaultValue)
      ? defaultValue(this._document)
      : defaultValue;

    value = this._cast(value, type); // value type casting
    if (set) { // custom setter
      value = set.call(this.$owner, value);
    }

    return value;
  }

  /*
  * Returns the value of a field of the last commit.
  */

  get initialValue () {
    return this._initialValue;
  }

  /*
  * Returns the last error of the field.
  */

  get errors () {
    return this._errors;
  }

  /*
  * Returns the last error of the field.
  */

  set errors (errors) {
    this._errors = errors.map((e) => this._createError(e));
  }

  /*
  * Returns the last error of the field.
  */

  _createError (data) {
    switch (data.name) {
      case 'ValidatorError':
        return new ValidatorError(data.validator, data.message, data.code);
      case 'Error':
        return new Error(data.message);
    }

    throw new Error(`Unknown document field error`);
  }

  /*
  * Converts the `value` into specified `type`.
  */

  _cast (value, type) {
    let options = this.$owner.$schema.typeOptions;

    options.types = Object.assign({}, options.types, {
      Schema: (value) => {
        if (isArray(type)) type = type[0]; // in case of {type: [Schema]}

        return this.$owner._createRelative(type, value);
      }
    });

    return cast(value, type, options);
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
  * Validates the field by populating the `_errors` property.
  */

  async validate () {
    let relatives = toArray(this.value) || []; // validate related documents
    for (let relative of relatives) {
      let isDocument = relative instanceof this.$owner.constructor;

      if (isDocument) {
        await relative.validate({quiet: true}); // don't throw
      }
    }

    this._errors = await this.$owner.$validator.validate( // validate this field
      this.value,
      this.$owner.$schema.fields[this.name].validate
    );

    return this;
  }

  /*
  * Validates the field by clearing the `_errors` property
  */

  invalidate () {
    let relatives = toArray(this.value) || []; // validate related documents
    for (let relative of relatives) {
      let isDocument = relative instanceof this.$owner.constructor;

      if (isDocument) {
        relative.invalidate();
      }
    }

    this._errors = [];

    return this;
  }

  /*
  * Returns `true` when the value is valid.
  */

  async isValid () {
    return isAbsent(this.errors);
  }

}
