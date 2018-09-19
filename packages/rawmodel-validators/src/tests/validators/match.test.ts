import { Spec } from '@hayspec/spec';
import { matchValidator } from '../..';

const spec = new Spec();

spec.test('passes with a valid pattern', (ctx) => {
  ctx.true(matchValidator({ regexp: /me/i })('me'));
});

export default spec;
