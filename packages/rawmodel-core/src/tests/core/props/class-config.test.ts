import { Spec } from '@hayspec/spec';
import { Prop } from '../../..';

const spec = new Spec();

spec.test('supports default value', (ctx) => {
  const prop0 = new Prop({
    defaultValue: 0,
  });
  const prop1 = new Prop({
    defaultValue: [], // empty value
  });
  const prop2 = new Prop({
    defaultValue: () => 'bar',
  });
  ctx.is(prop0.getValue(), 0);
  ctx.deepEqual(prop1.getValue(), []);
  ctx.is(prop2.getValue(), 'bar');
});

spec.test('supports empty value', (ctx) => {
  const prop0 = new Prop({
    emptyValue: 'foo',
  });
  const prop1 = new Prop({
    defaultValue: () => 'foo',
  });
  ctx.is(prop0.getValue(), 'foo');
  ctx.is(prop1.getValue(), 'foo');
});

spec.test('supports custom getter', (ctx) => {
  const prop = new Prop({
    getter: (v) => `foo-${v}`,
  });
  ctx.is(prop.getValue(), `foo-null`);
  prop.setValue('bar');
  ctx.is(prop.getValue(), 'foo-bar');
});

spec.test('supports custom setter', (ctx) => {
  const prop = new Prop({
    setter: (v) => `foo-${v}`,
  });
  ctx.is(prop.getValue(), null);
  prop.setValue('bar');
  ctx.is(prop.getValue(), 'foo-bar');
});

export default spec;
