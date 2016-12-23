import {isFunction, isUndefined, isArray, cast} from 'typeable';
import {serialize, isEqual} from './utils';
import {Validator, ValidatorRecipe} from 'validatable';

/*
* Field context definition interface.
*/

export interface FieldOptions {
  // owner: any;
  validators?: {[name: string]: () => boolean | Promise<boolean>};
  firstErrorOnly?: boolean;
}

/*
* Field validation definition interface.
*/

export interface ValidationRecipe {
  validator: string;
  message: string;
  [key: string]: any;
}

/*
* Field definition interface.
*/

export interface FieldRecipe {
  type?: any;
  get?: (v: any) => any;
  set?: (v: any) => void;
  defaultValue?: any;
  fakeValue?: any;
  validate?: ValidationRecipe[];
}

/*
* Field error interface.
*/

export interface FieldError {
  message: string;
  [key: string]: any;  
}

/*
* Field class.
*/

export class Field {
  protected _data: any;
  protected _initialData: any;
  protected _validator: Validator;
  readonly recipe: FieldRecipe;
  readonly options: FieldOptions;
  readonly defaultValue: any;
  readonly fakeValue: any;
  readonly initialValue: any;
  public value: any;
  public errors: FieldError[];

  /*
  * Class constructor.
  */

  constructor (recipe: FieldRecipe = {}, options: FieldOptions = {}) {
    this.recipe = Object.freeze(recipe);
    this.options = Object.freeze(options);
    this.errors = [];

    Object.defineProperty(this, '_data', { // current value
      value: this._getDefaultValue.bind(this),
      writable: true
    });
    Object.defineProperty(this, '_initialData', { // last commited value
      value: this._getDefaultValue(),
      writable: true
    });
    Object.defineProperty(this, '_validator', { // validatable.js instance
      value: this._createValidator()
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
  }

/*
  * Returns a new instance of validator.
  */

  _createValidator () {
    let {validators, firstErrorOnly} = this.options;
    let context = this;

    return new Validator({validators, firstErrorOnly, context});
  }

  /*
  * Returns current field value.
  */

  _getValue () {
    let data = this._data;
    if (isFunction(data)) {
      data = data.call(this);
    }
    
    let {get} = this.recipe;
    if (isFunction(get)) {
      data = get.call(this, data);
    }

    let {type} = this.recipe;
    data = this._cast(data, type);

    return data;
  }

  /*
  * Sets current field value.
  */

  _setValue (data) {
    let {set} = this.recipe;
    if (isFunction(set)) {
      data = set.call(this, data);
    }

    this.invalidate();

    this._data = data;
  }

  /*
  * Converts a `value` into specified `type`.
  */

  _cast (data, type) {
    if (isUndefined(type)) {
      return data;
    }
    return cast(data, type);
  }  

  /*
  * Returns the default value of a field.
  */

  _getDefaultValue () {
    let data = null;
    
    let {defaultValue} = this.recipe;
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

  _getFakeValue () {
    let data = null;
    
    let {fakeValue} = this.recipe;
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

  reset (): this {
    this.value = this._getDefaultValue.bind(this);

    return this;
  }

  /*
  * Sets data to the fake value.
  */

  fake (): this {
    this.value = this._getFakeValue.bind(this);

    return this;
  }

  /*
  * Sets data to `null`.
  */

  clear (): this {
    this.value = null;

    return this;
  }

  /*
  * Set's the initial value to the current value.
  */

  commit (): this {
    // this._commitRelated(this.value);
    this._initialData = serialize(this.value);

    return this;
  }

  /*
  * Sets value to the initial value.
  */

  rollback (): this {
    this.value = this.initialValue;

    return this;
  }

  /*
  * Returns `true` when `data` equals to the current value.
  */

  equals (data): boolean {
    let value = data instanceof Field ? data.value : data;

    return isEqual(
      serialize(this.value),
      serialize(value)
    );
  }

  /*
  * Returns `true` if the value has been changed.
  */

  isChanged (): boolean {
    return !this.equals(this.initialValue);
  }

  /*
  * Returns `true` if the data is a Document.
  */

  isNested (): boolean {
    let {type} = this.recipe;
    if (isArray(type)) type = type[0];

    // TODO !!!!!
    // if (type instanceof this.constructor.owner) {
    //   return true;
    // }
    return false;
  }

  /*
  * Validates the field by populating the `errors` property.
  *
  * IMPORTANT: Array null values for nested objects are not treated as an object
  * but as an empty item thus isValid() for [null] succeeds.
  */

  async validate (): Promise<this> {
    // let relatives = toArray(this.value) || []; // validate related documents
    // for (let relative of relatives) {
    //   let isDocument = relative instanceof this.$owner.constructor;

    //   if (isDocument) {
    //     await relative.validate({quiet: true}); // don't throw
    //   }
    // }

    this.errors = await this._validator.validate(
      this.value,
      this.recipe.validate
    );

    return this;
  }

  /*
  * Clears errors.
  */

  invalidate (): this {
    // let relatives = toArray(this.value) || []; // validate related documents
    // for (let relative of relatives) {
    //   let isDocument = relative instanceof this.$owner.constructor;

    //   if (isDocument) {
    //     relative.invalidate();
    //   }
    // }

    this.errors = [];

    return this;
  }

  /*
  * Returns `true` when errors exist (inverse of `isValid`).
  */

  hasErrors (): boolean {
    if (this.errors.length > 0) {
      return true;
    }
    else if (!this.isNested()) {
      return false;
    }
    // else {
    //   return toArray(this.value).filter((f) => !!f).some((f) => f.hasErrors())
    // }
  }

  /*
  * Returns `true` when the value is valid (inverse of `hasErrors`).
  */

  isValid (): boolean {
    return !this.hasErrors();
  }
  
}
