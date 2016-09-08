import {
  cast,
  isObject,
  isArray,
  isFunction,
  isPresent,
  isAbsent,
  isUndefined
} from 'typeable';

import deeplyEquals from 'deep-equal';
import {Validator} from 'validatable';
import {Schema} from './schema';

/*
* The core schema-based object class.
*/

export class Document {

  /*
  * Class constructor.
  */

  constructor(schema, data={}) {
    if (!(schema instanceof Schema)) {
      throw new Error(`${this.constructor.name} expects schema to be an instance of Schema class`);
    }

    Object.defineProperty(this, 'schema', {
      get: () => schema,
      enumerable: false // do not expose as object key
    });

    Object.defineProperty(this, 'validator', {
      value: new Validator(Object.assign({}, schema.validator, {context: this})),
      enumerable: false // do not expose as object key
    });

    this.define();
    this.populate(data);
  }

  /*
  * Defines class fields for all fields in schema.
  */

  define() {
    let {fields} = this.schema;

    for (let name in fields) {
      this._defineField(name, fields[name]);
    }

    return this;
  }

  /*
  * Defines a class field from the provided `name` and
  * field definition object.
  */

  _defineField(name, definition={}) {
    let data;

    Object.defineProperty(this, name, { // field definition
      get: () => {
        if (definition.get) { // value transformation
          return definition.get(data, this);
        } else {
          return data;
        }
      },
      set: (value=null) => {
        data = this._castValue(value, definition.type); // value type casting
        if (definition.set) { // value transformation
          data = definition.set(data, this);
        }
      },
      enumerable: true,
      configurable: true
    })

    if (isFunction(definition.defaultValue)) { // setting default value
      this[name] = definition.defaultValue(this);
    } else {
      this[name] = definition.defaultValue;
    }

    return this[name];
  }

  /*
  * Converts the `value` into specified `type`.
  */

  _castValue(value, type) {
    let options = this.schema.type;

    options.types = Object.assign({}, options.types, {
      Schema: (value) => {
        if (isArray(type)) type = type[0]; // in case of {type: [Schema]}
        return new this.constructor(type, value);
      }
    });

    return cast(value, type, options);
  }

  /*
  * Sets values of class properties with values provided by
  * the `data` object.
  */

  populate(data={}) {
    if (!isObject(data)) {
      throw new Error(`Only Object can populate a ${this.constructor.name}`);
    }

    for (let name in data) {
      this.populateField(name, data[name]);
    }

    return this;
  }

  /*
  * Sets a value of a single class property.
  */

  populateField(name, value) {
    if (this.schema.mode === 'relaxed') {
      this[name] = value;
    } else {
      let names = Object.keys(this.schema.fields);
      let exists = names.indexOf(name) > -1;

      if (exists) {
        this[name] = value;
      }
    }

    return this[name];
  }

  /*
  * Deletes all class fields.
  */

  purge() {
    let names = Object.keys(this);
    names.forEach((name) => this._purgeField(name));

    return this;
  };

  /*
  * Deletes specified class field.
  */

  _purgeField(name) {
    return delete this[name];
  }

  /*
  * Remove values of all class fields.
  */

  clear() {
    let names = Object.keys(this);

    for (let name of names) {
      this.clearField(name);
    }

    return this;
  }

  /*
  * Removes a value of a field with `name`.
  */

  clearField(name) {
    this[name] = null;
    return this[name];
  }

  /*
  * Returns a new Document instance which is the exact
  * copy of the original instance.
  */

  clone() {
    return new this.constructor(this.schema, this.toObject());
  }

  /*
  * Converts this class into serialized data object.
  */

  toObject() {
    let data = {};
    let names = Object.keys(this);

    for (let name of names) {
      data[name] = this._toObjectValue(this[name]);
    }

    return data;
  }

  /*
  * Reads a value recursivelly and returns a serialized data object.
  */

  _toObjectValue(value) {
    if (value && value.toObject) {
      return value.toObject();
    } else if (value && isArray(value)) {
      return value.map((value) => this._toObjectValue(value));
    } else {
      return value;
    }
  };

  /*
  * Validates all class fields and returns errors.
  */

  async validate() {
    let errors = {};

    for (let name in this) {

      let error = await this.validateField(name);
      if (!isUndefined(error)) {
        errors[name] = error;
      }
    }

    return errors;
  }

  /*
  * Validates a single class field with `name` and returns errors.
  */

  async validateField(name) {
    let value = this[name];
    let definition = this.schema.fields[name];

    return await this._validateValue(value, definition);
  }

  /*
  * Validates a value agains the field `definition` object.
  */

  async _validateValue(value, definition) {
    let {type, validations} = definition;
    let error = {};

    error.messages = await this.validator.validate(value, validations);

    let related = await this._validateRelatedObject(value, definition);
    if (related) {
      error.related = related;
    }

    error.isValid = (
      error.messages.length === 0
      && this._isRelatedObjectValid(related)
    );

    return error.isValid ? undefined : error;
  }

  /*
  * Validates a value agains the field `definition` object.
  */

  async _validateRelatedObject(value, definition) {
    let {type, validations} = definition;

    if (!value) {
      return undefined;
    } else if (type instanceof Schema) {
      return await value.validate();
    } else if (isArray(type) && isArray(value)) {
      let aaa = [];

      for (let v of value) {
        if (type[0] instanceof Schema) {
          if (v) {
            aaa.push(await v.validate());
          } else {
            aaa.push(undefined);
          }
        } else {
          aaa.push(await this._validateValue(v, definition));
        }
      }
      return aaa;
    } else {
      return undefined;
    }
  }

  /*
  * Validates a related object of a field (a sub schema).
  */

  _isRelatedObjectValid(value) {
    if (!value) {
      return true;
    } else if (isObject(value)) {
      return Object.values(value).map(v => v.isValid).indexOf(false) === -1;
    } else if (isArray(value)) {
      return value.map(v => this._isRelatedObjectValid(v)).indexOf(false) === -1;
    }
  }

  /*
  * Returns `true` when all document fields are valid.
  */

  async isValid() {
    let errors = await this.validate();
    return isAbsent(errors);
  }

  /*
  * Returns `true` when the `value` represents an object with the
  * same field values as the original document.
  */

  equalsTo(value) {
    return deeplyEquals(this, value);
  }

}
