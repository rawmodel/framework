import { Spec } from '@hayspec/spec';
import { Prop } from '../../..';

const spec = new Spec();

spec.test('handles property errors and populates error codes', async (ctx) => {
  const prop = new Prop({
    handle: [
      { code: 400, resolver: (e) => e === 'foo' },
      { code: 401, resolver: (e) => e === 'foo' },
    ],
  });
  await prop.handle('foo');
  ctx.deepEqual(prop.getErrorCodes(), [400]);
});

export default spec;
