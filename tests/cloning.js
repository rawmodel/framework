const test = require('ava');
const {Document, Schema} = require('../dist');

test('document.clone', (t) => {
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

  t.is(user.clone() === user, false);
  t.deepEqual(user.clone(), user);
});
