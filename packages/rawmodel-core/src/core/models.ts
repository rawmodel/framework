import { Prop } from './props';
import { normalize, isDeepEqual, isArray, isUndefined, toArray, realize,
  isObject, isInteger, isNumber } from '@rawmodel/utils';
import { ModelConfig, PropConfig, PropItem, PropError, PropPath } from './types';

/**
 * Strongly typed javascript object.
 */
export class Model<Context = any> {
  public readonly $config: ModelConfig<Context>;
  public readonly $props: {[key: string]: Prop};
  public static readonly $props: {[key: string]: PropConfig} = {};

  /**
   * Class constructor.
   * @param data Model initial data.
   * @param config Model configuration.
   */
  public constructor(data?: any, config?: ModelConfig<Context>) {

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
   * @param key Property name.
   * @param config Property configuration.
   */
  protected defineProp(key: string, config: PropConfig) {

    this.$props[key] = new Prop({
      ...config,
      model: this,
    });

    Object.defineProperty(this, key, {
      get: () => this.$props[key].getValue(),
      set: (value) => this.$props[key].setValue(value),
      enumerable: config.enumerable !== false,
      configurable: false,
    });
  }

  /**
   * Returns model context object.
   */
  public getContext(): Context {
    return realize(this.$config.context) || null;
  }

  /**
   * Returns parent model instance.
   */
  public getParent(): Model<Context> {
    return this.$config.parent || null;
  }

  /**
   * Returns a list of all parent model instances.
   */
  public getAncestors(): Model<Context>[] {
    const tree  = [];

    let parent = this as any;
    while (true) {
      parent = parent.getParent();
      if (parent) {
        tree.unshift(parent);
      } else {
        break;
      }
    }

    return tree;
  }

  /**
   * Returns a value at path.
   * @param keys Property path keys.
   */
  public getProp(...keys: any[]): Prop {
    keys = [].concat(isArray(keys[0]) ? keys[0] : keys);

    let lastKey = keys.pop();
    if (keys.length === 0) {
      return this.$props[lastKey];
    } else if (isInteger(lastKey)) {
      lastKey = keys.pop(); // array items refer to parent prop
    }

    const prop = keys.reduce((a, c) => (a[c] || {}), this);
    return prop instanceof Model ? prop.getProp(lastKey) : undefined;
  }

  /**
   * Returns `true` if the prop exists.
   * @param keys Property path keys.
   */
  public hasProp(...keys: any[]): boolean {
    return !isUndefined(this.getProp(...keys));
  }

  /**
   * Deeply assignes data to model props.
   * @param data Data for populating model.
   * @param strategy Population strategy name.
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
   * @param strategy Serialization strategy name.
   */
  public serialize(strategy?: string): { [key: string]: any } {
    const data = {};

    Object.keys(this.$props).forEach((key) => {
      const value = this.$props[key].serialize(strategy);
      if (!isUndefined(value)) {
        data[key] = value;
      }
    });

    return data;
  }

  /**
   * Scrolls through the model and returns an array of property instances.
   * @param strategy Serialization strategy name.
   */
  public flatten(strategy?: string): PropItem[] {
    const items = [];

    const transform = (obj: any, prefix: PropPath = []) => {
      if (isArray(obj)) {
        obj.forEach((value, index) => {
          const path = prefix.concat([index]);
          const prop = this.getProp(prefix);
          items.push({ path, prop, value });
          transform(value, path);
        });
      }
      else if (isObject(obj)) {
        Object.keys(obj).forEach((key) => {
          const path = prefix.concat([key]);
          const prop = this.getProp(path);
          const value = obj[key];
          items.push({ path, prop, value });
          transform(value, path);
        });
      }
    };
    transform(this.serialize(strategy));

    return items;
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
   * @param value A value to verify.
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
   * @param quiet Set to `true` to not throw on validation error.
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
   * @param quiet Set to `true` to not throw on error.
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
   * @param errors A list of error codes per path.
   */
  public applyErrors(errors: PropError[]): this {
    toArray(errors).forEach((error) => {
      const prop = this.getProp(...error.path);
      if (prop) {
        prop.setErrorCode(error.code);
      }
    });

    return this;
  }

  /**
   * Returns a list of all props with errors.
   */
  public collectErrors(): PropError[] {
    return this.flatten()
      .map(({ path, prop }) => ({ path, code: prop ? prop.getErrorCode() : null }))
      .filter(({ code }) => isNumber(code));
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
   * @param data Data for populating the new model.
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
