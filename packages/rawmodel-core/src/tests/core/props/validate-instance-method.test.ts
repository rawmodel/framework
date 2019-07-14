import { Spec } from '@hayspec/spec';
import { Prop } from '../../..';

const spec = new Spec();

spec.test('validates property and populates error codes', async (ctx) => {
  const prop = new Prop({
    validate: [
      { code: 400, resolver: (v) => true },
      { code: 401, resolver: (v) => false },
    ],
  });
  await prop.validate();
  ctx.deepEqual(prop.getErrorCodes(), [401]);
});

export default spec;
