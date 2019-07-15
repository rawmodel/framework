import { Model } from '@rawmodel/core';
import { Spec } from '@hayspec/spec';
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

spec.test('supports property default value', (ctx) => {
  const Klass = createModel({
    props: [{
      name: 'firstName',
      defaultValue: 'default',
    }],
  });
  const model = new Klass();
  ctx.deepEqual(model.serialize(), { firstName: 'default' });
});

spec.test('supports property fake value', (ctx) => {
  const Klass = createModel({
    props: [{
      name: 'firstName',
      fakeValue: 'fake',
    }],
  });
  const model = new Klass().fake();
  ctx.deepEqual(model.serialize(), { firstName: 'fake' });
});

spec.test('supports property empty value', (ctx) => {
  const Klass = createModel({
    props: [
      {
        name: 'firstName',
        emptyValue: 'none',
      },
    ],
  });
  const model = new Klass();
  ctx.deepEqual(model.serialize(), { firstName: 'none' });
});

spec.test('supports property parsers', (ctx) => {
  const Klass = createModel({
    props: [
      {
        name: 'firstName',
        parse: { resolver: 'string' },
      },
    ],
  });
  const model = new Klass({
    firstName: 100,
  });
  console.log(model.serialize());
  ctx.deepEqual(model.serialize(), {
    firstName: '100',
  });
});

export default spec;
