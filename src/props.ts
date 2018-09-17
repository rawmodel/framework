import { Model, cast, CastConfig, CastHandler, Validator, ValidatorRecipe, Handler,
  HandlerRecipe, normalize, isDeepEqual, isUndefined, isPresent, toArray } from '.';

/**
 * Property error interface.
 */
export interface PropError {
  path: (string | number)[];
  errors: number[];
}

/**
 * Model property class configuration object.
 */
export interface PropRef {
  path: string[];
  prop: Prop;
}

/**
 * Model property class configuration object.
 */
export interface PropConfig<T = any> {
  set?: (v: any) => T;
  get?: (v: any) => T;
  cast?: CastConfig;
  defaultValue?: T | (() => T);
  fakeValue?: T | (() => T);
  emptyValue?: T | (() => T);
  validator?: Validator | (() => Validator);
  validate?: ValidatorRecipe[];
  handler?: Handler | (() => Handler);
  handle?: HandlerRecipe[];
  populatable?: string[];
  serializable?: string[];
  enumerable?: boolean;
  model?: Model;
}

/**
 * Property decorator for model.
 */
export function prop(config?: PropConfig) {
  return function(target: any, key: string) {

    let other = {};
    if (target.constructor.prototype && target.constructor.prototype.constructor) {
      other = { ...target.constructor.prototype.constructor.$props };
    }
    other[key] = { ...config };

    Object.defineProperty(target.constructor, '$props', {
      value: other,
      enumerable: true,
      configurable: true,
    });

  };
}

/**
 * Model property class.
 */
export class Prop<T = any> {
  protected rawValue: T | (() => T);
  protected initialValue: T | (() => T);
  protected errorCodes: number[] = [];
  readonly $config: PropConfig<T>;

  /**
   * Class constructor.
   * @param config Model prop configuration.
   */
  public constructor(config?: PropConfig<T>) {

    Object.defineProperty(this, '$config', {
      value: { ...config },
      enumerable: false,
    });

    this.setValue(this.$config.defaultValue);
    this.commit();
  }

  /**
   * Sets the current value.
   */
  public setValue(data: T | (() => T), strategy?: string) {
    if (!this.isPopulatable(strategy)) {
      return;
    }

    let value = isUndefined(data) ? null : data;
    
    if (this.$config.cast) {
      value = this.cast(value, strategy);
    }
    if (this.$config.set) {
      value = this.$config.set.call(this, value);
    }

    this.rawValue = value;
  }

  /**
   * Calculates the current value.
   */
  public getValue(): T {
    let value = typeof this.rawValue === 'function'
      ? this.rawValue.call(this)
      : this.rawValue;

    if (this.$config.get) {
      value = this.$config.get.call(this, value);
    }

    if (this.isEmpty()) {
      value = typeof this.$config.emptyValue === 'function'
        ? this.$config.emptyValue.call(this)
        : this.$config.emptyValue;
    }

    return isUndefined(value) ? null : value;
  }

  /**
   * Sets the current value.
   */
  public setErrorCodes(...codes: number[]) {
    this.errorCodes = this.errorCodes.concat(codes)
      .reduce((a, b) => a.indexOf(b) === -1 ? a.concat([b]) : a, []);
  }

  /**
   * Sets the current value.
   */
  public getErrorCodes() {
    return this.errorCodes;
  }

  /**
   * Returns raw property value.
   */
  public getRawValue() {
    return this.rawValue;
  }

  /**
   * Returns property value on last commit.
   */
  public getInitialValue() {
    return this.initialValue;
  }

  /**
   * Returns `true` if the property type represents a Model.
   */
  public isModel(): boolean {
    const { handler } = this.$config.cast || {} as any;
    return (
      isPresent(handler)
      && isPresent(handler.prototype)
      && (
        handler.prototype instanceof Model
        || handler.prototype.constructor === Model
      )
    );
  }

  /**
   * Returns `true` if the property is an array.
   */
  public isArray(): boolean {
    const { array } = this.$config.cast || {} as any;
    return array === true;
  }

  /**
   * Returns `true` if the property value can be set based on the strategy.
   * @param strategy Populatable strategy.
   */
  public isPopulatable(strategy?: string): boolean {
    return (
      typeof strategy === 'undefined'
      || (this.$config.populatable || []).indexOf(strategy) !== -1
    );
  }

  /**
   * Returns `true` if the property value can be read based on the strategy.
   * @param strategy Serialization strategy.
   */
  public isSerializable(strategy?: string): boolean {
    return (
      typeof strategy === 'undefined'
      || (this.$config.serializable || []).indexOf(strategy) !== -1
    );
  }

  /**
   * Returns true if the property value is an empty value.
   */
  public isEmpty() {
    const value = typeof this.rawValue === 'function'
      ? this.rawValue.call(this)
      : this.rawValue;

    return !isPresent(value);
  }

  /**
   * Returns `true` if the value has been changed.
   */
  public isChanged(): boolean {
    return this.initialValue !== this.rawValue;
  }

  /**
   * Returns `true` when `data` isEqual to the current value.
   */
  public isEqual(data: any): boolean {
    if (typeof data === 'function') {
      return this.rawValue === data;
    }
    return isDeepEqual(
      normalize(this.getValue()),
      normalize(data instanceof Prop ? data.getValue() : data)
    );
  }

  /**
   * Returns `true` when the value is valid.
   */
  public isValid(): boolean {
    if (this.getErrorCodes().length !== 0) {
      return false;
    }
    if (this.isModel()) {}


    // ISVALID, getERRORS NE GLEDA DEEPLKY!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  }

  /**
   * Converts the provided value to the property type.
   */
  protected cast(value: any, strategy?: string): any {
    let { handler, array } = this.$config.cast || {} as any;

    if (this.isModel()) {
      const Klass = (handler as typeof Model);
      handler = (data: any) => {
        if (data instanceof Klass) {
          return data; // keep instances
        } else {
          const instance = new Klass(null, this.$config.model.$config);
          instance.$config.parent = this.$config.model;
          return instance.populate(data, strategy).commit();
        }
      };
    }

    return cast(value, handler as CastHandler, array);
  }

  /**
   * Serializes the provided property value.
   */
  public serialize(strategy?: string): any {
    if (!this.isSerializable(strategy)) {
      return null;
    }

    const value = this.getValue() as any;
    if (!value) {
      return null;
    }

    if (this.isModel()) {
      if (this.isArray()) {
        return value.map((m) => m ? m.serialize() : null);
      }
      else {
        return value.serialize();
      }
    } else {
      return normalize(value);
    }
  }
  
  /**
   * Sets property value to the default value.
   */
  public reset(): this {
    this.setValue(this.$config.defaultValue);

    return this;
  }

  /**
   * Sets property value to the fake value.
   */
  public fake(): this {
    this.setValue(this.$config.fakeValue);

    (toArray(this.rawValue) || []) // related fake values
      .filter((doc) => doc instanceof Model)
      .map((doc) => doc.fake());

    return this;
  }

  /**
   * Sets property value to empty value.
   */
  public empty(): this {
    this.setValue(null);

    return this;
  }

  /**
   * Saves the property value to initial value.
   */
  public commit(): this {
    this.initialValue = this.rawValue;

    return this;
  }

  /**
   * Sets property value to the initial value.
   */
  public rollback(): this {
    this.rawValue = this.initialValue; // normalize and keep functions

    return this;
  }

  /**
   * Validates the property and saves the error on the class itself.
   */
  public async validate(): Promise<this> {

    const validator = typeof this.$config.validator === 'function'
      ? this.$config.validator.call(this)
      : this.$config.validator;
    this.errorCodes = await validator.validate(
      this.getValue(),
      this.$config.validate
    );

    return this;
  }

  /**
   * Handles property error and saves the error on the class itself .
   */
  public async handle(error: any): Promise<this> {

    const handler = typeof this.$config.handler === 'function'
      ? this.$config.handler.call(this)
      : this.$config.handler;
    this.errorCodes = await handler.handle(
      error,
      this.$config.handle
    );

    return this;
  }

  /**
   * Clears errors.
   */
  public invalidate(): this {
    this.errorCodes = [];

    return this;
  }

}
