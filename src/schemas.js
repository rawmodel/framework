import {isBoolean} from 'typeable';
import {
  retrieve,
  merge
} from './utils';

/*
* A class for defining Document structure and properties.
*/

export class Schema {

  /*
  * Class constructor.
  */

  constructor ({
    mixins = [], // not a property
    fields = {},
    strict,
    validatorOptions = {},
    typeOptions = {}
  } = {}) {

    Object.defineProperty(this, 'fields', { // document fields
      get: () => merge(
        ...mixins.map((s) => retrieve(s.fields)),
        retrieve(fields)
      ),
      enumerable: true // required for deep nesting
    });

    Object.defineProperty(this, 'strict', { // document schema mode
      get: () => (
        [true].concat(mixins.map((s) => s.strict), strict).filter((s) => isBoolean(s)).reverse()[0]
      ),
      enumerable: true // required for deep nesting
    });

    Object.defineProperty(this, 'validatorOptions', { // options for validatable.js
      get: () => merge(
        ...mixins.map((v) => v.validatorOptions),
        validatorOptions
      ),
      enumerable: true // required for deep nesting
    });

    Object.defineProperty(this, 'typeOptions', { // options for typeable.js
      get: () => merge(
        ...mixins.map((v) => v.typeOptions),
        typeOptions
      ),
      enumerable: true // required for deep nesting
    });
  }

}
