import { Spec } from '@hayspec/spec';
import { emailValidator } from '../..';

const spec = new Spec();

spec.test('fails when not a string', (ctx) => {
  ctx.false(emailValidator()(true));
});

spec.test('fails when invalid', (ctx) => {
  ctx.false(emailValidator()('john'));
});

spec.test('fails when display name', (ctx) => {
  ctx.false(emailValidator()('John <john@domain.com>'));
});

spec.test('fails with UTF8 characters', (ctx) => {
  ctx.false(emailValidator()('šžćč@domain.com'));
});

spec.test('fails without top-level domain name', (ctx) => {
  ctx.false(emailValidator()('john@domain'));
});

spec.test('fails without top-level domain name', (ctx) => {
  ctx.true(emailValidator({ requireTld: false })('john@domain'));
  ctx.false(emailValidator({ requireTld: true })('john@domain'));
});

spec.test('passes with display name when allowDisplayName is true', (ctx) => {
  ctx.true(emailValidator({ allowDisplayName: true })('John <john@domain.com>'));
  ctx.false(emailValidator({ allowDisplayName: false })('John <john@domain.com>'));
});

spec.test('passes with UTF8 characters when allowUtf8LocalPart is true', (ctx) => {
  ctx.true(emailValidator({ allowUtf8LocalPart: true })('đšpŽĆČ@domain.com'));
  ctx.false(emailValidator({ allowUtf8LocalPart: false })('đšpŽĆČ@domain.com'));
});

export default spec;
