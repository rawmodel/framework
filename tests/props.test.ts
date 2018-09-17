import { Spec } from '@hayspec/spec';
import { Model, Prop, Handler, Validator } from '../src';

const spec = new Spec();

spec.test('config `defaultValue` option configures property default value', (ctx) => {
  const prop0 = new Prop({
    defaultValue: 'foo',
  });
  const prop1 = new Prop({
    defaultValue: () => 'bar',
  });
  ctx.is(prop0.getValue(), 'foo');
  ctx.is(prop1.getValue(), 'bar');
});

spec.test('config `emptyValue` option configures property empty value', (ctx) => {
  const prop0 = new Prop({
    emptyValue: 'foo',
  });
  const prop1 = new Prop({
    defaultValue: () => 'foo',
  });
  ctx.is(prop0.getValue(), 'foo');
  ctx.is(prop1.getValue(), 'foo');
});

spec.test('config `get` option sets property custom getter', (ctx) => {
  const prop = new Prop({
    get: (v) => `foo-${v}`,
  });
  ctx.is(prop.getValue(), null);
  prop.setValue('bar');
  ctx.is(prop.getValue(), 'foo-bar');
});

spec.test('config `set` option sets property custom setter', (ctx) => {
  const prop = new Prop({
    set: (v) => `foo-${v}`,
  });
  ctx.is(prop.getValue(), 'foo-null');
  prop.setValue('bar');
  ctx.is(prop.getValue(), 'foo-bar');
});

spec.test('methods `setValue` and `getValue` sets and gets property value', (ctx) => {
  const prop = new Prop();
  ctx.is(prop.getValue(), null);
  prop.setValue('foo');
  ctx.is(prop.getValue(), 'foo');
  prop.setValue('bar');
  ctx.is(prop.getValue(), 'bar');
  prop.setValue(() => 'zak');
  ctx.is(prop.getValue(), 'zak');
});

spec.test('method `setValue` sets property value using strategy', (ctx) => {
  const prop = new Prop({
    populatable: ['foo'],
  });
  ctx.is(prop.getValue(), null);
  prop.setValue('100', 'bar');
  ctx.is(prop.getValue(), null);
  prop.setValue('200', 'foo');
  ctx.is(prop.getValue(), '200');
});

spec.test('methods `setErrorCode` and `getErrorCode` sets and gets property error codes', (ctx) => {
  const prop = new Prop();
  ctx.deepEqual(prop.getErrorCodes(), []);
  prop.setErrorCodes(100, 200);
  ctx.deepEqual(prop.getErrorCodes(), [100, 200]);
});

spec.test('methods `getRawValue` returns raw property value', (ctx) => {
  const prop = new Prop();
  const value = () => true;
  prop.setValue(value);
  ctx.is(value, value);
});

spec.test('methods `getInitialValue` returns property value on last commit', (ctx) => {
  const prop = new Prop();
  prop.setValue('foo');
  prop.commit();
  prop.setValue('bar');
  ctx.is(prop.getInitialValue(), 'foo');
});

spec.test('methods `isModel` returns true if the property type represents a Model', (ctx) => {
  class User extends Model {}
  const prop = new Prop({
    cast: { handler: Model },
  });
  ctx.true(prop.isModel());
  prop.$config.cast.handler = User;
  ctx.true(prop.isModel());
  prop.$config.cast.handler = () => Model;
  ctx.false(prop.isModel());
});

spec.test('methods `isPopulatable` returns true if the property value can be set using strategy', (ctx) => {
  const prop = new Prop({
    populatable: ['foo'],
  });
  ctx.true(prop.isPopulatable());
  ctx.true(prop.isPopulatable('foo'));
  ctx.false(prop.isPopulatable('bar'));
});

spec.test('methods `isSerializable` returns true if the property value can be read using strategy', (ctx) => {
  const prop = new Prop({
    serializable: ['foo'],
  });
  ctx.true(prop.isSerializable());
  ctx.true(prop.isSerializable('foo'));
  ctx.false(prop.isSerializable('bar'));
});

spec.test('methods `isEmpty` returns true if the property value is empty', (ctx) => {
  const prop = new Prop();
  ctx.true(prop.isEmpty());
  prop.setValue(null);
  ctx.true(prop.isEmpty());
  prop.setValue('');
  ctx.true(prop.isEmpty());
  prop.setValue('foo');
  ctx.false(prop.isEmpty());
  prop.setValue([]);
  ctx.true(prop.isEmpty());
  prop.setValue([null]);
  ctx.false(prop.isEmpty());
});

spec.test('methods `isChanged` returns true if the property value has been changed', (ctx) => {
  const prop = new Prop();
  ctx.false(prop.isChanged());
  prop.setValue(null);
  ctx.false(prop.isChanged());
  prop.setValue('foo');
  prop.commit();
  ctx.false(prop.isChanged());
});

spec.test('methods `isEqual` returns true if the property value equals to the provided one', (ctx) => {
  const prop = new Prop();
  const fn = () => true;
  ctx.true(prop.isEqual(null));
  prop.setValue('foo');
  ctx.true(prop.isEqual('foo'));
  prop.setValue(fn);
  ctx.true(prop.isEqual(fn));
});

spec.test('methods `isValid` returns true if the property has no errors', (ctx) => {
  const prop = new Prop();
  ctx.true(prop.isValid());
});

spec.test('methods `reset` resets property to default value', (ctx) => {
  const prop = new Prop({
    defaultValue: 'foo',
  });
  prop.setValue('bar');
  prop.commit();
  prop.setValue('baz');
  prop.reset();
  ctx.is(prop.getValue(), 'foo');
});

spec.test('methods `fake` populates property with fake value', (ctx) => {
  const prop = new Prop({
    fakeValue: 'baz',
  });
  prop.setValue('bar');
  prop.fake();
  ctx.is(prop.getValue(), 'baz');
});

spec.test('methods `empty` clears property value', (ctx) => {
  const prop = new Prop({
    emptyValue: null,
  });
  prop.setValue('bar');
  prop.empty();
  ctx.is(prop.getValue(), null);
});

spec.test('methods `commit` copies property data to initial value', (ctx) => {
  const prop = new Prop();
  prop.setValue('foo');
  prop.commit();
  prop.setValue('baz');
  ctx.is(prop.getInitialValue(), 'foo');
});

spec.test('methods `rollback` reverts property to the last commited value', (ctx) => {
  const prop = new Prop();
  prop.setValue('foo');
  prop.commit();
  prop.setValue('baz');
  prop.rollback();
  ctx.is(prop.getValue(), 'foo');
});

spec.test('methods `validate` validates property and populates error codes', async (ctx) => {
  const validator = new Validator();
  const prop = new Prop({
    validator: () => validator,
    validate: [
      { code: 400, handler: (v) => false },
      { code: 401, handler: (v) => false },
    ],
  });
  await prop.validate();
  ctx.deepEqual(prop.getErrorCodes(), [400, 401]);
});

spec.test('methods `handle` handles property errors and populates error codes', async (ctx) => {
  const handler = new Handler();
  const prop = new Prop({
    handler: () => handler,
    handle: [
      { code: 400, handler: (e) => e === 'foo' },
      { code: 401, handler: (e) => e === 'foo' },
    ],
  });
  await prop.handle('foo');
  ctx.deepEqual(prop.getErrorCodes(), [400, 401]);
});

spec.test('methods `invalidate` clears property errors', (ctx) => {
  const prop = new Prop();
  prop.setErrorCodes(100, 200, 300);
  prop.invalidate();
  ctx.deepEqual(prop.getErrorCodes(), []);
});

export default spec;
