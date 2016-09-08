const test = require('ava');
const {Document, Schema} = require('../../dist');

test('toObject', (t) => {
  let bookSchema = new Schema({
    fields: {
      title: {
        type: 'String',
        defaultValue: 100
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
        type: 'float'
      },
      enabled: {
        type: 'Boolean'
      },
      newBook: {
        type: bookSchema
      },
      newBooks: {
        type: [bookSchema]
      },
      oldBook: {
        type: bookSchema
      },
      oldBooks: {
        type: [bookSchema]
      }
    }
  });
  let data = {
    name: 'John Smith',
    newBook: {
      title: 100
    },
    newBooks: [
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
    newBook: {
      title: '100',
      year: null
    },
    newBooks: [
      null,
      {
        title: '100',
        year: null
      }
    ],
    oldBook: null,
    oldBooks: null
  });
});
