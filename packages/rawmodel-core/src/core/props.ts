import { Validator, ValidatorRecipe } from '@rawmodel/validator';
import { Handler, HandlerRecipe } from '@rawmodel/handler';
import { normalize, realize, isDeepEqual, isClassOf, isUndefined, isPresent,
  toArray, isInstanceOf } from '@rawmodel/utils';
import { CastConfig, CastHandler, cast } from '@rawmodel/parser';
import { Model } from './models';

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
export interface PropCast extends CastConfig {
  handler?: CastHandler | any;
}

/**
 * Model property class configuration object.
 */
export interface PropConfig {
  set?: (v: any) => any;
  get?: (v: any) => any;
  cast?: PropCast;
  defaultValue?: any | (() => any);
  fakeValue?: any | (() => any);
  emptyValue?: any | (() => any);
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
      enumerable: false,
      configurable: true,
    });

  };
}

/**
 * Model property class.
 */
export class Prop {
  protected rawValue: any | (() => any);
  protected initialValue: any | (() => any);
  protected errorCodes: number[] = [];
  protected frozen: boolean = false;
  readonly $config: PropConfig;

  /**
   * Class constructor.
   * @param config Model prop configuration.
   */
  public constructor(config?: PropConfig) {

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
  public setValue(data: any | (() => any), strategy?: string) {
    if (this.frozen) {
      const error = new Error('Mutation of frozen property failed');
      error['code'] = 500;
      throw error;
    }
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
  public getValue(): any {
    let value = realize(this.rawValue, this);

    if (this.$config.get) {
      value = this.$config.get.call(this, value);
    }

    if (this.isEmpty()) {
      value = realize(this.$config.emptyValue, this);
    }

    return isUndefined(value) ? null : value;
  }

  /**
   * Sets local error codes.
   */
  public setErrorCodes(...codes: number[]) {
    this.errorCodes = codes;
  }

  /**
   * Gets local error codes.
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
    return isClassOf(handler, Model);
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
    return !isPresent(
      realize(this.rawValue, this)
    );
  }

  /**
   * Returns `true` if the value has been changed.
   */
  public isChanged(): boolean {

    let initialValue = realize(this.initialValue);
    let rawValue = realize(this.rawValue);
    if (this.isModel()) {
      initialValue = isInstanceOf(initialValue, Model) ? initialValue.serialize() : initialValue;
      rawValue = isInstanceOf(rawValue, Model) ? rawValue.serialize() : rawValue;
    }

    return !isDeepEqual(
      normalize(initialValue),
      normalize(rawValue)
    );
  }

  /**
   * Returns `true` when `data` deeply equals the current value.
   */
  public isEqual(data: any): boolean {

    let value = realize(data);
    if (isInstanceOf(value, Prop) || isInstanceOf(value, Model)) {
      value = value.serialize();
    }

    return isDeepEqual(
      normalize(this.getValue()),
      normalize(value)
    );
  }

  /**
   * Returns `true` when the value and possible nested models have no errors.
   */
  public isValid(): boolean {
    if (this.getErrorCodes().length > 0) {
      return false;
    }
    if (this.isModel()) {
      return !(toArray(this.rawValue) || []) // nested models
        .filter((m) => isInstanceOf(m, Model))
        .some((m) => !m.isValid());
    }
    return true;
  }

  /**
   * Converts the provided value to the property type.
   */
  protected cast(value: any, strategy?: string): any {
    const config = { ...this.$config.cast };

    if (this.isModel()) {
      const Klass = (config.handler as any);
      config.handler = (data: any) => {
        if (isInstanceOf(data, Klass)) {
          return data; // keep instances for speed
        }
        else {
          return new Klass(null, {
            parent: this.$config.model,
            ...this.$config.model.$config
          }).populate(data, strategy);
        }
      };
    }

    return cast(value, config.handler as CastHandler, config.array);
  }

  /**
   * Returns JSON serialized property value.
   */
  public serialize(strategy?: string): any {
    if (!this.isSerializable(strategy)) {
      return undefined;
    }

    const value = this.getValue();
    if (!value) {
      return null;
    }
    else if (this.isModel()) {
      if (this.isArray()) {
        return value.map((m) => m ? m.serialize(strategy) : null);
      }
      else {
        return value.serialize(strategy);
      }
    }
    else {
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
   * Deeply sets property value to the fake value.
   */
  public fake(): this {

    this.setValue(this.$config.fakeValue);

    (toArray(this.rawValue) || []) // related fake values
      .filter((doc) => isInstanceOf(doc, Model))
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
   * Saves the local property value to initial value.
   */
  public commit(): this {

    if (this.isModel()) {
      (toArray(this.rawValue) || [])
        .filter((doc) => isInstanceOf(doc, Model))
        .forEach((doc) => doc.commit());
    }

    const value = this.rawValue; // same process as serialization
    if (!value) {
      this.initialValue = null;
    }
    else if (this.isModel()) {
      if (this.isArray()) {
        this.initialValue = value.map((m) => m ? m.serialize() : null);
      }
      else {
        this.initialValue = value.serialize();
      }
    }
    else {
      this.initialValue = normalize(value);
    }

    return this;
  }

  /**
   * Sets local property value to the initial value.
   */
  public rollback(): this {
    let value = this.initialValue;

    if (this.$config.cast) {
      value = this.cast(value);
    }

    this.rawValue = value;

    return this;
  }

  /**
   * Makes this property not settable.
   */
  public freeze(): this {

    if (this.isModel()) {
      (toArray(this.rawValue) || [])
        .filter((doc) => isInstanceOf(doc, Model))
        .forEach((doc) => doc.freeze());
    }

    this.frozen = true;

    return this;
  }

  /**
   * Validates the property and sets errors codes.
   */
  public async validate(): Promise<this> {

    await Promise.all( // validate related models
      (toArray(this.rawValue) || [])
        .filter((doc) => isInstanceOf(doc, Model))
        .map((doc) => doc.validate({ quiet: true }))
    );

    const validator = realize(this.$config.validator, this) as Validator;
    this.errorCodes = await validator.validate(
      this.getValue(),
      this.$config.validate
    );

    return this;
  }

  /**
   * Handles property error and sets error codes.
   */
  public async handle(error: any): Promise<this> {

    await Promise.all( // handle related models
      (toArray(this.rawValue) || [])
        .filter((doc) => isInstanceOf(doc, Model))
        .map((doc) => doc.handle(error))
    ).catch(() => {}); // do not throw even when unhandled error

    const handler = realize(this.$config.handler, this) as Handler;
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
    (toArray(this.rawValue) || []) // invalidate related models
      .filter((doc) => isInstanceOf(doc, Model))
      .forEach((doc) => doc.invalidate());

    this.errorCodes = [];

    return this;
  }

}
