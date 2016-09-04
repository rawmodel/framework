import {
  cast,
  isObject,
  isArray,
  isFunction
} from 'typeable';

import {Schema} from './schema';

import {
  objectFields,
  objectCloning
} from './structure';

import {
  objectSerialization
} from './serialization';

@objectFields
@objectCloning
@objectSerialization
export class Document {

  constructor(schema, data={}) {
    if (!(schema instanceof Schema)) {
      throw new Error(`${this.constructor.name} expects schema to be an instance of Schema class`);
    }

    Object.defineProperty(this, '_schema', {
      get: () => schema,
      enumerable: false // do not expose as object key
    });

    this.purge();
    this.define();
    this.populate(data);
  }

  // isValid() {
  //   let names = Object.keys(this);
  //
  //   for (let name of names) {
  //     if (!this.isValidField(name)) return false;
  //   }
  //   return true;
  // }
  //
  // isValidField(name) {
  //
  // }

}
