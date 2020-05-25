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
      other = { ...target.constructor.prototype.constructor.__props };
    }
    other[key] = { ...config };

    Object.defineProperty(target.constructor, '__props', {
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
  public readonly __config: PropConfig;
  protected _rawValue: any | (() => any);
  protected _initialValue: any | (() => any);
  protected _errorCode: number = null;
  protected _frozen = false;

  /**
   * Class constructor.
   * @param config Model prop configuration.
   */
  public constructor(config?: PropConfig) {

    Object.defineProperty(this, '__config', {
      value: { ...config },
      enumerable: false,
    });

    this._initialValue = this._rawValue = isUndefined(this.__config.defaultValue)
      ? null
      : this.__config.defaultValue;
  }

  /**
   * Returns model reference.
   */
  public getModel() {
    return realize(this.__config.model);
  }

  /**
   * Sets the current value.
   */
  public setValue(data: any | (() => any), strategy?: string) {
    if (this._frozen) {
      const error = new Error('Mutation of _frozen property failed');
      error['code'] = 500;
      throw error;
    }
    if (!this.isPopulatable(strategy)) {
      return;
    }

    let value = isUndefined(data) ? null : data;
    if (this.__config.parser) {
      value = this.parse(realize(value, this.getModel()), strategy);
    }
    if (this.__config.setter) {
      value = this.__config.setter.call(this.getModel(), realize(value, this.getModel()));
    }

    this._rawValue = value;
  }

  /**
   * Calculates the current value.
   */
  public getValue(): any {
    let value = realize(this._rawValue, this.getModel());

    if (this.__config.getter) {
      value = this.__config.getter.call(this.getModel(), value);
    }

    if (!isPresent(value) && !isUndefined(this.__config.emptyValue)) {
      value = realize(this.__config.emptyValue, this.getModel());
    }

    return isUndefined(value) ? null : value;
  }

  /**
   * Sets local error code.
   */
  public setErrorCode(code: number) {
    this._errorCode = code;
  }

  /**
   * Gets local error codes.
   */
  public getErrorCode() {
    return this._errorCode;
  }

  /**
   * Returns raw property value.
   */
  public getRawValue() {
    return this._rawValue;
  }

  /**
   * Returns property value on last commit.
   */
  public getInitialValue() {
    return this._initialValue;
  }

  /**
   * Returns `true` if the property is an array.
   */
  public isArray(): boolean {
    const { array } = this.__config.parser || {} as any;
    return array === true;
  }

  /**
   * Returns `true` if the property value can be set based on the strategy.
   * @param strategy Populatable strategy.
   */
  public isPopulatable(strategy?: string): boolean {
    return (
      this.__config.enumerable !== false
      && (
        isUndefined(strategy)
        || (this.__config.populatable || []).indexOf(strategy) !== -1
      )
    );
  }

  /**
   * Returns `true` if the property value can be read based on the strategy.
   * @param strategy Serialization strategy.
   */
  public isSerializable(strategy?: string): boolean {
    return (
      this.__config.enumerable !== false
      && (
        isUndefined(strategy)
        || (this.__config.serializable || []).indexOf(strategy) !== -1
      )
    );
  }

  /**
   * Returns true if the property value is an empty value.
   */
  public isEmpty() {
    return !isPresent(
      realize(this._rawValue, this.getModel())
    );
  }

  /**
   * Returns `true` if the value has been changed.
   */
  public isChanged(): boolean {
    const _initialValue = realize(this._initialValue, this.getModel());

    let value = realize(this._rawValue, this.getModel());
    if (isInstanceOf(value, Prop) || isInstanceOf(value, Model)) {
      value = value.serialize();
    }

    return !isDeepEqual(
      normalize(_initialValue),
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
    if (isNumber(this._errorCode)) {
      return false;
    }
    return !(toArray(this._rawValue) || []) // nested models
      .filter((m) => isInstanceOf(m, Model))
      .some((m) => !m.isValid());
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
    } else if (value) {
      return isInstanceOf(value, Model) ? value.serialize(strategy) : value;
    } else {
      return normalize(value);
    }
  }

  /**
   * Sets property value to the default value.
   */
  public reset(): this {
    this.setValue(this.__config.defaultValue);

    return this;
  }

  /**
   * Deeply sets property value to the fake value.
   */
  public fake(): this {

    this.setValue(this.__config.fakeValue);

    (toArray(this._rawValue) || []) // related fake values
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

    (toArray(this._rawValue) || [])
      .filter((doc) => isInstanceOf(doc, Model))
      .forEach((doc) => doc.commit());

    const value = this._rawValue; // same process as serialization
    if (!isValue(value)) {
      this._initialValue = null;
    } else if (this.isArray()) {
      this._initialValue = value.map((m) => isInstanceOf(m, Model) ? m.serialize() : normalize(m));
    } else {
      this._initialValue = isInstanceOf(value, Model) ? value.serialize() : normalize(value);
    }

    return this;
  }

  /**
   * Sets local property value to the initial value.
   */
  public rollback(): this {
    let value = this._initialValue;

    if (this.__config.parser) {
      value = this.parse(value);
    }

    this._rawValue = value;

    return this;
  }

  /**
   * Makes this property not settable.
   */
  public freeze(): this {

    (toArray(this._rawValue) || [])
      .filter((doc) => isInstanceOf(doc, Model))
      .forEach((doc) => doc.freeze());

    this._frozen = true;

    return this;
  }

  /**
   * Validates the property and sets errors codes.
   */
  public async validate(): Promise<this> {

    this._errorCode = await validate(
      this.getValue(),
      this.__config.validators,
      {
        context: this.getModel(),
      },
    );

    if (!isNumber(this._errorCode)) {
      await Promise.all( // validate related models
        (toArray(this._rawValue) || [])
          .filter((doc) => isInstanceOf(doc, Model))
          .map((doc) => doc.validate({ quiet: true }))
      );
    }

    return this;
  }

  /**
   * Handles property error and sets error codes.
   */
  public async handle(error: any): Promise<this> {

    this._errorCode = await handle(
      error,
      this.__config.handlers,
      {
        context: this.getModel(),
      },
    );

    if (!isNumber(this._errorCode)) {
      await Promise.all( // handle related models
        (toArray(this._rawValue) || [])
          .filter((doc) => isInstanceOf(doc, Model))
          .map((doc) => doc.handle(error))
      ).catch(); // do not throw even when unhandled error
    }

    return this;
  }

  /**
   * Clears errors.
   */
  public invalidate(): this {
    (toArray(this._rawValue) || []) // invalidate related models
      .filter((doc) => isInstanceOf(doc, Model))
      .forEach((doc) => doc.invalidate());

    this._errorCode = null;

    return this;
  }

  /**
   * Parses input value using RawModel parser.
   * @param value Arbitrary value.
   * @param strategy Population strategy (only for Model types).
   */
  protected parse(value: any, strategy?: string): any {
    const parser = (this.__config.parser || {}) as any;
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
        } else {
          return new Klass(null, {
            ...this.getModel().__config,
            parent: this.getModel(),
          }).populate(data, strategy);
        }
      };
    }

    return parse(value, recipe, config);
  }

}
