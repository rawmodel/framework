import {
  isObject,
  isArray,
  isFunction,
  isPresent,
  isAbsent,
  isUndefined
} from 'typeable';

import deeplyEquals from 'deep-equal';
import {Validator} from 'validatable';
import {cloneData} from './utils';
import {Schema} from './schema';
import {Field} from './field';

/*
* The core schema-based object class.
*/

export class Document {

  /*
  * Class constructor.
  */

  constructor (schema, data={}, parent=null) {
    Object.defineProperty(this, '$schema', {
      value: schema
    });
    Object.defineProperty(this, '$parent', {
      value: parent,
    });
    Object.defineProperty(this, '$validator', {
      value: this._createValidator(),
    });

    this._defineFields();
    this._populateFields(data);
  }

  /*
  * Returns a new instance of validator.
  */

  _createValidator () {
    return new Validator(Object.assign({}, this.$schema.validatorOptions, {context: this}));
  }

  /*
  * Defines class fields from schema.
  */

  _defineFields () {
    let {fields} = this.$schema;

    for (let name in fields) {
      this._defineField(name);
    }
  }

  /*
  * Defines a schema field by name.
  */

  _defineField (name) {
    let field = new Field(this, name);

    Object.defineProperty(this, name, { // field definition
      get: () => field.value,
      set: (v) => field.value = v,
      enumerable: true,
      configurable: true
    });

    Object.defineProperty(this, `$${name}`, { // field class instance definition
      value: field
    });
  }

  /*
  * Returns `true` if keys exist on the document.
  */

  hasPath (...keys) {
    if (isArray(keys[0])) {
      keys = keys[0];
    }

    return keys.reduce(( a, b ) => (a || {})[b], this) !== undefined;
  }

  /*
  * Sets field values from the provided by data object.
  */

  populate (data={}) {
    return this._populateFields(data);
  }

  /*
  * Sets field values from the provided by data object.
  */

  _populateFields (data={}) {
    data = cloneData(data);

    for (let name in data) {
      this._populateField(name, data[name]);
    }

    return this;
  }

  /*
  * Sets a value of a field by name.
  */

  _populateField (name, value) {
    if (!this.$schema.strict) {
      this[name] = value;
    }
    else {
      let names = Object.keys(this.$schema.fields);
      let exists = names.indexOf(name) > -1;

      if (exists) {
        this[name] = value;
      }
    }
  }

  /*
  * Converts this class into serialized data object.
  */

  toObject () {
    let data = {};
    let names = Object.keys(this);

    for (let name of names) {
      data[name] = this._serializeValue(this[name]);
    }

    return data;
  }

  /*
  * Serializes a value recursivelly and returns a serialized data object.
  */

  _serializeValue (value) {
    if (value && value.toObject) {
      return value.toObject();
    }
    else if (value && isArray(value)) {
      return value.map((value) => this._serializeValue(value));
    }
    else {
      return value;
    }
  }

  /*
  * Sets each document field to its default value.
  */

  reset () {
    let {fields} = this.$schema;

    for (let name in fields) {
      this[`$${name}`].reset();
    }

    return this;
  }

  /*
  * Removes all fileds values by setting them to `null`.
  */

  clear () {
    let {fields} = this.$schema;

    for (let name in fields) {
      this[`$${name}`].clear();
    }

    return this;
  }

  /*
  * Sets initial value of each document field to the current value of a field.
  */

  commit () {
    let {fields} = this.$schema;

    for (let name in fields) {
      this[`$${name}`].commit();
    }

    return this;
  }

  /*
  * Sets each document field to its initial value (value before last commit).
  */

  rollback () {
    let {fields} = this.$schema;

    for (let name in fields) {
      this[`$${name}`].rollback();
    }

    return this;
  }

  /*
  * Returns `true` when the `value` represents an object with the
  * same field values as the original document.
  */

  equals (value) {
    return deeplyEquals(this, value);
  }

  /*
  * Returns a new Document instance which is the exact copy of the original.
  */

  clone () {
    return new this.constructor(this.$schema, this.toObject());
  }

  /*
  * Returns a `true` if at least one field has been changed.
  */

  isChanged () {
    return Object.keys(this.$schema.fields).some((name) => {
      return this[`$${name}`].isChanged();
    });
  }

  /*
  * Validates fields and returns errors.
  */

  async validate () {
    let data = {};
    let {fields} = this.$schema;

    for (let name in fields) {
      let errors = await this[`$${name}`].validate();

      if (!isAbsent(errors)) {
        data[name] = errors;
      }
    }

    return data;
  }

  /*
  * Returns `true` when all document fields are valid.
  */

  async isValid () {
    return isAbsent(
      await this.validate()
    );
  }

}
