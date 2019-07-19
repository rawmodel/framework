import { Spec } from '@hayspec/spec';
import { base64Validator } from '../..';

const spec = new Spec();

spec.test('fails when not a string', (ctx) => {
  ctx.false(base64Validator()(true));
});

spec.test('fails when invalid', (ctx) => {
  ctx.false(base64Validator()('1'));
  ctx.false(base64Validator()('12345'));
  ctx.false(base64Validator()(''));
  ctx.false(base64Validator()('Vml2YW11cyBmZXJtZtesting123'));
  ctx.false(base64Validator()('Zg='));
  ctx.false(base64Validator()('Z==='));
  ctx.false(base64Validator()('Zm=8'));
  ctx.false(base64Validator()('=m9vYg=='));
  ctx.false(base64Validator()('Zm9vYmFy===='));
});

spec.test('passes when value not present', (ctx) => {
  ctx.true(base64Validator()(undefined));
  ctx.true(base64Validator()(null));
});

spec.test('passes when valid', (ctx) => {
  ctx.true(base64Validator()('Zg=='));
  ctx.true(base64Validator()('Zm8='));
  ctx.true(base64Validator()('Zm9v'));
  ctx.true(base64Validator()('Zm9vYg=='));
  ctx.true(base64Validator()('Zm9vYmE='));
  ctx.true(base64Validator()('Zm9vYmFy'));
  ctx.true(base64Validator()('dGVzdA=='));
  ctx.true(base64Validator()('TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4='));
  ctx.true(base64Validator()('Vml2YW11cyBmZXJtZW50dW0gc2VtcGVyIHBvcnRhLg=='));
  ctx.true(base64Validator()('U3VzcGVuZGlzc2UgbGVjdHVzIGxlbw=='));
  ctx.true(base64Validator()('MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuMPNS1Ufof9EW/M98FNwUAKrwflsqVxaxQjBQnHQmiI7Vac40t8x7pIb8gLGV6wL7sBTJiPovJ0V7y7oc0YerhKh0Rm4skP2z/jHwwZICgGzBvA0rH8xlhUiTvcwDCJ0kc+fh35hNt8srZQM4619FTgB66Xmp4EtVyhpQV+t02g6NzK72oZI0vnAvqhpkxLeLiMCyrI416wHm5TkukhxQmcL2a6hNOyu0ixX/x2kSFXApEnVrJ+/IxGyfyw8kf4N2IZpW5nEP847lpfj0SZZFwrd1mnfnDbYohX2zRptLy2ZUn06Qo9pkG5ntvFEPo9bfZeULtjYzIl6K8gJ2uGZHQIDAQAB'));
});

export default spec;
