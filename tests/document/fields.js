const test = require('ava');
const {Document, Schema} = require('../../dist');

test('structure type casting', (t) => {
  let bookSchema = new Schema({
    fields: {
      title: {
        type: 'String'
      },
      year: {
        type: 'Integer'
      }
    }
  });
  let userSchema = new Schema({
    fields: {
      name: {
        type: 'String'
      },
      age: {
        type: 'Integer'
      },
      enabled: {
        type: 'Boolean'
      },
      book: {
        type: bookSchema
      },
      books: {
        type: [bookSchema]
      },
      tags: {
        type: ['String']
      },
      keywords: {
        type: []
      }
    }
  });
  let data = {
    name: 100,
    age: '35',
    enabled: 'true',
    book: {
      title: 100
    },
    books: [
      {
        title: 100
      }
    ],
    tags: ['foo', 'bar', 100, null],
    keywords: ['foo', 'bar', 100, null]
  };
  let user = new Document(userSchema, data);

  t.is(user.name, '100');
  t.is(user.age, 35);
  t.is(user.enabled, true);
  t.is(user.book.title, '100');
  t.is(user.book.year, null);
  t.is(user.books[0].title, '100');
  t.is(user.books[0].year, null);
  t.deepEqual(user.tags, ['foo', 'bar', '100', null]);
  t.deepEqual(user.keywords, ['foo', 'bar', 100, null]);
});

test('custom types', (t) => {
  let userSchema = new Schema({
    fields: {
      name: {
        type: 'cool'
      }
    },
    typeOptions: {
      types: {
        cool: (v) => `${v}-cool`
      }
    }
  });
  let data = {
    name: 100
  };
  let user = new Document(userSchema, data);

  t.is(user.name, '100-cool');
});

test('field default value', (t) => {
  let bookSchema = new Schema({
    fields: {
      title: {
        type: 'String',
        defaultValue: 100
      }
    }
  });
  let userSchema = new Schema({
    fields: {
      name: {
        type: 'String',
        defaultValue: 100
      },
      age: {
        type: 'Integer',
        defaultValue: '35'
      },
      enabled: {
        type: 'Boolean',
        defaultValue: () => true
      },
      book: {
        type: bookSchema
      },
      books: {
        type: [bookSchema]
      }
    }
  });
  let data = {
    books: [
      null,
      {
        title: 100
      }
    ]
  };
  let user0 = new Document(userSchema);
  let user1 = new Document(userSchema, data);
  let book0 = new Document(bookSchema);
  let book1 = new Document(bookSchema, data.books[1])

  t.is(user0.name, '100');
  t.is(user0.age, 35);
  t.is(user0.enabled, true);
  t.is(user0.book, null);
  t.deepEqual(user1.books, [null, book1]);
  t.is(user1.books[0], null);
  t.is(user1.books[1].title, '100');
});

test('field value transformation', (t) => {
  let userSchema = new Schema({
    fields: {
      name: {
        type: 'String',
        defaultValue: 100,
        get: (value) => `${value}-get`,
        set: (value) => `${value}-set`
      }
    }
  });
  let user = new Document(userSchema);

  t.is(user.name, '100-set-get');
});

test('relaxed mode schema', (t) => {
  let userSchema = new Schema({
    mode: 'relaxed',
    fields: {
      name: {
        type: 'String',
        defaultValue: 100
      }
    }
  });
  let data = {
    name: 'John',
    age: 35.5
  };
  let user = new Document(userSchema, data);

  t.is(user.name, 'John');
  t.is(user.age, 35.5);
});

test('strict mode schema', (t) => {
  let userSchema = new Schema({
    mode: 'strict',
    fields: {
      name: {
        type: 'String',
        defaultValue: 100
      }
    }
  });
  let data = {
    name: 'John',
    age: 35.5
  };
  let user = new Document(userSchema, data);

  t.is(user.name, 'John');
  t.is(user.age, undefined);
});

test('clearing fields', (t) => {
  let userSchema = new Schema({
    fields: {
      name: {
        type: 'String',
        defaultValue: 'John'
      }
    }
  });
  let user = new Document(userSchema);
  user.clear();

  t.is(user.name, null);
});

test('method `hasPath`', (t) => {
  let bookSchema = new Schema({
    fields: {
      title: {
        type: 'String'
      }
    }
  });
  let userSchema = new Schema({
    fields: {
      name: {
        type: 'String'
      },
      book: {
        type: bookSchema
      },
      books: {
        type: [bookSchema]
      }
    }
  });
  let data = {
    name: 100,
    book: {
      title: 100
    },
    books: [
      {
        title: 100
      }
    ]
  };
  let user0 = new Document(userSchema);
  let user1 = new Document(userSchema, data);

  t.is(user0.hasPath('name'), true);
  t.is(user0.hasPath('book', 'title'), false);
  t.is(user0.hasPath('books', 0, 'title'), false);
  t.is(user0.hasPath(['books', 0, 'title']), false);
  t.is(user1.hasPath('name'), true);
  t.is(user1.hasPath('book', 'title'), true);
  t.is(user1.hasPath('books', 0, 'title'), true);
  t.is(user1.hasPath(['books', 0, 'title']), true);
});
