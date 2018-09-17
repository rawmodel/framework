import { Spec } from '@hayspec/spec';
import { Model, Prop, prop } from '../src';

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
  ctx.false(user1.isChanged());
  user2.books[0] = { title: 'baz-new' } as Book;
  ctx.false(user2.isChanged());
  user3.books[1].title = 'baz-new';
  ctx.false(user3.isChanged());
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

// test('method `validate` validates props and throws an error', async (ctx) => {
//   const validate = [
//     { validator: 'presence', message: 'foo' },
//     { validator: 'presence', code: 999 },
//   ];
//   class Book extends Model {
//     constructor(data) {
//       super(data);
//       this.defineProp('title', { validate });
//     }
//   }
//   class User extends Model {
//     constructor(data) {
//       super(data);
//       this.defineProp('name', { validate });
//       this.defineProp('book0', { type: Book, validate });
//       this.defineProp('books0', { type: [Book], validate });
//       this.defineProp('book1', { type: Book, validate });
//       this.defineProp('books1', { type: [Book], validate });
//       this.populate(data);
//     }
//   }
//   const user = new User({
//     book1: {},
//     books1: [{}]
//   });
//   const errors = [
//     { validator: 'presence', message: 'foo', code: 422 },
//     { validator: 'presence', message: undefined, code: 999 },
//   ];
//   await user.validate({quiet: true});
//   ctx.is(await user.validate().catch(() => false), false);
//   ctx.deepEqual(user.collectErrors() as {}, [
//     { path: ['name'], errors },
//     { path: ['book0'], errors },
//     { path: ['books0'], errors },
//     { path: ['book1', 'title'], errors },
//     { path: ['books1', 0, 'title'], errors },
//   ]);
// });

// test('method `defineValidator` defines a custom prop validator', async (ctx) => {
//   const validator = function (v) {
//     return this.value === 'cool' && v === 'cool';
//   };
//   const validate = [{
//     validator: 'coolness',
//     message: 'foo'
//   }];
//   class Book extends Model {
//     constructor(data) {
//       super(data);
//       this.defineValidator('coolness', validator);
//       this.defineProp('title', { validate });
//     }
//   }
//   class User extends Model {
//     constructor(data) {
//       super(data);
//       this.defineValidator('coolness', validator);
//       this.defineProp('name', { validate });
//       this.defineProp('book', { type: Book, validate });
//       this.populate(data);
//     }
//   }
//   const user = new User({
//     book: {}
//   });
//   const errors = [{ validator: 'coolness', message: 'foo', code: 422 }];
//   await user.validate({quiet: true});
//   ctx.deepEqual(user.collectErrors() as {}, [
//     {path: ['name'], errors},
//     {path: ['book'], errors},
//     {path: ['book', 'title'], errors},
//   ]);
// });

// test('method `failFast` configures validator to stop validating prop on the first error', async (ctx) => {
//   const validate = [
//     { validator: 'presence', message: 'foo' },
//     { validator: 'presence', message: 'foo' },
//   ];
//   class Book extends Model {
//     constructor(data) {
//       super(data);
//       this.failFast();
//       this.defineProp('title', { validate });
//     }
//   }
//   class User extends Model {
//     constructor(data) {
//       super(data);
//       this.failFast();
//       this.defineProp('name', { validate });
//       this.defineProp('book', { type: Book });
//       this.populate(data);
//     }
//   }
//   const user = new User({
//     book: {}
//   });
//   const errors = [{ validator: 'presence', message: 'foo', code: 422 }];
//   await user.validate({ quiet: true });
//   ctx.is(user.getProp('name').errors.length, 1);
//   ctx.is(user.getProp('book', 'title').errors.length, 1);
// });

// test('method `invalidate` clears props errors', async (ctx) => {
//   class Book extends Model {
//     constructor(data) {
//       super(data);
//       this.defineProp('title');
//     }
//   }
//   class User extends Model {
//     constructor(data) {
//       super(data);
//       this.defineProp('name');
//       this.defineProp('book', { type: Book });
//       this.defineProp('books', { type: [Book] });
//       this.populate(data);
//     }
//   }
//   const user = new User({
//     book: {},
//     books: [null, {}]
//   });
//   user.applyErrors([
//     { path: ['name'], errors: [{ message: 'foo'}] },
//     { path: ['book', 'title'], errors: [{ message: 'bar'}] },
//     { path: ['books', 1, 'title'], errors: [{ message: 'baz'}] },
//   ]);
//   user.invalidate();
//   ctx.deepEqual(user.getProp('name').errors, []);
//   ctx.deepEqual(user.getProp('book', 'title').errors, []);
//   ctx.deepEqual(user.getProp('books', 1, 'title').errors, []);
// });

// test('method `clone` returns an exact copy of the original', (ctx) => {
//   class Book extends Model {
//     title: string;
//     constructor(data?) {
//       super(data);
//       this.defineProp('title');
//       this.commit();
//     }
//   }
//   class User extends Model {
//     name: string;
//     book: Book;
//     books: Book[];
//     constructor(data?) {
//       super(data);
//       this.defineProp('name');
//       this.defineProp('book', { type: Book });
//       this.defineProp('books', { type: [Book] });
//       this.populate(data);
//       this.commit();
//     }
//   }
//   const parent = new Book();
//   const user = new User({
//     parent, // fake parent
//     name: 'foo',
//     book: {
//       title: 'bar'
//     },
//     books: [
//       null,
//       {
//         title: 'baz'
//       }
//     ]
//   });
//   const clone0 = user.clone();
//   const clone1 = user.clone({book: { title: 'foo' }});
//   ctx.is(clone0 !== user, true);
//   ctx.is(clone0.equals(user), true);
//   ctx.is(clone0.book.parent, clone0);
//   ctx.is(clone0.parent, parent);
//   ctx.is(clone0.parent, parent);
//   ctx.is(clone1.book.title, 'foo');
// });

// test('method `handle` handles prop-related errors', async (ctx) => {
//   const handle = [{
//     handler: 'block',
//     message: '%{foo}',
//     block: async () => true,
//     foo: 'foo'
//   }];
//   class Book extends Model {
//     constructor(data) {
//       super(data);
//       this.defineProp('title', { handle });
//     }
//   }
//   class Country extends Model {
//     constructor(data) {
//       super(data);
//       this.defineProp('code'); // this prop is nested and without handler
//       this.populate(data);
//     }
//   }
//   class User extends Model {
//     constructor(data) {
//       super(data);
//       this.defineProp('name', { handle });
//       this.defineProp('book0', { type: Book, handle });
//       this.defineProp('books0', { type: [Book], handle });
//       this.defineProp('book1', { type: Book });
//       this.defineProp('books1', { type: [Book] });
//       this.defineProp('country', { type: [Country] });
//       this.populate(data);
//     }
//   }
//   const user = new User({
//     book1: {},
//     books1: [{}],
//     country: {}
//   });
//   const problem0 = new Error();
//   const problem1 = new Error() as any; problem1.code = 422;
//   const errors = [{ handler: 'block', message: 'foo', code: 422 }];
//   ctx.is(await user.handle(problem0, { quiet: false }).catch(() => false), false);
//   ctx.is(await user.handle(problem0).then(() => true), true);
//   ctx.is(await user.handle(problem1, { quiet: false }).then(() => true), true);
//   await user.handle(problem0);
//   ctx.deepEqual(user.collectErrors() as {}, [
//     { path: ['name'], errors },
//     { path: ['book0'], errors },
//     { path: ['books0'], errors },
//     { path: ['book1', 'title'], errors },
//     { path: ['books1', 0, 'title'], errors },
//   ]);
// });

// test('method `defineHandler` defines a custom prop handler', async (ctx) => {
//   const handler = function (e) {
//     return e.message === 'cool';
//   };
//   const handle = [{
//     handler: 'coolness',
//     message: '%{foo}',
//     foo: 'foo'
//   }];
//   class Book extends Model {
//     constructor(data) {
//       super(data);
//       this.defineHandler('coolness', handler);
//       this.defineProp('title', { handle });
//     }
//   }
//   class User extends Model {
//     constructor(data) {
//       super(data);
//       this.defineHandler('coolness', handler);
//       this.defineProp('name', { handle });
//       this.defineProp('book', { type: Book });
//       this.defineProp('books', { type: [Book] });
//       this.populate(data);
//     }
//   }
//   const user = new User({
//     book: {},
//     books: [{}]
//   });
//   const problem = new Error('cool');
//   const errors = [{ handler: 'coolness', message: 'foo', code: 422 }];
//   await user.handle(problem);
//   ctx.deepEqual(user.collectErrors() as {}, [
//     { path: ['name'], errors },
//     { path: ['book', 'title'], errors },
//     { path: ['books', 0, 'title'], errors },
//   ]);
// });

// test('property `enumerable` handles prop visibility', (ctx) => {
//   class User0 extends Model {
//     name: string;
//     constructor(data) {
//       super(data);
//       this.defineProp('name', { enumerable: true });
//     }
//   }
//   class User1 extends Model {
//     name: string;
//     constructor(data) {
//       super(data);
//       this.defineProp('name', { enumerable: false });
//     }
//   }
//   const user0 = new User0({});
//   const user1 = new User1({});
//   ctx.deepEqual(Object.keys(user0), ['name']);
//   ctx.deepEqual(Object.keys(user1), []);
// });


export default spec;
