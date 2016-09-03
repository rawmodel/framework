import {cast, isObject} from 'typeable';
import {Schema} from './schema';

export class Document {

  constructor(schema={}, data={}) {
    if (!(schema instanceof Schema)) {
      throw new Error('Document expects schema to be an instance of Schema class');
    }

    Object.defineProperty(this, '_schema', {
      get: () => schema,
      enumerable: false // do not expose as object key
    });

    this.deleteAllFields();
    this.defineAllFields();
    this.assignFields(data);
  }

  deleteAllFields() {
    let names = Object.keys(this);
    this.deleteFields(names);
  }

  deleteFields(names=[]) {
    names.forEach((name) => this.deleteField(name));
  }

  deleteField(name) {
    delete this[name];
  }

  defineAllFields() {
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
      set: (value=null) => data = this.castFieldValue(value, config),
      enumerable: true,
      configurable: true
    });

    this[name] = config.defaultValue;
  }

  assignFields(fields={}) {
    if (!isObject(fields)) {
      throw new Error('Only Object can be assigned to a Document');
    }

    let names = Object.keys(fields);

    for (let name in fields) {
      this.assignField(name, fields[name]);
    }
  }

  assignField(name, value) {
    this[name] = value;
  }

  castFieldValue(value, config) {
    return cast(value, config, {
      schema: (value, config) => new Document(config, value)
    });
  }

  toObject() {
    let data = {};
    let names = Object.keys(this);

    for (let name of names) {
      let value = this[name];

      if (value instanceof Document) {
        data[name] = value.toObject();
      } else {
        data[name] = value;
      }
    }

    return data;
  }

}
