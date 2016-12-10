![Build Status](https://travis-ci.org/xpepermint/objectschemajs.svg?branch=master)&nbsp;[![NPM Version](https://badge.fury.io/js/objectschema.svg)](https://badge.fury.io/js/objectschema)&nbsp;[![Dependency Status](https://gemnasium.com/xpepermint/objectschemajs.svg)](https://gemnasium.com/xpepermint/objectschemajs)

# objectschema.js

> Advanced schema enforced JavaScript objects.

This is a light weight open source package for use on **server** or in **browser** (using module bundler). The source code is available on [GitHub](https://github.com/xpepermint/objectschemajs) where you can also find our [issue tracker](https://github.com/xpepermint/objectschemajs/issues).

## Features

* Type casting
* Custom data types
* Field default value
* Field fake value
* Field value transformation with getter and setter
* Strict and relaxed schemas
* Schema mixins for extending schemas
* Document serialization and filtering
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
import {Document, Schema} from 'objectschema';

let bookSchema = new Schema({
  fields: { // document fields
    title: { // field name
      type: 'String', // field type
      defaultValue: () => 'Lord of the flies', // value or function
      fakeValue: () => 'Fake Title' // value or function (use e.g. `faker` for that)
    }
  }
});

let userSchema = new Schema({ // root document
  fields: { // document fields
    name: { // field name
      type: 'String', // field type (string)
      validate: [ // field validators
        {
          validator: 'presence',  // validator name
          message: 'is required' // validator error message
        }
      ]
    },
    books: { // field name
      type: [bookSchema], // array of `bookSchema` documents
      validate: [ // validators
        {
          validator: 'presence',  // validator name
          message: 'is required' // validator error message
        }
      ]
    }
  }
});

let initialData = {
  name: 'John Smith',
  books: [
    {
      title: 'True Detective'
    }
  ]
};

let user = new Document(initialData, userSchema); // new document instance

user.title; // => "True Detective"
await user.validate({quiet: true});
user.isValid(); // => false

user.fake(); // generate fake data
user.title; // => "lorem ipsum"
user.reset(); // use default value
user.title; // => "Lord of the flies"

user.$title; // => field class instance
```

## API

This package consists of two core classes. A `Schema` represents a configuration object and a `Document` represents a data object defined by the Schema. There is also the `Field` class which represents a document field.

This package uses [*typeable.js*](https://github.com/xpepermint/typeablejs) module for type casting and [*validatable.js*](https://github.com/xpepermint/validatablejs) for validating fields.

### Schema

Schema represents a configuration object which configures the `Document`. It holds information about fields, type casting, how fields are validated and what the default values are.

A Schema can also be used as a custom type object. This way you can create a nested data structure by setting a schema instance for a field `type`. When a document is created, each schema in a tree of fields will become an instance of a Document - a tree of documents.

**Schema({mixins, fields, strict, validators, types, firstErrorOnly})**

> A class for defining document structure.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| mixins | [] | No | [] | A list of schema instances from which to extend the schema.
| fields | Object,Function | Yes | - | An object with fields definition. You should pass a function which returns the definition object in case of self referencing.
| strict | Boolean | No | true | A schema type (set to `false` to allow dynamic fields not defined in schema).
| validators | Object | No | validatable.js defaults | Configuration options for the `Validator` class, provided by the [validatable.js](https://github.com/xpepermint/validatablejs), which is used for field validation.
| types | Object | No | typeable.js defaults | Configuration options for the `cast` method provided by the [typeable.js](https://github.com/xpepermint/typeablejs), which is used for data type casting.
| firstErrorOnly | Boolean | No | false | When set to true, the validation stops after the first validation error.

```js
new Schema({
  mixins: [animalSchema, catSchema], // schema extensions
  fields: { // schema fields definition
    email: { // a field name holding a field definition
      type: 'String', // [required] a field data type provided by typeable.js
      defaultValue: 'John Smith', // a default field value (can be a value of a function)
      fakeValue: 'John Smith', // a fake field value (can be a value of a function)
      validate: [ // field validations provided by validatable.js
        { // validator recipe
          validator: 'presence', // [required] validator name
          message: 'is required', // [required] validator error message
          condition () { return true } // condition to switch off the validator
        }
      ]
    },
  },
  strict: true, // schema mode
  validators: {}, // validatable.js configuration options (see the package's page for details)
  types: {}, // typeable.js configuration options (see the package's page for details)
  firstErrorOnly: false, // validatable.js configuration options (see the package's page for details)
});
```

This package uses [*typeable.js*](https://github.com/xpepermint/typeablejs) for data type casting. Many common data types and array types are supported, but we can also define custom types or override existing types through a `types` key. Please check package's website for a list of supported types and further information.

By default, all fields in a schema are set to `null`. We can set a default value for a field by setting the `defaultValue` option.

Validation is handled by [*validatable.js*](https://github.com/xpepermint/validatablejs). We can configure the package through `validators` and `firstErrorOnly` options. The package provides many built-in validators, allows adding custom validators and overriding existing ones. When a document is created all validator methods share document's context thus we can write context-aware checks. Please see package's website for details.

### Document

A document is a schema enforced object. All document properties and configuration options are defined by the schema.

**Document(data, schema, parent)**

> A class for creating schema enforced objects.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| data | Object | No | - | Initial data object.
| schema | Schema | No | - | An instance of the Schema class.
| parent | Document | No | - | A parent document instance (for nesting documents).

**Document.prototype.$parent**: Document

> Parent document instance.

**Document.prototype.$root**: Document

> The first document instance in a tree of documents.

**Document.prototype.$schema**: Schema

> Schema instance.

**Document.prototype.$validator**: Validator

> Validator instance, used for validating fields.

**Document.prototype.applyErrors(errors)**: Document

> Deeply populates fields with the provided `errors`.

```js
doc.applyErrors([
  {
    path: ['name'], // field path
    errors: [
      {
        validator: 'presence',  // validator name
        message: 'is required', // validator message
        code: 422 // error code
      }
    ]
  },
  {
    path: ['newBook', 'title'],
    errors: [
      {
        validator: 'absence',
        message: 'must be blank',
        code: 422
      }
    ]
  },
  {
    path: ['newBooks', 1, 'title'],
    errors: [
      {
        validator: 'presence',
        message: 'is required',
        code: 422
      }
    ]
  }
]);
```

**Document.prototype.clear()**: Document

> Sets all document fields to `null`.

**Document.prototype.clone()**: Document

> Returns a new Document instance which is the exact copy of the original.

**Document.prototype.collect(handler)**: Array

> Scrolls through document fields and collects results.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| handler | Function | Yes | - | A handler method which is executed for each document field.

**Document.prototype.collectErrors()**: Array

> Returns a list of errors for all the fields ({path, errors}[]).

**Document.prototype.commit()**: Document

> Sets initial value of each document field to the current value of a field. This is how field change tracking is restarted.

**Document.prototype.equals(value)**: Boolean

> Returns `true` when the provided `value` represents an object with the same fields as the document itself.

**Document.prototype.getPath(...keys)**: Field

> Returns a class instance of the field at path.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| keys | Array | Yes | - | Path to a field (e.g. `['book', 0, 'title']`).

**Document.prototype.fake()**: Document

> Sets each document field to its fake value if a fake value generator is registered, otherwise the default value is used.

**Document.prototype.filter(handler)**: Object

> Converts a document into serialized data object with only the keys that pass the test.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| handler | Function | Yes | - | A function to test each key value. If the function returns `true` then the key is included in the returned object.

**Document.prototype.flatten()**: Array

> Converts the document into an array of fields.

**Document.prototype.hasErrors()**: Boolean

> Returns `true` when no errors exist (inverse of `isValid()`). Make sure that you call the `validate()` method first.

**Document.prototype.hasPath(...keys)**: Boolean

> Returns `true` when a field path exists.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| keys | Array | Yes | - | Path to a field (e.g. `['book', 0, 'title']`).

**Document.prototype.isChanged()**: Boolean

> Returns `true` if at least one document field has been changed.

**Document.prototype.isNested()**: Boolean

> Returns `true` if nested fields exist.

**Document.prototype.isValid()**: Boolean

> Returns `true` when all document fields are valid (inverse of `hasErrors()`). Make sure that you call the `validate()` method first.

**Document.prototype.invalidate()**: Document

> Clears `errors` on all fields (the reverse of `validate()`).

**Document.prototype.populate(data)**: Document

> Applies data to a document.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| data | Object | Yes | - | Data object.

**Document.prototype.reset()**: Document

> Sets each document field to its default value.

**Document.prototype.rollback()**: Document

> Sets each document field to its initial value (last committed value). This is how you can discharge document changes.

**Document.prototype.scroll(handler)**: Integer

> Scrolls through document fields and executes a handler on each field.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| handler | Function | Yes | - | A handler method which is executed for each document field.

**Document.prototype.serialize()**: Object

> Converts a document into serialized data object.

**Document.prototype.validate({quiet})**: Promise(Document)

> Validates document fields and throws an error if not all fields are valid unless the `quiet` is set to `true`.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| quiet | Boolean | No | false | When set to `true`, a validation error is thrown.

```js
try {
  await doc.validate(); // throws a validation error when fields are invalid
}
catch (e) {
  // `e` is an error, which holds errors for all invalid fields (including those deeply nested)
}
```

### Field

When a document field is defined, another field with the same name but prefixed with the `$` sign is set. This special read-only field holds a reference to the actual field instance.

```js
let user = new Document(null, schema);
user.name = 'John'; // actual document field
user.$name; // reference to document field instance
user.$name.isChanged(); // calling field instance method
```

**Field(owner, name)**

> A field class which represents each field on a document.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| owner | Document | Yes | - | An instance of a Document which owns the field.
| name | String | Yes | - | Field name

**Field.prototype.$owner**: Document

> A reference to a Document instance on which the field is defined.

**Field.prototype.clear()**: Field

> Sets field and related sub fields to `null`.

**Field.prototype.commit()**: Field

> Sets initial value to the current value. This is how field change tracking is restarted.

**Field.prototype.defaultValue**: Any

> A getter which returns the default field value.

**Field.prototype.equals(value)**: Boolean

> Returns `true` when the provided `value` represents an object that looks the same.

**Field.prototype.fake()**: Field

> Sets field to a generated fake value.

**Field.prototype.fakeValue**: Any

> A getter which returns a fake field value.

**Field.prototype.hasErrors()**: Boolean

> Returns `true` when no errors exist (inverse of `isValid()`). Make sure that you call the `validate()` method first.

**Field.prototype.initialValue**: Any

> A getter which returns the initial field value (last committed value).

**Field.prototype.isChanged()**: Boolean

> Returns `true` if the field or at least one sub field have been changed.

**Field.prototype.isNested()**: Boolean

> Returns `true` if the field is a nested document.

**Field.prototype.isValid()**: Boolean

> Returns `true` if the field and all sub fields are valid (inverse of `hasErrors()`). Make sure that you call the `validate()` method first.

**Field.prototype.invalidate()**: Field

> Clears the `errors` field on all fields (the reverse of `validate()`).

**Field.prototype.name**: String

> A getter which returns a name of a field.

**Field.prototype.reset()**: Field

> Sets the field to its default value.

**Field.prototype.rollback()**: Field

> Sets the field to its initial value (last committed value). This is how you can discharge field's changes.

**Field.prototype.validate()**: Promise(Field)

> Validates the `value` and populates the `errors` property with errors.

**Field.prototype.value**: Any

> A getter and setter for the value of the field.

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
