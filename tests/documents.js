import test from 'ava';
import {Document, Field} from '..';

test('method `defineField` initializes nullified enumerable property', (t) => {
  let user = new class User extends Document {
    constructor () {
      super();
      this.defineField('name');
    }
  }
  let descriptor = Object.getOwnPropertyDescriptor(user, 'name');
  t.is(typeof descriptor.get, 'function');
  t.is(typeof descriptor.set, 'function');
  t.is(descriptor.enumerable, true);
  t.is(descriptor.configurable, true);
  t.is(user.name, null);
});

test('method `defineType` defines a custom data type', (t) => {
  let user = new class User extends Document {
    constructor () {
      super();
      this.defineType('cool', (v) => `${v}-cool`);
      this.defineField('name', {type: 'cool'});
    }
  }
  user.name = 'foo';
  t.is(user.name, 'foo-cool');
});

test('method `populate` deeply populates fields', (t) => {
  class Book extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('title', {type: 'String'});
      this.populate(data);
    }
  }
  class User extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('name', {type: 'String'});
      this.defineField('book', {type: Book});
      this.defineField('books', {type: [Book]});
      this.populate(data);
    }
  }
  let user = new User({
    name: 100,
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
  t.is(user.name, '100');
  t.is(user.book.title, '200');
  t.is(user.books[0], null);
  t.is(user.books[1].title, '300');
});

test('property `parent` holds an instance of a parent document', (t) => {
  class Book extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('title', {type: 'String'});
      this.populate(data);
    }
  }
  class User extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('name', {type: 'String'});
      this.defineField('book', {type: Book});
      this.defineField('books', {type: [Book]});
      this.populate(data);
    }
  }
  let user = new User({
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
  t.is(user.book.parent, user);
  t.is(user.books[1].parent, user);
});

test('property `root` return the first document in a tree of nested documents', (t) => {
  class Book extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('title');
      this.populate(data);
    }
  }
  class User extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('book', {type: Book});
      this.populate(data);
    }
  }
  let user = new User({
    book: {
      title: 200
    }
  });
  t.is(user.root, user);
  t.is(user.book.root, user);
});

test('method `getField` returns an instance of a field at path', (t) => {
  class Book extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('title', {type: 'String'});
      this.populate(data);
    }
  }
  class User extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('name', {type: 'String'});
      this.defineField('book', {type: Book});
      this.defineField('books', {type: [Book]});
      this.populate(data);
    }
  }
  let user = new User({
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
  t.is(user.getField(['name']).value, 'foo');
  t.is(user.getField('name').value, 'foo');
  t.is(user.getField(['book', 'title']).value, 'bar');
  t.is(user.getField('book', 'title').value, 'bar');
  t.is(user.getField(['books', 1, 'title']).value, 'baz');
  t.is(user.getField('books', 1, 'title').value, 'baz');
  t.is(user.getField(['fake']), undefined);
  t.is(user.getField(['fake', 10, 'title']), undefined);
  t.is(user.getField(), undefined);
});

test('method `hasField` returns `true` if the field exists', (t) => {
  class User extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('name', {type: 'String'});
      this.populate(data);
    }
  }
  let user = new User();
  t.is(user.hasField(['name']), true);
  t.is(user.hasField(['book', 'title']), false);
});

test('method `serialize` converts document into a serialized data object', (t) => {
  class Book extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('title', {type: 'String'});
      this.populate(data);
    }
  }
  class User extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('name', {type: 'String'});
      this.defineField('book', {type: Book});
      this.defineField('books', {type: [Book]});
      this.populate(data);
    }
  }
  let user = new User({
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
  t.deepEqual(user.serialize(), {
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
});

test('method `flatten` returns an array of fields', async (t) => {
  class Book extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('title', {type: 'String'});
      this.populate(data);
    }
  }
  class User extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('name', {type: 'String'});
      this.defineField('book', {type: Book});
      this.defineField('books', {type: [Book]});
      this.populate(data);
    }
  }
  let user = new User({
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
  t.deepEqual(Object.keys(user.flatten()[0]), ['path', 'field']);
  t.deepEqual(user.flatten()[0].path, ['name']);
  t.is(user.flatten()[0].field.value, 'foo');
});

test('method `collect` returns an array of results', (t) => {
  class Book extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('title', {type: 'String'});
      this.populate(data);
    }
  }
  class User extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('name', {type: 'String'});
      this.defineField('book', {type: Book});
      this.populate(data);
    }
  }
  let user = new User({
    name: 'foo',
    book: {
      title: 'bar'
    }
  });
  let results = user.collect(({path}) => path);
  t.deepEqual(results, [
    ['name'],
    ['book'],
    ['book', 'title']
  ]);
});

test('method `scroll` runs the provided handler on each field', (t) => {
  class Book extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('title', {type: 'String'});
      this.populate(data);
    }
  }
  class User extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('name', {type: 'String'});
      this.defineField('book', {type: Book});
      this.populate(data);
    }
  }
  let user = new User({
    name: 'foo',
    book: {
      title: 'bar'
    }
  });
  let count = user.scroll(({path}) => null);
  t.deepEqual(count, 3);
});

test('method `filter` converts a document into serialized object with only keys that pass the test', (t) => {
  class Book extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('title', {type: 'String'});
      this.populate(data);
    }
  }
  class User extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('name', {type: 'String'});
      this.defineField('book', {type: Book});
      this.defineField('books', {type: [Book]});
      this.populate(data);
    }
  }
  let user = new User({
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
  let result = user.filter(({path, field}) => field.value !== 'foo');
  t.deepEqual(result, {
    book: {
      title: 'bar'
    },
    books: [
      null,
      {
        title: 'bar'
      }
    ]
  });
});

test('method `reset` sets fields to their default values', (t) => {
  class Book extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('title', {defaultValue: 'foo'});
      this.populate(data);
    }
  }
  class User extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('name', {defaultValue: 'bar'});
      this.defineField('book', {type: Book, defaultValue: {}});
      this.defineField('books', {type: [Book], defaultValue: [null, {}]});
      this.populate(data);
    }
  }
  let user = new User({
    name: 'fake',
    book: {
      title: 'fake'
    },
    books: [
      {
        title: 'fake'
      }
    ]
  });
  user.reset();
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

test('method `fake` sets fields to their fake values', (t) => {
  class Book extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('title', {fakeValue: 'foo'});
      this.populate(data);
    }
  }
  class User extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('name', {fakeValue: 'bar'});
      this.defineField('book', {type: Book, defaultValue: {}});
      this.defineField('books', {type: [Book], defaultValue: [null, {}]});
      this.populate(data);
    }
  }
  let user = new User();
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

test('method `clear` sets fields to `null`', (t) => {
  class Book extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('title', {defaultValue: 'foo'});
      this.populate(data);
    }
  }
  class User extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('name', {defaultValue: 'bar'});
      this.defineField('book', {type: Book, defaultValue: {}});
      this.defineField('books', {type: [Book], defaultValue: [null, {}]});
      this.populate(data);
    }
  }
  let user = new User({
    name: 'fake',
    book: {
      title: 'fake'
    },
    books: [
      {
        title: 'fake'
      }
    ]
  });
  user.clear();
  t.deepEqual(user.serialize(), {
    name: null,
    book: null,
    books: null
  });
});

test('methods `commit()` and `rollback()` manage committed states', (t) => {
  class Book extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('title');
      this.populate(data);
    }
  }
  class User extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('name');
      this.defineField('book', {type: Book});
      this.defineField('books', {type: [Book]});
      this.populate(data);
    }
  }
  let user = new User({
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
  t.is(user.getField('name').initialValue, 'foo');
  t.is(user.getField('book', 'title').initialValue, 'bar');
  t.is(user.getField('books', 0, 'title').initialValue, 'baz');
  user.populate({
    name: 'foo-new',
    book: {
      title: 'bar-new'
    },
    books: [
      {
        title: 'baz-new'
      }
    ]
  });
  user.rollback();
  t.is(user.getField('name').value, 'foo');
  t.is(user.getField('book', 'title').value, 'bar');
  t.is(user.getField('books', 0, 'title').value, 'baz');
});

test('method `equals` returns `true` when the passing object looks the same', (t) => {
  class Book extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('title');
      this.populate(data);
    }
  }
  class User extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('name');
      this.defineField('book', {type: Book});
      this.defineField('books', {type: [Book]});
      this.populate(data);
    }
  }
  let data = {
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
  };
  t.is(new User(data).equals(new User(data)), true);
});

test('method `isChanged` returns `true` if at least one field has been changed', (t) => {
  class Book extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('title');
      this.populate(data);
      this.commit();
    }
  }
  class User extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('name');
      this.defineField('book', {type: Book});
      this.defineField('books', {type: [Book]});
      this.populate(data);
      this.commit();
    }
  }
  let data = {
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
  };
  let user0 = new User(data);
  let user1 = new User(data);
  let user2 = new User(data);
  let user3 = new User(data);
  t.is(user0.isChanged(), false);
  user0.name = 'foo-new';
  user1.book.title = 'bar-new';
  user2.books[0] = {title: 'baz-new'};
  user3.books[1].title = 'baz-new';
  t.is(user0.isChanged(), true);
  t.is(user1.isChanged(), true);
  t.is(user2.isChanged(), true);
  t.is(user3.isChanged(), true);
});

test('method `isNested` returns `true` if nested fields exist', (t) => {
  class Book extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('title');
      this.populate(data);
    }
  }
  class User extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('name');
      this.defineField('books', {type: [Book]});
      this.populate(data);
    }
  }
  let user = new User();
  t.is(user.isNested(), true);
});

test('method `collectErrors` returns an array of field errors', (t) => {
  class Book extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('title');
      this.populate(data);
    }
  }
  class User extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('name');
      this.defineField('book', {type: Book});
      this.defineField('books', {type: [Book]});
      this.populate(data);
    }
  }
  let user = new User({
    book: {},
    books: [{}]
  });
  user.getField('name').errors = [{message: 'foo'}];
  user.getField('book', 'title').errors = [{message: 'bar'}];
  user.getField('books', 0, 'title').errors = [{message: 'baz'}];
  t.deepEqual(user.collectErrors(), [
    {path: ['name'], errors: [{message: 'foo'}]},
    {path: ['book', 'title'], errors: [{message: 'bar'}]},
    {path: ['books', 0, 'title'], errors: [{message: 'baz'}]}
  ]);
});

test('method `applyErrors` sets fields errors', (t) => {
  class Book extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('title');
      this.populate(data);
    }
  }
  class User extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('name');
      this.defineField('book', {type: Book});
      this.defineField('books', {type: [Book]});
      this.populate(data);
    }
  }
  let user = new User({
    book: {},
    books: [null, {}]
  });
  user.applyErrors([
    {path: ['name'], errors: [{message: 'foo'}]},
    {path: ['book', 'title'], errors: [{message: 'bar'}]},
    {path: ['books', 1, 'title'], errors: [{message: 'baz'}]}
  ]);
  t.deepEqual(user.getField('name').errors, [{message: 'foo'}]);
  t.deepEqual(user.getField('book', 'title').errors, [{message: 'bar'}]);
  t.deepEqual(user.getField('books', 1, 'title').errors, [{message: 'baz'}]);
});

test('methods `isValid` and `hasErrors` tell if errors exist', async (t) => {
  class Book extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('title');
      this.populate(data);
    }
  }
  class User extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('name');
      this.defineField('book', {type: Book});
      this.defineField('books', {type: [Book]});
      this.populate(data);
    }
  }
  let user = new User({
    book: {},
    books: [null, {}]
  });
  t.is(user.hasErrors(), false);
  t.is(user.isValid(), true);
  user.applyErrors([
    {path: ['books', 1, 'title'], errors: [{message: 'baz'}]}
  ]);
  t.is(user.hasErrors(), true);
  t.is(user.isValid(), false);
});

test('method `validate` validates fields and throws an error', async (t) => {
  let validate = [{
    validator: 'presence',
    message: 'foo'
  }];
  class Book extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('title', {validate});
      this.populate(data);
    }
  }
  class User extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('name', {validate});
      this.defineField('book0', {type: Book, validate});
      this.defineField('books0', {type: [Book], validate});
      this.defineField('book1', {type: Book, validate});
      this.defineField('books1', {type: [Book], validate});
      this.populate(data);
    }
  }
  let user = new User({
    book1: {},
    books1: [{}]
  });
  let errors = [{validator: 'presence', message: 'foo', code: 422}];
  await user.validate({quiet: true});
  t.throws(user.validate());
  t.deepEqual(user.collectErrors(), [
    {path: ['name'], errors},
    {path: ['book0'], errors},
    {path: ['books0'], errors},
    {path: ['book1', 'title'], errors},
    {path: ['books1', 0, 'title'], errors},
  ]);
});

test('method `defineValidator` defines a custom field validator', async (t) => {
  let validator = function (v) { 
    return this.value === 'cool' && v === 'cool';
  };
  let validate = [{
    validator: 'coolness',
    message: 'foo'
  }];
  class Book extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineValidator('coolness', validator);
      this.defineField('title', {validate});
      this.populate(data);
    }
  }
  class User extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineValidator('coolness', validator);
      this.defineField('name', {validate});
      this.defineField('book', {type: Book, validate});
      this.populate(data);
    }
  }
  let user = new User({
    book: {}
  });
  let errors = [{validator: 'coolness', message: 'foo', code: 422}];
  await user.validate({quiet: true});
  t.deepEqual(user.collectErrors(), [
    {path: ['name'], errors},
    {path: ['book'], errors},
    {path: ['book', 'title'], errors},
  ]);
});

test('method `failFast` configures validator to stop validating field on the first error', async (t) => {
  let validate = [
    {validator: 'presence', message: 'foo'},
    {validator: 'presence', message: 'foo'}
  ];
  class Book extends Document {
    constructor (data, options) {
      super(data, options);
      this.failFast();
      this.defineField('title', {validate});
      this.populate(data);
    }
  }
  class User extends Document {
    constructor (data, options) {
      super(data, options);
      this.failFast();
      this.defineField('name', {validate});
      this.defineField('book', {type: Book});
      this.populate(data);
    }
  }
  let user = new User({
    book: {}
  });
  let errors = [{validator: 'presence', message: 'foo', code: 422}];
  await user.validate({quiet: true});
  t.is(user.getField('name').errors.length, 1);
  t.is(user.getField('book', 'title').errors.length, 1);
});

test('method `invalidate` clears fields errors', async (t) => {
  class Book extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('title');
      this.populate(data);
    }
  }
  class User extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('name');
      this.defineField('book', {type: Book});
      this.defineField('books', {type: [Book]});
      this.populate(data);
    }
  }
  let user = new User({
    book: {},
    books: [null, {}]
  });
  user.applyErrors([
    {path: ['name'], errors: [{message: 'foo'}]},
    {path: ['book', 'title'], errors: [{message: 'bar'}]},
    {path: ['books', 1, 'title'], errors: [{message: 'baz'}]}
  ]);
  user.invalidate();
  t.deepEqual(user.getField('name').errors, []);
  t.deepEqual(user.getField('book', 'title').errors, []);
  t.deepEqual(user.getField('books', 1, 'title').errors, []);
});

test('method `clone` returns an exact copy of the original', (t) => {
  class Book extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('title');
      this.populate(data);
      this.commit();
    }
  }
  class User extends Document {
    constructor (data, options) {
      super(data, options);
      this.defineField('name');
      this.defineField('book', {type: Book});
      this.defineField('books', {type: [Book]});
      this.populate(data);
      this.commit();
    }
  }
  let user = new User({
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
  t.is(user.clone() !== user, true);
  t.is(user.equals(user), true);
});
