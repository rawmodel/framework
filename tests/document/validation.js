const test = require('ava');
const {Document, Schema} = require('../../dist');

test('document validation', async (t) => {
  let bookSchema = new Schema({
    fields: {
      title: {
        type: 'string',
        validations: {
          presence: {message: 'is required'}
        }
      },
      year: {
        type: 'integer'
      }
    }
  });
  let userSchema = new Schema({
    fields: {
      name: {
        type: 'string',
        validations: {
          presence: {message: 'is required'}
        }
      },
      newBook: {
        type: bookSchema,
        validations: {
          presence: {message: 'is required'}
        }
      },
      newBooks: {
        type: [bookSchema],
        validations: {
          presence: {message: 'is required'}
        }
      },
      oldBook: {
        type: bookSchema,
        validations: {
          presence: {message: 'is required'}
        }
      },
      oldBooks: {
        type: [bookSchema],
        validations: {
          presence: {message: 'is required'}
        }
      }
    }
  });

  let data = {
    oldBook: {
      title: ''
    },
    oldBooks: [
      null,
      {
        title: ''
      }
    ]
  };

  let user0 = new Document(userSchema, data);

  t.deepEqual(await user0.validate(), {
    name: {
      isValid: false,
      messages: ['is required'],
      related: null
    },
    newBook: {
      isValid: false,
      messages: ['is required'],
      related: null
    },
    newBooks: {
      isValid: false,
      messages: ['is required'],
      related: null
    },
    oldBook: {
      isValid: false,
      messages: [],
      related: {
        title: {
          isValid: false,
          messages: ['is required'],
          related: null
        }
      }
    },
    oldBooks: {
      isValid: false,
      messages: [],
      related: [
        undefined,
        {
          title: {
            isValid: false,
            messages: ['is required'],
            related: null
          }
        }
      ]
    }
  });
});
