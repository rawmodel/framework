import { Validator } from '@rawmodel/validator';
import { Handler } from '@rawmodel/handler';
import { Prop, PropConfig, PropRef, PropError } from './props';
import { normalize, isDeepEqual, isArray, isUndefined, toArray } from '@rawmodel/utils';

/**
 * Model configuration interface.
 */
export interface ModelConfig {
  ctx?: any | (() => any);
  failFast?: boolean | (() => boolean);
  parent?: Model;
}

/**
 * Strongly typed javascript object.
 */
export class Model {
  readonly $config: ModelConfig;
  readonly $props: {[key: string]: Prop};
  static readonly $props: {[key: string]: PropConfig} = {};

  /**
   * Class constructor.
   * @param data Model initial data.
   * @param config Model configuration.
   */
  public constructor(data?: any, config?: ModelConfig) {

    Object.defineProperty(this, '$config', {
      value: config || {},
      enumerable: false,
    });
    Object.defineProperty(this, '$props', {
      value: {},
      enumerable: false,
    });

    this.defineProps();
    this.populate(data);
  }

  /**
   * Defines all registered class properties. Registered properties are stored
   * on the static variable using the @prop decorator.
   */
  protected defineProps() {
    const recipes = this.constructor['$props'];

    for (const key in recipes) {
      this.defineProp(key, recipes[key]);
    }
  }

  /**
   * Defines a new class property.
   */
  protected defineProp(key: string, config: PropConfig) {

    this.$props[key] = new Prop({
      model: this,
      validator: () => new Validator(config as any), // lazy load
      handler: () => new Handler(config as any), // lazy load
      ...config,
    });

    Object.defineProperty(this, key, {
      get: () => this.$props[key].getValue(),
      set: (value) => this.$props[key].setValue(value),
      enumerable: config.enumerable !== false,
      configurable: false,
    });
  }

  /**
   * Returns parent model instance.
   */
  public getParent() {
    return this.$config.parent || null;
  }

  /**
   * Returns the root model instance.
   */
  public getRoot() {
    let root: Model = this;
    do {
      const parent = root.getParent();
      if (parent) {
        root = parent;
      }
      else {
        return root;
      }
    }
    while (true);
  }

  /**
   * Returns a value at path.
   */
  public getProp(...keys: any[]): Prop {
    keys = [].concat(isArray(keys[0]) ? keys[0] : keys);

    const lastKey = keys.pop();
    if (keys.length === 0) {
      return this.$props[lastKey];
    }

    const prop = keys.reduce((a, c) => (a[c] || {}), this);
    return prop instanceof Model ? prop.getProp(lastKey) : undefined;
  }

  /**
   * Returns `true` if the prop exists.
   */
  public isProp(...keys: any[]): boolean {
    return !isUndefined(this.getProp(...keys));
  }

  /**
   * Deeply assignes data to model props.
   */
  public populate(data: any, strategy?: string): this {

    Object.keys(data || {}).forEach((key) => {
      const prop = this.$props[key];
      if (prop) {
        prop.setValue(data[key], strategy);
      }
    });

    return this;
  }

  /**
   * Converts this class into serialized data object.
   */
  public serialize(strategy?: string): { [key: string]: any } {
    const data = {};

    Object.keys(this.$props)
      .forEach((key) => {
        const value = this.$props[key].serialize(strategy);
        if (!isUndefined(value)) {
          data[key] = value;
        }
      });

    return data;
  }

  /**
   * Scrolls through the model and returns an array of property instances.
   */
  public flatten(prefix: string[] = []): PropRef[] {
    let props = [];

    Object.keys(this.$props)
      .forEach((key) => {
        const prop = this.$props[key];
        const path = (prefix || []).concat(key);

        props.push({ path, prop });

        if (!prop.isEmpty() && prop.isModel()) {
          if (prop.isArray()) {
            props = props.concat(
              prop.getValue()
                .map((f, i) => (f && f instanceof Model ? f.flatten(path.concat([i])) : null))
                .filter((f) => isArray(f))
                .reduce((a, b) => a.concat(b), [])
            );
          }
          else {
            props = props.concat(
              prop.getValue().flatten(path)
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

    Object.keys(this.$props)
      .forEach((key) => this.$props[key].reset());

    return this;
  }

  /**
   * Resets properties then sets properties to their fake values.
   */
  public fake(): this {

    Object.keys(this.$props)
      .forEach((key) => this.$props[key].fake());

    return this;
  }

  /**
   * Sets all fileds to `null`.
   */
  public empty(): this {

    Object.keys(this.$props)
      .forEach((key) => this.$props[key].empty());

    return this;
  }

  /**
   * Resets information about changed props by setting initial value of each prop.
   */
  public commit(): this {

    Object.keys(this.$props)
      .forEach((key) => this.$props[key].commit());

    return this;
  }

  /**
   * Sets each prop to its initial value (value before last commit).
   */
  public rollback(): this {

    Object.keys(this.$props)
      .forEach((key) => this.$props[key].rollback());

    return this;
  }

  /**
   * Makes all properties not settable.
   */
  public freeze(): this {

    Object.keys(this.$props)
      .forEach((key) => this.$props[key].freeze());

    return this;
  }

  /**
   * Returns `true` when the `value` represents an object with the same prop
   * values as the original model.
   */
  public isEqual(value: any): boolean {
    return isDeepEqual(
      this.serialize(),
      value instanceof Model ? value.serialize() : normalize(value)
    );
  }

  /**
   * Returns `true` if at least one prop has been changed.
   */
  public isChanged(): boolean {
    return Object.keys(this.$props)
      .some((key) => this.$props[key].isChanged());
  }

  /**
   * Returns `true` when no errors exist.
   */
  public isValid(): boolean {
    return !Object.keys(this.$props)
      .some((key) => !this.$props[key].isValid());
  }

  /**
   * Validates props and throws an error.
   */
  public async validate({
    quiet = false
  }: {
    quiet?: boolean
  } = {}): Promise<this> {

    await Promise.all(
      Object.keys(this.$props)
        .map((key) => this.$props[key].validate())
    );

    if (!quiet && !this.isValid()) {
      const error = new Error('Validation failed');
      error['code'] = 422;
      throw error;
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

    if (!error) {
      return this; // blank values are valid
    }
    if (error.code === 422) {
      return this; // validation errors are ignored
    }

    await Promise.all(
      Object.keys(this.$props)
        .map((n) => this.$props[n].handle(error))
    );

    if (!quiet && !this.isValid()) {
      const error = new Error('Validation failed');
      error['code'] = 422;
      throw error;
    }
    else if (!quiet && this.isValid()) {
      throw error; // always throw unhandled errors
    }

    return this;
  }

  /**
   * Sets props errors.
   */
  public applyErrors(errors: PropError[] = []): this {
    toArray(errors).forEach((error) => {
      const prop = this.getProp(...error.path);
      if (prop) {
        prop.setErrorCodes(...error.errors);
      }
    });

    return this;
  }

  /**
   * Returns a list of all props with errors.
   */
  public collectErrors(): PropError[] {
    return this.flatten()
      .map(({ path, prop }) => ({ path, errors: prop.getErrorCodes() }))
      .filter(({ errors }) => errors.length > 0);
  }

  /**
   * Removes props errors.
   */
  public invalidate(): this {
    Object.keys(this.$props)
      .forEach((key) => this.$props[key].invalidate());

    return this;
  }

  /**
   * Returns a new Model instance which is the exact copy of the original.
   */
  public clone(data = {}): this {
    return new (this.constructor as any)({
      ...this.serialize(),
      ...data,
    }, {
      ...this.$config,
    });
  }

}
