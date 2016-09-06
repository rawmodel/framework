![Build Status](https://travis-ci.org/xpepermint/objectschemajs.svg?branch=master)&nbsp;[![NPM Version](https://badge.fury.io/js/objectschema.svg)](https://badge.fury.io/js/objectschema)&nbsp;[![Dependency Status](https://gemnasium.com/xpepermint/objectschemajs.svg)](https://gemnasium.com/xpepermint/objectschemajs)

# objectschema.js

> Schema enforced JavaScript objects.

<img src="giphy.gif" width="300" />

## Install

```
$ npm install --save objectschema
```

## Example

```js
import {
  Document,
  Schema
} from 'objectschema';

let bookSchema = new Schema({
  fields: {
    title: {
      type: 'string'
    }
  }
});

let userSchema = new Schema({
  fields: {
    name: {
      type: 'string',
      validations: {
        presence: {
          message: 'is required'
        }
      }
    },
    books: {
      type: [bookSchema],
      validations: {
        presence: {
          message: 'is required'
        }
      }
    }
  }
});

let data = {
  name: 'John Smith',
  books: [
    {
      title: 'True Detective'
    }
  ]
};

let user = new Document(userSchema, data);
user.name; // -> 'John Smith'
await user.isValid(); // -> true
```

## API

### Schema

**new Schema({mode, validator, fields})**

> A class for defining document structure.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| mode | String | No | strict | A schema type (use `relaxed` to allow dynamic fields).
| validator | Object | No | using [validatablejs](https://github.com/xpepermint/validatablejs) defaults | Object with custom validators (this variable is merged with built-in validators thus you can override a validator key if you need to).
| fields | Object | Yes | {} | An object with fields definition.

```js
let fields = { // schema fields definition
  name: { // field name holding a field definition
    type: 'string', // field type
    defaultValue: 'John Smith', // default field value
    validations: { // field validations
      presence: { // validator name
        message: 'is required' // validator options
      }
    }
  },
};
```

This package integrates [typeablejs](https://github.com/xpepermint/typeablejs) module for type casting and [validatablejs](https://github.com/xpepermint/validatablejs) for field value validation. See these packages for available configuration options and other details.

### Document


**new Document(schema, data)**

> A class for creating a schema-based object.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| schema | Schema | Yes | - | An instance of the Schema class.
| data | Object | No | - | Data object.

**document.populate(data)**:Document

> Applies data to a document.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| data | Object | Yes | - | Data object.

**document.populateField(name, value)**:Any

> Sets a value of document field.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| name | string | Yes | - | Document field name.
| value | Any | Yes | - | Data object.

**document.clear()**:Document

> Sets all document fields to `null`.

**document.clearField(name)**:Document

> Sets the `name` document field to `null`.

**document.clone()**:Document

> Returns a new Document instance which is the exact copy of the original instance.

**document.toObject()**:Object

> Converts the `document` into serialized data object.

**document.validate()**:Promise

> Validates all class fields and returns errors.

```js
{ // return value example
  name: { // field value is missing
    messages: ['is required'],
    isValid: false
  },
  book: { // nested object is missing
    messages: ['is required'],
    isValid: false
  },
  address: {
    messages: [],
    related: { // nested object errors
      post: {
        messages: ['is required'],
        isValid: false
      }
    },
    isValid: false
  },
  friends: { // an array of nested objects has errors
    messages: [],
    related: [
      undefined, // the first item was valid
      { // the second item has errors
        name: {
          messages: ['is required'],
          isValid: false
        }
      }
    ],
    isValid: false
  }
}
```

**document.validateField(name)**:Promise

> Validates the `name` field and returns errors.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| name | string | Yes | - | Document field name.

**document.isValid()**:Promise

> Returns `true` when all document fields are valid.

**document.equalsTo(value)**:Boolean

> Returns `true` when the `value` represents an object with the same field values as the original document.

**document.purge()**:Document

> Deletes all class fields.

**document.define()**:Document

> Defines class fields for all fields in schema.

## License (MIT)

```
Copyright (c) 2016 Kristijan Sedlak <xpepermint@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
