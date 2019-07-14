import { Spec } from '@hayspec/spec';
import { Prop } from '../../..';

const spec = new Spec();

spec.test('returns true if the property value can be set using strategy', (ctx) => {
  const prop = new Prop({
    populatable: ['foo'],
  });
  ctx.true(prop.isPopulatable());
  ctx.true(prop.isPopulatable('foo'));
  ctx.false(prop.isPopulatable('bar'));
});

export default spec;
