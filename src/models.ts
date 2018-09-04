import { isArray, isUndefined, isPresent, isString, toBoolean } from 'typeable';
import { ValidatorRecipe } from 'validatable';
import { HandlerRecipe } from 'handleable';
import { Field, FieldRecipe, FieldError } from './fields';
import { normalize, isEqual, merge } from './utils';

/**
 * Flattened field reference type definition.
 */
export interface FieldRef {
  path: (string | number)[];
  field: Field;
}

/**
 * Field error type definition.
 */
export interface FieldErrorRef {
  path: (string | number)[];
  errors: FieldError[];
}

/**
 * Model recipe interface (can be used also for pasing data).
 */
export interface ModelRecipe {
  parent?: Model;
  [key: string]: any;
}

/**
 * The core schema object class.
 */
export abstract class Model {
  protected _fields: { [name: string]: Field }; // model fields
  protected _types: { [key: string]: (v?: any) => any }; // custom data types
  protected _validators: { [key: string]: (v?: any, r?: ValidatorRecipe) => boolean | Promise<boolean> }; // custom validators
  protected _handlers: { [key: string]: (v?: any, r?: HandlerRecipe) => boolean | Promise<boolean> }; // custom validators
  protected _failFast: boolean; // stop validating/handling on first error
  readonly root: Model;
  public parent: Model;

  /**
   * Class constructor.
   */
  public constructor(recipe?: ModelRecipe) {
    if (!recipe) {
      recipe = {};
    }

    Object.defineProperty(this, 'parent', {
      value: recipe.parent || this.parent || null,
      writable: true
    });
    Object.defineProperty(this, 'root', {
      get: () => this._getRootModel()
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
    Object.defineProperty(this, '_handlers', {
      value: {},
      writable: true
    });
    Object.defineProperty(this, '_failFast', {
      value: false,
      writable: true
    });
  }

  /**
   * Loops up on the tree and returns the first model in the tree.
   */
  protected _getRootModel() {
    let root: Model = this;
    do {
      if (root.parent) {
        root = root.parent;
      }
      else {
        return root;
      }
    } while (true);
  }

  /**
   * Returns the appropriate field type.
   */
  protected _getFieldType(recipe: FieldRecipe = {}) {
    let type = isArray(recipe.type) ? recipe.type[0] : recipe.type;
    type = this._types[type] || type;
    return isArray(recipe.type) ? [type] : type;
  }

  /**
   * Creates a new field instance. This method is especially useful when
   * extending this class.
   */
  protected _createField(recipe: FieldRecipe = {}) {
    return new Field(
      merge({}, recipe, {
        type: this._getFieldType(recipe),
        owner: this,
        validators: this._validators,
        handlers: this._handlers,
        failFast: this._failFast
      })
    );
  }

  /**
   * Creates a new validation error instance.
   */
  protected _createValidationError(message = 'Validation failed', code = 422): FieldError {
    const error: FieldError = new Error(message);
    error.code = code;

    return error;
  }

  /**
   * Creates a new model instance. This method is especially useful when
   * extending this class.
   */
  protected _createModel(recipe: ModelRecipe = {}) {
    return new (this.constructor as any)(recipe);
  }

  /**
   * Configures validator to stop validating field on the first error.
   */
  public failFast(fail: boolean = true): void {
    this._failFast = toBoolean(fail);
  }

  /**
   * Defines a new model property.
   */
  public defineField(name: string, recipe: FieldRecipe = {}): void {
    const field = this._createField(recipe);

    Object.defineProperty(this, name, {
      get: () => field.value,
      set: (v) => field.value = v,
      enumerable: recipe.enumerable !== false,
      configurable: true
    });

    this._fields[name] = field;
  }

  /**
   * Defines a new custom data type.
   */
  public defineType(name: string, converter: (v?: any) => any): void {
    this._types[name] = converter;
  }

  /**
   * Defines a new custom validator.
   */
  public defineValidator(name: string, handler: (v?: any, r?: ValidatorRecipe) => boolean | Promise<boolean>): void {
    this._validators[name] = handler;
  }

  /**
   * Defines a new custom validator.
   */
  public defineHandler(name: string, handler: (e?: any, r?: HandlerRecipe) => boolean | Promise<boolean>): void {
    this._handlers[name] = handler;
  }

  /**
   * Returns a value at path.
   */
  public getField(...keys: any[]): Field {
    keys = [].concat(isArray(keys[0]) ? keys[0] : keys);

    const lastKey = keys.pop();
    if (keys.length === 0) {
      return this._fields[lastKey];
    }

    const field = keys.reduce((a, c) => (a[c] || {}), this);
    return field instanceof Model ? field.getField(lastKey) : undefined;
  }

  /**
   * Returns `true` if the field exists.
   */
  public hasField(...keys: any[]): boolean {
    return !isUndefined(this.getField(...keys));
  }

  /**
   * Deeply assignes data to model fields.
   */
  public populate(data = {}, strategy?: string): this {

    function toValue(value) {
      if (value instanceof Model) {
        const data = normalize(value);
        return value.reset().populate(data, strategy);
      } else if (isArray(value)) {
        return value.map((v) => toValue(v));
      } else {
        return value;
      }
    }

    Object.keys(data || {})
      .filter((n) => (
        !!this._fields[n]
      ))
      .forEach((name) => {
        const field = this._fields[name];
        const value = field.cast(data[name]);
        if (
          isString(strategy)
          && isArray(field.populatable)
          && field.populatable.indexOf(strategy) !== -1
          || !isString(strategy)
        ) {
          this[name] = toValue(value);
        }
      });

    return this;
  }

  /**
   * Converts this class into serialized data object.
   */
  public serialize(strategy?: string): { [key: string]: any } {
    const data = {};

    function toObject(value) {
      if (value instanceof Model) {
        return value.serialize(strategy);
      } else if (isArray(value)) {
        return value.map((v) => toObject(v));
      } else {
        return value;
      }
    }

    Object.keys(this._fields).forEach((name) => {
      const field = this._fields[name];
      if (
        isString(strategy)
        && isArray(field.serializable)
        && field.serializable.indexOf(strategy) !== -1
        || !isString(strategy)
      ) {
        data[name] = toObject(field.value);
      }
    });

    return data;
  }

  /**
   * Scrolls through the model and returns an array of fields.
   */
  public flatten(prefix: string[] = []): FieldRef[] {
    let fields = [];

    Object.keys(this._fields).forEach((name) => {
      const field = this._fields[name];
      const type = field.type;
      const path = (prefix || []).concat(name);
      const value = field.value;

      fields.push({path, field});

      if (isPresent(value) && isPresent(type)) {
        if (type.prototype instanceof Model) {
          fields = fields.concat(
            value.flatten(path)
          );
        }
        else if (isArray(type) && type[0].prototype instanceof Model) {
          fields = fields.concat(
            value
              .map((f, i) => (f && f instanceof Model ? f.flatten(path.concat([i])) : null))
              .filter((f) => isArray(f))
              .reduce((a, b) => a.concat(b), [])
          );
        }
      }
    });

    return fields;
  }

  /**
   * Scrolls through object fields and collects results.
   */
  public collect(handler: (field: FieldRef) => any): any[] {
    return this.flatten().map(handler);
  }

  /**
   * Scrolls through model fields and executes a handler on each field.
   */
  public scroll(handler: (field: FieldRef) => void): number {
    return this.flatten().map(handler).length;
  }

  /**
   * Converts this class into serialized data object with only the keys that
   * pass the provided `test`.
   */
  public filter(test: (field: FieldRef) => boolean): {[key: string]: any} {
    const data = this.serialize();

    this.flatten()
      .sort((a, b) => b.path.length - a.path.length)
      .filter((field) => !test(field))
      .forEach((field) => {
        const names = field.path.concat();
        const lastName = names.pop();
        delete names.reduce((o, k) => o[k], data)[lastName];
      });

    return data;
  }

  /**
   * Sets each model field to its default value.
   */
  public reset(): this {
    Object.keys(this._fields)
      .forEach((name) => this._fields[name].reset());

    return this;
  }

  /**
   * Resets fields then sets fields to their fake values.
   */
  public fake(): this {
    Object.keys(this._fields)
      .forEach((name) => this._fields[name].fake());

    return this;
  }

  /**
   * Sets all fileds to `null`.
   */
  public clear(): this {
    Object.keys(this._fields)
      .forEach((name) => this._fields[name].clear());

    return this;
  }

  /**
   * Resets information about changed fields by setting initial value of each field.
   */
  public commit(): this {
    Object.keys(this._fields)
      .forEach((name) => this._fields[name].commit());

    return this;
  }

  /**
   * Sets each field to its initial value (value before last commit).
   */
  public rollback(): this {
    Object.keys(this._fields)
      .forEach((name) => this._fields[name].rollback());

    return this;
  }

  /**
   * Returns `true` when the `value` represents an object with the
   * same field values as the original model.
   */
  public equals(value: any): boolean {
    return isEqual(
      normalize(this),
      normalize(value)
    );
  }

  /**
   * Returns `true` if at least one field has been changed.
   */
  public isChanged(): boolean {
    return Object.keys(this._fields)
      .some((name) => this._fields[name].isChanged());
  }

  /**
   * Returns `true` if nested fields exist.
   */
  public isNested(): boolean {
    return Object.keys(this._fields)
      .some((name) => this._fields[name].isNested());
  }

  /**
   * Validates fields and throws an error.
   */
  public async validate({
    quiet = false
  }: {
    quiet?: boolean
  } = {}): Promise<this> {
    const fields = this._fields;

    await Promise.all(
      Object.keys(fields)
        .map((n) => fields[n].validate())
    );

    if (!quiet && this.hasErrors()) {
      throw this._createValidationError();
    }
    return this;
  }

  /**
   * Handles the error and throws an error if the error can not be handled.
   */
  public async handle(error: any, {
    quiet = true
  }: {
    quiet?: boolean
  } = {}): Promise<this> {
    if (!error) return this; // blank values are valid
    if (error.code === 422) return this; // validation errors are ignored

    const fields = this._fields;
    await Promise.all(
      Object.keys(fields)
        .map((n) => fields[n].handle(error))
    );

    if (!quiet && this.hasErrors()) {
      throw this._createValidationError();
    }
    else if (!this.hasErrors()) {
      throw error; // always throw unhandled errors
    }
    return this;
  }

  /**
   * Returns a list of all fields with errors.
   */
  public collectErrors(): FieldErrorRef[] {
    return this.flatten()
      .map(({path, field}) => ({path, errors: field.errors} as FieldErrorRef))
      .filter(({path, errors}) => errors.length > 0);
  }

  /**
   * Sets fields errors.
   */
  public applyErrors(errors: FieldErrorRef[] = []): this {
    errors.forEach((error) => {
      const field = this.getField(...error.path);
      if (field) {
        field.errors = error.errors;
      }
    });

    return this;
  }

  /**
   * Returns `true` when errors exist (inverse of `isValid`).
   */
  public hasErrors(): boolean {
    return Object.keys(this._fields)
      .some((name) => this._fields[name].hasErrors());
  }

  /**
   * Returns `true` when no errors exist (inverse of `hasErrors`).
   */
  public isValid(): boolean {
    return !this.hasErrors();
  }

  /**
   * Removes fields errors.
   */
  public invalidate(): this {
    Object.keys(this._fields)
      .forEach((name) => this._fields[name].invalidate());

    return this;
  }

  /**
   * Returns a new Model instance which is the exact copy of the original.
   */
  public clone(data = {}): this {
    return this._createModel({ parent: this.parent })
      .populate(merge({}, this.serialize(), data));
  }
}
