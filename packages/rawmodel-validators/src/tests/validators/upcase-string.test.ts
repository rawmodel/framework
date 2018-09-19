import { Spec } from '@hayspec/spec';
import { upcaseStringValidator } from '../..';

const spec = new Spec();

spec.test('fails when not a string', (ctx) => {
  ctx.false(upcaseStringValidator()(true));
});

spec.test('fails when invalid', (ctx) => {
  ctx.false(upcaseStringValidator()('Hello'));
});

spec.test('passes when valid', (ctx) => {
  ctx.true(upcaseStringValidator()('HELLO'));
});

export default spec;
