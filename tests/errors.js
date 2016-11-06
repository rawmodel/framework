import test from 'ava';
import {
  ValidationError,
  ValidatorError
} from '../dist';

test.only('ValidationError method `toArray` should return a single-dimensional array of errors', (t) => {
  let validatorError = new ValidatorError('presence', 'is required');
  let validationError = new ValidationError([], [], [
    new ValidationError('name', [validatorError]),
    new ValidationError('oldBook', [], [
      new ValidationError('title', [validatorError])
    ]),
    new ValidationError('oldBooks', [validatorError], [
      undefined,
      [
        new ValidationError('title', [validatorError])
      ]
    ])
  ]);

  t.deepEqual(validationError.toArray(), [
    new ValidationError(['name'], [validatorError]),
    new ValidationError(['oldBook', 'title'], [validatorError]),
    new ValidationError(['oldBooks'], [validatorError]),
    new ValidationError(['oldBooks', 1, 'title'], [validatorError])
  ]);
});
