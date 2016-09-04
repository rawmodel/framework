import {
  cast,
  isObject,
  isArray,
  isFunction
} from 'typeable';

import {Schema} from './schema';

import {
  injectFieldsUtils,
  injectCloningUtils
} from './structure';
import {injectObjectSerializationUtils} from './serialization';
import {injectValidationUtils} from './validation';

@injectFieldsUtils
@injectCloningUtils
@injectObjectSerializationUtils
@injectValidationUtils
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

}
