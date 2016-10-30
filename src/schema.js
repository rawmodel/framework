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

  constructor ({fields={}, strict=true, validatorOptions={}, typeOptions={}}={}) {
    Object.defineProperty(this, 'fields', { // document fields
      get: () => typeof fields === 'function' ? fields() : fields,
    });
    Object.defineProperty(this, 'strict', { // document schema mode
      value: strict
    });
    Object.defineProperty(this, 'validatorOptions', { // options for validatable.js
      value: Object.assign({}, validatorDefaults, validatorOptions)
    });
    Object.defineProperty(this, 'typeOptions', { // options for typeable.js
      value: typeOptions
    });
  }

}
