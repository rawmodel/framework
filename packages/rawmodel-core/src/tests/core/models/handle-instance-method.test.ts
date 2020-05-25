import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('handles property errors', async (ctx) => {
  const handlers = [{
    resolver: (e) => e.message === 'foo',
    code: 100,
  }];
  class Book extends Model {
    @prop({
      handlers,
    })
    public title: string;
  }
  class Country extends Model {
    @prop()
    public code: string;
  }
  class User extends Model {
    @prop({
      handlers,
    })
    public name: string;
    @prop({
      handlers,
      parser: { resolver: Book },
    })
    public book0: Book;
    @prop({
      handlers,
      parser: { array: true, resolver: Book },
    })
    public books0: Book[];
    @prop({
      parser: { resolver: Book },
    })
    public book1: Book;
    @prop({
      parser: { array: true, resolver: Book },
    })
    public books1: Book[];
    @prop({
      parser: { resolver: Country },
    })
    public country: Country;
  }
  const user = new User({
    book1: {},
    books1: [{}],
    country: {},
  });
  const problem0 = new Error();
  const problem1 = new Error('foo');
  const code = 100;
  await user.handle(problem0);
  ctx.true(user.isValid());
  await user.handle(problem1);
  ctx.false(user.isValid());
  ctx.throws(() => user.handle(problem0, { quiet: false }));
  ctx.throws(() => user.handle(problem1, { quiet: false }));
  ctx.deepEqual(user.collectErrors(), [
    { path: ['name'], code },
    { path: ['book0'], code },
    { path: ['books0'], code },
    { path: ['book1', 'title'], code },
    { path: ['books1', 0, 'title'], code },
  ]);
});

export default spec;
