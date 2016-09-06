const test = require('ava');
const {Document, Schema} = require('../../dist');

test('document comperison', (t) => {
  let bookSchema = new Schema({
    fields: {
      title: {
        type: 'string'
      }
    }
  });
  let userSchema = {
    fields: {
      name: {
        type: 'string',
        defaultValue: 'John'
      },
      book: {
        type: bookSchema
      },
      books: {
        type: [bookSchema]
      }
    }
  };
  let data0 = {
    name: null
  };
  let data1 = {
    name: 'Mandy'
  };
  let user0 = new Document(new Schema(userSchema));
  let user1 = new Document(new Schema(userSchema));
  let user2 = new Document(new Schema(userSchema), data0);
  let user3 = new Document(new Schema(userSchema), data1);

  t.is(user0.equalsTo(user1), true);
  t.is(user0.equalsTo(user2), false);
  t.is(user0.equalsTo(user3), false);
  t.is(user2.equalsTo(user3), false);
});
