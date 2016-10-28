import {isObject} from 'typeable';

/*
* A list of available Schema modes.
*/

export const modes = {
  RELAXED: 'relaxed',
  STRICT: 'strict'
};

/*
* Validates the `mode` value.
*/

export function isValidMode (mode) {
  let keys = Object.keys(modes);

  for (let key of keys) {
    if (modes[key] === mode) return true;
  }
  return false;
}

/*
* Validator default options.
*/

export const validatorDefaults = {
  errorBuilder: (validator, value, {message}) => ({validator, message})
};

/*
* A class for defining Document structure and properties.
*/

export class Schema {

  /*
  * Class constructor.
  */

  constructor ({fields={}, mode=modes.STRICT, validatorOptions={}, typeOptions={}}={}) {
    if (!isValidMode(mode)) {
      throw new Error(`Unknown schema mode ${mode}`);
    }
    if (!isObject(fields)) {
      throw new Error(`Schema fields key should be an Object`);
    }
    if (!isObject(validatorOptions)) {
      throw new Error(`Schema validatorOptions key should be an Object`);
    }
    if (!isObject(typeOptions)) {
      throw new Error(`Schema typeOptions key should be an Object`);
    }

    this.fields = fields; // document fields
    this.mode = mode; // document schema mode
    this.validatorOptions = Object.assign({}, validatorDefaults, validatorOptions); // options for validatable.js
    this.typeOptions = typeOptions; // options for typeable.js
  }

}
