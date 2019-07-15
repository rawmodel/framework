import { Model } from '@rawmodel/core';
import { Spec } from '@hayspec/spec';
import { stringParser } from '@rawmodel/parsers';
import { stringLengthValidator } from '@rawmodel/validators';
import { createModel } from '../../..';

const spec = new Spec();

spec.test('generates empty model class', (ctx) => {
  const Klass = createModel({});
  ctx.true(new Klass() instanceof Model);
});

spec.test('generates model with properties', (ctx) => {
  const Klass = createModel({
    props: [
      { name: 'firstName' },
      { name: 'lastName' },
    ],
  });
  const data = {
    firstName: 'John',
    lastName: 'Smith',
  };
  const model = new Klass(data);
  ctx.deepEqual(model.serialize(), data);
});

spec.test('supports property custom getter', (ctx) => {
  const Klass = createModel({
    getters: {
      foo () { return () => 'foo'; },
    },
    props: [
      {
        name: 'firstName',
        get: 'foo',
      },
    ],
  });
  const model = new Klass();
  ctx.deepEqual(model.serialize(), {
    firstName: 'foo',
  });
});

spec.test('supports property custom setter', (ctx) => {
  const Klass = createModel({
    setters: {
      foo () { return () => 'foo'; },
    },
    props: [
      {
        name: 'firstName',
        set: 'foo',
      },
    ],
  });
  const model = new Klass({
    firstName: 'bar',
  });
  ctx.deepEqual(model.serialize(), {
    firstName: 'foo',
  });
});

spec.test('supports property default value', (ctx) => {
  const Klass = createModel({
    defaultValues: {
      smithName() { return 'Smith'; },
    },
    props: [
      {
        name: 'firstName',
        defaultValue: 'John',
      },
      {
        name: 'lastName',
        defaultValue: 'smithName',
      },
    ],
  });
  const model = new Klass();
  ctx.deepEqual(model.serialize(), {
    firstName: 'John',
    lastName: 'Smith',
  });
});

spec.test('supports property fake value', (ctx) => {
  const Klass = createModel({
    fakeValues: {
      smithName() { return 'Smith'; },
    },
    props: [
      {
        name: 'firstName',
        fakeValue: 'John',
      },
      {
        name: 'lastName',
        fakeValue: 'smithName',
      },
    ],
  });
  const model = new Klass().fake();
  ctx.deepEqual(model.serialize(), {
    firstName: 'John',
    lastName: 'Smith',
  });
});

spec.test('supports property empty value', (ctx) => {
  const Klass = createModel({
    emptyValues: {
      emptyString() { return ''; },
    },
    props: [
      {
        name: 'firstName',
        emptyValue: 'none',
      },
      {
        name: 'lastName',
        emptyValue: 'emptyString',
      },
    ],
  });
  const model = new Klass();
  ctx.deepEqual(model.serialize(), {
    firstName: 'none',
    lastName: '',
  });
});

spec.test('supports property parsers', (ctx) => {
  const Klass = createModel({
    parsers: {
      string: stringParser,
    },
    props: [
      {
        name: 'firstName',
        parse: {
          array: true,
          resolver: 'string',
        },
      },
    ],
  });
  const model = new Klass({
    firstName: 100,
  });
  ctx.deepEqual(model.serialize(), {
    firstName: ['100'],
  });
});

spec.test('supports property validators', async (ctx) => {
  const Klass = createModel({
    validators: {
      stringLength: stringLengthValidator,
    },
    props: [
      {
        name: 'firstName',
        validate: [
          {
            resolver: 'stringLength',
            code: 400,
            options: { min: 5 },
          },
        ],
      },
    ],
  });
  const model = new Klass({
    firstName: '123',
  });
  await ctx.throws(() => model.validate());
  ctx.deepEqual(model.collectErrors(), [
    { path: ['firstName'], errors: [400] },
  ]);
});

spec.test('supports property handlers', async (ctx) => {
  const Klass = createModel({
    handlers: {
      generalError() { return (e: any) => true; },
    },
    props: [
      {
        name: 'firstName',
        handle: [
          {
            resolver: 'generalError',
            code: 400,
          },
        ],
      },
    ],
  });
  const model = new Klass();
  await ctx.throws(() => model.handle(new Error(), { quiet: false }));
  ctx.deepEqual(model.collectErrors(), [
    { path: ['firstName'], errors: [400] },
  ]);
});

export default spec;
