const test = require('ava');
const {Document, Schema} = require('../dist');

test('field type casting', (t) => {
  let bookSchema = new Schema({
    fields: {
      title: {
        type: 'string'
      }
    }
  });
  let userSchema = new Schema({
    fields: {
      name: {
        type: 'string'
      },
      age: {
        type: 'integer'
      },
      enabled: {
        type: 'boolean'
      },
      books: [bookSchema]
    }
  });
  let data = {
    name: 100,
    age: '35',
    enabled: 'true',
    books: [
      {
        title: 100
      }
    ]
  };
  let user = new Document(userSchema, data);
  let book = new Document(bookSchema, data.books[0])

  t.is(user.name, '100');
  t.is(user.age, 35);
  t.is(user.enabled, true);
  t.deepEqual(user.books, [book]);
  t.is(user.books[0].title, '100');
});

test('field default value', (t) => {
  let bookSchema = new Schema({
    fields: {
      title: {
        type: 'string',
        defaultValue: 100
      }
    }
  });
  let userSchema = new Schema({
    fields: {
      name: {
        type: 'string',
        defaultValue: 100
      },
      age: {
        type: 'integer',
        defaultValue: '35'
      },
      enabled: {
        type: 'boolean',
        defaultValue: (ctx) => true
      },
      book: bookSchema,
      books: [bookSchema]
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
        type: 'string',
        defaultValue: 100,
        get: (value, ctx) => `${value}-get`,
        set: (value, ctx) => `${value}-set`
      }
    }
  });
  let user = new Document(userSchema);

  t.is(user.name, '100-set-get');
});

test('strict mode schema', (t) => {
  let userSchema = new Schema({
    mode: 'strict',
    fields: {
      name: {
        type: 'string',
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

test('document.toObject', (t) => {
  let bookSchema = new Schema({
    fields: {
      title: {
        type: 'string',
        defaultValue: 100
      }
    }
  });
  let userSchema = new Schema({
    fields: {
      name: {
        type: 'string'
      },
      age: {
        type: 'float'
      },
      enabled: {
        type: 'boolean'
      },
      book: bookSchema,
      books: [bookSchema]
    }
  });
  let data = {
    name: 'John Smith',
    books: [
      null,
      {
        title: 100
      }
    ]
  };
  let user = new Document(userSchema, data);

  t.deepEqual(user.toObject(), {
    name: 'John Smith',
    age: null,
    enabled: null,
    book: null,
    books: [
      null,
      {
        title: '100'
      }
    ]
  });
});

test('document.clear', (t) => {
  let userSchema = new Schema({
    fields: {
      name: {
        type: 'string',
        defaultValue: 'John'
      }
    }
  });
  let user = new Document(userSchema);
  user.clear();

  t.is(user.name, null);
});

// test('document.isValid', (t) => {
//   let userSchema = new Schema({
//     fields: {
//       name: {
//         type: 'string',
//         validations: {
//           isPresent: {
//             message: 'is required'
//           }
//         }
//       }
//     }
//   });
//   let user = new Document(userSchema);
//
//   t.is(user.isValid(), false);
// });
