[![Build Status](https://travis-ci.org/rawmodel/framework.svg?branch=master)](https://travis-ci.org/rawmodel/framework)&nbsp;[![codecov](https://codecov.io/gh/rawmodel/framework/branch/master/graph/badge.svg)](https://codecov.io/gh/rawmodel/framework)

# RawModel.js

> Strongly-typed JavaScript object with support for validation and error handling.

This is a lightweight open source framework for the **server** and **browser** (using module bundler), written with [TypeScript](https://www.typescriptlang.org). It's actively maintained, well tested and already used in production environments. The source code is available on [GitHub](https://github.com/rawmodel/framework) where you can also find our [issue tracker](https://github.com/rawmodel/framework/issues).

## Introduction

RawModel provides a mechanism for creating strongly-typed data objects with built-in logic for unified data validation and error handling. It has a simple and intuitive API and tends to be a powerful, magic-free, minimalistic and unopinionated framework for writing application data layers where you have a complete control. It could be a perfect fit when writing an [Express.js](http://expressjs.com/) action, [GraphQL](http://graphql.org/) resolver or similar and it's easily extendable.

## Installation

Run the command below to install the package.

```
$ npm install --save @rawmodel/core
```

This package uses promises thus you need to use [Promise polyfill](https://github.com/taylorhakes/promise-polyfill) when promises are not supported.

## Example

The code below shows a basic usage example.

```ts
import { Model } from '@rawmodel/core';

// defining a basic model
class User extends Model {
  @prop()
  public name: string;
}

// usage example
const model = new User({
  'name': 'John Smith'
});
model.name; // => 'John Smith'
```

## Usage

Below we explain some of the most important features that this framework provides. Please check the API section to see a complete list of features.

### Defining Fields

Model properties are defined using the `prop` ES6 decorator. The code below is an example of a basic model class with a `name` property.

```ts
import { Model } from 'rawmodel';

class User extends Model {
  @prop()
  public name: string;
}

const user = new User();
user.name = 'John Smith';
user.name; // -> "John Smith"
```

### Type Casting

Each property has a built-in system for type casting, thus we can force a value to be automatically converted to a specific type when setting a value.

```ts
@prop({
  cast: { handler: 'String' },
})
name: string;
```

Common types are supported by default. A `Model` also represents a type handler.

```ts
class User extends Model {}
...
@prop({
  cast: { handler: User, array: true },
})
user: User[];
```

You can use your own handler function. Please see the API section for further details.

### Nested Models

As mentioned above, a model class is already a type handler. This way you can create complex nested structures by nesting models as shown in the example below.

```ts
class Book extends Model {
  @prop()
  title: string;
}

class User extends Model {
  @prop({
    cast: { handler: Book },
  })
  book: Book;
}
```

### Field Default Value

We can set a `defaultValue` for each property which will automatically populate a property on creation.

The `defaultValue` can also be a method which returns a dynamic value. This function shares the context of a property instance thus you have access to all the features of the `Field` class.

```ts
@prop({
  defaultValue () { return new Date() },
})
now: string;
```

### Field Fake Value

Similar to default values, we can set a `fakeValue` for each property, to populate a property with fakes data when calling the `fake()` method.

The `fakeValue` can also be a method which returns a dynamic value. This function shares the context of a property instance, thus you have access to all the features of the `Field` class.

```ts
@prop({
  fakeValue () { return new Date() },
})
today: string;
```

### Field Empty Value

By default, all defined properties are set to `null`. Similar to default and fake value we can set an `emptyValue` option for each property, to automatically replace `null` values.

The `emptyValue` can also be a method which returns a dynamic value. Note that this function shares the context of a property instance, thus you have access to all the features of the `Field` class.

```ts
@prop({
  fakeValue () { return '' },
})
name: string;
```

### Field Value Transformation

A property can have a custom `getter` and a custom `setter`. These methods all share the context of a property instance, thus you have access to all the features of the `Field` class.

```ts
@prop({
  get (value) { return value },
  set (value) { return value },
})
name: string;
```

### Value Assignments

Model's properties are like properties on a Javascript Object. We can easily assign a value to a property through its setter method (e.g. `model.name = 'value';`). Instead of assigning properties one by one, we can use the `populate()` method as shown below.

```ts
model.populate({
  'name': 'John Smith',
  'age': 35,
});
```

We can allow only selected properties to be populated by using population strategies (e.g. populating data received from a form ).

```ts
class User extends Model {
  @prop({
    populatable: ['internal'], // list population strategy names
  })
  public id: string;
  @prop({
    populatable: ['input', 'internal'], // list population strategy names
  })
  public name: string;
}

const data = {
  'id': 100,
  'name': 'John Smith'
};
const user = new User();
user.populate(data); // -> { "id": 100, "name": "John Smith" }
user.populate(data, 'internal'); // -> { "id": 100, "name": "John Smith" }
user.serialize(data, 'input'); // -> { id: null, "name": "John Smith" }
```

### Serialization & Filtering

Model provides useful methods for object serialization and filtering (check the API for more methods).

```ts
const user = new User({
  'name': 'John Smith', // initial value
});

user.scroll(function(property) { // argument is an instance of a property
  // do something useful
}).then((count) => { // number of processed properties
  user.serialize(); // -> { "name": "John Smith" }
});
```

Fields are serializable by default and are thus included in the result object returned by the `serialize()` method. We can customize the output and include or exclude properties for different occasions by using serialization strategies.

```ts
class User extends Model {
  @prop({
    serializable: ['output'], // list serialization strategy names
  })
  public id: string;
  @prop({
    serializable: ['input', 'output'], // list serialization strategy names
  })
  public name: string;
}

const user = new User({
  'id': 100,
  'name': 'John Smith',
});
user.serialize(); // -> { "id": 100, "name": "John Smith" }
user.serialize('input'); // -> { "name": "John Smith" }
user.serialize('output'); // -> { "id": 100, "name": "John Smith" }
```

### Commits & Rollbacks

RawModel tracks changes for all properties and provides a mechanism for committing values and rollbacks.

```ts
class User extends Model {
  @prop()
  public name: string;
}

const user = new User();
user.name = 'Mandy Taylor'; // changing property's value
user.isChanged(); // -> true
user.commit(); // set `initialValue` of each property to the value of  `value`
user.isChanged(); // -> false
user.name = 'Tina Fey'; // changing property's value
user.rollback(); // -> reset `value` of each property to its `initialValue` (last committed value)
```

Note that the `commit` method will memorize a serialized data and the `rollback` method will apply it back. Assigning functions or instances to properties is discourages.

### Validation

RawModel provides a simple mechanism for validating properties.

```ts
class User extends Model {
  @prop({
    validate: [ // property validation setup
      { // validator recipe
        handler: (v) => !!v, // [required] validator function
        code: 422, // [optional] error code
        condition () { return true }, // [optional] condition which switches the validation on/off
      },
    ],
  })
  public name: string;
}

const user = new User();
user.validate().catch((err) => {
  user.collectErrors(); // -> [{path: ['name'], errors: [{validator: 'presence', message: 'is must be present', code: 422}]}]
});
```

### Error Handling

RawModel provides a mechanism for handling property-related errors. The logic is aligned with the validation thus the validation and the error handling can easily be managed in a unified way. This is great because we always deal with validation errors and can thus directly send these errors back to a user in a unified format.

```ts
class User extends Model {
  @prop({
    handle: [ // property error handling setup
      { // handler recipe
        handler: (e) => e.message === 'foo', // [required] errir handler function
        code: 422, // [optional] error code
        condition () { return true }, // [optional] condition which switches the handling on/off
      },
    ],
  })
  public name: string;
}

const error = new Error();
lconstet user = new User();
user.handle(error).then(() => {
  user.collectErrors(); // -> [{ path: ['name'], errors: [{ handler: 'block', message: 'is unknown', code: 422 }] }]
});
```

This mechanism is especially handful when saving data to a database. MongoDB could, for example, throw a uniqueness error (E11000) if we try to insert a value that already exists in the database. We can catch that error by using the `handle()` method and then return a unified validation error message to a user.

### GraphQL

RawModel.js can be a perfect framework for writing GraphQL resolvers. An instance of a root model, in our case the `App` class, can represent GraphQL's `rootValue`.

```ts
import { Model } from 'rawmodel';
import { graphql, buildSchema } from 'graphql';

class App extends Model { // root resolver
  public hello() { // `hello` property resolver
    return 'Hello World!';
  }
}

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = new App(); // root resolver

graphql(schema, '{ hello }', root).then((response) => {
  console.log(response);
});
```

## API

### Model Class

**Model(data, )**

> Abstract class which represents a strongly-typed JavaScript object.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| data | Object | No | - | Data for populating model properties.
| parent | Model | Only when used as a submodel | - | Parent model instance.

```ts
class User extends Model {
  public name: string;

  public constructor({ parent, ...data } = {}) {
    super({ parent }); // initializing the Model

    this.defineField('name', {
      type: 'String', // [optional] property type casting
      populatable: ['input', 'internal'], // [optional] population strategies
      serializable: ['input', 'output'], // [optional] serialization strategies
      enumerable: true, // [optional] when set to `false` the property is not enumerable (ignored by `Object.keys()`)
      get (v) { return v }, // [optional] custom getter
      set (v) { return v }, // [optional] custom setter
      validate: [ // [optional] value validator recipes
        { // validator recipe (check validatable.js for more)
          validator: 'presence', // [required] validator name
          condition () { return true }, // [optional] condition which switches the validation on/off
          message: '%{it} must be present', // [optional] error message
          code: 422, // [optional] error code
          it: 'it' // [optional] custom variable for the `message`
        }
      ],
      handle: [ // [optional] error handling recipies
        { // handler recipe
          handler: 'block', // [optional] handler name
          condition () { return true }, // [optional] condition which switches the handling on/off
          message: '%{is} unknown', // [optional] error message
          code: 422, // [optional] error code
          block (error) { return true }, // [optional] handler-specific function
          is: 'is' // [optional] custom variable for the `message`
        }
      ],
      defaultValue: 'Noname', // [optional] property default value (value or function)
      fakeValue: 'Noname', // [optional] property fake value (value or function)
    });

    this.populate(data); // [optional] a good practice to enable data population from model constructor
    this.commit(); // [optional] a good practice to commit default data
  }
}
```

**Model.prototype.applyErrors(errors)**: Model

> Deeply populates properties with the provided `errors`.

```ts
model.applyErrors([
  {
    path: ['books', 1, 'title'], // property path
    errors: [
      {
        validator: 'presence', // or handler: ''
        message: 'is required',
        code: 422,
      },
    ],
  },
]);
```

**Model.prototype.clear()**: Model

> Sets all model properties to `null`.

**Model.prototype.clone()**: Model

> Returns a new Model instance which is the exact copy of the original.

**Model.prototype.collect(handler)**: Array

> Scrolls through model properties and collects results.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| handler | Function | Yes | - | A handler method which is executed for each property.

**Model.prototype.collectErrors()**: Array

> Returns a list of errors for all the properties ({path, errors}[]).

```ts
model.collectErrors(); // => { path: ['name'], errors: [{ validator: 'absence', message: 'must be blank', code: 422 }] }
```

**Model.prototype.commit()**: Model

> Sets initial value of each model property to the current value of a property. This is how property change tracking is restarted.

**Model.prototype.defineField(name, { type, populatable, serializable, enumerable, get, set, defaultValue, fakeValue, validate })**: Void

> Defines a new model property.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| name | String | Yes | - | Property name.
| populatable | String[] | No | undefined | Population strategies (used by `.populate()`).
| serializable | String[] | No | undefined | Serialization strategies (used by `.serialize()`).
| enumerable | Boolean | No | true | When set to `false` the property is not enumerable (ignored by `Object.keys()`).
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

> Returns `true` when the provided `value` represents an object with the same properties as the model itself.

**Model.prototype.failFast(fail)**: Void

> Configures validator to stop property validation on the first error.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| fail | Boolean | No | false | Stops property validation on the first error when set to `true`.

**Model.prototype.fake()**: Model

> Sets each model property to its fake value if the fake value generator is defined.

**Model.prototype.filter(handler)**: Object

> Converts a model into serialized data object with only the keys that pass the test.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| handler | Function | Yes | - | A function to test each key value. If the function returns `true` then the key is included in the returned object.

**Model.prototype.flatten()**: Array

> Converts the model into an array of properties.

```ts
user.flatten(); // -> [{path: [...], property: ...}, ...]
```

**Model.prototype.getField(...keys)**: Field

> Returns a class instance of a property at path.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| keys | Array | Yes | - | Path to a property (e.g. `['book', 0, 'title']`).

**Model.prototype.handle(error, { quiet }): Promise(Model)**

> Tries to handle the `error` against each property handlers and populates the model with possible errors.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| error | Any | Yes | - | Error to be handled.
| quiet | Boolean | No | true | When set to `false`, a handled validation error is thrown. This doesn't affect the unhandled errors (they are always thrown).

```ts
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

> Returns `true` when a property path exists.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| keys | Array | Yes | - | Path to a property (e.g. `['book', 0, 'title']`).

**Model.prototype.isChanged()**: Boolean

> Returns `true` if at least one model property has been changed.

**Model.prototype.isNested()**: Boolean

> Returns `true` if nested properties exist.

**Model.prototype.isValid()**: Boolean

> Returns `true` when all model properties are valid (inverse of `hasErrors()`). Make sure that you call the `validate()` method first.

**Model.prototype.invalidate()**: Model

> Clears `errors` on all properties.

**Model.prototype.options**: Object

> Model options.

**Model.prototype.parent**: Model

> Parent model instance.

**Model.prototype.populate(data, strategy)**: Model

> Applies data to a model.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| data | Object | Yes | - | Data object.
| strategy | String | No | - | When the strategy name is provided, only the properties where the `populatable` option includes this strategy name are populated. If the parameter is not provided then all properties are included in the process.

**Model.prototype.reset()**: Model

> Sets each model property to its default value.

**Model.prototype.rollback()**: Model

> Sets each model property to its initial value (last committed value). This is how you can discharge model changes.

**Model.prototype.root**: Model

> The first model instance in a tree of models.

**Model.prototype.scroll(handler)**: Integer

> Scrolls through model properties and executes a handler on each property.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| handler | Function | Yes | - | A handler method which is executed for each property.

**Model.prototype.serialize(strategy)**: Object

> Converts a model into serialized data object.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| strategy | String | No | - | When the strategy name is provided, the output will include only the properties where the `serializable` option includes this strategy name. If the parameter is not provided then all properties are included in the result.

**Model.prototype.validate({ quiet })**: Promise(Model)

> Validates model properties, populates the model with possible errors and throws a validation error if not all properties are valid unless the `quiet` is set to `true`.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| quiet | Boolean | No | true | When set to `false`, a validation error is thrown.

```ts
try {
  await model.validate(); // throws a validation error when invalid properties exist
}
catch (e) {
  // `e` is a 422 validation error
}
```

### Field Class

**Field({ type, get, set, defaultValue, fakeValue, validate, validators, handle, handlers, owner, failFast })**

> A model property.

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
| owner | Model | No | - | An instance of a Model which owns the property.
| failFast | Boolean | No | false | Stops validation on the first error when set to `true`.

**Field.prototype.cast(value)**: Any

> Returns transformed value based on property's type.

**Field.prototype.clear()**: Field

> Sets property and related subproperties to `null`.

**Field.prototype.commit()**: Field

> Sets initial value to the current value. This is how property change tracking is restarted.

**Field.prototype.defaultValue**: Any

> A getter which returns the default property value.

**Field.prototype.errors**: Object[]

> List of property errors (sets the `validate` method).

**Field.prototype.equals(value)**: Boolean

> Returns `true` when the provided `value` represents an object that looks the same.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| value | Any | Yes | - | A value to compare to.

**Field.prototype.fake()**: Field

> Sets property to a generated fake value.

**Field.prototype.fakeValue**: Any

> A getter which returns a fake property value.

**Field.prototype.handle(error)**: Promise(Field)

> Validates the `value` and populates the `errors` property with errors.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| error | Any | Yes | - | Error to be handled.

**Field.prototype.hasErrors()**: Boolean

> Returns `true` when no errors exist (inverse of `isValid()`). Make sure that you call the `validate()` method first.

**Field.prototype.initialValue**: Any

> A getter which returns the last committed property value.

**Field.prototype.isChanged()**: Boolean

> Returns `true` if the property or at least one subproperty have been changed.

**Field.prototype.isNested()**: Boolean

> Returns `true` if the property is a nested model.

**Field.prototype.isValid()**: Boolean

> Returns `true` if the property and all subproperties are valid (inverse of `hasErrors()`). Make sure that you call the `validate()` method first.

**Field.prototype.invalidate()**: Field

> Clears the `errors` property on all properties (the reverse of `validate()`).

**Field.prototype.options**: Object

> A getter which returns property options.

**Field.prototype.owner**: Model

> A getter which returns a reference to a Model instance on which the property is defined.

**Field.prototype.recipe**: Object

> A getter which returns a property recipe object.

**Field.prototype.reset()**: Field

> Sets the property to its default value.

**Field.prototype.rollback()**: Field

> Sets the property to its initial value (last committed value). This is how you can discharge property's changes.

**Field.prototype.type**: Any

> A getter which returns property type (set to `Model` for a nested structure).

**Field.prototype.validate()**: Promise(Field)

> Validates the `value` and populates the `errors` property with errors.

**Field.prototype.value**: Any

> Field current value (the actual model's property).

### Built-in Data Types

| Type | Description
|------|------------
| 'String' | A string value.
| 'Boolean' | A boolean value.
| 'Number' | An integer or a float number.
| 'Integer' | An integer number.
| 'Float' | A float number.
| 'Date' | A date.

**NOTE:** Field data type should always represent a `value`. This means that you should never assign a `function` to a property. If you need to handle dynamic property values, please use [property value transformations](#property-value-transformation) instead. You can also define your own data type by using the `defineType` method.

### Built-in Validators

**absence**

> Validates that the specified property is blank.

**arrayExclusion**

> Validates that the specified property is not in an array of values.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| values | Array | Yes | - | Array of restricted values.

**arrayInclusion**

> Validates that the specified property is in an array of values.

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

> Validates the specified property against the provided block function. If the function returns true then the property is treated as valid.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| block | Function,Promise | Yes | - | Synchronous or asynchronous function (e.g. `async () => true`)

```ts
const recipe = {
  validator: 'block',
  message: 'must be present',
  async block (value, recipe) { return true },
};
```

**numberSize**

> Validates the size of a number.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| min | Number | No | - | Allowed minimum value.
| minOrEqual | Number | No | - | Allowed minimum value (allowing equal).
| max | Number | No | - | Allowed maximum value.
| maxOrEqual | Number | No | - | Allowed maximum value (allowing equal).

**presence**

> Validates that the specified property is not blank.

**stringBase64**

> Validates that the specified property is base64 encoded string.

**stringDate**

> Validates that the specified property is a date string.

| Option | Type | Required | Default | Description
|--------|------|----------|----------|-----------
| iso | Boolean | No | false | When `true` only ISO-8601 date format is accepted.

**stringEmail**

> Validates that the specified property is an email.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| allowDisplayName | Boolean | No | false | When set to true, the validator will also match `name <address>`.
| allowUtf8LocalPart | Boolean | No | false | When set to false, the validator will not allow any non-English UTF8 character in email address' local part.
| requireTld | Boolean | No | true | When set to false, email addresses without having TLD in their domain will also be matched.

**stringETHAddress**

> Checks if the string represents an ethereum address.

**stringExclusion**

> Checks if the string does not contain the seed.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| seed | String | Yes | - | The seed which should exist in the string.

**stringFQDN**

> Validates that the specified property is a fully qualified domain name (e.g. domain.com).

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| requireTld | Boolean | No | true | Require top-level domain name.
| allowUnderscores | Boolean | No | false | Allow string to include underscores.
| allowTrailingDot | Boolean | No | false | Allow string to include a trailing dot.

**stringHexColor**

> Validates that the specified property is a hexadecimal color string.

**stringHexadecimal**

> Validates that a specified property is a hexadecimal number.

**stringInclusion**

> Checks if the string contains the seed.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| seed | String | Yes | - | The seed which should exist in the string.

**stringJSON**

> Validates that the specified property is a JSON string.

**stringLength**

> Validates the length of the specified property.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| bytes | Boolean | No | false | When `true` the number of bytes is returned.
| min | Number | No | - | Allowed minimum number of characters.
| minOrEqual | Number | No | - | Allowed minimum value number of characters (allowing equal).
| max | Number | No | - | Allowed maximum number of characters.
| maxOrEqual | Number | No | - | Allowed maximum number of characters (allowing equal).

**stringLowercase**

> Validates that the specified property is lowercase.

**stringMatch**

> Validates that the specified property matches the pattern.

| Key | Type | Required | Default | Description
|-----|------|----------|---------|------------
| regexp | RegExp | Yes | - | Regular expression pattern.

**stringUppercase**

> Validates that the specified property is uppercase.

**stringUUID**

> Validates that the specified property is a [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier).

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| version | Integer | No | - | UUID version (1, 2, 3, 4 or 5).

### Built-in Handlers

**block**

> Checks if the provided block function succeeds.

| Option | Type | Required | Description
|--------|------|----------|------------
| block | Function,Promise | Yes | Synchronous or asynchronous function (e.g. `async () => true`).

```ts
const recipe = {
  handler: 'block',
  message: 'is unknown error',
  async block (error, recipe) { return true },
};
```

**mongoUniqueness**

> Checks if the error represents a MongoDB unique constraint error.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| indexName | String | Yes | - | MongoDB collection's unique index name.

```ts
const recipe = {
  handler: 'mongoUniqueness',
  message: 'is unknown error',
  indexName: 'uniqueEmail', // make sure that this index name exists in your MongoDB collection
};
```

## Packages

| Package | Description | Version
|-|-|-
| [@rawmodel/core](https://github.com/rawmodel/framework/tree/master/packages/rawmodel-core) | Model and property classes. | [![NPM Version](https://badge.fury.io/js/@rawmodel%2Fcore.svg)](https://badge.fury.io/js/%40rawmodel%2Fcore)
| [@rawmodel/handler](https://github.com/rawmodel/framework/tree/master/packages/rawmodel-handler) | Property error handler. | [![NPM Version](https://badge.fury.io/js/@rawmodel%2Fhandler.svg)](https://badge.fury.io/js/%40rawmodel%2Fhandler)
| [@rawmodel/parser](https://github.com/rawmodel/framework/tree/master/packages/rawmodel-parser) | Parsing and type casting. | [![NPM Version](https://badge.fury.io/js/@rawmodel%2Fparser.svg)](https://badge.fury.io/js/%40rawmodel%2Fparser)
| [@rawmodel/utils](https://github.com/rawmodel/framework/tree/master/packages/rawmodel-utils) | Framework helpers. | [![NPM Version](https://badge.fury.io/js/@rawmodel%2Futils.svg)](https://badge.fury.io/js/%40rawmodel%2Futils)
| [@rawmodel/validator](https://github.com/rawmodel/framework/tree/master/packages/rawmodel-validator) | Property validator. | [![NPM Version](https://badge.fury.io/js/@rawmodel%2Fvalidator.svg)](https://badge.fury.io/js/%40rawmodel%2Fvalidator)

## Contributing

See [CONTRIBUTING.md](https://github.com/rawmodel/framework/blob/master/CONTRIBUTING.md) for how to help out.

## Licence

See [LICENSE](https://github.com/rawmodel/framework/blob/master/LICENCE) for details.
