import { normalize, realize, isDeepEqual, isUndefined, isPresent, toArray,
  isInstanceOf, isValue, isClassOf, isNumber } from '@rawmodel/utils';
import { Model } from './models';
import { PropConfig } from './types';
import { parse } from './parser';
import { validate } from './validator';
import { handle } from './handler';

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
  protected errorCode: number = null;
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

    this.initialValue = this.rawValue = isUndefined(this.$config.defaultValue)
      ? null
      : this.$config.defaultValue;
  }

  /**
   * Returns model reference.
   */
  public getModel() {
    return realize(this.$config.model);
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
    if (this.$config.parser) {
      value = this.parse(realize(value, this.getModel()), strategy);
    }
    if (this.$config.setter) {
      value = this.$config.setter.call(this.getModel(), realize(value, this.getModel()));
    }

    this.rawValue = value;
  }

  /**
   * Calculates the current value.
   */
  public getValue(): any {
    let value = realize(this.rawValue, this.getModel());

    if (this.$config.getter) {
      value = this.$config.getter.call(this.getModel(), value);
    }

    if (!isPresent(value) && !isUndefined(this.$config.emptyValue)) {
      value = realize(this.$config.emptyValue, this.getModel());
    }

    return isUndefined(value) ? null : value;
  }

  /**
   * Sets local error code.
   */
  public setErrorCode(code: number) {
    this.errorCode = code;
  }

  /**
   * Gets local error codes.
   */
  public getErrorCode() {
    return this.errorCode;
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
   * Returns `true` if the property is an array.
   */
  public isArray(): boolean {
    const { array } = this.$config.parser || {} as any;
    return array === true;
  }

  /**
   * Returns `true` if the property value can be set based on the strategy.
   * @param strategy Populatable strategy.
   */
  public isPopulatable(strategy?: string): boolean {
    return (
      isUndefined(strategy)
      || (this.$config.populatable || []).indexOf(strategy) !== -1
    );
  }

  /**
   * Returns `true` if the property value can be read based on the strategy.
   * @param strategy Serialization strategy.
   */
  public isSerializable(strategy?: string): boolean {
    return (
      isUndefined(strategy)
      || (this.$config.serializable || []).indexOf(strategy) !== -1
    );
  }

  /**
   * Returns true if the property value is an empty value.
   */
  public isEmpty() {
    return !isPresent(
      realize(this.rawValue, this.getModel())
    );
  }

  /**
   * Returns `true` if the value has been changed.
   */
  public isChanged(): boolean {
    const initialValue = realize(this.initialValue, this.getModel());

    let value = realize(this.rawValue, this.getModel());
    if (isInstanceOf(value, Prop) || isInstanceOf(value, Model)) {
      value = value.serialize();
    }

    return !isDeepEqual(
      normalize(initialValue),
      normalize(value)
    );
  }

  /**
   * Returns `true` when `data` deeply equals the current value.
   */
  public isEqual(data: any): boolean {

    let value = realize(data, this.getModel());
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
    if (isNumber(this.errorCode)) {
      return false;
    }
    return !(toArray(this.rawValue) || []) // nested models
      .filter((m) => isInstanceOf(m, Model))
      .some((m) => !m.isValid());
  }

  /**
   * Parses input value using RawModel parser.
   * @param value Arbitrary value.
   * @param strategy Population strategy (only for Model types).
   */
  protected parse(value: any, strategy?: string): any {
    const parser = (this.$config.parser || {}) as any;
    const recipe = {
      resolver: parser.resolver,
      array: parser.array || false,
    };
    const config = {
      context: this.getModel(),
    };

    if (isClassOf(recipe.resolver, Model)) {
      const Klass = (recipe.resolver as any);
      recipe.resolver = (data: any) => {
        if (isInstanceOf(data, Klass)) {
          return data; // keep instances for speed
        }
        else {
          return new Klass(null, {
            ...this.getModel().$config,
            parent: this.getModel(),
          }).populate(data, strategy);
        }
      };
    }

    return parse(value, recipe, config);
  }

  /**
   * Returns JSON serialized property value.
   */
  public serialize(strategy?: string): any {
    if (!this.isSerializable(strategy)) {
      return undefined;
    }

    const value = this.getValue();
    if (value && this.isArray()) {
      return value.map((m) => isInstanceOf(m, Model) ? m.serialize(strategy) : m);
    }
    else if (value) {
      return isInstanceOf(value, Model) ? value.serialize(strategy) : value;
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

    (toArray(this.rawValue) || [])
      .filter((doc) => isInstanceOf(doc, Model))
      .forEach((doc) => doc.commit());

    const value = this.rawValue; // same process as serialization
    if (!isValue(value)) {
      this.initialValue = null;
    }
    else if (this.isArray()) {
      this.initialValue = value.map((m) => isInstanceOf(m, Model) ? m.serialize() : normalize(m));
    }
    else {
      this.initialValue = isInstanceOf(value, Model) ? value.serialize() : normalize(value);
    }

    return this;
  }

  /**
   * Sets local property value to the initial value.
   */
  public rollback(): this {
    let value = this.initialValue;

    if (this.$config.parser) {
      value = this.parse(value);
    }

    this.rawValue = value;

    return this;
  }

  /**
   * Makes this property not settable.
   */
  public freeze(): this {

    (toArray(this.rawValue) || [])
      .filter((doc) => isInstanceOf(doc, Model))
      .forEach((doc) => doc.freeze());

    this.frozen = true;

    return this;
  }

  /**
   * Validates the property and sets errors codes.
   */
  public async validate(): Promise<this> {

    this.errorCode = await validate(
      this.getValue(),
      this.$config.validators,
      {
        context: this.getModel(),
      },
    );

    await Promise.all( // validate related models
      (toArray(this.rawValue) || [])
        .filter((doc) => isInstanceOf(doc, Model))
        .map((doc) => doc.validate({ quiet: true }))
    );

    return this;
  }

  /**
   * Handles property error and sets error codes.
   */
  public async handle(error: any): Promise<this> {

    this.errorCode = await handle(
      error,
      this.$config.handlers,
      {
        context: this.getModel(),
      },
    );

    await Promise.all( // handle related models
      (toArray(this.rawValue) || [])
        .filter((doc) => isInstanceOf(doc, Model))
        .map((doc) => doc.handle(error))
    ).catch(() => {}); // do not throw even when unhandled error

    return this;
  }

  /**
   * Clears errors.
   */
  public invalidate(): this {
    (toArray(this.rawValue) || []) // invalidate related models
      .filter((doc) => isInstanceOf(doc, Model))
      .forEach((doc) => doc.invalidate());

    this.errorCode = null;

    return this;
  }

}
