import { Spec } from '@hayspec/spec';
import { Handler } from '@rawmodel/handler';
import { Prop } from '../../..';

const spec = new Spec();

spec.test('handles property errors and populates error codes', async (ctx) => {
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

export default spec;
