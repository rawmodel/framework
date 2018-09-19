import { Spec } from '@hayspec/spec';
import { ethAddressValidator } from '../..';

const spec = new Spec();

spec.test('fails when not a string', (ctx) => {
  ctx.false(ethAddressValidator()(true));
});

spec.test('fails on invalid address', (ctx) => {
  ctx.false(ethAddressValidator()('domain'));
  ctx.false(ethAddressValidator()('0x0'));
});

spec.test('passes on valid address', (ctx) => {
  ctx.true(ethAddressValidator()('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed'));
  ctx.true(ethAddressValidator()('0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359'));
  ctx.true(ethAddressValidator()('0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB'));
  ctx.true(ethAddressValidator()('0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb'));
});

export default spec;
