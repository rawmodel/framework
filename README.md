![Build Status](https://travis-ci.org/xpepermint/objectschemajs.svg?branch=master)&nbsp;[![NPM Version](https://badge.fury.io/js/objectschema.svg)](https://badge.fury.io/js/objectschema)&nbsp;[![Dependency Status](https://gemnasium.com/xpepermint/objectschemajs.svg)](https://gemnasium.com/xpepermint/objectschemajs)

# objectschema.js

> Advanced strongly-typed JavaScript object.

This is a light weight open source package for the **server** and **browser** (using module bundler). The source code is available on [GitHub](https://github.com/xpepermint/objectschemajs) where you can also find our [issue tracker](https://github.com/xpepermint/objectschemajs/issues).

## Features

* Simple and intuitive API
* TypeScript ready
* Field type casting
* Custom field data types
* Field dynamic default value
* Field dynamic fake value
* Field value transformation with getter and setter
* Document serialization and filtering
* Document nesting with support for self referencing
* Change tracking, data commits and rollbacks
* Advanced field validation
* Built-in and custom validators

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

This package uses promises thus you need to use [Promise polyfill](https://github.com/taylorhakes/promise-polyfill) when promises are not supported.

## Example

### TypeScript

```js
import {Document} from 'objectschema';

/* Model */

class User extends Document { // User model
  public name: string; // class property
  public constructor (data, options) {
    super(data, options);
    this.defineField('name'); // field definition (for class property `name`)
    this.populate(data); // set values
  }
}

/* Usage */

let user = new User({ // new model instance
  name: 'John Smith'
});
```

### JavaScript

```js
import {Document} from 'objectschema';

/* Model */

class User extends Document { // User model
  constructor (data, options) {
    super(data, options);
    this.defineField('name'); // field definition
    this.populate(data); // set values
  }
}

/* Usage */

let user = new User({ // new model instance
  name: 'John Smith'
});
```

## API

This package consists of two core classes:
* `Document` represents a data object with fields.
* `Field` represents a document property.

This package uses [*typeable.js*](https://github.com/xpepermint/typeablejs) for data type casting. Many common data types and array types are supported, but we can also use custom types. Please check package's website for a list of supported types and further information.

Validation is handled by [*validatable.js*](https://github.com/xpepermint/validatablejs). The package provides many built-in validators, allows adding custom validators and overriding existing ones. When a document is created all validator methods share document's context thus we can write context-aware checks. Please see package's website for details.

### Document

A document is an advanced strongly-typed JavaScript object where properties are instances of the `Field` class.

**Document(data, {parent})**

> A class for creating schema enforced objects.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| data | Object | No | - | Initial data object.
| parent | Document | No | - | Parent document instance (for nesting).

```js
class Model extends Document { // User model
  constructor (data, options) {
    super(data, options);

    this.defineField('name', {
      type: 'String', // converts value to string
      get (v) { return v }, // custom getter
      set (v) { return v }, // custom setter
      validate: [ // value validations
        { // validator recipe (check validatable.js for more)
          validator: 'presence', // validator name
          message: 'must be present' // error message
        }
      ],
      defaultValue: 'Noname', // field default value (value or function)
      fakeValue: 'Noname', // field fake value (value or function)
    });

    this.populate(data);
    this.commit();
  }
}
```

#### Properties

**Document.prototype.options**: Object

> Document options.

**Document.prototype.parent**: Document

> Parent document instance.

**Document.prototype.root**: Document

> The first document instance in a tree of documents.

#### Methods

**Document.prototype.applyErrors(errors)**: Document

> Deeply populates fields with the provided `errors`.

```js
doc.applyErrors([
  {
    path: ['books', 1, 'title'], // field path
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
| handler | Function | Yes | - | A handler method which is executed for each field.

**Document.prototype.collectErrors()**: Array

> Returns a list of errors for all the fields ({path, errors}[]).

```js
doc.collectErrors(); // => {path: ['name'], errors: [{validator: 'absence', message: 'must be blank', code: 422}]}
```

**Document.prototype.commit()**: Document

> Sets initial value of each document field to the current value of a field. This is how field change tracking is restarted.

**Document.prototype.defineField(name, {type, get, set, defaultValue, fakeValue, validate})**: Void

> Defines a new document property.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| name | String | Yes | - | Property name.
| type | String, Document | No | - | Data type (pass a Document to create a nested structure; check [typeable.js](https://github.com/xpepermint/validatablejs) for more).
| get | Function | No | - | Custom getter.
| set | Function | No | - | Custom setter.
| defaultValue | Any | No | - | Field default value.
| fakeValue | Any | No | - | Field fake value.
| validate | Array | No | - | List of validation recipies (check [validatable.js](https://github.com/xpepermint/validatablejs) for more).

**Document.prototype.defineType(name, converter)**: Void

> Defines a custom data type.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| name | String | Yes | - | Type name.
| converter | Function | Yes | - | Type converter.

**Document.prototype.defineValidator(name, handler)**: Void

> Defines a custom validator.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| name | String | Yes | - | Validator name.
| handler | Function, Promise | Yes | - | Validator handler.

**Document.prototype.equals(value)**: Boolean

> Returns `true` when the provided `value` represents an object with the same fields as the document itself.

**Document.prototype.failFast(fail)**: Void

> Configures validator to stop field validation on the first error.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| fail | Boolean | No | false | Stops field validation on the first error when set to `true`.

**Document.prototype.fake()**: Document

> Sets each document field to its fake value if a fake value generator is registered, otherwise the default value is used.

**Document.prototype.filter(handler)**: Object

> Converts a document into serialized data object with only the keys that pass the test.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| handler | Function | Yes | - | A function to test each key value. If the function returns `true` then the key is included in the returned object.

**Document.prototype.flatten()**: Array

> Converts the document into an array of fields.

**Document.prototype.getField(...keys)**: Field

> Returns a class instance of a field at path.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| keys | Array | Yes | - | Path to a field (e.g. `['book', 0, 'title']`).

**Document.prototype.hasErrors()**: Boolean

> Returns `true` when no errors exist (inverse of `isValid()`). Make sure that you call the `validate()` method first.

**Document.prototype.hasField(...keys)**: Boolean

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

> Clears `errors` on all fields.

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
| handler | Function | Yes | - | A handler method which is executed for each field.

**Document.prototype.serialize()**: Object

> Converts a document into serialized data object.

**Document.prototype.validate({quiet})**: Promise(Document)

> Validates document fields and throws an error if not all fields are valid unless the `quiet` is set to `true`.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| quiet | Boolean | No | false | When set to `true`, a validation error is thrown.

```js
try {
  await doc.validate(); // throws a validation error when invalid fields exist
}
catch (e) {
  // `e` is a 422 validation error
}
```

### Field

Every document field is an instance of the `Field` class.

**Field({type, get, set, defaultValue, fakeValue, validate}, {owner, validators, failFast})**

> A document field.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| type | String, Document | No | - | Data type (pass a Document to create a nested structure; check [typeable.js](https://github.com/xpepermint/validatablejs) for more).
| get | Function | No | - | Custom getter.
| set | Function | No | - | Custom setter.
| defaultValue | Any | No | - | Field default value.
| fakeValue | Any | No | - | Field fake value.
| validate | Array | No | - | List of validation recipies (check [validatable.js](https://github.com/xpepermint/validatablejs) for more).
| owner | Document | No | - | An instance of a Document which owns the field.
| validators | Object | No | - | Custom validators (check [validatable.js](https://github.com/xpepermint/validatablejs) for more)
| failFast | Boolean | No | false | Stops validation on the first error when set to `true`.

#### Properties

**Field.prototype.defaultValue**: Any

> A getter which returns the default field value.

**Field.prototype.errors**: Object[];

> List of field errors (sets the `validate` method).

**Field.prototype.fakeValue**: Any

> A getter which returns a fake field value.

**Field.prototype.initialValue**: Any

> A getter which returns the last commited field value.

**Field.prototype.options**: Object

> A getter which returns field options.

**Field.prototype.owner**: Document

> A getter which returns a reference to a Document instance on which the field is defined.

**Field.prototype.recipe**: Object

> A getter which returns a field recipe object.

**Field.prototype.type**: Any

> A getter which returns field type (set to `Document` for a nested structure).

**Field.prototype.value**: Any

> Field current value (the actula document's property).

#### Methods

**Field.prototype.clear()**: Field

> Sets field and related sub fields to `null`.

**Field.prototype.commit()**: Field

> Sets initial value to the current value. This is how field change tracking is restarted.

**Field.prototype.equals(value)**: Boolean

> Returns `true` when the provided `value` represents an object that looks the same.

**Field.prototype.fake()**: Field

> Sets field to a generated fake value.

**Field.prototype.hasErrors()**: Boolean

> Returns `true` when no errors exist (inverse of `isValid()`). Make sure that you call the `validate()` method first.

**Field.prototype.isChanged()**: Boolean

> Returns `true` if the field or at least one sub field have been changed.

**Field.prototype.isNested()**: Boolean

> Returns `true` if the field is a nested document.

**Field.prototype.isValid()**: Boolean

> Returns `true` if the field and all sub fields are valid (inverse of `hasErrors()`). Make sure that you call the `validate()` method first.

**Field.prototype.invalidate()**: Field

> Clears the `errors` field on all fields (the reverse of `validate()`).

**Field.prototype.reset()**: Field

> Sets the field to its default value.

**Field.prototype.rollback()**: Field

> Sets the field to its initial value (last committed value). This is how you can discharge field's changes.

**Field.prototype.validate()**: Promise(Field)

> Validates the `value` and populates the `errors` property with errors.

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
