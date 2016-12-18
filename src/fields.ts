import {cast, isArray, toArray, isFunction} from 'typeable';
import {serialize, isEqual, merge} from './utils';
import {Schema} from './schemas';
import {Document} from './documents';

/*
* Document field class.
*/

export class Field {
  private _value: any;
  private _initialValue: any;
  $owner: Document;
  name: string;
  value: any;
  defaultValue: any;
  initialValue: any;
  fakeValue: any;
  errors: any[];

  /*
  * Class constructor.
  */

  constructor (owner: Document, name) {
    Object.defineProperty(this, '$owner', { // reference to the Document instance which owns the field
      value: owner
    });

    Object.defineProperty(this, 'name', { // field name
      value: name,
    });

    Object.defineProperty(this, 'defaultValue', { // default field value
      get: () => this._getDefaultValue(),
      enumerable: true
    });

    Object.defineProperty(this, '_value', { // current field value
      value: this.defaultValue,
      writable: true
    });
    Object.defineProperty(this, 'value', {
      get: () => this._getValue(),
      set: (v) => this._setValue(v),
      enumerable: true
    });

    Object.defineProperty(this, '_initialValue', { // last committed field value
      value: this._value,
      writable: true
    });
    Object.defineProperty(this, 'initialValue', {
      get: () => this._initialValue,
      enumerable: true
    });

    Object.defineProperty(this, 'fakeValue', {
      get: () => this._getFakeValue(),
      enumerable: true
    });

    Object.defineProperty(this, 'errors', { // last action errors
      value: [],
      writable: true
    });
  }

  /*
  * Return field value.
  */

  _getValue () {
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

  _setValue (value) {
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

  _getDefaultValue () {
    let {type, set, defaultValue} = this.$owner.$schema.fields[this.name];

    let value = isFunction(defaultValue)
      ? defaultValue.call(this)
      : defaultValue;

    value = this._cast(value, type); // value type casting
    if (set) { // custom setter
      value = set.call(this.$owner, value);
    }

    return value;
  }

  /*
  * Returns a fake value of a field.
  */

  _getFakeValue () {
    let {type, set, fakeValue} = this.$owner.$schema.fields[this.name];

    let value = isFunction(fakeValue)
      ? fakeValue.call(this)
      : fakeValue;

    value = this._cast(value, type); // value type casting
    if (set) { // custom setter
      value = set.call(this.$owner, value);
    }

    return value;
  }

  /*
  * Converts the `value` into specified `type`.
  */

  _cast (value, type) {
    let types = merge(this.$owner.$schema.types, {
      Schema: (value) => {
        if (isArray(type)) type = type[0]; // in case of {type: [Schema]}

        return this.$owner._createDocument(value, type, this.$owner);
      }
    });

    return cast(value, type, types);
  }

  /*
  * Sets field to the default value.
  */

  reset (): this {
    this.value = this.defaultValue;

    return this;
  }

  /*
  * Sets field to a generated fake value.
  */

  fake (): this {
    this.value = this.fakeValue || this.defaultValue;

    return this;
  }

  /*
  * Removes field's value by setting it to null.
  */

  clear (): this {
    this.value = null;

    return this;
  }

  /*
  * Deeply set's the initial values to the current value of each field.
  */

  commit (): this {
    this._commitRelated(this.value);
    this._initialValue = serialize(this.value);

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

  rollback (): this {
    this.value = this.initialValue;

    return this;
  }

  /*
  * Returns `true` when the `data` equals to the current value.
  */

  equals (data): boolean {
    return isEqual(
      serialize(this.value),
      serialize(data)
    );
  }

  /*
  * Returns `true` if the field or related sub-fields have been changed.
  */

  isChanged (): boolean {
    return !this.equals(this.initialValue);
  }

  /*
  * Returns `true` if the field is a Document field.
  */

  isNested (): boolean {
    let {type} = this.$owner.$schema.fields[this.name];
    if (isArray(type)) type = type[0];

    if (type.fields) {
      return type instanceof Schema;
    }
    return false;
  }

  /*
  * Validates the field by populating the `errors` property.
  *
  * IMPORTANT: Array null values for nested objects are not treated as an object
  * but as an empty item thus isValid() for [null] succeeds.
  */

  async validate (): Promise<this> {
    let relatives = toArray(this.value) || []; // validate related documents
    for (let relative of relatives) {
      let isDocument = relative instanceof this.$owner.constructor;

      if (isDocument) {
        await relative.validate({quiet: true}); // don't throw
      }
    }

    this.errors = await this.$owner.$validator.validate( // validate this field
      this.value,
      this.$owner.$schema.fields[this.name].validate
    );

    return this;
  }

  /*
  * Validates the field by clearing the `errors` property
  */

  invalidate (): this {
    let relatives = toArray(this.value) || []; // validate related documents
    for (let relative of relatives) {
      let isDocument = relative instanceof this.$owner.constructor;

      if (isDocument) {
        relative.invalidate();
      }
    }

    this.errors = [];

    return this;
  }

  /*
  * Returns `true` when the value is valid (inverse of `hasErrors`).
  */

  isValid (): boolean {
    return !this.hasErrors();
  }

  /*
  * Returns `true` when errors exist (inverse of `isValid`).
  */

  hasErrors (): boolean {
    if (this.errors.length > 0) {
      return true;
    }
    else if (!this.isNested()) {
      return false;
    }
    else {
      return toArray(this.value).filter((f) => !!f).some((f) => f.hasErrors())
    }
  }

}
