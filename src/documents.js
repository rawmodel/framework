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
import {Schema} from './schemas';
import {Field} from './fields';
import {ValidationError} from './errors';

/*
* The core schema-based object class.
*/

export class Document {

  /*
  * Class constructor.
  */

  constructor (schema, data = {}, parent = null) {
    Object.defineProperty(this, '$schema', { // schema instance
      value: schema
    });
    Object.defineProperty(this, '$parent', { // parent document instance
      value: parent,
    });
    Object.defineProperty(this, '$root', { // root document instance
      get: () =>  this._getRootDocument(),
    });
    Object.defineProperty(this, '$validator', { // validatable.js instance
      value: this._createValidator()
    });
    Object.defineProperty(this, '$error', { // last document error instance
      value: null,
      writable: true
    });

    this._defineFields();
    this._populateFields(data);
  }

  /*
  * Loops up on the tree and returns the first document in the tree.
  */

  _getRootDocument () {
    let root = this;
    do {
      if (root.$parent) {
        root = root.$parent;
      }
      else {
        return root;
      }
    } while (true);
  }

  /*
  * Returns a new instance of validator.
  */

  _createValidator () {
    return new Validator(Object.assign({}, this.$schema.validatorOptions, {context: this}));
  }

  /*
  * Creates a new Field instance.
  */

  _createField (name) {
    return new Field(this, name);
  }

  /*
  * Creates a new sub-document instance (a nested document).
  */

  _createRelative (schema, data={}) {
    return new this.constructor(schema, data, this);
  }

  /*
  * Creates a new ValidationError instance.
  */

  _createValidationError (paths) {
    return new ValidationError(paths);
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
    let field = this._createField(name);

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
  * Returns a value at path.
  */

  getPath (...keys) {
    if (isArray(keys[0])) {
      keys = keys[0];
    }

    return keys.reduce((a, b) => (a || {})[b], this);
  }

  /*
  * Returns `true` if field at path exists.
  */

  hasPath (...keys) {
    return this.getPath(...keys) !== undefined;
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

  async validate ({quiet = false} = {}) {
    let {fields} = this.$schema;

    for (let path in fields) {
      await this[`$${path}`].validate();
    }

    let paths = this.collectErrors().map((e) => e.path);
    if (!quiet && paths.length > 0) {
      let error = this._createValidationError(paths);
      throw error;
    }

    return this;
  }

  /*
  * Validates fields and returns errors.
  */

  invalidate () {
    let {fields} = this.$schema;

    for (let path in fields) {
      this[`$${path}`].invalidate();
    }

    return this;
  }

  /*
  * Returns `true` when all document fields are valid (inverse of `hasErrors`).
  */

  isValid () {
    return !this.hasErrors();
  }

  /*
  * Returns `true` when errors exist (inverse of `isValid`).
  */

  hasErrors () {
    return this.collectErrors().length > 0;
  }

  /*
  * Returns a list of all field-related errors, including those deeply nested.
  */

  collectErrors () {

    let getErrors = (doc, prefix = []) => {
      let errors = [];

      for (let name in doc.$schema.fields) {
        let field = doc[`$${name}`];

        if (field.errors.length > 0) {
          errors.push({
            path: prefix.concat([field.name]),
            errors: field.errors
          });
        }

        if (field.value instanceof this.constructor) {
          errors.push(
            ...getErrors(field.value, prefix.concat(field.name))
          );
        }
        else if (isArray(field.value)) {
          field.value.forEach((d, i) => {
            if (d instanceof this.constructor) {
              errors.push(
                ...getErrors(d, prefix.concat([field.name, i]))
              );
            }
          });
        }
      }

      return errors;
    }

    return getErrors(this);
  }

  /*
  * Deeply populates fields with the provided `errors`.
  */

  applyErrors (errors = []) {
    for (let error of errors) {
      let path = error.path.concat();
      path[path.length - 1] = `$${path[path.length - 1]}`;

      let field = this.getPath(path);
      if (field) {
        field.errors = error.errors;
      }
    }

    return this;
  }

}
