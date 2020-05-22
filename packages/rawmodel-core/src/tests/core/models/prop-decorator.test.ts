import { Spec } from '@hayspec/spec';
import { stringParser } from '@rawmodel/parsers';
import { Model, Prop, prop } from '../../..';

const spec = new Spec();

spec.test('defines model property', (ctx) => {
  class User extends Model {
    @prop()
    public name: string;
  }
  const user = new User();
  const descriptor = Object.getOwnPropertyDescriptor(user, 'name');
  ctx.true(user.__props['name'] instanceof Prop);
  ctx.is(user.name, null);
  ctx.is(typeof descriptor.get, 'function');
  ctx.is(typeof descriptor.set, 'function');
  ctx.true(descriptor.enumerable);
  ctx.false(descriptor.configurable);
  user.name = 'John';
  ctx.is(user.name, 'John');
});

spec.test('supports property enumerable style', (ctx) => {
  class User0 extends Model {
    @prop({
      enumerable: true,
    })
    public name: string;
  }
  class User1 extends Model {
    @prop({
      enumerable: false,
    })
    public name: string;
  }
  const user0 = new User0({});
  const user1 = new User1({});
  ctx.deepEqual(Object.keys(user0), ['name']);
  ctx.deepEqual(Object.keys(user1), []);
});

spec.test('supports deep type parsing', (ctx) => {
  class Book extends Model {
    @prop({
      parser: { resolver: stringParser() },
    })
    public name: string;
  }
  class User extends Model {
    @prop({
      parser: { resolver: stringParser() },
    })
    public name: string;
    @prop({
      parser: { resolver: Book },
    })
    public book: Book;
    @prop({
      parser: { array: true, resolver: Book },
    })
    public books: Book[];
    @prop({
      parser: { array: true },
    })
    public items: any[];
  }
  const book = new Book({
    name: 'Baz',
  });
  const user = new User({
    name: 100,
    book,
    books: [
      book,
      { name: 'Zed' },
    ],
    items: [100, { foo: 'foo'}, 'bar'],
  });
  ctx.is(user.name, '100');
  ctx.is(user.book.name, 'Baz');
  ctx.true(user.book instanceof Book);
  ctx.is(user.books[0].name, 'Baz');
  ctx.true(user.books[0] instanceof Book);
  ctx.is(user.books[1].name, 'Zed');
  ctx.true(user.books[1] instanceof Book);
  ctx.is(user.book, book); // preserves instance
  user.book = book; // preserves instance
  ctx.is(user.book, book);
  ctx.deepEqual(user.items, [100, { foo: 'foo'}, 'bar']);
});

spec.test('parser shares associated model context', (ctx) => {
  let context = null;
  class User extends Model {
    @prop({
      parser: { resolver(v) {
        context = this; return v;
      } },
    })
    public name: string;
  }
  const user = new User();
  user.name = 'foo'; // run setter
  ctx.is(context, user);
});

spec.test('supports custom setter', (ctx) => {
  class User extends Model {
    @prop({
      setter: (v) => `foo-${v}`,
    })
    public name: string;
  }
  const user = new User();
  user.name = 'bar';
  ctx.is(user.name, 'foo-bar');
});

spec.test('setter shares associated model context', (ctx) => {
  let context = null;
  class User extends Model {
    @prop({
      setter() {
        context = this;
      },
    })
    public name: string;
  }
  const user = new User();
  user.name = 'foo'; // run setter
  ctx.is(context, user);
});

spec.test('supports custom getter', (ctx) => {
  class User extends Model {
    @prop({
      getter: (v) => `foo-${v}`,
    })
    public name: string;
  }
  const user = new User();
  user.name = 'bar';
  ctx.is(user.name, 'foo-bar');
});

spec.test('getter shares associated model context', (ctx) => {
  let context = null;
  class User extends Model {
    @prop({
      getter() {
        context = this;
      },
    })
    public name: string;
  }
  const user = new User();
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  user.name; // run getter
  ctx.is(context, user);
});

spec.test('supports default value', (ctx) => {
  class User extends Model {
    @prop({
      defaultValue: 'foo',
    })
    public name: string;
    @prop({
      defaultValue: [],
    })
    public tags: string[];
  }
  const user = new User();
  ctx.is(user.name, 'foo');
  ctx.deepEqual(user.tags, []);
});

spec.test('default value shares associated model context', (ctx) => {
  let context = null;
  class User extends Model {
    @prop({
      defaultValue() {
        context = this;
      },
    })
    public name: string;
  }
  const user = new User();
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  user.name; // run getter (default value)
  ctx.is(context, user);
});

spec.test('supports fake value', (ctx) => {
  class User extends Model {
    @prop({
      fakeValue: 'foo',
    })
    public name: string;
    @prop({
      fakeValue: () => 'bar',
    })
    public email: string;
  }
  const user = new User();
  ctx.is(user.name, null);
  ctx.is(user.email, null);
  user.fake();
  ctx.is(user.name, 'foo');
  ctx.is(user.email, 'bar');
});

spec.test('fake value shares associated model context', (ctx) => {
  let context = null;
  class User extends Model {
    @prop({
      fakeValue() {
        context = this;
      },
    })
    public name: string;
  }
  const user = new User();
  user.fake(); // set fake value
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  user.name; // run getter (fake value)
  ctx.is(context, user);
});

spec.test('supports empty value', (ctx) => {
  class User extends Model {
    @prop({
      emptyValue: 'foo',
    })
    public name: string;
    @prop({
      emptyValue: [],
    })
    public list: string[];
    @prop({
      defaultValue: [],
      emptyValue: ['foo'], // override default value if empty
    })
    public tags: string[];
  }
  const user = new User();
  ctx.is(user.name, 'foo');
  ctx.deepEqual(user.list, []);
  ctx.deepEqual(user.tags, ['foo']);
});

spec.test('empty value shares associated model context', (ctx) => {
  let context = null;
  class User extends Model {
    @prop({
      emptyValue() {
        context = this;
      },
    })
    public name: string;
  }
  const user = new User();
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  user.name; // run getter (default value)
  ctx.is(context, user);
});

spec.test('validators share associated model context', async (ctx) => {
  let context = null;
  class User extends Model {
    @prop({
      validators: [
        { resolver(v) {
          return context = this;
        }, code: 100 },
      ],
    })
    public name: string;
  }
  const user = new User();
  await user.validate({ quiet: true }); // run validation
  ctx.is(context, user);
});

spec.test('resolvers share associated model context', async (ctx) => {
  let context = null;
  class User extends Model {
    @prop({
      handlers: [
        { resolver(v) {
          return context = this;
        }, code: 100 },
      ],
    })
    public name: string;
  }
  const user = new User();
  await user.handle(new Error()); // run resolver
  ctx.is(context, user);
});

export default spec;
