import { Model } from '@rawmodel/core';
import { Spec } from '@hayspec/spec';
import { createModel } from '../../..';

const spec = new Spec();

spec.test('generates model class', (ctx) => {
  const Klass = createModel();
  ctx.true(new Klass() instanceof Model);
});

export default spec;
