![Build Status](https://travis-ci.org/xpepermint/rawmodeljs.svg?branch=master)&nbsp;[![NPM Version](https://badge.fury.io/js/rawmodel.svg)](https://badge.fury.io/js/rawmodel)&nbsp;[![Dependency Status](https://gemnasium.com/xpepermint/rawmodeljs.svg)](https://gemnasium.com/xpepermint/rawmodeljs)

```
┌────────────────────────────────────────────────────┐
│    ____                __  __           _      _   │
│   |  _ \ __ ___      _|  \/  | ___   __| | ___| |  │
│   | |_) / _` \ \ /\ / / |\/| |/ _ \ / _` |/ _ \ |  │
│   |  _ < (_| |\ V  V /| |  | | (_) | (_| |  __/ |  │
│   |_| \_\__,_| \_/\_/ |_|  |_|\___/ \__,_|\___|_|  │
│                                                    │
└────────────────────────────────────────────────────┘
```

# RawModel.js

> Strongly-typed JavaScript object with support for validation and error handling.

This is a light weight open source package for the **server** and **browser** (using module bundler) written with  [TypeScript](https://www.typescriptlang.org). It's actively maintained, well tested and ready for production environments. The source code is available on [GitHub](https://github.com/xpepermint/rawmodeljs) where you can also find our [issue tracker](https://github.com/xpepermint/rawmodeljs/issues).

## Related Projects

* [vue-rawmodel](https://github.com/xpepermint/vue-rawmodel): RawModel.js plugin for Vue.js v2. Form validation has never been easier!

## Introduction

RawModel provides a mechanism for creating strongly-typed data objects with built-in logic for unified data validation and error handling. It has a simple and intuitive API and tends to be a powerful, magic-free, minimalistic and unopinionated framework for writing application data layers where you have a full control. It could be a perfect fit when writing an [Express.js](http://expressjs.com/) action, [GraphQL](http://graphql.org/) resolver or similar and it's easily extendable.

It provides two core classes:
* `Model` represents strongly-typed data object with properties.
* `Field` represents model's property.

Both classes can be used independently but most likely you will use only the `Model` class.

> We will be using TypeScript for code examples for the rest of the docs. If you haven't picked it up, [you should](https://www.typescriptlang.org)!

## Installation

Run the command below to install the package.

```
npm install --save rawmodel
```

This package uses promises thus you need to use [Promise polyfill](https://github.com/taylorhakes/promise-polyfill) when promises are not supported.

## Example

The code below shows a basic usage example.

```js
import {Model} from 'rawmodel';

// defining a basic model
class User extends Model {
  public name: string;

  public constructor (data = {}) {
    super(data);
    this.defineField('name');
    this.populate(data);
  }
}

// usage example
let model = new User({
  name: 'John Smith'
});
model.name; // => 'John Smith'
```

Examples are also available inside the `./example` folder. You should also check the links below:

* [graphql-example](https://github.com/xpepermint/graphql-example): A GraphQL application example (intuitive rootValue resolvers using rawmodel.js)
* [vue-example](https://github.com/xpepermint/vue-example): Vue.js example application (server-side rendering, router, vuex store, forms validation with rawmodel.js)

## Usage

### Defining Fields

Model fields are defined using the `defineField` method. The code below is an example of a basic model class with a property `name` of type `Any`.

```js
import {Model} from 'rawmodel';

class User extends Model {
  public name: string; // typescript property definition for field `name`

  public constructor (data = {}) {
    super(data);
    this.defineField('name'); // definition of the `name` field
  }
}

let user = new User();
user.name = 'John Smith';
user.name; // -> "John Smith"
```

### Type Casting

Each field has a built-in system for type casting thus we can force a value to be automatically converted to a specific type.

```js
this.defineField('name', {
  type: 'String' // automatically cast values to `String`
});
```

Please see the API section for a list of all supported types.

### Nested Models

Each model also represents a type. This way you can create complex nested structures by nesting models as shown in the example below.

> Make sure that you preserve the constructor's initial parameter structure on nested models.

```js
import {Model, ModelRecipe} from 'rawmodel';

class Book extends Model {
  public title: string;

  public constructor (data = {}) {
    super(data);
    this.defineField('title');
    this.populate(data);
  }
}

class User extends Model {
  public book: Book;

  public constructor (data = {}) {
    super(data);
    this.defineField('book', {type: Book});
    this.populate(data);
  }
}
```

### Field Default Value

We can set a `defaultValue` options for each field which will populate a field when it is created.

The `defaultValue` can also be a method which returns a value. Note that this function shares the context of a field instance thus you have access to all the features of the `Field` class.

```js
this.defineField('name', {
  defaultValue () { return this.value }
});
```

### Field Fake Value

We can set a `fakeValue` options for each field which will populate a field when calling the `fake()` method.

The `fakeValue` can also be a method which returns a value. Note that this function shares the context of a field instance thus you have access to all the features of the `Field` class.

```js
this.defineField('name', {
  fakeValue () { return this.value }
});
```

### Field Value Transformation

A field can have a custom getter and a custom setter.

These methods all share the context of a field instance thus you have access to all the features of the `Field` class.

```js
this.defineField('name', {
  get (value) { return value },
  set (value) { return value }
});
```

### Commits & Rollbacks

RawModel tracks changes for all fields and provides a mechanism for committing values and rollbacks.

The example below explains how to setup and use these features.

```js
class User extends Model {
  public name: string;

  public constructor (data = {}) {
    super(data);
    this.defineField('name');
    this.populate(data); // populate model with initial values
    this.commit(); // restart change tracking
  }
}

let user = new User({
  name: 'John Smith' // initial value
});
user.name = 'Mandy Taylor'; // changing field's value
user.isChanged(); // -> true
user.commit(); // set `initialValue` of each field to the value of  `value`
user.isChanged(); // -> false
user.name = 'Tina Fey'; // changing field's value
user.rollback(); // -> reset `value` of each field to its `initialValue` (last committed value)
```

Note that the logic above applies also the the `Field` class.

### Serialization & Filtering

Model class provides useful methods for object serialization and filtering.

```js
let user = new User({
  name: 'John Smith' // initial value
});

user.scroll(function (field) { // argument is an instance of a field
  // do something useful
}).then((count) => { // number of processed fields
  user.serialize(); // -> {"name": "John Smith"}
});
```

The code above is only a quick example of what's possible. Please check the API section for all available methods.

### Validation

RawModel provides a simple mechanism for validating fields.

```js
class User extends Model {
  public name: string;

  public constructor (data = {}) {
    super(data);

    this.defineField('name', {
      validate: [ // field validation setup
        { // validator recipe
          validator: 'presence', // validator name
          message: '%{it} must be present', // error message
          condition () { return true }, // optional condition which switches the validation on/off
          it: 'it' // optional custom variable for the `message`
        }
      ]
    });
  }
}

let user = new User();
user.validate().then((err) => {
  user.collectErrors(); // -> [{path: ['name'], errors: [{validator: 'presence', message: 'is must be present', code: 422}]}]
});
```

It already includes some useful built-in validators but it's super simple to define your own validator. Note that each validator function shares the context of a field instance thus you have access to all the features of the `Field` class.

```js
class User extends Model {
  public name: string;

  constructor (data = {}) {
    super(data);

    this.defineValidator('coolness', function (v) {
      return v === 'cool';
    });

    this.defineField('name', {
      validate: [
        {
          validator: 'coolness',
          message: 'must be cool'
        }
      ]
    });
  }
}
```

### Error Handling

RawModel provides a mechanism for handling field-related errors. The logic is aligned with validation thus validation and error handling can easily be managed in a unified way. This is great because we always deal with validation errors and can thus directly send these errors back to a user in unified format.

```js
class User extends Model {
  public name: string;

  public constructor (data = {}) {
    super(data);

    this.defineField('name', {
      handle: [ // field error handling setup
        { // handler recipe
          handler: 'block', // handler name
          message: '%{is} unknown', // error message
          block (error) { return true }, // block handler-specific option
          condition () { return true }, // optional condition which switches the handling on/off
          is: 'is' // optional custom variable for the `message`
        }
      ]
    });
  }
}

let error = new Error();
let user = new User();
user.handle(error).then(() => {
  user.collectErrors(); // -> [{path: ['name'], errors: [{handler: 'block', message: 'is unknown', code: 422}]}]
});
```

This mechanism is especially handful when saving data to a database. MongoDB could, for example, throw a uniqueness error (E11000) if we try to insert a value that already exists in the database. We can catch that error by using the `handle()` and then return a unified validation error message to a user.

RawModel already includes some useful built-in handlers but it's super simple to define your own handler. Note that each handler function shares the context of a field instance thus you have access to all the features of the `Field` class.

```js
class User extends Model {
  public name: string;

  public constructor (data = {}) {
    super(data);

    this.defineHandler('coolness', function (e) {
      return e.message === 'cool';
    });

    this.defineField('name', {
      handle: [ // field error handling setup
        { // handler recipe
          handler: 'coolness', // handler name
          message: 'cool' // error message
        }
      ]
    });
  }
}
```

### GraphQL

RawModel.js can be a perfect framework for writing GraphQL resolvers. An instance of a root model, in our case the `App` class, can represent GraphQL's `rootValue`.

```js
import {Model, ModelRecipe} from 'rawmodel';
import {graphql, buildSchema} from 'graphql';

class App extends Model { // root resolver
  public hello () { // `hello` field resolver
    return 'Hello World!';
  }
}

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

var root = new App(); // root resolver

graphql(schema, '{hello}', root).then((response) => {
  console.log(response);
});
```

## API

### Model Class

**Model({parent})**

> Abstract class which represents a strongly-typed JavaScript object.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| parent | Model | No | - | Parent model instance.

```js
class User extends Model {
  public name: string;

  public constructor (data = {}) {
    super(data); // initializing the Model

    this.defineField('name', {
      type: 'String', // field type casting
      get (v) { return v }, // custom getter
      set (v) { return v }, // custom setter
      validate: [ // value validator recipes
        { // validator recipe (check validatable.js for more)
          validator: 'presence', // validator name
          condition () { return true }, // optional condition which switches the validation on/off
          message: '%{it} must be present', // error message
          it: 'it' // custom variable for the `message`
        }
      ],
      handle: [ // error handling recipies
        { // handler recipe
          handler: 'block', // handler name
          condition () { return true }, // optional condition which switches the handling on/off
          message: '%{is} unknown', // error message
          block (error) { return true }, // block handler-specific option
          is: 'is' // optional custom variable for the `message`
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

**Model.prototype.applyErrors(errors)**: Model

> Deeply populates fields with the provided `errors`.

```js
model.applyErrors([
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

**Model.prototype.clear()**: Model

> Sets all model fields to `null`.

**Model.prototype.clone()**: Model

> Returns a new Model instance which is the exact copy of the original.

**Model.prototype.collect(handler)**: Array

> Scrolls through model fields and collects results.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| handler | Function | Yes | - | A handler method which is executed for each field.

**Model.prototype.collectErrors()**: Array

> Returns a list of errors for all the fields ({path, errors}[]).

```js
model.collectErrors(); // => {path: ['name'], errors: [{validator: 'absence', message: 'must be blank', code: 422}]}
```

**Model.prototype.commit()**: Model

> Sets initial value of each model field to the current value of a field. This is how field change tracking is restarted.

**Model.prototype.defineField(name, {type, get, set, defaultValue, fakeValue, validate})**: Void

> Defines a new model property.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| name | String | Yes | - | Property name.
| type | String, Model | No | - | Data type (pass a Model to create a nested structure; check [typeable.js](https://github.com/xpepermint/validatablejs) for more).
| get | Function | No | - | Custom getter.
| set | Function | No | - | Custom setter.
| defaultValue | Any | No | - | Field default value.
| fakeValue | Any | No | - | Field fake value.
| validate | Array | No | - | List of validation recipies (check [validatable.js](https://github.com/xpepermint/validatablejs) for more).

**Model.prototype.defineType(name, converter)**: Void

> Defines a custom data type.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| name | String | Yes | - | Type name.
| converter | Function | Yes | - | Type converter.

**Model.prototype.defineValidator(name, handler)**: Void

> Defines a custom validator.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| name | String | Yes | - | Validator name.
| handler | Function, Promise | Yes | - | Validator handler.

**Model.prototype.equals(value)**: Boolean

> Returns `true` when the provided `value` represents an object with the same fields as the model itself.

**Model.prototype.failFast(fail)**: Void

> Configures validator to stop field validation on the first error.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| fail | Boolean | No | false | Stops field validation on the first error when set to `true`.

**Model.prototype.fake()**: Model

> Sets each model field to its fake value if a fake value generator is registered, otherwise the default value is used.

**Model.prototype.filter(handler)**: Object

> Converts a model into serialized data object with only the keys that pass the test.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| handler | Function | Yes | - | A function to test each key value. If the function returns `true` then the key is included in the returned object.

**Model.prototype.flatten()**: Array

> Converts the model into an array of fields.

```js
user.flatten(); // -> [{path: [...], field: ...}, ...]
```

**Model.prototype.getField(...keys)**: Field

> Returns a class instance of a field at path.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| keys | Array | Yes | - | Path to a field (e.g. `['book', 0, 'title']`).

**Model.prototype.handle(error, {quiet}): Promise(Model)**

> Tries to handle the `error` against each field handlers and populates model with possible errors.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| error | Any | Yes | - | Error to be handled.
| quiet | Boolean | No | true | When set to `false`, a handled validation error is thrown. This doesn't affect the unhandled errors (they are always thrown).

```js
try {
  // throws an error (e.g. you can call the `validate()` method)
}
catch (e) {
  model.handle(e);
}
```

**Model.prototype.hasErrors()**: Boolean

> Returns `true` when no errors exist (inverse of `isValid()`). Make sure that you call the `validate()` method first.

**Model.prototype.hasField(...keys)**: Boolean

> Returns `true` when a field path exists.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| keys | Array | Yes | - | Path to a field (e.g. `['book', 0, 'title']`).

**Model.prototype.isChanged()**: Boolean

> Returns `true` if at least one model field has been changed.

**Model.prototype.isNested()**: Boolean

> Returns `true` if nested fields exist.

**Model.prototype.isValid()**: Boolean

> Returns `true` when all model fields are valid (inverse of `hasErrors()`). Make sure that you call the `validate()` method first.

**Model.prototype.invalidate()**: Model

> Clears `errors` on all fields.

**Model.prototype.options**: Object

> Model options.

**Model.prototype.parent**: Model

> Parent model instance.

**Model.prototype.populate(data)**: Model

> Applies data to a model.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| data | Object | Yes | - | Data object.

**Model.prototype.reset()**: Model

> Sets each model field to its default value.

**Model.prototype.rollback()**: Model

> Sets each model field to its initial value (last committed value). This is how you can discharge model changes.

**Model.prototype.root**: Model

> The first model instance in a tree of models.

**Model.prototype.scroll(handler)**: Integer

> Scrolls through model fields and executes a handler on each field.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| handler | Function | Yes | - | A handler method which is executed for each field.

**Model.prototype.serialize()**: Object

> Converts a model into serialized data object.

**Model.prototype.validate({quiet})**: Promise(Model)

> Validates model fields, populates model with possible errors and throws a validation error if not all fields are valid unless the `quiet` is set to `true`.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| quiet | Boolean | No | true | When set to `false`, a validation error is thrown.

```js
try {
  await model.validate(); // throws a validation error when invalid fields exist
}
catch (e) {
  // `e` is a 422 validation error
}
```

### Field Class

**Field({type, get, set, defaultValue, fakeValue, validate, validators, handle, handlers, owner, failFast})**

> A model field.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| type | String, Model | No | - | Data type (pass a Model to create a nested structure).
| get | Function | No | - | Custom getter.
| set | Function | No | - | Custom setter.
| defaultValue | Any | No | - | Field default value.
| fakeValue | Any | No | - | Field fake value.
| validate | Array | No | - | List of validator recipes.
| handle | Array | No | - | List of error handler recipes.
| validators | Object | No | - | Custom validators.
| handlers | Object | No | - | Custom handlers.
| owner | Model | No | - | An instance of a Model which owns the field.
| failFast | Boolean | No | false | Stops validation on the first error when set to `true`.

**Field.prototype.clear()**: Field

> Sets field and related sub fields to `null`.

**Field.prototype.commit()**: Field

> Sets initial value to the current value. This is how field change tracking is restarted.

**Field.prototype.defaultValue**: Any

> A getter which returns the default field value.

**Field.prototype.errors**: Object[]

> List of field errors (sets the `validate` method).

**Field.prototype.equals(value)**: Boolean

> Returns `true` when the provided `value` represents an object that looks the same.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| value | Any | Yes | - | A value to compare to.

**Field.prototype.fake()**: Field

> Sets field to a generated fake value.

**Field.prototype.fakeValue**: Any

> A getter which returns a fake field value.

**Field.prototype.handle(error)**: Promise(Field)

> Validates the `value` and populates the `errors` property with errors.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| error | Any | Yes | - | Error to be handled.

**Field.prototype.hasErrors()**: Boolean

> Returns `true` when no errors exist (inverse of `isValid()`). Make sure that you call the `validate()` method first.

**Field.prototype.initialValue**: Any

> A getter which returns the last committed field value.

**Field.prototype.isChanged()**: Boolean

> Returns `true` if the field or at least one sub field have been changed.

**Field.prototype.isNested()**: Boolean

> Returns `true` if the field is a nested model.

**Field.prototype.isValid()**: Boolean

> Returns `true` if the field and all sub fields are valid (inverse of `hasErrors()`). Make sure that you call the `validate()` method first.

**Field.prototype.invalidate()**: Field

> Clears the `errors` field on all fields (the reverse of `validate()`).

**Field.prototype.options**: Object

> A getter which returns field options.

**Field.prototype.owner**: Model

> A getter which returns a reference to a Model instance on which the field is defined.

**Field.prototype.recipe**: Object

> A getter which returns a field recipe object.

**Field.prototype.reset()**: Field

> Sets the field to its default value.

**Field.prototype.rollback()**: Field

> Sets the field to its initial value (last committed value). This is how you can discharge field's changes.

**Field.prototype.type**: Any

> A getter which returns field type (set to `Model` for a nested structure).

**Field.prototype.validate()**: Promise(Field)

> Validates the `value` and populates the `errors` property with errors.

**Field.prototype.value**: Any

> Field current value (the actual model's property).

### Built-in Data Types

| Type | Description
|------|------------
| 'Any' | A value of different types (excluding arrays).
| ['Any'] | An array with values of different types.
| 'String' | A string value.
| ['String'] | An array of string values.
| 'Boolean' | A boolean value.
| ['Boolean'] | An array of boolean values.
| 'Number' | An integer or a float number.
| ['Number'] | An array of integer or float numbers.
| 'Integer' | An integer number.
| ['Integer'] | An array of integer numbers.
| 'Float' | A float number.
| ['Float'] | An array of float numbers.
| 'Date' | A date.
| ['Date'] | An array of dates.
| Function | Custom type.
| [Function] | Custom type.

### Built-in Validators

**absence**

> Validates that the specified field is blank.

**arrayExclusion**

> Validates that the specified field is not in an array of values.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| values | Array | Yes | - | Array of restricted values.

**arrayInclusion**

> Validates that the specified field is in an array of values.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| values | Array | Yes | - | Array of allowed values.

**arrayLength**

> Validates the size of an array.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| min | Number | No | - | Allowed minimum items count.
| minOrEqual | Number | No | - | Allowed minimum items count (allowing equal).
| max | Number | No | - | Allowed maximum items count.
| maxOrEqual | Number | No | - | Allowed maximum items count (allowing equal).

**block**

> Validates the specified field against the provided block function. If the function returns true then the field is treated as valid.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| block | Function,Promise | Yes | - | Synchronous or asynchronous function (e.g. `async () => true`)

```js
let recipe = {
  validator: 'block',
  message: 'must be present',
  async block (value, recipe) { return true }
};
```

**BSONObjectID**

> Validates that the specified field is a valid hex-encoded representation of a [MongoDB ObjectID](http://docs.mongodb.org/manual/reference/object-id/).

**numberSize**

> Validates the size of a number.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| min | Number | No | - | Allowed minimum value.
| minOrEqual | Number | No | - | Allowed minimum value (allowing equal).
| max | Number | No | - | Allowed maximum value.
| maxOrEqual | Number | No | - | Allowed maximum value (allowing equal).

**presence**

> Validates that the specified field is not blank.

**stringBase64**

> Validates that the specified field is base64 encoded string.

**stringDate**

> Validates that the specified field is a date string.

| Option | Type | Required | Default | Description
|--------|------|----------|----------|-----------
| iso | Boolean | No | false | When `true` only ISO-8601 date format is accepted.

**stringEmail**

> Validates that the specified field is an email.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| allowDisplayName | Boolean | No | false | When set to true, the validator will also match `name <address>`.
| allowUtf8LocalPart | Boolean | No | false | When set to false, the validator will not allow any non-English UTF8 character in email address' local part.
| requireTld | Boolean | No | true | When set to false, email addresses without having TLD in their domain will also be matched.

**stringExclusion**

> Checks if the string does not contain the seed.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| seed | String | Yes | - | The seed which should exist in the string.

**stringFQDN**

> Validates that the specified field is a fully qualified domain name (e.g. domain.com).

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| requireTld | Boolean | No | true | Require top-level domain name.
| allowUnderscores | Boolean | No | false | Allow string to include underscores.
| allowTrailingDot | Boolean | No | false | Allow string to include a trailing dot.

**stringHexColor**

> Validates that the specified field is a hexadecimal color string.

**stringHexadecimal**

> Validates that the specified field is a hexadecimal number.

**stringInclusion**

> Checks if the string contains the seed.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| seed | String | Yes | - | The seed which should exist in the string.

**stringJSON**

> Validates that the specified field is a JSON string.

**stringLength**

> Validates the length of the specified field.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| bytes | Boolean | No | false | When `true` the number of bytes is returned.
| min | Number | No | - | Allowed minimum number of characters.
| minOrEqual | Number | No | - | Allowed minimum value number of characters (allowing equal).
| max | Number | No | - | Allowed maximum number of characters.
| maxOrEqual | Number | No | - | Allowed maximum number of characters (allowing equal).

**stringLowercase**

> Validates that the specified field is lowercase.

**stringMatch**

> Validates that the specified field matches the pattern.

| Key | Type | Required | Default | Description
|-----|------|----------|---------|------------
| pattern | String | Yes | - | Regular expression pattern.
| modifiers | String | No | - | Regular expression modifiers.

**stringUppercase**

> Validates that the specified field is uppercase.

**stringUUID**

> Validates that the specified field is a [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier).

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| version | Integer | No | - | UUID version (1, 2, 3, 4 or 5).

### Built-in Handlers

**block**

> Checks if the provided block function succeeds.

| Option | Type | Required | Description
|--------|------|----------|------------
| block | Function,Promise | Yes | Synchronous or asynchronous function (e.g. `async () => true`).

```js
let recipe = {
  handler: 'block',
  message: 'is unknown error',
  async block (error, recipe) { return true }
};
```

**mongoUniqueness**

> Checks if the error represents a MongoDB unique constraint error.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| indexName | String | Yes | - | MongoDB collection's unique index name.

```js
let recipe = {
  handler: 'mongoUniqueness',
  message: 'is unknown error',
  indexName: 'uniqueEmail' // make sure that this index name exists in your MongoDB collection
};
```

## License (MIT)

```
Copyright (c) 2016+ Kristijan Sedlak <xpepermint@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated modelation files (the "Software"), to deal
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
