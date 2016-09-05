import {
  cast,
  isObject,
  isArray,
  isFunction,
  isPresent,
  isAbsent,
  isUndefined
} from 'typeable';

import {Validator} from 'validatable';
import {Schema} from './schema';

export class Document {

  constructor(schema, data={}) {
    if (!(schema instanceof Schema)) {
      throw new Error(`${this.constructor.name} expects schema to be an instance of Schema class`);
    }

    Object.defineProperty(this, '_schema', {
      get: () => schema,
      enumerable: false // do not expose as object key
    });

    Object.defineProperty(this, '_validator', {
      value: new Validator(Object.assign({}, schema.validator, {context: this})),
      enumerable: false // do not expose as object key
    });

    this.purge();
    this.define();
    this.populate(data);
  }

  define() {
    let {fields} = this._schema;
    this.defineFields(fields);

    return this;
  }

  defineFields(fields) {
    for (let name in fields) {
      this.defineField(name, fields[name]);
    }

    return this;
  }

  defineField(name, definition={}) {
    let data;

    Object.defineProperty(this, name, {
      get: () => {
        if (definition.get) {
          return definition.get(data, this);
        } else {
          return data;
        }
      },
      set: (value=null) => {
        data = this.castValue(value, definition);
        if (definition.set) {
          data = definition.set(data, this);
        }
      },
      enumerable: true,
      configurable: true
    })

    if (isFunction(definition.defaultValue)) {
      this[name] = definition.defaultValue(this);
    } else {
      this[name] = definition.defaultValue;
    }

    return this[name];
  }

  castValue(value, {type}) {
    return cast(value, type, {
      schema: (value) => {
        if (isArray(type)) type = type[0];
        return new this.constructor(type, value);
      }
    });
  }

  populate(fields={}) {
    if (!isObject(fields)) {
      throw new Error(`Only Object can populate a ${this.constructor.name}`);
    }

    for (let name in fields) {
      this.populateField(name, fields[name]);
    }

    return this;
  }

  populateField(name, value) {
    if (this._schema.mode === 'relaxed') {
      this[name] = value;
    } else {
      let names = Object.keys(this._schema.fields);
      let exists = names.indexOf(name) > -1;

      if (exists) {
        this[name] = value;
      }
    }

    return this[name];
  }

  purge() {
    let names = Object.keys(this);
    this.purgeFields(names);

    return this;
  };

  purgeFields(names=[]) {
    names.forEach((name) => this.purgeField(name));

    return this;
  }

  purgeField(name) {
    return delete this[name];
  }

  clear() {
    let names = Object.keys(this);

    for (let name of names) {
      this.clearField(name);
    }

    return this;
  }

  clearField(name) {
    this[name] = null;
    return this[name];
  }

  clone() {
    return new this.constructor(this._schema, this.toObject());
  }

  toObject() {
    let valueToObject = (v) => {
      if (v && v.toObject) {
        return v.toObject();
      } else if (v && isArray(v)) {
        return v.map((v) => valueToObject(v));
      } else {
        return v;
      }
    };

    let data = {};
    let names = Object.keys(this);
    for (let name of names) {
      data[name] = valueToObject(this[name]);
    }
    return data;
  }















  // async validate() {
  //   let errors = {};
  //
  //   let {fields} = this._schema;
  //   for (let name in fields) {
  //     errors[name] = await this.validateField(name);
  //   }
  //
  //   return errors;
  // }
  //
  // async validateField(name) {
  //   let definition = this._schema.fields[name];
  //   let value = this[name];
  //
  //   return await this.validateValue(value, definition);
  // }

  async validate() {
    let errors = {};

    for (let name in this) {
      let value = this[name];
      let definition = this._schema.fields[name];

      let error = await this.validateField(value, definition);
      if (!isUndefined(error)) {
        errors[name] = error;
      }
    }

    return errors;
  }

  async validateField(value, definition) {
    let {type, validations} = definition;

    let messages = await this._validator.validate(value, validations);

    let related = null;
    if (type instanceof Schema && value) {
      related = await value.validate();
    } else if (isArray(type) && isArray(value)) {
      related = [];
      for (let v of value) {
        if (type[0] instanceof Schema) {
          if (v) {
            related.push(await v.validate());
          } else {
            related.push(undefined);
          }
        } else {
          related.push(await this.validateField(v, definition));
        }
      }
    }

    let isValid = messages.length === 0;
    if (related && isObject(related)) {
      isValid = !Object.values(related).map(v => v.isValid).includes(false);
    } else if (related && isArray(related)) {
      isValid = related.map(v => !v || v.isValid).includes(false);
    }

    return isValid ? undefined : {isValid, messages, related};
  }

}
