import { Spec } from '@hayspec/spec';
import { Model, Prop, prop } from '../..';

const spec = new Spec();

spec.test('decorator `prop` defines model property', (ctx) => {
  class User extends Model {
    @prop({})
    name: string;
  }
  const user = new User();
  const descriptor = Object.getOwnPropertyDescriptor(user, 'name');
  ctx.true(user.$props['name'] instanceof Prop);
  ctx.is(user.name, null);
  ctx.is(typeof descriptor.get, 'function');
  ctx.is(typeof descriptor.set, 'function');
  ctx.true(descriptor.enumerable);
  ctx.false(descriptor.configurable);
  user.name = 'John';
  ctx.is(user.name, 'John');
});

spec.test('decorator `prop` supports deep type casting', (ctx) => {
  class Book extends Model {
    @prop({ cast: { handler: 'String' } })
    name: string;
  }
  class User extends Model {
    @prop({ cast: { handler: 'String' } })
    name: string;
    @prop({ cast: { handler: Book } })
    book: Book;
    @prop({ cast: { handler: Book, array: true } })
    books: Book[];
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
  });
  ctx.is(user.name, '100');
  ctx.is(user.book.name, 'Baz');
  ctx.true(user.book instanceof Book);
  ctx.is(user.books[0].name, 'Baz');
  ctx.true(user.books[0] instanceof Book);
  ctx.is(user.books[1].name, 'Zed');
  ctx.true(user.books[1] instanceof Book);
  ctx.not(user.book, book); // recreates instance
  user.book = book; // preserves instance
  ctx.is(user.book, book);
});

spec.test('decorator `prop` supports custom setter', (ctx) => {
  class User extends Model {
    @prop({
      set: (v) => `foo-${v}`,
    })
    name: string;
  }
  const user = new User();
  user.name = 'bar';
  ctx.is(user.name, 'foo-bar');
});

spec.test('decorator `prop` supports custom getter', (ctx) => {
  class User extends Model {
    @prop({
      get: (v) => `foo-${v}`,
    })
    name: string;
  }
  const user = new User();
  user.name = 'bar';
  ctx.is(user.name, 'foo-bar');
});

spec.test('decorator `prop` supports default value', (ctx) => {
  class User extends Model {
    @prop({
      defaultValue: 'foo',
    })
    name: string;
  }
  const user = new User();
  ctx.is(user.name, 'foo');
});

spec.test('decorator `prop` supports property enumerable style', (ctx) => {
  class User0 extends Model {
    @prop({
      enumerable: true,
    })
    name: string;
  }
  class User1 extends Model {
    @prop({
      enumerable: false,
    })
    name: string;
  }
  const user0 = new User0({});
  const user1 = new User1({});
  ctx.deepEqual(Object.keys(user0), ['name']);
  ctx.deepEqual(Object.keys(user1), []);
});

spec.test('method `getParent` returns an instance of the parent model', (ctx) => {
  class Book extends Model {
    @prop()
    title: string;
  }
  class User extends Model {
    @prop()
    name: string;
    @prop({
      cast: { handler: Book },
    })
    book: Book;
    @prop({
      cast: { handler: Book, array: true },
    })
    books: Book[];
  }
  const user = new User({
    book: {
      title: 200,
    },
    books: [
      undefined,
      {
        title: 300,
      }
    ]
  });
  ctx.is(user.getParent(), null);
  ctx.is(user.book.getParent(), user);
  ctx.is(user.books[1].getParent(), user);
});

spec.test('method `getRoot` return the first model in a tree of nested models', (ctx) => {
  class Book extends Model {
    @prop()
    title: string;
  }
  class User extends Model {
    @prop({
      cast: { handler: Book },
    })
    book: Book;
  }
  const user = new User({
    book: {
      title: 200,
    },
  });
  ctx.is(user.getRoot(), user);
  ctx.is(user.book.getRoot(), user);
});

spec.test('method `populate` deeply assignes property data using strategies', (ctx) => {
  class Book extends Model {
    @prop({
      cast: { handler: 'Number' },
      populatable: ['output'],
    })
    id: number;
    @prop({
      cast: { handler: 'String' },
    })
    title: string;
    @prop({
      cast: { handler: 'String' },
      populatable: ['input'],
    })
    description: string;
  }
  class User extends Model {
    @prop({
      cast: { handler: 'Number' },
      populatable: ['output'],
    })
    id: number;
    @prop({
      cast: { handler: 'String' },
    })
    name: string;
    @prop({
      cast: { handler: 'String' },
      populatable: ['input'],
    })
    email: string;
    @prop({
      cast: { handler: Book },
      populatable: ['output'],
    })
    book0: Book;
    @prop({
      cast: { handler: Book },
    })
    book1: Book;
    @prop({
      cast: { handler: Book, array: true },
      populatable: ['input'],
    })
    books: Book[];
  }
  const data = {
    id: 100,
    name: 'John',
    email: 'foo@bar.com',
    book0: {
      id: 200,
      title: 'Foo',
      description: 'Bar',
    },
    book1: undefined,
    books: [
      undefined,
      {
        id: 300,
        title: 'Baz',
        description: 'Zed',
      },
    ],
  };
  const book = new Book();
  const user0 = new User();
  const user1 = new User();
  const user2 = new User();
  const user3 = new User();
  user0.populate(null); // should not break
  user0.populate(false); // should not break
  user0.populate(''); // should not break
  user0.populate(true); // should not break
  user0.populate(100); // should not break
  user0.populate(data);
  ctx.is(user0.id, 100);
  ctx.is(user0.name, 'John');
  ctx.is(user0.book0.id, 200);
  ctx.is(user0.book0.title, 'Foo');
  ctx.is(user0.book1, null);
  ctx.is(user0.books[0], null);
  ctx.is(user0.books[1].title, 'Baz');
  user1.populate(data, 'input');
  ctx.is(user1.id, null);
  ctx.is(user1.name, null);
  ctx.is(user1.email, 'foo@bar.com');
  ctx.is(user1.book0, null);
  ctx.is(user1.book1, null);
  ctx.is(user1.books[0], null);
  ctx.is(user1.books[1].id, null);
  ctx.is(user1.books[1].title, null);
  ctx.is(user1.books[1].description, 'Zed');
  user2.populate(data, 'output');
  ctx.is(user2.id, 100);
  ctx.is(user2.name, null);
  ctx.is(user2.email, null);
  ctx.is(user2.book0.id, 200);
  ctx.is(user2.book0.title, null);
  ctx.is(user2.book0.description, null);
  ctx.is(user2.book1, null);
  ctx.is(user2.books, null);
  user3.populate({ book0: book, books: [book] });
  ctx.not(user3.book0, book);
  ctx.not(user3.books[1], book);
});

spec.test('method `serialize` deeply serializes property data using strategies', (ctx) => {
  class Book extends Model {
    @prop({
      cast: { handler: 'Number' },
      populatable: ['output'],
    })
    id: number;
    @prop({
      cast: { handler: 'String' },
    })
    title: string;
    @prop({
      cast: { handler: 'String' },
      populatable: ['input'],
    })
    description: string;
  }
  class User extends Model {
    @prop({
      cast: { handler: 'Number' },
      populatable: ['output'],
    })
    id: number;
    @prop({
      cast: { handler: 'String' },
    })
    name: string;
    @prop({
      cast: { handler: 'String' },
      populatable: ['input'],
    })
    email: string;
    @prop({
      cast: { handler: Book },
      populatable: ['output'],
    })
    book0: Book;
    @prop({
      cast: { handler: Book },
    })
    book1: Book;
    @prop({
      cast: { handler: Book, array: true },
      populatable: ['input'],
    })
    books: Book[];
  }
  const data = {
    id: 100,
    name: 'John',
    email: 'foo@bar.com',
    book0: {
      id: 200,
      title: 'Foo',
      description: 'Bar',
    },
    book1: null,
    books: [
      null,
      {
        id: 300,
        title: 'Baz',
        description: 'Zed',
      },
    ],
  };
  const user = new User(data);
  const json = user.serialize();
  ctx.deepEqual(json, {
    id: 100,
    name: 'John',
    email: 'foo@bar.com',
    book0: {
      id: 200,
      title: 'Foo',
      description: 'Bar',
    },
    book1: null,
    books: [
      null,
      {
        id: 300,
        title: 'Baz',
        description: 'Zed',
      },
    ],
  });
  ctx.false(json.book0 instanceof Book);
  ctx.is(json.books[0], null);
  ctx.false(json.books[1] instanceof Book);
});

spec.test('method `getProp` returns an instance of a prop at path', (ctx) => {
  class Book extends Model {
    @prop()
    title: string;
  }
  class User extends Model {
    @prop()
    name: string;
    @prop({
      cast: { handler: Book },
    })
    book: Book;
    @prop({
      cast: { handler: Book, array: true },
    })
    books: Book[];
  }
  const user = new User({
    name: 'foo',
    book: {
      title: 'bar'
    },
    books: [
      undefined,
      {
        title: 'baz'
      }
    ]
  });
  ctx.is(user.getProp(['name']).getValue(), 'foo');
  ctx.is(user.getProp('name').getValue(), 'foo');
  ctx.is(user.getProp(['book', 'title']).getValue(), 'bar');
  ctx.is(user.getProp('book', 'title').getValue(), 'bar');
  ctx.is(user.getProp(['books', 1, 'title']).getValue(), 'baz');
  ctx.is(user.getProp('books', 1, 'title').getValue(), 'baz');
  ctx.is(user.getProp(['fake']), undefined);
  ctx.is(user.getProp(['fake', 10, 'title']), undefined);
  ctx.is(user.getProp(), undefined);
});

spec.test('method `hasProp` returns `true` if the prop exists', (ctx) => {
  class User extends Model {
    @prop()
    name: string;
  }
  const user = new User();
  ctx.is(user.hasProp(['name']), true);
  ctx.is(user.hasProp(['book', 'title']), false);
});

spec.test('method `flatten` returns an array of props', (ctx) => {
  class Book extends Model {
    @prop()
    title: string;
  }
  class User extends Model {
    @prop()
    name: string;
    @prop({
      cast: { handler: Book },
    })
    book: Book;
    @prop({
      cast: { handler: Book, array: true },
    })
    books: Book[];
  }
  const user = new User({
    name: 'foo',
    book: {
      title: 'bar',
    },
    books: [
      undefined,
      {
        title: 'baz',
      },
    ],
  });
  ctx.deepEqual(user.flatten().map((f) => f.path), [
    ['name'],
    ['book'],
    ['book', 'title'],
    ['books'],
    ['books', 1, 'title']
  ]);
  ctx.deepEqual(Object.keys(user.flatten()[0]), ['path', 'prop']);
  ctx.deepEqual(user.flatten()[0].path, ['name']);
  ctx.is(user.flatten()[0].prop.getValue(), 'foo');
});

spec.test('method `collect` returns an array of results', (ctx) => {
  class Book extends Model {
    @prop()
    title: string;
  }
  class User extends Model {
    @prop()
    name: string;
    @prop({
      cast: { handler: Book },
    })
    book: Book;
  }
  const user = new User({
    name: 'foo',
    book: {
      title: 'bar',
    },
  });
  const results = user.collect(({ path }) => path);
  ctx.deepEqual(results, [
    ['name'],
    ['book'],
    ['book', 'title']
  ]);
});

spec.test('method `scroll` runs the provided handler on each prop', (ctx) => {
  class Book extends Model {
    @prop()
    title: string;
  }
  class User extends Model {
    @prop()
    name: string;
    @prop({
      cast: { handler: Book },
    })
    book: Book;
  }
  const user = new User({
    name: 'foo',
    book: {
      title: 'bar',
    },
  });
  const count = user.scroll(({ path }) => null);
  ctx.deepEqual(count, 3);
});

spec.test('method `filter` converts a model into serialized object with only keys that pass the test', (ctx) => {
  class Book extends Model {
    @prop()
    title: string;
  }
  class User extends Model {
    @prop()
    name: string;
    @prop({
      cast: { handler: Book },
    })
    book: Book;
    @prop({
      cast: { handler: Book, array: true },
    })
    books: Book[];
  }
  const user = new User({
    name: 'foo',
    book: {
      title: 'bar'
    },
    books: [
      undefined,
      {
        title: 'bar',
      },
    ],
  });
  const result = user.filter(({ path, prop }) => prop.getValue() !== 'foo');
  ctx.deepEqual(result as any, {
    book: {
      title: 'bar',
    },
    books: [
      null,
      {
        title: 'bar',
      },
    ],
  });
});

spec.test('method `reset` sets properties to their default values', (ctx) => {
  class Book extends Model {
    @prop({
      defaultValue: 'foo',
    })
    title: string;
  }
  class User extends Model {
    @prop({
      defaultValue: 'bar',
    })
    name: string;
    @prop({
      cast: { handler: Book },
      defaultValue: {},
    })
    book: Book;
    @prop({
      cast: { handler: Book, array: true },
      defaultValue: [null, {}],
    })
    books: Book[];
  }
  const user = new User({
    name: 'fake',
    book: {
      title: 'fake',
    },
    books: [
      {
        title: 'fake',
      },
    ],
  });
  user.reset();
  ctx.deepEqual(user.serialize(), {
    name: 'bar',
    book: {
      title: 'foo',
    },
    books: [
      null,
      {
        title: 'foo',
      },
    ],
  });
});

spec.test('method `fake` sets properties to their fake values', (ctx) => {
  class Book extends Model {
    @prop({
      fakeValue: 'foo',
    })
    title: string;
  }
  class User extends Model {
    @prop({
      fakeValue: 'bar',
    })
    name: string;
    @prop({
      cast: { handler: Book },
      fakeValue: 'bar',
    })
    book: Book;
    @prop({
      cast: { handler: Book, array: true },
      fakeValue: [null, {}],
    })
    books: Book[];
  }
  const user = new User();
  user.fake();
  ctx.deepEqual(user.serialize(), {
    name: 'bar',
    book: {
      title: 'foo',
    },
    books: [
      null,
      {
        title: 'foo',
      },
    ],
  });
});

spec.test('method `empty` sets properties to `null`', (ctx) => {
  class Book extends Model {
    @prop({
      defaultValue: 'foo',
    })
    title: string;
  }
  class User extends Model {
    @prop({
      defaultValue: 'bar',
    })
    name: string;
    @prop({
      emptyValue: 'null',
    })
    description: string;
    @prop({
      cast: { handler: Book },
      defaultValue: {},
    })
    book: Book;
    @prop({
      cast: { handler: Book, array: true },
      defaultValue: [null, {}],
    })
    books: Book[];
  }
  const user = new User({
    name: 'fake',
    description: 'fake',
    book: {
      title: 'fake',
    },
    books: [
      {
        title: 'fake',
      },
    ],
  });
  user.empty();
  ctx.deepEqual(user.serialize(), {
    name: null,
    description: 'null',
    book: null,
    books: null,
  });
});

spec.test('methods `commit()` and `rollback()` manage committed states', (ctx) => {
  class Book extends Model {
    @prop()
    title: string;
  }
  class User extends Model {
    @prop()
    name: string;
    @prop({
      cast: { handler: Book },
    })
    book: Book;
    @prop({
      cast: { handler: Book, array: true },
    })
    books: Book[];
  }
  const user = new User({
    name: 'foo',
    book: {
      title: 'bar',
    },
    books: [
      {
        title: 'baz',
      },
    ],
  });
  user.commit();
  ctx.is(user.getProp('name').getInitialValue(), 'foo');
  ctx.is(user.getProp('book', 'title').getInitialValue(), 'bar');
  ctx.is(user.getProp('books', 0, 'title').getInitialValue(), 'baz');
  user.populate({
    name: 'foo-new',
    book: {
      title: 'bar-new',
    },
    books: [
      {
        title: 'baz-new',
      },
    ],
  });
  user.rollback();
  ctx.is(user.getProp('name').getValue(), 'foo');
  ctx.is(user.getProp('book', 'title').getValue(), 'bar');
  ctx.is(user.getProp('books', 0, 'title').getValue(), 'baz');
});

spec.test('method `isEqual` returns `true` when the passing object looks the same', (ctx) => {
  class Book extends Model {
    @prop()
    title: string;
  }
  class User extends Model {
    @prop()
    name: string;
    @prop({
      cast: { handler: Book },
    })
    book: Book;
    @prop({
      cast: { handler: Book, array: true },
    })
    books: Book[];
  }
  const data = {
    name: 'foo',
    book: {
      title: 'bar',
    },
    books: [
      null,
      {
        title: 'baz',
      },
    ],
  };
  ctx.true(new User(data).isEqual(new User(data)));
});

spec.test('method `isChanged` returns `true` if at least one prop has been changed', (ctx) => {
  class Book extends Model {
    @prop()
    title: string;
  }
  class User extends Model {
    @prop()
    name: string;
    @prop({
      cast: { handler: Book },
    })
    book: Book;
    @prop({
      cast: { handler: Book, array: true },
    })
    books: Book[];
  }
  const data = {
    name: 'foo',
    book: {
      title: 'bar',
    },
    books: [
      null,
      {
        title: 'baz',
      },
    ],
  };
  const user0 = new User(data);
  const user1 = new User(data);
  const user2 = new User(data);
  const user3 = new User(data);
  ctx.false(user0.isChanged());
  user0.name = 'foo-new';
  ctx.true(user0.isChanged());
  user1.book.title = 'bar-new';
  ctx.true(user1.isChanged());
  user2.books[0] = { title: 'baz-new' } as Book; // model instances in array
  ctx.true(user2.isChanged());
  user3.books[1].title = 'baz-new';
  ctx.true(user3.isChanged());
});

spec.test('method `applyErrors` sets properties errors', (ctx) => {
  class Book extends Model {
    @prop()
    title: string;
  }
  class User extends Model {
    @prop()
    name: string;
    @prop({
      cast: { handler: Book },
    })
    book: Book;
    @prop({
      cast: { handler: Book, array: true },
    })
    books: Book[];
  }
  const user = new User({
    book: {},
    books: [null, {}]
  });
  user.applyErrors([
    { path: ['name'], errors: [100] },
    { path: ['book', 'title'], errors: [200, 300] },
    { path: ['books', 1, 'title'], errors: [400] },
  ]);
  ctx.deepEqual(user.getProp('name').getErrorCodes(), [100]);
  ctx.deepEqual(user.getProp('book', 'title').getErrorCodes(), [200, 300]);
  ctx.deepEqual(user.getProp('books', 1, 'title').getErrorCodes(), [400]);
});

spec.test('method `collectErrors` returns an array of errors', (ctx) => {
  class Book extends Model {
    @prop()
    title: string;
  }
  class User extends Model {
    @prop()
    name: string;
    @prop({
      cast: { handler: Book },
    })
    book: Book;
    @prop({
      cast: { handler: Book, array: true },
    })
    books: Book[];
  }
  const user = new User({
    book: {},
    books: [{}]
  });
  user.getProp('name').setErrorCodes(100);
  user.getProp('book', 'title').setErrorCodes(200, 300);
  user.getProp('books', 0, 'title').setErrorCodes(400);
  ctx.deepEqual(user.collectErrors(), [
    { path: ['name'], errors: [100] },
    { path: ['book', 'title'], errors: [200, 300] },
    { path: ['books', 0, 'title'], errors: [400] },
  ]);
});

spec.test('method `isValid` tell if model has no errors', async (ctx) => {
  class Book extends Model {
    @prop()
    title: string;
  }
  class User extends Model {
    @prop()
    name: string;
    @prop({
      cast: { handler: Book },
    })
    book: Book;
    @prop({
      cast: { handler: Book, array: true },
    })
    books: Book[];
  }
  const user0 = new User({
    book: {},
    books: [null, {}]
  });
  const user1 = new User();
  ctx.true(user0.isValid());
  ctx.true(user1.isValid());
  user0.applyErrors([
    { path: ['books', 1, 'title'], errors: [100]},
  ]);
  ctx.false(user0.isValid());
});

spec.test('method `validate` validates properties and throws an error', async (ctx) => {
  const validate = [
    { handler: (v) => !!v, code: 100 },
    { handler: (v) => !!v, code: 200 },
  ];
  class Book extends Model {
    @prop({
      validate,
    })
    title: string;
  }
  class User extends Model {
    @prop({
      validate,
    })
    name: string;
    @prop({
      validate,
      cast: { handler: Book },
    })
    book0: Book;
    @prop({
      validate,
      cast: { handler: Book, array: true },
    })
    books0: Book[];
    @prop({
      validate,
      cast: { handler: Book },
    })
    book1: Book;
    @prop({
      validate,
      cast: { handler: Book, array: true },
    })
    books1: Book[];
  }
  const user = new User({
    book1: {},
    books1: [{}]
  });
  const errors = [100, 200];
  await user.validate({quiet: true});
  ctx.is(await user.validate().catch(() => false), false);
  ctx.deepEqual(user.collectErrors(), [
    { path: ['name'], errors },
    { path: ['book0'], errors },
    { path: ['books0'], errors },
    { path: ['book1', 'title'], errors },
    { path: ['books1', 0, 'title'], errors },
  ]);
});

spec.test('method `handle` handles property errors', async (ctx) => {
  const handle = [{
    handler: (e) => e.message === 'foo',
    code: 100,
  }];
  class Book extends Model {
    @prop({
      handle
    })
    title: string;
  }
  class Country extends Model {
    @prop()
    code: string;
  }
  class User extends Model {
    @prop({
      handle
    })
    name: string;
    @prop({
      handle,
      cast: { handler: Book },
    })
    book0: Book;
    @prop({
      handle,
      cast: { handler: Book, array: true },
    })
    books0: Book[];
    @prop({
      cast: { handler: Book },
    })
    book1: Book;
    @prop({
      cast: { handler: Book, array: true },
    })
    books1: Book[];
    @prop({
      cast: { handler: Country },
    })
    country: Country;
  }
  const user = new User({
    book1: {},
    books1: [{}],
    country: {},
  });
  const problem0 = new Error();
  const problem1 = new Error('foo');
  const errors = [100];
  await user.handle(problem0);
  ctx.true(user.isValid());
  await user.handle(problem1);
  ctx.false(user.isValid());
  ctx.throws(() => user.handle(problem0, { quiet: false }));
  ctx.throws(() => user.handle(problem1, { quiet: false }));
  ctx.deepEqual(user.collectErrors(), [
    { path: ['name'], errors },
    { path: ['book0'], errors },
    { path: ['books0'], errors },
    { path: ['book1', 'title'], errors },
    { path: ['books1', 0, 'title'], errors },
  ]);
});

spec.test('method `invalidate` clears property errors', async (ctx) => {
  class Book extends Model {
    @prop()
    title: string;
  }
  class User extends Model {
    @prop()
    name: string;
    @prop({
      cast: { handler: Book },
    })
    book: Book;
    @prop({
      cast: { handler: Book, array: true },
    })
    books: Book[];
  }
  const user = new User({
    book: {},
    books: [null, {}]
  });
  user.applyErrors([
    { path: ['name'], errors: [100] },
    { path: ['book', 'title'], errors: [200] },
    { path: ['books', 1, 'title'], errors: [300] },
  ]);
  user.invalidate();
  ctx.deepEqual(user.getProp('name').getErrorCodes(), []);
  ctx.deepEqual(user.getProp('book', 'title').getErrorCodes(), []);
  ctx.deepEqual(user.getProp('books', 1, 'title').getErrorCodes(), []);
});

spec.test('method `clone` returns an exact copy of the original', (ctx) => {
  class Book extends Model {
    @prop()
    title: string;
  }
  class User extends Model {
    @prop()
    name: string;
    @prop({
      cast: { handler: Book },
    })
    book: Book;
    @prop({
      cast: { handler: Book, array: true },
    })
    books: Book[];
  }
  const parent = new Book();
  const user = new User({
    parent, // fake parent
    name: 'foo',
    book: {
      title: 'bar'
    },
    books: [
      null,
      {
        title: 'baz'
      }
    ]
  });
  const clone0 = user.clone();
  const clone1 = user.clone({book: { title: 'foo' }});
  ctx.true(clone0 !== user);
  ctx.true(clone0.isEqual(user));
  ctx.is(clone0.book.getParent(), clone0);
  ctx.is(clone0.getParent(), null);
  ctx.is(clone0.getRoot(), clone0);
  ctx.is(clone1.book.title, 'foo');
});

export default spec;
