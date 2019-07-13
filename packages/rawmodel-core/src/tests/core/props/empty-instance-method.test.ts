import { Spec } from '@hayspec/spec';
import { Prop } from '../../..';

const spec = new Spec();

spec.test('clears property value', (ctx) => {
  const prop = new Prop({
    emptyValue: null,
  });
  prop.setValue('bar');
  prop.empty();
  ctx.is(prop.getValue(), null);
});

export default spec;
