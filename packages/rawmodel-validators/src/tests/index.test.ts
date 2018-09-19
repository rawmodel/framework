import { Spec } from '@hayspec/spec';
import * as validators from '..';

const spec = new Spec();

spec.test('exposed content', (t) => {
  t.true(!!validators.absenceValidator);
  t.true(!!validators.arrayExclusionValidator);
  t.true(!!validators.arrayInclusionValidator);
  t.true(!!validators.arrayLengthValidator);
  t.true(!!validators.base64Validator);
  t.true(!!validators.bsonObjectIdValidator);
  t.true(!!validators.dateValidator);
  t.true(!!validators.emailValidator);
  t.true(!!validators.ethAddressValidator);
  t.true(!!validators.fqdnValidator);
  t.true(!!validators.hexColorValidator);
  t.true(!!validators.hexValidator);
  t.true(!!validators.jsonStringValidator);
  t.true(!!validators.downcaseStringValidator);
  t.true(!!validators.matchValidator);
  t.true(!!validators.numberSizeValidator);
  t.true(!!validators.presenceValidator);
  t.true(!!validators.stringExclusionValidator);
  t.true(!!validators.stringInclusionValidator);
  t.true(!!validators.stringLengthValidator);
  t.true(!!validators.upcaseStringValidator);
  t.true(!!validators.uuidValidator);
});

export default spec;
