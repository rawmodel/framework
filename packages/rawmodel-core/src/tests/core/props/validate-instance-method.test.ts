import { Spec } from '@hayspec/spec';
import { Validator } from '@rawmodel/validator';
import { Prop } from '../../..';

const spec = new Spec();

spec.test('validates property and populates error codes', async (ctx) => {
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

export default spec;
