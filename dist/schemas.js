'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
* A class for defining Document structure and properties.
*/

class Schema {

  /*
  * Class constructor.
  */

  constructor() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    let name = _ref.name;
    var _ref$fakes = _ref.fakes;
    let fakes = _ref$fakes === undefined ? {} : _ref$fakes;
    var _ref$fields = _ref.fields;
    let fields = _ref$fields === undefined ? {} : _ref$fields;
    var _ref$strict = _ref.strict;
    let strict = _ref$strict === undefined ? true : _ref$strict;
    var _ref$validatorOptions = _ref.validatorOptions;
    let validatorOptions = _ref$validatorOptions === undefined ? {} : _ref$validatorOptions;
    var _ref$typeOptions = _ref.typeOptions;
    let typeOptions = _ref$typeOptions === undefined ? {} : _ref$typeOptions;

    Object.defineProperty(this, 'name', { // document name
      value: name
    });

    Object.defineProperty(this, 'fakes', { // document fakes registry
      get: () => typeof fakes === 'function' ? fakes() : fakes
    });

    Object.defineProperty(this, 'fields', { // document fields
      get: () => typeof fields === 'function' ? fields() : fields
    });
    Object.defineProperty(this, 'strict', { // document schema mode
      value: strict
    });
    Object.defineProperty(this, 'validatorOptions', { // options for validatable.js
      value: validatorOptions
    });
    Object.defineProperty(this, 'typeOptions', { // options for typeable.js
      value: typeOptions
    });
  }

}
exports.Schema = Schema;