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

export function isValidMode(mode) {
  let keys = Object.keys(modes);

  for (let key of keys) {
    if (modes[key] === mode) return true;
  }
  return false;
}

/*
* A class for defining Document structure and properties.
*/

export class Schema {

  constructor({mode=modes.STRICT, fields={}, validator={}}) {
    if (!isValidMode(mode)) {
      throw new Error(`Unknown schema mode ${mode}`);
    }
    if (!isObject(fields)) {
      throw new Error(`Schema fields key should be an Object`);
    }
    if (!isObject(validator)) {
      throw new Error(`Schema validator key should be an Object`);
    }

    this.mode = mode; // document schema mode
    this.fields = fields; // document fields
    this.validator = validator; // document validator configuration options
  }

}
