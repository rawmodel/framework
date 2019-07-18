import { Spec } from '@hayspec/spec';
import * as rawmodel from '..';

const spec = new Spec();

spec.test('exposed content', (ctx) => {
  ctx.true(!!rawmodel.isArray);
  ctx.true(!!rawmodel.isBoolean);
  ctx.true(!!rawmodel.isClassOf);
  ctx.true(!!rawmodel.isDate);
  ctx.true(!!rawmodel.isDeepEqual);
  ctx.true(!!rawmodel.isFloat);
  ctx.true(!!rawmodel.isFunction);
  ctx.true(!!rawmodel.isHex);
  ctx.true(!!rawmodel.isInfinite);
  ctx.true(!!rawmodel.isInstanceOf);
  ctx.true(!!rawmodel.isInteger);
  ctx.true(!!rawmodel.isNull);
  ctx.true(!!rawmodel.isNumber);
  ctx.true(!!rawmodel.isObject);
  ctx.true(!!rawmodel.isPresent);
  ctx.true(!!rawmodel.isString);
  ctx.true(!!rawmodel.isUndefined);
  ctx.true(!!rawmodel.isValue);
  ctx.true(!!rawmodel.normalize);
  ctx.true(!!rawmodel.realize);
  ctx.true(!!rawmodel.toArray);
  ctx.true(!!rawmodel.toBoolean);
  ctx.true(!!rawmodel.toDate);
  ctx.true(!!rawmodel.toFloat);
  ctx.true(!!rawmodel.toInteger);
  ctx.true(!!rawmodel.toNumber);
  ctx.true(!!rawmodel.toString);
});

export default spec;
