import { Spec } from '@hayspec/spec';
import { normalize, realize, isDeepEqual, isInstanceOf, isClassOf, isUndefined,
  isNull, isInfinite, isValue, isString, isBoolean, isNumber, isInteger, isFloat,
  toNumber, isDate, isObject, isArray, isPresent, isFunction, toString,
  toBoolean, toInteger, toFloat, toDate, toArray } from '../..';

const spec = new Spec();

spec.test('normalize', (ctx) => {
  class User {
    public foo: string = 'Foo';
    public bar: string = 'Bar';
  }
  const user = new User();
  ctx.false(normalize(user) instanceof User);
  ctx.is(normalize(null), null);
  ctx.is(normalize(undefined), null); // nullify
  ctx.is(normalize(false), false);
  ctx.deepEqual(normalize(user), {
    foo: 'Foo',
    bar: 'Bar',
  });
});

spec.test('realize', (ctx) => {
  ctx.is(realize('foo'), 'foo');
  ctx.is(realize(100), 100);
  ctx.is(realize(() => 'bar'), 'bar');
  ctx.is(realize(function() { return `${this.foo}bar`; }, { foo: 'foo' }), 'foobar');
  ctx.is(realize(function(a, b) { return `${a}${b}baz`; }, null, ['foo', 'bar']), 'foobarbaz');
});

spec.test('isDeepEqual', (ctx) => {
  ctx.true(isDeepEqual('foo', 'foo'));
  ctx.true(isDeepEqual('', ''));
  ctx.false(isDeepEqual('', 'foo'));
  ctx.true(isDeepEqual(null, null));
  ctx.true(isDeepEqual(undefined, undefined));
  ctx.false(isDeepEqual(null, undefined));
  ctx.true(isDeepEqual(false, false));
  ctx.true(isDeepEqual(true, true));
  ctx.false(isDeepEqual(false, true));
  ctx.true(isDeepEqual({ a: 1, b: 2 }, { a: 1, b: 2 }));
  ctx.true(isDeepEqual({ a: 1, b: 2 }, { b: 2, a: 1 }));
  ctx.true(isDeepEqual({ a: 1, b: { c: [1, 2] }}, { a: 1, b: { c: [1, 2] }}));
  ctx.false(isDeepEqual({ a: 1, b: { c: [1, 2] }}, { a: 1, b: { c: [2, 1] }}));
});

spec.test('isInstanceOf', (ctx) => {
  class Fake {}
  class Base {}
  class User extends Base {}
  ctx.true(isInstanceOf(new Base(), Base));
  ctx.true(isInstanceOf(new User(), Base));
  ctx.false(isInstanceOf(new Fake(), Base));
  ctx.false(isInstanceOf(new Base(), 'foo'));
  ctx.false(isInstanceOf(null, Base));
  ctx.false(isInstanceOf(undefined, Base));
  ctx.false(isInstanceOf('foo', Base));
  ctx.false(isInstanceOf(false, Base));
});

spec.test('isClassOf', (ctx) => {
  class Fake {}
  class Base {}
  class User extends Base {}
  ctx.true(isClassOf(Base, Base));
  ctx.true(isClassOf(User, Base));
  ctx.false(isClassOf(Fake, Base));
  ctx.false(isClassOf(Base, 'foo'));
  ctx.false(isClassOf(null, Base));
  ctx.false(isClassOf(undefined, Base));
  ctx.false(isClassOf('foo', Base));
  ctx.false(isClassOf(false, Base));
});

spec.test('isUndefined', (ctx) => {
  ctx.is(isUndefined(), true);
  ctx.is(isUndefined(undefined), true);
  ctx.is(isUndefined(''), false);
});

spec.test('isNull', (ctx) => {
  ctx.is(isNull(null), true);
  ctx.is(isNull(undefined), false);
  ctx.is(isNull(''), false);
});

spec.test('isInfinite', (ctx) => {
  ctx.is(isInfinite(Infinity), true);
  ctx.is(isInfinite(0), false);
  ctx.is(isInfinite(''), false);
});

spec.test('isValue', (ctx) => {
  ctx.is(isValue(undefined), false);
  ctx.is(isValue(null), false);
  ctx.is(isValue(NaN), false);
  ctx.is(isValue(Infinity), false);
  ctx.is(isValue(0), true);
  ctx.is(isValue(''), true);
  ctx.is(isValue(new Date()), true);
  ctx.is(isValue([]), true);
  ctx.is(isValue({}), true);
});

spec.test('isString', (ctx) => {
  ctx.is(isString(''), true);
  ctx.is(isString('foo'), true);
  ctx.is(isString(null), false);
});

spec.test('isBoolean', (ctx) => {
  ctx.is(isBoolean(true), true);
  ctx.is(isBoolean(false), true);
  ctx.is(isBoolean('true'), false);
});

spec.test('isNumber', (ctx) => {
  ctx.is(isNumber(0), true);
  ctx.is(isNumber(100.0), true);
  ctx.is(isNumber(-100.0), true);
  ctx.is(isNumber(NaN), true);
  ctx.is(isNumber(Infinity), true);
  ctx.is(isNumber(undefined), false);
  ctx.is(isNumber(null), false);
  ctx.is(isNumber(''), false);
  ctx.is(isNumber('100'), false);
});

spec.test('isInteger', (ctx) => {
  ctx.is(isInteger(0), true);
  ctx.is(isInteger(10), true);
  ctx.is(isInteger(-10), true);
  ctx.is(isInteger(10.1), false);
  ctx.is(isInteger(Infinity), false);
  ctx.is(isInteger(NaN), false);
  ctx.is(isInteger(null), false);
  ctx.is(isInteger(undefined), false);
});

spec.test('isFloat', (ctx) => {
  ctx.is(isFloat(0), true);
  ctx.is(isFloat(-100), true);
  ctx.is(isFloat(100), true);
  ctx.is(isFloat(0.1), true);
  ctx.is(isFloat(-0.1), true);
  ctx.is(isFloat(Infinity), false);
  ctx.is(isFloat(NaN), false);
  ctx.is(isFloat(null), false);
  ctx.is(isFloat(undefined), false);
});

spec.test('isDate', (ctx) => {
  ctx.is(isDate(new Date()), true);
  ctx.is(isDate(new Date('ksjlfjsdfjsd')), false);
  ctx.is(isDate(null), false);
  ctx.is(isDate(undefined), false);
  ctx.is(isDate(NaN), false);
  ctx.is(isDate(Infinity), false);
  ctx.is(isDate(0), false);
  ctx.is(isDate(100), false);
  ctx.is(isDate(''), false);
});

spec.test('isObject', (ctx) => {
  ctx.is(isObject({}), true);
  ctx.is(isObject(Infinity), false);
  ctx.is(isObject(NaN), false);
  ctx.is(isObject(null), false);
  ctx.is(isObject(undefined), false);
  ctx.is(isObject(0), false);
  ctx.is(isObject(''), false);
  ctx.is(isObject(new Date()), false);
});

spec.test('isArray', (ctx) => {
  ctx.is(isArray([]), true);
  ctx.is(isArray([1]), true);
  ctx.is(isArray({}), false);
  ctx.is(isArray(Infinity), false);
  ctx.is(isArray(NaN), false);
  ctx.is(isArray(null), false);
  ctx.is(isArray(undefined), false);
  ctx.is(isArray(0), false);
  ctx.is(isArray(''), false);
});

spec.test('isPresent', (ctx) => {
  ctx.is(isPresent(0), true);
  ctx.is(isPresent(Infinity), true);
  ctx.is(isPresent([1]), true);
  ctx.is(isPresent(undefined), false);
  ctx.is(isPresent(null), false);
  ctx.is(isPresent(NaN), false);
  ctx.is(isPresent([]), false);
  ctx.is(isPresent({}), false);
  ctx.is(isPresent(''), false);
});

spec.test('isFunction', (ctx) => {
  ctx.is(isFunction(undefined), false);
  ctx.is(isFunction(null), false);
  ctx.is(isFunction(NaN), false);
  ctx.is(isFunction(() => {}), true);
  ctx.is(isFunction(function() {}), true);
  ctx.is(isPresent(class {}), true);
});

spec.test('toString', (ctx) => {
  ctx.is(toString(), null);
  ctx.is(toString(undefined), null);
  ctx.is(toString(null), null);
  ctx.is(toString(''), '');
  ctx.is(toString(NaN), 'NaN');
  ctx.is(toString(Infinity), 'Infinity');
  ctx.is(toString(true), 'true');
  ctx.is(toString(100.1), '100.1');
  ctx.is(toString([1, 2]), '1,2');
});

spec.test('toBoolean', (ctx) => {
  ctx.is(toBoolean(), null);
  ctx.is(toBoolean(undefined), null);
  ctx.is(toBoolean(null), null);
  ctx.is(toBoolean(false), false);
  ctx.is(toBoolean(NaN), false);
  ctx.is(toBoolean(0), false);
  ctx.is(toBoolean(-100), false);
  ctx.is(toBoolean('-'), false);
  ctx.is(toBoolean('0'), false);
  ctx.is(toBoolean('-10'), false);
  ctx.is(toBoolean('false'), false);
  ctx.is(toBoolean(true), true);
  ctx.is(toBoolean(1), true);
  ctx.is(toBoolean(100), true);
  ctx.is(toBoolean(Infinity), true);
  ctx.is(toBoolean('+'), true);
  ctx.is(toBoolean('1'), true);
  ctx.is(toBoolean('100'), true);
  ctx.is(toBoolean('true'), true);
  ctx.is(toBoolean('yes'), true);
});

spec.test('toInteger', (ctx) => {
  ctx.is(toInteger(), null);
  ctx.is(toInteger(undefined), null);
  ctx.is(toInteger(null), null);
  ctx.is(toInteger(false), 0);
  ctx.is(toInteger(NaN), 0);
  ctx.is(toInteger(0), 0);
  ctx.is(toInteger(-100), -100);
  ctx.is(toInteger('-100'), -100);
  ctx.is(toInteger('-100.0'), -100);
  ctx.is(toInteger('false'), 0);
  ctx.is(toInteger(Infinity), 1);
  ctx.is(toInteger('true'), 1);
  ctx.is(toInteger('yes'), 1);
});

spec.test('toFloat', (ctx) => {
  ctx.is(toFloat(), null);
  ctx.is(toFloat(undefined), null);
  ctx.is(toFloat(null), null);
  ctx.is(toFloat(false), 0);
  ctx.is(toFloat(NaN), 0);
  ctx.is(toFloat(0), 0);
  ctx.is(toFloat(-100), -100);
  ctx.is(toFloat('-100'), -100);
  ctx.is(toFloat('-100.0'), -100);
  ctx.is(toFloat('-100.99'), -100.99);
  ctx.is(toFloat('false'), 0);
  ctx.is(toFloat(Infinity), 1);
  ctx.is(toFloat('true'), 1);
  ctx.is(toFloat('yes'), 1);
});

spec.test('toNumber', (ctx) => {
  ctx.is(toNumber(), null);
  ctx.is(toNumber(undefined), null);
  ctx.is(toNumber(null), null);
  ctx.is(toNumber(false), 0);
  ctx.is(toNumber(NaN), 0);
  ctx.is(toNumber(0), 0);
  ctx.is(toNumber(-100), -100);
  ctx.is(toNumber('-100'), -100);
  ctx.is(toNumber('-100.0'), -100);
  ctx.is(toNumber('-100.99'), -100.99);
  ctx.is(toNumber('false'), 0);
  ctx.is(toNumber(Infinity), 1);
  ctx.is(toNumber('true'), 1);
  ctx.is(toNumber('yes'), 1);
});

spec.test('toDate', (ctx) => {
  const d = new Date();
  ctx.is(toDate(d), d);
  ctx.deepEqual(toDate(100000), new Date(100000));
  ctx.deepEqual(toDate('2016-01-02'), new Date('2016-01-02'));
  ctx.is(toDate(), null);
  ctx.is(toDate(undefined), null);
  ctx.is(toDate(null), null);
  ctx.is(toDate('8sadufsdjfk1231'), null);
});

spec.test('toArray', (ctx) => {
  ctx.deepEqual(toArray(), null);
  ctx.deepEqual(toArray(undefined), null);
  ctx.deepEqual(toArray(null), null);
  ctx.deepEqual(toArray(NaN), []);
  ctx.deepEqual(toArray(Infinity), []);
  ctx.deepEqual(toArray([]), []);
  ctx.deepEqual(toArray({}), [{}]);
  ctx.deepEqual(toArray(''), ['']);
  ctx.deepEqual(toArray(0), [0]);
  ctx.deepEqual(toArray('john'), ['john']);
});

export default spec;
