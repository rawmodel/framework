import {
  cast,
  isObject,
  isArray
} from 'typeable';

import {Schema} from './schema';

export class Document {

  constructor(schema, data={}) {
    if (!(schema instanceof Schema)) {
      throw new Error('Document expects schema to be an instance of Schema class');
    }

    Object.defineProperty(this, '_schema', {
      get: () => schema,
      enumerable: false // do not expose as object key
    });

    this.purge();
    this.define();
    this.populate(data);
  }

  purge() {
    let names = Object.keys(this);
    this.purgeFields(names);
  }

  purgeFields(names=[]) {
    names.forEach((name) => this.purgeField(name));
  }

  purgeField(name) {
    delete this[name];
  }

  define() {
    let {fields} = this._schema;
    this.defineFields(fields);
  }

  defineFields(fields) {
    for (let name in fields) {
      this.defineField(name, fields[name]);
    }
  }

  defineField(name, config={}) {
    let data;

    Object.defineProperty(this, name, {
      get: () => data,
      set: (value=null) => data = this.castValue(value, config),
      enumerable: true,
      configurable: true
    });

    this[name] = config.defaultValue;
  }

  populate(fields={}) {
    if (!isObject(fields)) {
      throw new Error('Only Object can populate a Document');
    }

    let names = Object.keys(fields);

    for (let name in fields) {
      this.populateField(name, fields[name]);
    }
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
  }

  castValue(value, config) {
    return cast(value, config, {
      schema: (value, config) => new Document(config, value)
    });
  }

  toObject() {
    let data = {};
    let names = Object.keys(this);

    for (let name of names) {
      let value = this[name];

      if (isArray(value)) {
        data[name] = value.map(i => this.valueToObject(i));
      } else {
        data[name] = this.valueToObject(value);
      }
    }

    return data;
  }

  valueToObject(value) {
    if (value && value.toObject) {
      return value.toObject();
    } else {
      return value;
    }
  }

  clone() {
    return new Document(this._schema, this.toObject());
  }

}
