const test = require('ava');
const {Document, Schema} = require('../dist');

test('converting document to object', (t) => {
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
