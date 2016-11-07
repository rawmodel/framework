import test from 'ava';
import {ValidationError} from '../dist/index';

test('ValidationError should not expose properties', async (t) => {
  let e = new ValidationError();
  t.deepEqual(Object.keys(e), []);
});

test('ValidationError.toObject should return error data', async (t) => {
  let e = new ValidationError(['foo'], 'bar');
  t.deepEqual(e.toObject(), {
    name: 'ValidationError',
    message: 'bar',
    paths: ['foo'],
    code: 422
  });
});
