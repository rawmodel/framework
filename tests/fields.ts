import test from 'ava';
import {Field, Model} from '../src';
import {Validator} from 'validatable';

test('nullifies a value by default', (t) => {
  let f = new Field();
  t.is(f.value, null);
});

test('provides getter and setter for the current value', (t) => {
  let f = new Field();
  f.value = 'foo';
  t.is(f.value, 'foo');
});

test('supports custom getter and setter for the current value', (t) => {
  let f0 = new Field({get (v) { return `${v}-${this.constructor.name}`; }});
  let f1 = new Field({set (v) { return `${v}-${this.constructor.name}`; }});
  f0.value = 'foo';
  f1.value = 'foo';
  t.is(f0.value, 'foo-Field');
  t.is(f1.value, 'foo-Field');
});

test('can automatically cast a value to a specific data type', (t) => {
  let f0 = new Field({type: ['String']});
  let f1 = new Field({type: (v) => `${v}-foo`}); // custom type
  f0.value = 100;
  f1.value = 100;
  t.deepEqual(f0.value, ['100']);
  t.deepEqual(f1.value, '100-foo');
});

test('can have a default value', (t) => {
  let f0 = new Field({defaultValue: 'foo'});
  let f1 = new Field({defaultValue () { return this.constructor.name; }});
  let f2 = new Field({defaultValue () { return Math.random(); }});
  t.is(f0.value, 'foo');
  t.is(f1.value, 'Field');
  t.is(f0.defaultValue, 'foo');
  t.is(f1.defaultValue, 'Field');
  t.is(f2.defaultValue !== f2.defaultValue, true); // dynamic values
});

test('can have a fake value', (t) => {
  let f0 = new Field({fakeValue: 'foo'});
  let f1 = new Field({fakeValue () { return this.constructor.name; }});
  let f2 = new Field({fakeValue () { return Math.random(); }});
  t.is(f0.fakeValue, 'foo');
  t.is(f1.fakeValue, 'Field');
  t.is(f2.fakeValue !== f2.fakeValue, true); // dynamic values
});

test('method `reset()` sets value to the default value', (t) => {
  let f0 = new Field();
  let f1 = new Field({defaultValue: 'foo'});
  let f2 = new Field({defaultValue () { return Math.random(); }});
  t.is(f0.value, null);
  f1.value = 'bar';
  f1.reset();
  t.is(f1.value, 'foo');
  f2.reset();
  t.is(f1.value !== f2.value, true); // dynamic values
});

test('method `fake()` sets value to the fake value', (t) => {
  let f0 = new Field();
  let f1 = new Field({fakeValue: 'foo'});
  let f2 = new Field({fakeValue () { return Math.random(); }});
  f0.value = 'foo';
  f0.fake();
  t.is(f0.value, null);
  f1.value = 'bar';
  f1.fake();
  t.is(f1.value, 'foo');
  f2.value = 'foo';
  f2.fake();
  t.is(f2.value !== f1.value, true); // dynamic values
});

test('method `clear()` sets value to `null`', (t) => {
  let f = new Field();
  f.value = 'foo';
  f.clear();
  t.is(f.value, null);
});

test('methods `commit()` and `rollback()` manage committed value state', (t) => {
  let f = new Field();
  f.value = 'foo';
  t.is(f.initialValue, null);
  f.commit();
  t.is(f.initialValue, 'foo');
  f.value = 'bar';
  f.rollback();
  t.is(f.value, 'foo');
});

test('method `equals()` returns `true` when the provided `data` equals to the current value', (t) => {
  let f0 = new Field();
  let f1 = new Field();
  f0.value = 'foo';
  f1.value = 'foo';
  t.is(f0.equals(f1), true);
  t.is(f0.equals(f1.value), true);
});

test('method `isChanged()` returns `true` if the value have been changed', (t) => {
  let f = new Field();
  t.is(f.isChanged(), false);
  f.value = 'foo';
  t.is(f.isChanged(), true);
});

test('method `isNested()` returns `true` if the field type is un instance of a Model', (t) => {
  let f0 = new Field();
  let f1 = new Field({type: [Model]});
  let f2 = new Field({type: [class User extends Model {}]});
  t.is(f0.isNested(), false);
  t.is(f1.isNested(), true);
  t.is(f2.isNested(), true);
});

test('method `validate()` validates the value and populates the `errors` property', async (t) => {
  let f = new Field({
    validate: [
      {validator: 'presence', message: 'foo'},
      {validator: 'coolness', message: 'is not cool'}
    ],
    validators: {
      coolness () { return this.value === 'cool'; } // custom validators
    }
  });
  await f.validate();
  t.deepEqual(f.errors, [
    {validator: 'presence', message: 'foo', code: 422},
    {validator: 'coolness', message: 'is not cool', code: 422}
  ]);
});

test('method `invalidate()` clears the `errors` property', (t) => {
  let f = new Field();
  f.errors.push({message: 'foo'});
  f.invalidate();
  t.deepEqual(f.errors, []);
});

test('invalidates when the value changes', (t) => {
  let f = new Field();
  f.errors.push({message: 'foo'});
  f.value = 'foo';
  t.deepEqual(f.errors, []);
});

test('method `hasErrors()` returns `true` when errors exist', (t) => {
  let f = new Field();
  t.is(f.hasErrors(), false);
  f.errors.push({message: 'foo'});
  t.is(f.hasErrors(), true);
});

test('method `isValid()` returns `true` when no errors exist', (t) => {
  let f = new Field();
  t.is(f.isValid(), true);
  f.errors.push({message: 'foo'});
  t.is(f.isValid(), false);
});

test('has enumeratable properties', (t) => {
  let f = new Field();
  t.deepEqual(Object.keys(f), ['errors', 'value', 'defaultValue', 'fakeValue', 'initialValue', 'serializable', 'type', 'owner']);
});

test('method `handle()` handles an error and populates the `errors` property', async (t) => {
  let f = new Field({
    handle: [
      {handler: 'block', block () { return true; }, message: 'foo'},
      {handler: 'coolness', message: 'cool'} // custom
    ],
    handlers: {
      coolness (error) { return error.message === 'cool'; } // custom validators
    }
  });
  let e = new Error('cool');
  await f.handle(e);
  t.deepEqual(f.errors, [
    {handler: 'block', message: 'foo', code: 422},
    {handler: 'coolness', message: 'cool', code: 422}
  ]);
});
