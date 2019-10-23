import { Spec } from '@hayspec/spec';
import * as validators from '..';

const spec = new Spec();

spec.test('exposed content', (ctx) => {
  ctx.true(!!validators.absenceValidator);
  ctx.true(!!validators.arrayExclusionValidator);
  ctx.true(!!validators.arrayInclusionValidator);
  ctx.true(!!validators.arrayLengthValidator);
  ctx.true(!!validators.base64Validator);
  ctx.true(!!validators.bsonObjectIdValidator);
  ctx.true(!!validators.dateValidator);
  ctx.true(!!validators.emailValidator);
  ctx.true(!!validators.ethAddressValidator);
  ctx.true(!!validators.exclusionValidator);
  ctx.true(!!validators.fqdnValidator);
  ctx.true(!!validators.hexColorValidator);
  ctx.true(!!validators.hexValidator);
  ctx.true(!!validators.inclusionValidator);
  ctx.true(!!validators.jsonStringValidator);
  ctx.true(!!validators.downcaseStringValidator);
  ctx.true(!!validators.matchValidator);
  ctx.true(!!validators.numberSizeValidator);
  ctx.true(!!validators.presenceValidator);
  ctx.true(!!validators.stringExclusionValidator);
  ctx.true(!!validators.stringInclusionValidator);
  ctx.true(!!validators.stringLengthValidator);
  ctx.true(!!validators.upcaseStringValidator);
  ctx.true(!!validators.uuidValidator);
});

export default spec;
