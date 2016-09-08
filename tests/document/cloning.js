const test = require('ava');
const {Document, Schema} = require('../../dist');

test('clone', (t) => {
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
