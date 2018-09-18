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

### Defining Props

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

### Prop Default Value

We can set a `defaultValue` for each property which will automatically populate a property on creation.

The `defaultValue` can also be a method which returns a dynamic value. This function shares the context of a property instance thus you have access to all the features of the `Prop` class.

```ts
@prop({
  defaultValue () { return new Date() },
})
now: string;
```

### Prop Fake Value

Similar to default values, we can set a `fakeValue` for each property, to populate a property with fakes data when calling the `fake()` method.

The `fakeValue` can also be a method which returns a dynamic value. This function shares the context of a property instance, thus you have access to all the features of the `Prop` class.

```ts
@prop({
  fakeValue () { return new Date() },
})
today: string;
```

### Prop Empty Value

By default, all defined properties are set to `null`. Similar to default and fake value we can set an `emptyValue` option for each property, to automatically replace `null` values.

The `emptyValue` can also be a method which returns a dynamic value. Note that this function shares the context of a property instance, thus you have access to all the features of the `Prop` class.

```ts
@prop({
  fakeValue () { return '' },
})
name: string;
```

### Prop Value Transformation

A property can have a custom `getter` and a custom `setter`. These methods all share the context of a property instance, thus you have access to all the features of the `Prop` class.

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

Props are serializable by default and are thus included in the result object returned by the `serialize()` method. We can customize the output and include or exclude properties for different occasions by using serialization strategies.

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

**Model(data, config)**

> Abstract class which represents a strongly-typed JavaScript object.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| data | Object | No | - | Data for populating model properties.
| config.ctx | Any | No | - | Model context
| config.failFast | Boolean | No | false | When `true` the validation and error handling stops when the first error is found.
| config.parent | Model | Only when used as a submodel | - | Parent model instance.

```ts
class User extends Model {
  @prop({
    set(v) { return v; }, // [optional] custom setter
    get(v) { return v; }, // [optional] custom getter
    cast: { // [optional] property type casting
      handler(v) { return `${v}`; }, // [optional] type handler function
      array: false, // [optional] force to array type
    },
    defaultValue: 'Noname', // [optional] property default value (value or function)
    fakeValue: 'Noname', // [optional] property fake value (value or function)
    emptyValue: '', // [optional] property empty value (value or function)
    validate: [ // [optional] value validator recipes
      { // validator recipe (check validatable.js for more)
        handler(v) { return !!v; }, // [required] validator function (supports async)
        condition(v) { return true; }, // [optional] condition which switches the validation on/off
        code: 422, // [optional] error code
      },
    ],
    handle: [ // [optional] error handling recipies
      { // handler recipe
        handler(e) { return e.message === 'foo'; }, // [required] error handler function (supports async)
        condition(e) { return true; }, // [optional] condition which switches the handling on/off
        code: 422, // [optional] error code
      },
    ],
    populatable: ['input', 'internal'], // [optional] population strategies
    serializable: ['input', 'output'], // [optional] serialization strategies
    enumerable: true, // [optional] when set to `false` the property is not enumerable (ignored by `Object.keys()`)
  })
  name: string; // [required] typescript property definition
}
```

**Model.prototype.$config**: Object

> Model configuration data.

**Model.prototype.$props**: Object

> Model property instances.

**Model.prototype.applyErrors(errors)**: Model

> Deeply populates properties with the provided `errors`.

```ts
model.applyErrors([
  {
    path: ['books', 1, 'title'], // property path
    errors: [422, 500], // error codes
  },
]);
```

**Model.prototype.clone(data)**: Model

> Returns a new Model instance which is the exact copy of the original.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| data | Object | No | - | Data to override initial data.

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

**Model.prototype.empty()**: Model

> Sets all model properties to `null`.

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
user.flatten(); // -> [{ path: [...], property: ... }, ...]
```

**Model.prototype.getParent()**: Model

> Returns the parent model instance in a tree of models.

**Model.prototype.getProp(...keys)**: Prop

> Returns a class instance of a property at path.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| keys | Array | Yes | - | Path to a property (e.g. `['book', 0, 'title']`).

**Model.prototype.getRoot()**: Model

> Returns the first model instance in a tree of models.

**Model.prototype.handle(error, { quiet }): Promise(Model)**

> Tries to handle the `error` against each property handlers and populates the model with possible errors.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| error | Any | Yes | - | Error to be handled.
| quiet | Boolean | No | true | When set to `false`, a handled validation error is thrown. This doesn't affect the unhandled errors (they are always thrown).

```ts
try {
  await model.validate(e); // imagine it throws an error
} catch (e) {
  await model.handle(e);
}
```

**Model.prototype.isChanged()**: Boolean

> Returns `true` if at least one model property has been changed.
]

**Model.prototype.isEqual(value)**: Boolean

> Returns `true` when the provided `value` represents an object with the same properties as the model itself.

**Model.prototype.isProp(...keys)**: Boolean

> Returns `true` when a property path exists.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| keys | Array | Yes | - | Path to a property (e.g. `['book', 0, 'title']`).

**Model.prototype.isValid()**: Boolean

> Returns `true` when all model properties are valid. Make sure that you call the `validate()` method first.

**Model.prototype.invalidate()**: Model

> Clears `errors` on all properties.

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
} catch (e) {
  // `e` is a 422 validation error
}
```

### Prop Class

**Prop(config)**

> A model property.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| config.set | Function | No | - | Custom setter.
| config.get | Function | No | - | Custom getter.
| config.cast.handler | String, Model | No | - | Data type handler (pass a Model to create a nested structure).
| config.cast.array | Boolean | No | false | Force array type.
| config.defaultValue | Any | No | - | Prop default value.
| config.fakeValue | Any | No | - | Prop fake value.
| config.emptyValue | Any | No | - | Prop empty value.
| config.validator | Validator | No | Validator | Property validator instance.
| config.validate | Array | No | - | List of validator recipes.
| config.handler | Handler | No | Handler | Property error handler instance.
| config.handle | Array | No | - | List of error handler recipes.
| config.populatable | String[] | No | - | List of strategies for populating the property value.
| config.serializable | String[] | No | - | List of strategies for serializing the property value.
| config.enumerable | Boolean | No | true | Indicates that the property is enumerable.
| config.model | Model | No | null | Parent model instance.

**Prop.prototype.$config**: Object

> Property configuration object.

**Prop.prototype.empty()**: Prop

> Sets property and related subproperties to `null`.

**Prop.prototype.commit()**: Prop

> Sets initial value to the current value. This is how property change tracking is restarted.

**Prop.prototype.fake()**: Prop

> Sets property to a generated fake value.

**Prop.prototype.getErrorCodes()**: Number[]

> List of property error codes (sets the `validate` method).

**Prop.prototype.getInitialValue()**: Any

> Returns property initial value.

**Prop.prototype.getValue()**: Any

> Returns current property value.

**Prop.prototype.getRawValue()**: Any

> Returns current property raw value.

**Prop.prototype.handle(error)**: Promise(Prop)

> Validates the `value` and populates the `errors` property with errors.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| error | Any | Yes | - | Error to be handled.

**Prop.prototype.isArray()**: Boolean

> Returns `true` if the property is an array.

**Prop.prototype.isEmpty()**: Boolean

> Returns `true` if the property has no value.

**Prop.prototype.isEqual(value)**: Boolean

> Returns `true` when the provided `value` represents an object that looks the same.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| value | Any | Yes | - | A value to compare to.

**Prop.prototype.isChanged()**: Boolean

> Returns `true` if the property or at least one subproperty have been changed.

**Prop.prototype.isModel()**: Boolean

> Returns `true` if the property is a nested model.

**Prop.prototype.isPopulatable(strategy)**: Boolean

> Returns `true` if the property can be set.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| strategy | String | No | - | Populating strategy.

**Prop.prototype.isSerializable(strategy)**: Boolean

> Returns `true` if the property can be serialized.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| strategy | String | No | - | Serialization strategy.

**Prop.prototype.isValid()**: Boolean

> Returns `true` if the property and all subproperties are valid (inverse of `hasErrors()`). Make sure that you call the `validate()` method first.

**Prop.prototype.invalidate()**: Prop

> Clears the `errors` property on all properties (the reverse of `validate()`).

**Prop.prototype.reset()**: Prop

> Sets the property to its default value.

**Prop.prototype.rollback()**: Prop

> Sets the property to its initial value (last committed value). This is how you can discharge property's changes.

**Prop.prototype.serialize(strategy)**

> Returns a serialized property value.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| strategy | String | No | - | Serialization strategy.

**Prop.prototype.setValue(value)**

> Sets current property value.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| value | String | Yes | - | Arbitrary value.

**Prop.prototype.validate()**: Promise(Prop)

> Validates the `value` and populates the `errors` property with errors.

### Built-in Data Types

| Type | Description
|------|------------
| 'String' | String value.
| 'Boolean' | Boolean value.
| 'Number' | Integer or a float number.
| 'Integer' | Integer number.
| 'Float' | Float number.
| 'Date' | Date object.
| Model | Nested model instance.

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
