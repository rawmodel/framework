import { Spec } from '@hayspec/spec';
import { Prop } from '../../..';

const spec = new Spec();

spec.test('populates property with fake value', (ctx) => {
  const prop = new Prop({
    fakeValue: 'baz',
  });
  prop.setValue('bar');
  prop.fake();
  ctx.is(prop.getValue(), 'baz');
});

export default spec;
