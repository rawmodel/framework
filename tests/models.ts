import test from 'ava';
import { ObjectId } from 'mongodb';
import { Model, Prop } from '../src';

test('method `defineProp` initializes nullified enumerable property', (t) => {
  const user = new class User extends Model {
    name: string;
    constructor() {
      super();
      this.defineProp('name');
    }
  };
  const descriptor = Object.getOwnPropertyDescriptor(user, 'name');
  t.is(typeof descriptor.get, 'function');
  t.is(typeof descriptor.set, 'function');
  t.is(descriptor.enumerable, true);
  t.is(descriptor.configurable, true);
  t.is(user.name, null);
});

test('method `defineType` defines a custom data type', (t) => {
  const user = new class User extends Model {
    name0: string;
    name1: string[];
    constructor() {
      super();
      this.defineType('cool', (v) => `${v}-cool`);
      this.defineProp('name0', { type: 'cool' });
      this.defineProp('name1', { type: ['cool'] });
    }
  };
  user.name0 = 'foo';
  user.name1 = ['foo'];
  t.is(user.name0, 'foo-cool');
  t.deepEqual(user.name1, ['foo-cool']);
});

test('method `populate` deeply assignes data', (t) => {
  class Book extends Model {
    id: number;
    title: string;
    description: string;
    constructor(data = {}) {
      super(data);
      this.defineProp('id', { type: 'Integer', populatable: ['output'] });
      this.defineProp('title', { type: 'String'});
      this.defineProp('description', { type: 'String', populatable: ['input'] });
    }
  }
  class User extends Model {
    id: number;
    name: string;
    email: string;
    book0: Book;
    book1: Book;
    books: Book[];
    constructor(data = {}) {
      super(data);
      this.defineProp('id', { type: 'Integer', populatable: ['output'] });
      this.defineProp('name', { type: 'String'});
      this.defineProp('email', { type: 'String', populatable: ['input'] });
      this.defineProp('book0', { type: Book, populatable: ['output'] });
      this.defineProp('book1', { type: Book});
      this.defineProp('books', { type: [Book], populatable: ['input'] });
      this.populate(data);
    }
  }
  const data = {
    id: '100',
    name: 100,
    email: 'foo@bar.com',
    book0: {
      id: '200',
      title: 200,
      description: 'fake',
    },
    book1: undefined,
    books: [
      undefined,
      {
        id: '300',
        title: 300,
        description: 'fake',
      },
    ],
  };
  const user0 = new User();
  const user1 = new User();
  const user2 = new User();
  user0.populate(null); // should not break
  user0.populate(false); // should not break
  user0.populate(''); // should not break
  user0.populate(true); // should not break
  user0.populate(100); // should not break
  user0.populate(data);
  user1.populate(data, 'input');
  user2.populate(data, 'output');
  t.is(user0.id, 100);
  t.is(user0.name, '100');
  t.is(user0.book0.id, 200);
  t.is(user0.book0.title, '200');
  t.is(user0.book1, null);
  t.is(user0.books[0], null);
  t.is(user0.books[1].title, '300');
  t.is(user1.id, null);
  t.is(user1.name, null);
  t.is(user1.email, 'foo@bar.com');
  t.is(user1.book0, null);
  t.is(user1.book1, null);
  t.is(user1.books[0], null);
  t.is(user1.books[1].id, null);
  t.is(user1.books[1].title, null);
  t.is(user1.books[1].description, 'fake');
  t.is(user2.id, 100);
  t.is(user2.name, null);
  t.is(user2.email, null);
  t.is(user2.book0.id, 200);
  t.is(user2.book0.title, null);
  t.is(user2.book0.description, null);
  t.is(user2.book1, null);
  t.is(user2.books, null);
});

test('property `parent` holds an instance of a parent model', (t) => {
  class Book extends Model {
    title: string;
    constructor(data) {
      super(data);
      this.defineProp('title', { type: 'String' });
    }
  }
  class User extends Model {
    name: string;
    book: Book;
    books: Book[];
    constructor(data) {
      super(data);
      this.defineProp('name', { type: 'String' });
      this.defineProp('book', { type: Book });
      this.defineProp('books', { type: [Book] });
      this.populate(data);
    }
  }
  const user = new User({
    book: {
      title: 200
    },
    books: [
      undefined,
      {
        title: 300
      }
    ]
  });
  t.is(user.parent, null);
  t.is(user.propertyIsEnumerable('parent'), false);
  t.is(user.book.parent, user);
  t.is(user.books[1].parent, user);
});

test('property `root` return the first model in a tree of nested models', (t) => {
  class Book extends Model {
    title: string;
    constructor(data) {
      super(data);
      this.defineProp('title');
    }
  }
  class User extends Model {
    book: Book;
    constructor(data) {
      super(data);
      this.defineProp('book', { type: Book });
      this.populate(data);
    }
  }
  const user = new User({
    book: {
      title: 200
    }
  });
  t.is(user.root, user);
  t.is(user.book.root, user);
});

test('method `getProp` returns an instance of a prop at path', (t) => {
  class Book extends Model {
    constructor(data) {
      super(data);
      this.defineProp('title', { type: 'String' });
    }
  }
  class User extends Model {
    constructor(data) {
      super(data);
      this.defineProp('name', { type: 'String' });
      this.defineProp('book', { type: Book });
      this.defineProp('books', { type: [Book] });
      this.populate(data);
    }
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
  t.is(user.getProp(['name']).value, 'foo');
  t.is(user.getProp('name').value, 'foo');
  t.is(user.getProp(['book', 'title']).value, 'bar');
  t.is(user.getProp('book', 'title').value, 'bar');
  t.is(user.getProp(['books', 1, 'title']).value, 'baz');
  t.is(user.getProp('books', 1, 'title').value, 'baz');
  t.is(user.getProp(['fake']), undefined);
  t.is(user.getProp(['fake', 10, 'title']), undefined);
  t.is(user.getProp(), undefined);
});

test('method `hasProp` returns `true` if the prop exists', (t) => {
  class User extends Model {
    constructor(data = {}) {
      super(data);
      this.defineProp('name', { type: 'String' });
    }
  }
  const user = new User();
  t.is(user.hasProp(['name']), true);
  t.is(user.hasProp(['book', 'title']), false);
});

test('method `serialize` converts model into a serialized data object', (t) => {
  class Book extends Model {
    constructor(data) {
      super(data);
      this.defineProp('title', { type: 'String' });
      this.defineProp('description', { serializable: ['output'] }); // only for these strategies
    }
  }
  class User extends Model {
    constructor(data) {
      super(data);
      this.defineProp('id', { type: (v) => new Object(v), serializable: [] }); // never
      this.defineProp('name', { type: 'String', serializable: null });
      this.defineProp('description', { serializable: ['input', 'output'] }); // only for these strategies
      this.defineProp('book', { type: Book, serializable: ['output'] });
      this.defineProp('books', { type: [Book] });
      this.populate(data);
    }
  }
  const user = new User({
    id: new Object('59efbadde01a49055b39711f'),
    name: 'foo',
    description: 'des',
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
  t.deepEqual(user.serialize(), {
    id: new Object('59efbadde01a49055b39711f'),
    name: 'foo',
    description: 'des',
    book: {
      title: 'bar',
      description: null,
    },
    books: [
      null,
      {
        title: 'baz',
        description: null,
      },
    ],
  });
  t.deepEqual(user.serialize('input'), {
    description: 'des',
  });
  t.deepEqual(user.serialize('output'), {
    description: 'des',
    book: {
      description: null,
    },
  });
});

test('method `flatten` returns an array of props', async (t) => {
  class Book extends Model {
    constructor(data) {
      super(data);
      this.defineProp('title', { type: 'String' });
    }
  }
  class User extends Model {
    constructor(data) {
      super(data);
      this.defineProp('name', { type: 'String' });
      this.defineProp('book', { type: Book });
      this.defineProp('books', { type: [Book] });
      this.populate(data);
    }
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
  t.deepEqual(user.flatten().map((f) => f.path), [
    ['name'],
    ['book'],
    ['book', 'title'],
    ['books'],
    ['books', 1, 'title']
  ]);
  t.deepEqual(Object.keys(user.flatten()[0]), ['path', 'prop']);
  t.deepEqual(user.flatten()[0].path, ['name']);
  t.is(user.flatten()[0].prop.value, 'foo');
});

test('method `collect` returns an array of results', (t) => {
  class Book extends Model {
    constructor(data) {
      super(data);
      this.defineProp('title', { type: 'String' });
    }
  }
  class User extends Model {
    constructor(data) {
      super(data);
      this.defineProp('name', { type: 'String' });
      this.defineProp('book', { type: Book });
      this.populate(data);
    }
  }
  const user = new User({
    name: 'foo',
    book: {
      title: 'bar'
    }
  });
  const results = user.collect(({ path }) => path);
  t.deepEqual(results, [
    ['name'],
    ['book'],
    ['book', 'title']
  ]);
});

test('method `scroll` runs the provided handler on each prop', (t) => {
  class Book extends Model {
    constructor(data) {
      super(data);
      this.defineProp('title', { type: 'String' });
    }
  }
  class User extends Model {
    constructor(data) {
      super(data);
      this.defineProp('name', { type: 'String' });
      this.defineProp('book', { type: Book });
      this.populate(data);
    }
  }
  const user = new User({
    name: 'foo',
    book: {
      title: 'bar'
    }
  });
  const count = user.scroll(({ path }) => null);
  t.deepEqual(count, 3);
});

test('method `filter` converts a model into serialized object with only keys that pass the test', (t) => {
  class Book extends Model {
    constructor(data) {
      super(data);
      this.defineProp('title', { type: 'String' });
    }
  }
  class User extends Model {
    constructor(data) {
      super(data);
      this.defineProp('name', { type: 'String' });
      this.defineProp('book', { type: Book });
      this.defineProp('books', { type: [Book] });
      this.populate(data);
    }
  }
  const user = new User({
    name: 'foo',
    book: {
      title: 'bar'
    },
    books: [
      undefined,
      {
        title: 'bar'
      }
    ]
  });
  const result = user.filter(({ path, prop }) => prop.value !== 'foo');
  t.deepEqual(result as any, {
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

test('method `reset` sets props to their default values', (t) => {
  class Book extends Model {
    constructor(data) {
      super(data);
      this.defineProp('title', { defaultValue: 'foo' });
    }
  }
  class User extends Model {
    constructor(data) {
      super(data);
      this.defineProp('name', { defaultValue: 'bar' });
      this.defineProp('book', { type: Book, defaultValue: {} });
      this.defineProp('books', { type: [Book], defaultValue: [null, {}] });
      this.populate(data);
    }
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
  t.deepEqual(user.serialize(), {
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

test('method `fake` sets props to their fake values', (t) => {
  class Book extends Model {
    constructor(data) {
      super(data);
      this.defineProp('title', { fakeValue: 'foo' });
    }
  }
  class User extends Model {
    constructor(data = {}) {
      super();
      this.defineProp('name', { fakeValue: 'bar' });
      this.defineProp('book', { type: Book, defaultValue: {} });
      this.defineProp('books', { type: [Book], defaultValue: [null, {}] });
      this.populate(data);
    }
  }
  const user = new User();
  user.fake();
  t.deepEqual(user.serialize(), {
    name: 'bar',
    book: {
      title: 'foo'
    },
    books: [
      null,
      {
        title: 'foo'
      }
    ]
  });
});

test('method `clear` sets props to `null`', (t) => {
  class Book extends Model {
    constructor(data) {
      super(data);
      this.defineProp('title', { defaultValue: 'foo' });
    }
  }
  class User extends Model {
    constructor(data) {
      super(data);
      this.defineProp('name', { defaultValue: 'bar' });
      this.defineProp('description', { nullValue: 'null' });
      this.defineProp('book', { type: Book, defaultValue: {} });
      this.defineProp('books', { type: [Book], defaultValue: [null, {}] });
      this.populate(data);
    }
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
      }
    ]
  });
  user.clear();
  t.deepEqual(user.serialize(), {
    name: null,
    description: 'null',
    book: null,
    books: null
  });
});

test('methods `commit()` and `rollback()` manage committed states', (t) => {
  class Book extends Model {
    constructor(data) {
      super(data);
      this.defineProp('title');
    }
  }
  class User extends Model {
    constructor(data) {
      super(data);
      this.defineProp('name');
      this.defineProp('book', { type: Book });
      this.defineProp('books', { type: [Book] });
      this.populate(data);
    }
  }
  const user = new User({
    name: 'foo',
    book: {
      title: 'bar'
    },
    books: [
      {
        title: 'baz'
      }
    ]
  });
  user.commit();
  t.is(user.getProp('name').initialValue, 'foo');
  t.is(user.getProp('book', 'title').initialValue, 'bar');
  t.is(user.getProp('books', 0, 'title').initialValue, 'baz');
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
  t.is(user.getProp('name').value, 'foo');
  t.is(user.getProp('book', 'title').value, 'bar');
  t.is(user.getProp('books', 0, 'title').value, 'baz');
});

test('method `equals` returns `true` when the passing object looks the same', (t) => {
  class Book extends Model {
    constructor(data) {
      super(data);
      this.defineProp('title');
    }
  }
  class User extends Model {
    constructor(data) {
      super(data);
      this.defineProp('name');
      this.defineProp('book', { type: Book });
      this.defineProp('books', { type: [Book] });
      this.populate(data);
    }
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
      }
    ]
  };
  t.is(new User(data).equals(new User(data)), true);
});

test('method `isChanged` returns `true` if at least one prop has been changed', (t) => {
  class Book extends Model {
    title: string;
    constructor(data) {
      super(data);
      this.defineProp('title');
    }
  }
  class User extends Model {
    name: string;
    book: Book;
    books: Book[];
    constructor(data) {
      super(data);
      this.defineProp('name');
      this.defineProp('book', { type: Book });
      this.defineProp('books', { type: [Book] });
      this.populate(data);
      this.commit();
    }
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
  t.is(user0.isChanged(), false);
  user0.name = 'foo-new';
  user1.book.title = 'bar-new';
  user2.books[0] = { title: 'baz-new' } as Book;
  user3.books[1].title = 'baz-new';
  t.is(user0.isChanged(), true);
  t.is(user1.isChanged(), true);
  t.is(user2.isChanged(), true);
  t.is(user3.isChanged(), true);
});

test('method `isNested` returns `true` if nested props exist', (t) => {
  class Book extends Model {
    constructor(data) {
      super(data);
      this.defineProp('title');
    }
  }
  class User extends Model {
    constructor(data = {}) {
      super();
      this.defineProp('name');
      this.defineProp('books', { type: [Book] });
      this.populate(data);
    }
  }
  const user = new User();
  t.is(user.isNested(), true);
});

test('method `collectErrors` returns an array of prop errors', (t) => {
  class Book extends Model {
    constructor(data) {
      super(data);
      this.defineProp('title');
    }
  }
  class User extends Model {
    constructor(data) {
      super(data);
      this.defineProp('name');
      this.defineProp('book', { type: Book });
      this.defineProp('books', { type: [Book] });
      this.populate(data);
    }
  }
  const user = new User({
    book: {},
    books: [{}]
  });
  user.getProp('name').errors = [{ message: 'foo' }];
  user.getProp('book', 'title').errors = [{ message: 'bar' }];
  user.getProp('books', 0, 'title').errors = [{ message: 'baz' }];
  t.deepEqual(user.collectErrors(), [
    { path: ['name'], errors: [{ message: 'foo' }] },
    { path: ['book', 'title'], errors: [{ message: 'bar' }] },
    { path: ['books', 0, 'title'], errors: [{ message: 'baz' }] },
  ]);
});

test('method `applyErrors` sets props errors', (t) => {
  class Book extends Model {
    constructor(data) {
      super(data);
      this.defineProp('title');
    }
  }
  class User extends Model {
    constructor(data) {
      super(data);
      this.defineProp('name');
      this.defineProp('book', { type: Book });
      this.defineProp('books', { type: [Book] });
      this.populate(data);
    }
  }
  const user = new User({
    book: {},
    books: [null, {}]
  });

  user.applyErrors([
    { path: ['name'], errors: [{ message: 'foo' }] },
    { path: ['book', 'title'], errors: [{ message: 'bar' }] },
    { path: ['books', 1, 'title'], errors: [{ message: 'baz' }] },
  ]);
  t.deepEqual(user.getProp('name').errors, [{ message: 'foo' }]);
  t.deepEqual(user.getProp('book', 'title').errors, [{ message: 'bar' }]);
  t.deepEqual(user.getProp('books', 1, 'title').errors, [{ message: 'baz' }]);
});

test('methods `isValid` and `hasErrors` tell if errors exist', async (t) => {
  class Book extends Model {
    constructor(data) {
      super(data);
      this.defineProp('title');
    }
  }
  class User extends Model {
    constructor(data?) {
      super(data);
      this.defineProp('name');
      this.defineProp('book', { type: Book });
      this.defineProp('books', { type: [Book] });
      this.populate(data);
    }
  }
  const user0 = new User({
    book: {},
    books: [null, {}]
  });
  const user1 = new User();
  t.is(user0.hasErrors(), false);
  t.is(user1.hasErrors(), false);
  t.is(user0.isValid(), true);
  t.is(user1.isValid(), true);
  user0.applyErrors([
    { path: ['books', 1, 'title'], errors: [{ message: 'baz' }]},
  ]);
  t.is(user0.hasErrors(), true);
  t.is(user0.isValid(), false);
});

test('method `validate` validates props and throws an error', async (t) => {
  const validate = [
    { validator: 'presence', message: 'foo' },
    { validator: 'presence', code: 999 },
  ];
  class Book extends Model {
    constructor(data) {
      super(data);
      this.defineProp('title', { validate });
    }
  }
  class User extends Model {
    constructor(data) {
      super(data);
      this.defineProp('name', { validate });
      this.defineProp('book0', { type: Book, validate });
      this.defineProp('books0', { type: [Book], validate });
      this.defineProp('book1', { type: Book, validate });
      this.defineProp('books1', { type: [Book], validate });
      this.populate(data);
    }
  }
  const user = new User({
    book1: {},
    books1: [{}]
  });
  const errors = [
    { validator: 'presence', message: 'foo', code: 422 },
    { validator: 'presence', message: undefined, code: 999 },
  ];
  await user.validate({quiet: true});
  t.is(await user.validate().catch(() => false), false);
  t.deepEqual(user.collectErrors() as {}, [
    { path: ['name'], errors },
    { path: ['book0'], errors },
    { path: ['books0'], errors },
    { path: ['book1', 'title'], errors },
    { path: ['books1', 0, 'title'], errors },
  ]);
});

test('method `defineValidator` defines a custom prop validator', async (t) => {
  const validator = function (v) {
    return this.value === 'cool' && v === 'cool';
  };
  const validate = [{
    validator: 'coolness',
    message: 'foo'
  }];
  class Book extends Model {
    constructor(data) {
      super(data);
      this.defineValidator('coolness', validator);
      this.defineProp('title', { validate });
    }
  }
  class User extends Model {
    constructor(data) {
      super(data);
      this.defineValidator('coolness', validator);
      this.defineProp('name', { validate });
      this.defineProp('book', { type: Book, validate });
      this.populate(data);
    }
  }
  const user = new User({
    book: {}
  });
  const errors = [{ validator: 'coolness', message: 'foo', code: 422 }];
  await user.validate({quiet: true});
  t.deepEqual(user.collectErrors() as {}, [
    {path: ['name'], errors},
    {path: ['book'], errors},
    {path: ['book', 'title'], errors},
  ]);
});

test('method `failFast` configures validator to stop validating prop on the first error', async (t) => {
  const validate = [
    { validator: 'presence', message: 'foo' },
    { validator: 'presence', message: 'foo' },
  ];
  class Book extends Model {
    constructor(data) {
      super(data);
      this.failFast();
      this.defineProp('title', { validate });
    }
  }
  class User extends Model {
    constructor(data) {
      super(data);
      this.failFast();
      this.defineProp('name', { validate });
      this.defineProp('book', { type: Book });
      this.populate(data);
    }
  }
  const user = new User({
    book: {}
  });
  const errors = [{ validator: 'presence', message: 'foo', code: 422 }];
  await user.validate({ quiet: true });
  t.is(user.getProp('name').errors.length, 1);
  t.is(user.getProp('book', 'title').errors.length, 1);
});

test('method `invalidate` clears props errors', async (t) => {
  class Book extends Model {
    constructor(data) {
      super(data);
      this.defineProp('title');
    }
  }
  class User extends Model {
    constructor(data) {
      super(data);
      this.defineProp('name');
      this.defineProp('book', { type: Book });
      this.defineProp('books', { type: [Book] });
      this.populate(data);
    }
  }
  const user = new User({
    book: {},
    books: [null, {}]
  });
  user.applyErrors([
    { path: ['name'], errors: [{ message: 'foo'}] },
    { path: ['book', 'title'], errors: [{ message: 'bar'}] },
    { path: ['books', 1, 'title'], errors: [{ message: 'baz'}] },
  ]);
  user.invalidate();
  t.deepEqual(user.getProp('name').errors, []);
  t.deepEqual(user.getProp('book', 'title').errors, []);
  t.deepEqual(user.getProp('books', 1, 'title').errors, []);
});

test('method `clone` returns an exact copy of the original', (t) => {
  class Book extends Model {
    title: string;
    constructor(data?) {
      super(data);
      this.defineProp('title');
      this.commit();
    }
  }
  class User extends Model {
    name: string;
    book: Book;
    books: Book[];
    constructor(data?) {
      super(data);
      this.defineProp('name');
      this.defineProp('book', { type: Book });
      this.defineProp('books', { type: [Book] });
      this.populate(data);
      this.commit();
    }
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
  t.is(clone0 !== user, true);
  t.is(clone0.equals(user), true);
  t.is(clone0.book.parent, clone0);
  t.is(clone0.parent, parent);
  t.is(clone0.parent, parent);
  t.is(clone1.book.title, 'foo');
});

test('method `handle` handles prop-related errors', async (t) => {
  const handle = [{
    handler: 'block',
    message: '%{foo}',
    block: async () => true,
    foo: 'foo'
  }];
  class Book extends Model {
    constructor(data) {
      super(data);
      this.defineProp('title', { handle });
    }
  }
  class Country extends Model {
    constructor(data) {
      super(data);
      this.defineProp('code'); // this prop is nested and without handler
      this.populate(data);
    }
  }
  class User extends Model {
    constructor(data) {
      super(data);
      this.defineProp('name', { handle });
      this.defineProp('book0', { type: Book, handle });
      this.defineProp('books0', { type: [Book], handle });
      this.defineProp('book1', { type: Book });
      this.defineProp('books1', { type: [Book] });
      this.defineProp('country', { type: [Country] });
      this.populate(data);
    }
  }
  const user = new User({
    book1: {},
    books1: [{}],
    country: {}
  });
  const problem0 = new Error();
  const problem1 = new Error() as any; problem1.code = 422;
  const errors = [{ handler: 'block', message: 'foo', code: 422 }];
  t.is(await user.handle(problem0, { quiet: false }).catch(() => false), false);
  t.is(await user.handle(problem0).then(() => true), true);
  t.is(await user.handle(problem1, { quiet: false }).then(() => true), true);
  await user.handle(problem0);
  t.deepEqual(user.collectErrors() as {}, [
    { path: ['name'], errors },
    { path: ['book0'], errors },
    { path: ['books0'], errors },
    { path: ['book1', 'title'], errors },
    { path: ['books1', 0, 'title'], errors },
  ]);
});

test('method `defineHandler` defines a custom prop handler', async (t) => {
  const handler = function (e) {
    return e.message === 'cool';
  };
  const handle = [{
    handler: 'coolness',
    message: '%{foo}',
    foo: 'foo'
  }];
  class Book extends Model {
    constructor(data) {
      super(data);
      this.defineHandler('coolness', handler);
      this.defineProp('title', { handle });
    }
  }
  class User extends Model {
    constructor(data) {
      super(data);
      this.defineHandler('coolness', handler);
      this.defineProp('name', { handle });
      this.defineProp('book', { type: Book });
      this.defineProp('books', { type: [Book] });
      this.populate(data);
    }
  }
  const user = new User({
    book: {},
    books: [{}]
  });
  const problem = new Error('cool');
  const errors = [{ handler: 'coolness', message: 'foo', code: 422 }];
  await user.handle(problem);
  t.deepEqual(user.collectErrors() as {}, [
    { path: ['name'], errors },
    { path: ['book', 'title'], errors },
    { path: ['books', 0, 'title'], errors },
  ]);
});

test('property `enumerable` handles prop visibility', (t) => {
  class User0 extends Model {
    name: string;
    constructor(data) {
      super(data);
      this.defineProp('name', { enumerable: true });
    }
  }
  class User1 extends Model {
    name: string;
    constructor(data) {
      super(data);
      this.defineProp('name', { enumerable: false });
    }
  }
  const user0 = new User0({});
  const user1 = new User1({});
  t.deepEqual(Object.keys(user0), ['name']);
  t.deepEqual(Object.keys(user1), []);
});
