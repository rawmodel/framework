![Build Status](https://travis-ci.org/xpepermint/objectschemajs.svg?branch=master)&nbsp;[![NPM Version](https://badge.fury.io/js/objectschema.svg)](https://badge.fury.io/js/objectschema)&nbsp;[![Dependency Status](https://gemnasium.com/xpepermint/objectschemajs.svg)](https://gemnasium.com/xpepermint/objectschemajs)

# objectschema.js

> Advanced schema enforced JavaScript objects.

This is a light weight open source package for use on **server or in browser**. The source code is available on [GitHub](https://github.com/xpepermint/objectschemajs) where you can also find our [issue tracker](https://github.com/xpepermint/objectschemajs/issues).

## Features

* Type casting
* Custom data types
* Field default value
* Field value transformation with getter and setter
* Strict and relaxed schemas
* Document nesting with support for self referencing
* Change tracking, data commits and rollbacks
* Advanced field validation

## Related Projects

* [Contextable.js](https://github.com/xpepermint/contextablejs): Simple, unopinionated and minimalist framework for creating context objects with support for unopinionated ORM, object schemas, type casting, validation and error handling and more.
* [Validatable.js](https://github.com/xpepermint/validatablejs): A library for synchronous and asynchronous validation.
* [Handleable.js](https://github.com/xpepermint/handleablejs): A library for synchronous and asynchronous error handling.
* [Typeable.js](https://github.com/xpepermint/typeablejs): A library for checking and casting types.

## Install

Run the command below to install the package.

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
      type: 'String'
    }
  }
});

let userSchema = new Schema({
  fields: {
    name: { // field name
      type: 'String', // field type
      validate: [
        {
          name: 'presence',  // validator name
          message: 'is required' // validator error message
        }
      ]
    },
    books: {
      type: [bookSchema],
      validate: [
        {
          name: 'presence',
          message: 'is required'
        }
      ]
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
await user.isValid(); // -> false
```

## API

This package consists of two core classes. The `Schema` class represents a configuration object and the `Document` represents a data object defined by the Schema. There is also the `Field` class which represents a document field.

This package also integrates [*typeable.js*](https://github.com/xpepermint/typeablejs) module for type casting and [*validatable.js*](https://github.com/xpepermint/validatablejs) for validating fields.

### Schema

Schema represents a configuration object which configures the `Document`. It holds information about fields, type casting, how fields are validated and what the default values are.

A Schema can also be used as a custom type object. This way you can create a nested data structure by setting a schema instance for a field `type`. When a document is created, each schema in a tree of fields will become an instance of a Document - a tree of documents.

**Schema({fields, strict, validatorOptions, typeOptions})**

> A class for defining document structure.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| fields | Object,Function | Yes | - | An object with fields definition. You should pass a function which returns the definition object in case of self referencing.
| strict | Boolean | No | true | A schema type (set to `false` to allow dynamic fields not defined in schema).
| validatorOptions | Object | No | validatable.js defaults | Configuration options for the `Validator` class, provided by the [validatable.js](https://github.com/xpepermint/validatablejs), which is used for field validation.
| typeOptions | Object | No | typeable.js defaults | Configuration options for the `cast` method provided by the [typeable.js](https://github.com/xpepermint/typeablejs), which is used for data type casting.
```js

new Schema({
  fields: { // schema fields definition
    email: { // a field name holding a field definition
      type: 'String', // a field data type provided by typeable.js
      defaultValue: 'John Smith', // a default field value
      validate: [ // field validations provided by validatable.js
        { // validator recipe
          name: 'presence', // validator name
          message: 'is required' // validator error message
        }
      ]
    },
  },
  strict: true, // schema mode
  validatorOptions: {}, // validatable.js configuration options (see the package's page for details)
  typeOptions: {} // typeable.js configuration options (see the package's page for details)
});
```

This package uses [*typeable.js*](https://github.com/xpepermint/typeablejs) for data type casting. Many common data types and array types are supported, but we can also define custom types or override existing types through a `typeOptions` key. Please check package's website for a list of supported types and further information.

By default, all fields in a schema are set to `null`. We can set a default value for a field by setting the `defaultValue` option.

Validation is handled by the [*validatable.js*](https://github.com/xpepermint/validatablejs) package. We can configure the package by passing the `validatorOptions` option to our schema which will be passed directly to the `Validator` class. The package provides many built-in validators, allows adding custom validators and overriding existing ones. When a document is created all validator methods share document's context thus we can write context-aware checks. Please see package's website for details.

### Document

A document is a schema enforced data object. All document properties and configuration options are defined by the schema.

**Document(schema, data, parent)**

> A class for creating schema enforced objects.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| schema | Schema | Yes | - | An instance of the Schema class.
| data | Object | No | - | Initial data object.
| parent | Document | No | - | Parent document instance (for nesting documents).

**Document.prototype.$parent**: Document

> Parent document instance.

**Document.prototype.$root**: Document

> The first document instance in a tree of documents.

**Document.prototype.$schema**: Schema

> Schema instance.

**Document.prototype.$validator**: Validator

> Validator instance, used for validating fields.

**Document.prototype.clear()**: Document

> Sets all document fields to `null`.

**Document.prototype.clone()**: Document

> Returns a new Document instance which is the exact copy of the original.

**Document.prototype.commit()**: Document

> Sets initial value of each document field to the current value of a field. This is how field change tracking is restarted.

**Document.prototype.createField(name)**: Field

> A helper method which creates a new field instance.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| name | String | Yes | - | Field name.

**Document.prototype.equals(value)**: Boolean

> Returns `true` when the provided `value` represents an object with the same fields as the document itself.

**Document.prototype.get(...keys)**: Field

> Returns a class instance of the field at path.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| keys | Array | Yes | - | Path to a field (e.g. `['book', 0, 'title']`).

**Document.prototype.has(...keys)**: Boolean

> Returns `true` when a field path exists.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| keys | Array | Yes | - | Path to a field (e.g. `['book', 0, 'title']`).

**Document.prototype.isChanged()**: Boolean

> Returns `true` if at least one document field has been changed.

**Document.prototype.isValid()**: Promise<Boolean>

> Returns `true` when all document fields are valid.

**Document.prototype.populate(data)**: Document

> Applies data to a document.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| data | Object | Yes | - | Data object.

**Document.prototype.reset()**: Document

> Sets each document field to its default value.

**Document.prototype.rollback()**: Document

> Sets each document field to its initial value (last committed value). This is how you can discharge document changes.

**Document.prototype.toObject()**: Object

> Converts a document into serialized data object.

**Document.prototype.validate()**: Promise<InvalidFieldError[]>

> Validates all document fields and returns a list of `InvalidFieldError` errors for all invalid fields.

### Field

When a document field is defined, another field with the same name but prefixed with the `$` sign is set. This special read-only field holds a reference to the actual field instance.

```js
let user = new Document(schema);
user.name = 'John'; // -> actual document field
user.$name; // -> reference to document field instance
user.$name.isChanged(); // -> calling field instance method
```

**Field(document, name)**

> Document field class.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| document | Document | Yes | - | An instance of a Document.
| name | String | Yes | - | Field name

**Field.prototype.$document**: Document

> Document instance.

**Field.prototype.$name**: String

> Field name.

**Field.prototype.clear()**: Field

> Sets field and related sub fields to `null`.

**Field.prototype.commit()**: Field

> Sets initial value to the current value. This is how field change tracking is restarted.

**Field.prototype.defaultValue**: Any

> A getter which returns the default field value.

**Field.prototype.equals(value)**: Boolean

> Returns `true` when the provided `value` represents an object that looks the same.

**Field.prototype.initialValue**: Any

> A getter which returns the initial field value (a value from the last commit).

**Field.prototype.isChanged()**: Boolean

> Returns `true` if the field or at least one sub field have been changed.

**Field.prototype.isValid()**: Promise<Boolean>

> Returns `true` if the field and all sub fields are valid.

**Field.prototype.reset()**: Field

> Sets the field to its default value.

**Field.prototype.rollback()**: Field

> Sets the field to its initial value (last committed value). This is how you can discharge field's changes.

**Field.prototype.validate()**: Promise(Object)

> Validates the field and returns errors.

**Field.prototype.value**: Any

> A getter and setter for the value of the field.

### ValidatorError

**ValidatorError(value, recipe, code)**

> Validator error class, provided by the `validatable.js`, which holds information about an invalid value of a field..

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| recipe | Object | Yes | - | Validator recipe object.
| value | Any | Yes | - | The value which failed to pass the validation.
| code | Integer | No | 422 | Error status code.

### InvalidFieldError

**InvalidFieldError(path, errors, related, message, code)**

> Field validation error class.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| path | String | No | - | Field name
| errors | ValidatorError[] | No | [] | List of ValidatorError instances of a field.
| related | InvalidFieldError[] | No | [] | List of InvalidFieldError instances of a sub-document.
| message | String | No | Field validation failed | General error message.
| code | Number | No | 422 | Error code.

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
