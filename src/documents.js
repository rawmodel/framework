import {isPresent, isObject, isArray} from 'typeable';
import {Validator} from 'validatable';
import {Schema} from './schemas';
import {Field} from './fields';
import {serialize, isEqual} from './utils';

/*
* The core schema-based object class.
*/

export class Document {

  /*
  * Class constructor.
  */

  constructor (data, schema, parent = null) {
    Object.defineProperty(this, '$schema', { // schema instance
      value: schema
    });
    Object.defineProperty(this, '$parent', { // parent document instance
      value: parent
    });
    Object.defineProperty(this, '$root', { // root document instance
      get: () => this._getRootDocument()
    });
    Object.defineProperty(this, '$error', { // last document error instance
      value: null,
      writable: true
    });
    Object.defineProperty(this, '$validator', { // validatable.js instance
      value: this._createValidator()
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
  * Creates a new document instance. This method is especially useful when
  * extending this class.
  */

  _createDocument (data = null, schema = null, parent = null) {
    return new this.constructor(data, schema, parent);
  }

  /*
  * Creates a new field instance. This method is especially useful when
  * extending this class.
  */

  _createField (name) {
    return new Field(this, name);
  }

  /*
  * Returns a new instance of validator.
  */

  _createValidator () {
    return new Validator(
      Object.assign({}, {
        validators: this.$schema.validators,
        firstErrorOnly: this.$schema.firstErrorOnly,
        context: this
      })
    );
  }

  /*
  * Creates a new validation error instance.
  */

  _createValidationError (paths) {
    let error = new Error('Validation failed');
    error.code = 422;
    error.paths = paths;

    return error;
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
  * Scrolls through all set fields and returns an array of results.
  */

  flatten (prefix = []) {
    let fields = [];

    for (let name in this.$schema.fields) {
      let {type} = this.$schema.fields[name];
      let field = this[`$${name}`];
      let path = (prefix || []).concat(name);
      let value = field.value;

      fields.push({path, field});

      if (!isPresent(value)) continue;

      if (type instanceof Schema) {
        fields = fields.concat(
          value.flatten(path)
        );
      }
      else if (isArray(type) && type[0] instanceof Schema) {
        fields = fields.concat(
          value
            .map((f, i) => (f ? f.flatten(path.concat([i])) : null))
            .filter((f) => isArray(f))
            .reduce((a, b) => a.concat(b))
        );
      }
    }

    return fields;
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
    data = serialize(data);

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

  serialize () {
    return serialize(this);
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
  * Sets each document field to its fake value if a fake value generator
  * is registered, otherwise the default value is used.
  */

  fake () {
    let {fields} = this.$schema;

    for (let name in fields) {
      this[`$${name}`].fake();
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
    return isEqual(
      serialize(this),
      serialize(value)
    );
  }

  /*
  * Returns a new Document instance which is the exact copy of the original.
  */

  clone () {
    return this._createDocument(this, this.$schema, this.$parent);
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
      throw this._createValidationError(paths);
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
  * Returns `true` if nested fields exist.
  */

  isNested () {
    return Object.keys(this.$schema.fields).some((name) => {
      return this[`$${name}`].isNested();
    });
  }

  /*
  * Returns `true` when errors exist (inverse of `isValid`).
  */

  hasErrors () {
    return Object.keys(this.$schema.fields).some((name) => {
      return this[`$${name}`].hasErrors();
    });
  }

  /*
  * Returns a list of all field-related errors, including those deeply nested.
  */

  collectErrors () {
    return this.flatten().map(({path, field}) => {
      return {path, errors: field.errors};
    }).filter(({path, errors}) => {
      return errors.length > 0;
    });
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
