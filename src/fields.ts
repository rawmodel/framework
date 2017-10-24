import {isFunction, isUndefined, isPresent, isArray, toArray, isValue, cast} from 'typeable';
import {serialize, isEqual, merge} from './utils';
import {Validator, ValidatorRecipe} from 'validatable';
import {Handler, HandlerRecipe} from 'handleable';
import {Model} from './models';

/*
* Field definition interface.
*/

export interface FieldRecipe {
  type?: any;
  get?: (v: any) => any;
  set?: (v: any) => void;
  defaultValue?: any;
  fakeValue?: any;
  validate?: ValidatorRecipe[];
  handle?: HandlerRecipe[];
  validators?: {[name: string]: (v?: any, r?: ValidatorRecipe) => boolean | Promise<boolean>};
  handlers?: {[name: string]: (v?: any, r?: HandlerRecipe) => boolean | Promise<boolean>};
  owner?: Model;
  failFast?: boolean;
  serializable?: string[];
  enumerable?: boolean;
}

/*
* Field error interface.
*/

export interface FieldError {
  message?: string;
  code?: number;
  [key: string]: any;
}

/*
* Field class.
*/

export class Field {
  protected _data: any;
  protected _initialData: any;
  protected _validator: Validator;
  protected _handler: Handler;
  protected _recipe: FieldRecipe;
  readonly defaultValue: any;
  readonly fakeValue: any;
  readonly initialValue: any;
  readonly serializable: string[];
  readonly enumerable: boolean;
  readonly owner: Model;
  readonly type: any;
  public value: any;
  public errors: FieldError[];

  /*
  * Class constructor.
  */

  public constructor (recipe?: FieldRecipe) {
    if (!recipe) {
      recipe = {};
    }

    this.errors = [];

    Object.defineProperty(this, '_recipe', {
      value: Object.freeze(recipe || {})
    });

    Object.defineProperty(this, '_data', { // current value
      value: this._getDefaultValue(),
      writable: true
    });
    Object.defineProperty(this, '_initialData', { // last commited value
      value: this._getDefaultValue(),
      writable: true
    });
    Object.defineProperty(this, '_validator', { // validatable.js instance
      value: this._createValidator()
    });
    Object.defineProperty(this, '_handler', { // handleable.js instance
      value: this._createHandler()
    });

    Object.defineProperty(this, 'value', {
      get: () => this._getValue(),
      set: (v) => this._setValue(v),
      enumerable: true
    });
    Object.defineProperty(this, 'defaultValue', {
      get: () => this._getDefaultValue(),
      enumerable: true
    });
    Object.defineProperty(this, 'fakeValue', {
      get: () => this._getFakeValue(),
      enumerable: true
    });
    Object.defineProperty(this, 'initialValue', {
      get: () => this._initialData,
      enumerable: true
    });

    Object.defineProperty(this, 'serializable', {
      get: () => !isArray(this._recipe.serializable) ? [] : this._recipe.serializable,
      enumerable: true
    });
    Object.defineProperty(this, 'enumerable', {
      get: () => isUndefined(this._recipe.enumerable) ? true : !!this._recipe.enumerable,
      enumerable: true
    });
    Object.defineProperty(this, 'type', {
      get: () => this._recipe.type || null,
      enumerable: true
    });
    Object.defineProperty(this, 'owner', {
      get: () => this._recipe.owner || null,
      enumerable: true
    });
  }

  /*
  * Returns a new validator instance.
  */

  protected _createValidator () {
    let {validators, failFast} = this._recipe;
    let context = this;

    return new Validator({validators, failFast, context});
  }

  /*
  * Returns a new handler instance.
  */

  protected _createHandler () {
    let {handlers, failFast} = this._recipe;
    let context = this;

    return new Handler({handlers, failFast, context});
  }

  /*
  * Returns current field value.
  */

  protected _getValue () {
    let data = this._data;

    let {get} = this._recipe;
    if (isFunction(get)) {
      data = get.call(this, data);
    }

    return data;
  }

  /*
  * Sets current field value.
  */

  protected _setValue (data: any) {
    if (isFunction(data)) {
      data = data.call(this);
    }

    let {set} = this._recipe;
    if (isFunction(set)) {
      data = set.call(this, data);
    }

    data = this._cast(data, this.type);

    this._data = data;
  }

  /*
  * Converts a `value` into specified `type`.
  */

  protected _cast (data: any, type: any) {
    let converter = type;

    if (!isValue(data)) {
      return null;
    }

    if (this.isNested()) {
      let Klass = isArray(type) ? type[0] : type;
      let toModel = (d) => new Klass(
        merge({}, d, {parent: this.owner})
      );
      converter = isArray(type) ? [toModel] : toModel;
    }

    return cast(data, converter);
  }

  /*
  * Returns the default value of a field.
  */

  protected _getDefaultValue () {
    let data = null;

    let {defaultValue} = this._recipe;
    if (isFunction(defaultValue)) {
      data = defaultValue.call(this);
    }
    else if (!isUndefined(defaultValue)) {
      data = defaultValue;
    }

    return data;
  }

  /*
  * Returns the fake value of a field.
  */

  protected _getFakeValue () {
    let data = null;

    let {fakeValue} = this._recipe;
    if (isFunction(fakeValue)) {
      data = fakeValue.call(this);
    }
    else if (!isUndefined(fakeValue)) {
      data = fakeValue;
    }

    return data;
  }

  /*
  * Sets data to the default value.
  */

  public reset (): this {
    this.value = this._getDefaultValue();

    return this;
  }

  /*
  * Resets the value then sets data to the fake value.
  */

  public fake (): this {
    this.reset();

    if (this.fakeValue) {
      this.value = this.fakeValue;
    }

    (toArray(this.value) || []) // related fake values
      .filter((doc) => doc instanceof Model)
      .map((doc) => doc.fake());

    return this;
  }

  /*
  * Sets data to `null`.
  */

  public clear (): this {
    this.value = null;

    return this;
  }

  /*
  * Set's the initial value to the current value.
  */

  public commit (): this {
    if (isValue(this.value)) {
      toArray(this.value)
        .filter((v) => v && v.commit)
        .forEach((v) => v.commit());
    }

    this._initialData = serialize(this.value);

    return this;
  }

  /*
  * Sets value to the initial value.
  */

  public rollback (): this {
    this.value = this.initialValue;

    return this;
  }

  /*
  * Returns `true` when `data` equals to the current value.
  */

  public equals (data: any): boolean {
    let value = data instanceof Field ? data.value : data;

    return isEqual(
      serialize(this.value),
      serialize(value)
    );
  }

  /*
  * Returns `true` if the value has been changed.
  */

  public isChanged (): boolean {
    return !this.equals(this.initialValue);
  }

  /*
  * Returns `true` if the data is a Model.
  */

  public isNested (): boolean {
    let type = this.type;
    if (isArray(type)) type = type[0];

    return (
      isPresent(type)
      && isPresent(type.prototype)
      && (
        type.prototype instanceof Model
        || type.prototype.constructor === Model
      )
    );
  }

  /*
  * Validates the field by populating the `errors` property.
  *
  * IMPORTANT: Array null values for nested objects are not treated as an object
  * but as an empty item thus isValid() for [null] succeeds.
  */

  public async validate (): Promise<this> {
    await Promise.all( // validate related models
      (toArray(this.value) || [])
        .filter((doc) => doc instanceof Model)
        .map((doc) => doc.validate({quiet: true}))
    );

    this.errors = await this._validator.validate(
      this.value,
      this._recipe.validate
    );

    return this;
  }

  /*
  * Handles the field by populating the `errors` property.
  *
  * IMPORTANT: Array null values for nested objects are not treated as an object
  * but as an empty item thus isValid() for [null] succeeds.
  */

  public async handle (error: any): Promise<this> {
    await Promise.all( // handle related models
      (toArray(this.value) || [])
        .filter((doc) => doc instanceof Model)
        .map((doc) => doc.handle(error))
    ).catch(() => {}); // do not throw even when unhandled error

    this.errors = await this._handler.handle(
      error,
      this._recipe.handle
    );

    return this;
  }

  /*
  * Clears errors.
  */

  public invalidate (): this {
    (toArray(this.value) || []) // invalidate related models
      .filter((doc) => doc instanceof Model)
      .forEach((doc) => doc.invalidate());

    this.errors = [];

    return this;
  }

  /*
  * Returns `true` when errors exist (inverse of `isValid`).
  */

  public hasErrors (): boolean {
    if (this.errors.length > 0) {
      return true;
    }
    else if (!this.isNested()) {
      return false;
    }
    else if (isPresent(this.value)) {
      return toArray(this.value)
        .filter((f) => !!f)
        .some((f) => f.hasErrors());
    }
    return false;
  }

  /*
  * Returns `true` when the value is valid (inverse of `hasErrors`).
  */

  public isValid (): boolean {
    return !this.hasErrors();
  }

}
