import { Spec } from '@hayspec/spec';
import { Prop } from '../../..';

const spec = new Spec();

spec.test('sets property value', (ctx) => {
  const prop = new Prop();
  ctx.is(prop.getValue(), null);
  prop.setValue('foo');
  ctx.is(prop.getValue(), 'foo');
  prop.setValue('bar');
  ctx.is(prop.getValue(), 'bar');
  prop.setValue(() => 'zak');
  ctx.is(prop.getValue(), 'zak');
});

spec.test('sets property value using strategy', (ctx) => {
  const prop = new Prop({
    populatable: ['foo'],
  });
  ctx.is(prop.getValue(), null);
  prop.setValue('100', 'bar');
  ctx.is(prop.getValue(), null);
  prop.setValue('200', 'foo');
  ctx.is(prop.getValue(), '200');
});

export default spec;
