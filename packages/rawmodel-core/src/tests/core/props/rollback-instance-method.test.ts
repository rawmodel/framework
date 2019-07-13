import { Spec } from '@hayspec/spec';
import { Prop } from '../../..';

const spec = new Spec();

spec.test('reverts property to the last commited value', (ctx) => {
  const prop = new Prop();
  prop.setValue('foo');
  prop.commit();
  prop.setValue('baz');
  prop.rollback();
  ctx.is(prop.getValue(), 'foo');
});

export default spec;
