import {isObject} from 'typeable';

export const modes = {
  RELAXED: 'relaxed',
  STRICT: 'strict'
};

export function isValidMode(mode) {
  let keys = Object.keys(modes);

  for (let key of keys) {
    if (modes[key] === mode) return true;
  }
  return false;
}

export class Schema {

  constructor({mode=modes.RELAXED, fields={}, validator={}}) {
    if (!isValidMode(mode)) {
      throw new Error(`Unknown schema mode ${mode}`);
    }
    if (!isObject(fields)) {
      throw new Error(`Schema fields key should be an Object`);
    }
    if (!isObject(validator)) {
      throw new Error(`Schema validator key should be an Object`);
    }

    this.mode = mode;
    this.fields = fields;
    this.validator = validator;
  }

}
