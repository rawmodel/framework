import {isArray, isUndefined, isPresent, toBoolean} from 'typeable';
import {ValidatorRecipe} from 'validatable';
import {Field, FieldRecipe, FieldError} from './fields';
import {serialize, isEqual, merge} from './utils';

/*
* Flattened field reference type definition.
*/

export interface FieldRef {
  path: string[];
  field: Field;
}

/*
* Field error type definition.
*/

export interface FieldErrorRef extends Error {
  path: string[];
  errors: FieldError[];
}

/*
* Document options interface.
*/

export interface DocumentOptions {
  parent?: Document;
}

/*
* The core schema object class.
*/

export class Document {
  protected _fields: {[name: string]: Field}; // document fields
  protected _types: {[key: string]: (v?) => any}; // custom data types
  protected _validators: {[key: string]: (v?, r?: ValidatorRecipe) => boolean | Promise<boolean>}; // custom validators
  protected _failFast: boolean; // stop validating on first error
  readonly options: DocumentOptions;
  readonly parent: Document;
  readonly root: Document;

  /*
  * Class constructor.
  */

  constructor (data?, options?: DocumentOptions) {    
    Object.defineProperty(this, 'options', {
      value: Object.freeze(options || {})
    });
    Object.defineProperty(this, 'parent', {
      value: this.options.parent || null
    });
    Object.defineProperty(this, 'root', {
      get: () => this._getRootDocument()
    });

    Object.defineProperty(this, '_fields', {
      value: {},
      writable: true
    });
    Object.defineProperty(this, '_types', {
      value: {},
      writable: true
    });
    Object.defineProperty(this, '_validators', {
      value: {},
      writable: true
    });
    Object.defineProperty(this, '_failFast', {
      value: false,
      writable: true
    });

    this.populate(data);
  }

  /*
  * Loops up on the tree and returns the first document in the tree.
  */

  protected _getRootDocument () {
    let root: Document = this;
    do {
      if (root.parent) {
        root = root.parent;
      }
      else {
        return root;
      }
    } while (true);
  }

  /*
  * Creates a new field instance. This method is especially useful when
  * extending this class.
  */

  protected _createField (recipe: FieldRecipe = {}) {
    let {type} = recipe;

    return new Field(merge(
      recipe,
      {type: this._types[type] || type}
    ), {
      owner: this,
      validators: this._validators,
      failFast: this._failFast
    });
  }

  /*
  * Creates a new validation error instance.
  */

  protected _createValidationError (message = 'Validation failed', code = 422): FieldError {
    let error: FieldError = new Error(message);
    error.code = code;

    return error;
  }

  /*
  * Creates a new document instance. This method is especially useful when
  * extending this class.
  */

  protected _createDocument (data = {}, options: DocumentOptions = {}) {
    return new (this.constructor as any)(data, options);
  }

  /*
  * Configures validator to stop validating field on the first error.
  */

  public failFast (fail: boolean = true): void {
    this._failFast = toBoolean(fail);
  }

  /*
  * Defines a new field property.
  */

  public defineField (name: string, recipe?: FieldRecipe) {
    let field = this._createField(recipe);

    Object.defineProperty(this, name, {
      get: () => field.value,
      set: (v) => field.value = v,
      enumerable: true,
      configurable: true
    });

    this._fields[name] = field;
  }

  /*
  * Defines a new custom data type.
  */

  public defineType (name: string, converter: (v?) => any) {
    this._types[name] = converter;
  }

  /*
  * Defines a new custom validator.
  */

  public defineValidator (name: string, handler: (v?, r?: ValidatorRecipe) => boolean | Promise<boolean>) {
    this._validators[name] = handler;
  }

  /*
  * Returns a value at path.
  */

  public getField (...keys): Field {
    keys = [].concat(isArray(keys[0]) ? keys[0] : keys);
    
    let lastKey = keys.pop();
    if (keys.length === 0) {
      return this._fields[lastKey];
    }

    let field = keys.reduce((a, c) => (a[c] || {}), this);
    return field instanceof Document ? field.getField(lastKey) : undefined;
  }

  /*
  * Returns `true` if the field exists.
  */

  public hasField (...keys): boolean {
    return !isUndefined(this.getField(...keys));
  }

  /*
  * Deeply applies data to the fields.
  */

  public populate (data = {}): this {
    data = serialize(data);

    Object.keys(data)
      .filter((n) => !!this._fields[n])
      .forEach((name) => this[name] = data[name]);

    return this;
  }

  /*
  * Converts this class into serialized data object.
  */

  public serialize (): {} {
    return serialize(this);
  }

  /*
  * Scrolls through the document and returns an array of fields.
  */

  public flatten (prefix: string[] = []): FieldRef[] {
    let fields = [];

    Object.keys(this._fields).forEach((name) => {
      let field = this._fields[name];
      let type = field.type;
      let path = (prefix || []).concat(name);
      let value = field.value;

      fields.push({path, field});

      if (isPresent(value) && isPresent(type)) {
        if (type.prototype instanceof Document) {
          fields = fields.concat(
            value.flatten(path)
          );
        }
        else if (isArray(type) && type[0].prototype instanceof Document) {
          fields = fields.concat(
            value
              .map((f, i) => (f ? f.flatten(path.concat([i])) : null))
              .filter((f) => isArray(f))
              .reduce((a, b) => a.concat(b))
          );
        }
      }
    });

    return fields;
  }

  /*
  * Scrolls through object fields and collects results.
  */

  public collect (handler: (field: FieldRef) => any): any[] {
    return this.flatten().map(handler);
  }

  /*
  * Scrolls through document fields and executes a handler on each field.
  */

  public scroll (handler: (field: FieldRef) => void): number {
    return this.flatten().map(handler).length;
  }

  /*
  * Converts this class into serialized data object with only the keys that
  * pass the provided `test`.
  */

  public filter (test: (field: FieldRef) => boolean): {} {
    let data = serialize(this);

    this.flatten()
      .sort((a, b) => b.path.length - a.path.length)
      .filter((field) => !test(field))
      .forEach((field) => {
        let names = field.path.concat();
        let lastName = names.pop();
        delete names.reduce((o, k) => o[k], data)[lastName];
      });

    return data;
  }

  /*
  * Sets each document field to its default value.
  */

  reset (): this {
    Object.keys(this._fields)
      .forEach((name) => this._fields[name].reset());

    return this;
  }

  /*
  * Resets fields then sets fields to their fake values.
  */

  fake (): this {
    Object.keys(this._fields)
      .forEach((name) => this._fields[name].fake());

    return this;
  }

  /*
  * Sets all fileds to `null`.
  */

  clear (): this {
    Object.keys(this._fields)
      .forEach((name) => this._fields[name].clear());

    return this;
  }

  /*
  * Resets information about changed fields by setting initial value of each field.
  */

  commit (): this {
    Object.keys(this._fields)
      .forEach((name) => this._fields[name].commit());

    return this;
  }

  /*
  * Sets each field to its initial value (value before last commit).
  */

  rollback (): this {
    Object.keys(this._fields)
      .forEach((name) => this._fields[name].rollback());

    return this;
  }

  /*
  * Returns `true` when the `value` represents an object with the
  * same field values as the original document.
  */

  equals (value: any): boolean {
    return isEqual(
      serialize(this),
      serialize(value)
    );
  }

  /*
  * Returns `true` if at least one field has been changed.
  */

  isChanged (): boolean {
    return Object.keys(this._fields)
      .some((name) => this._fields[name].isChanged());
  }

  /*
  * Returns `true` if nested fields exist.
  */

  isNested (): boolean {
    return Object.keys(this._fields)
      .some((name) => this._fields[name].isNested());
  }

  /*
  * Validates fields and throws an error.
  */

  async validate ({
    quiet = false
  }: {
    quiet?: boolean
  } = {}): Promise<this> {
    let fields = this._fields;

    await Promise.all(
      Object.keys(fields)
        .map((n) => fields[n].validate())
    );

    if (!quiet && this.hasErrors()) {
      throw this._createValidationError();
    }

    return this;
  }

  /*
  * Returns a list of all fields with errors.
  */

  collectErrors (): FieldErrorRef[] {
    return this.flatten()
      .map(({path, field}) => ({path, errors: field.errors} as FieldErrorRef))
      .filter(({path, errors}) => errors.length > 0);
  }

  /*
  * Sets fields errors.
  */

  applyErrors (errors: FieldErrorRef[] = []): this {
    errors.forEach((error) => {
      let field = this.getField(...error.path);
      if (field) {
        field.errors = error.errors;
      }
    });

    return this;
  }

  /*
  * Returns `true` when errors exist (inverse of `isValid`).
  */

  hasErrors (): boolean {
    return Object.keys(this._fields)
      .some((name) => this._fields[name].hasErrors());
  }

  /*
  * Returns `true` when no errors exist (inverse of `hasErrors`).
  */

  isValid (): boolean {
    return !this.hasErrors();
  }

  /*
  * Removes fields errors.
  */

  invalidate (): this {
    Object.keys(this._fields)
      .forEach((name) => this._fields[name].invalidate());

    return this;
  }

  /*
  * Returns a new Document instance which is the exact copy of the original.
  */

  clone (): this {
    return this._createDocument(this, this.options);
  }

}
