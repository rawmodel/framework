import { isArray, isUndefined, isPresent, isString, toBoolean } from 'typeable';
import { ValidatorRecipe } from 'validatable';
import { HandlerRecipe } from 'handleable';
import { Prop, PropRecipe, PropError } from './props';
import { normalize, isEqual, merge } from './utils';

/**
 * Flattened prop reference type definition.
 */
export interface PropRef {
  path: (string | number)[];
  prop: Prop;
}

/**
 * Prop error type definition.
 */
export interface PropErrorRef {
  path: (string | number)[];
  errors: PropError[];
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
  protected _props: { [name: string]: Prop }; // model props
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

    Object.defineProperty(this, '_props', {
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
   * Returns the appropriate prop type.
   */
  protected _getPropType(recipe: PropRecipe = {}) {
    let type = isArray(recipe.type) ? recipe.type[0] : recipe.type;
    type = this._types[type] || type;
    return isArray(recipe.type) ? [type] : type;
  }

  /**
   * Creates a new prop instance. This method is especially useful when
   * extending this class.
   */
  protected _createProp(recipe: PropRecipe = {}) {
    return new Prop(
      merge({}, recipe, {
        type: this._getPropType(recipe),
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
  protected _createValidationError(message = 'Validation failed', code = 422): PropError {
    const error: PropError = new Error(message);
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
   * Configures validator to stop validating prop on the first error.
   */
  public failFast(fail: boolean = true): void {
    this._failFast = toBoolean(fail);
  }

  /**
   * Defines a new model property.
   */
  public defineProp(name: string, recipe: PropRecipe = {}): void {
    const prop = this._createProp(recipe);

    Object.defineProperty(this, name, {
      get: () => prop.value,
      set: (v) => prop.value = v,
      enumerable: recipe.enumerable !== false,
      configurable: true
    });

    this._props[name] = prop;
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
  public getProp(...keys: any[]): Prop {
    keys = [].concat(isArray(keys[0]) ? keys[0] : keys);

    const lastKey = keys.pop();
    if (keys.length === 0) {
      return this._props[lastKey];
    }

    const prop = keys.reduce((a, c) => (a[c] || {}), this);
    return prop instanceof Model ? prop.getProp(lastKey) : undefined;
  }

  /**
   * Returns `true` if the prop exists.
   */
  public hasProp(...keys: any[]): boolean {
    return !isUndefined(this.getProp(...keys));
  }

  /**
   * Returns prop value instance.
   */
  public toValue(value, strategy?: string) {
    if (value instanceof Model) {
      const data = normalize(value);
      return value.reset().populate(data, strategy);
    } else if (isArray(value)) {
      return value.map((v) => this.toValue(v, strategy));
    } else {
      return value;
    }
  }

  /**
   * Deeply assignes data to model props.
   */
  public populate(data = {}, strategy?: string): this {
    Object.keys(data || {})
      .filter((n) => (
        !!this._props[n]
      ))
      .forEach((name) => {
        const prop = this._props[name];
        const value = prop.cast(data[name]);
        if (
          isString(strategy)
          && isArray(prop.populatable)
          && prop.populatable.indexOf(strategy) !== -1
          || !isString(strategy)
        ) {
          this[name] = this.toValue(value, strategy);
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

    Object.keys(this._props).forEach((name) => {
      const prop = this._props[name];
      if (
        isString(strategy)
        && isArray(prop.serializable)
        && prop.serializable.indexOf(strategy) !== -1
        || !isString(strategy)
      ) {
        data[name] = toObject(prop.value);
      }
    });

    return data;
  }

  /**
   * Scrolls through the model and returns an array of props.
   */
  public flatten(prefix: string[] = []): PropRef[] {
    let props = [];

    Object.keys(this._props).forEach((name) => {
      const prop = this._props[name];
      const type = prop.type;
      const path = (prefix || []).concat(name);
      const value = prop.value;

      props.push({path, prop});

      if (isPresent(value) && isPresent(type)) {
        if (type.prototype instanceof Model) {
          props = props.concat(
            value.flatten(path)
          );
        }
        else if (isArray(type) && type[0].prototype instanceof Model) {
          props = props.concat(
            value
              .map((f, i) => (f && f instanceof Model ? f.flatten(path.concat([i])) : null))
              .filter((f) => isArray(f))
              .reduce((a, b) => a.concat(b), [])
          );
        }
      }
    });

    return props;
  }

  /**
   * Scrolls through object props and collects results.
   */
  public collect(handler: (prop: PropRef) => any): any[] {
    return this.flatten().map(handler);
  }

  /**
   * Scrolls through model props and executes a handler on each prop.
   */
  public scroll(handler: (prop: PropRef) => void): number {
    return this.flatten().map(handler).length;
  }

  /**
   * Converts this class into serialized data object with only the keys that
   * pass the provided `test`.
   */
  public filter(test: (prop: PropRef) => boolean): {[key: string]: any} {
    const data = this.serialize();

    this.flatten()
      .sort((a, b) => b.path.length - a.path.length)
      .filter((prop) => !test(prop))
      .forEach((prop) => {
        const names = prop.path.concat();
        const lastName = names.pop();
        delete names.reduce((o, k) => o[k], data)[lastName];
      });

    return data;
  }

  /**
   * Sets each model prop to its default value.
   */
  public reset(): this {
    Object.keys(this._props)
      .forEach((name) => this._props[name].reset());

    return this;
  }

  /**
   * Resets props then sets props to their fake values.
   */
  public fake(): this {
    Object.keys(this._props)
      .forEach((name) => this._props[name].fake());

    return this;
  }

  /**
   * Sets all fileds to `null`.
   */
  public clear(): this {
    Object.keys(this._props)
      .forEach((name) => this._props[name].clear());

    return this;
  }

  /**
   * Resets information about changed props by setting initial value of each prop.
   */
  public commit(): this {
    Object.keys(this._props)
      .forEach((name) => this._props[name].commit());

    return this;
  }

  /**
   * Sets each prop to its initial value (value before last commit).
   */
  public rollback(): this {
    Object.keys(this._props)
      .forEach((name) => this._props[name].rollback());

    return this;
  }

  /**
   * Returns `true` when the `value` represents an object with the
   * same prop values as the original model.
   */
  public equals(value: any): boolean {
    return isEqual(
      normalize(this),
      normalize(value)
    );
  }

  /**
   * Returns `true` if at least one prop has been changed.
   */
  public isChanged(): boolean {
    return Object.keys(this._props)
      .some((name) => this._props[name].isChanged());
  }

  /**
   * Returns `true` if nested props exist.
   */
  public isNested(): boolean {
    return Object.keys(this._props)
      .some((name) => this._props[name].isNested());
  }

  /**
   * Validates props and throws an error.
   */
  public async validate({
    quiet = false
  }: {
    quiet?: boolean
  } = {}): Promise<this> {
    const props = this._props;

    await Promise.all(
      Object.keys(props)
        .map((n) => props[n].validate())
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

    const props = this._props;
    await Promise.all(
      Object.keys(props)
        .map((n) => props[n].handle(error))
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
   * Returns a list of all props with errors.
   */
  public collectErrors(): PropErrorRef[] {
    return this.flatten()
      .map(({path, prop}) => ({path, errors: prop.errors} as PropErrorRef))
      .filter(({path, errors}) => errors.length > 0);
  }

  /**
   * Sets props errors.
   */
  public applyErrors(errors: PropErrorRef[] = []): this {
    errors.forEach((error) => {
      const prop = this.getProp(...error.path);
      if (prop) {
        prop.errors = error.errors;
      }
    });

    return this;
  }

  /**
   * Returns `true` when errors exist (inverse of `isValid`).
   */
  public hasErrors(): boolean {
    return Object.keys(this._props)
      .some((name) => this._props[name].hasErrors());
  }

  /**
   * Returns `true` when no errors exist (inverse of `hasErrors`).
   */
  public isValid(): boolean {
    return !this.hasErrors();
  }

  /**
   * Removes props errors.
   */
  public invalidate(): this {
    Object.keys(this._props)
      .forEach((name) => this._props[name].invalidate());

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
