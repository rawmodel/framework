const test = require('ava');
const {Document, Schema} = require('../../dist');

test('validate', async (t) => {
  let bookSchema = new Schema({
    fields: {
      title: {
        type: 'String',
        validate: {
          presence: {message: 'is required'}
        }
      },
      year: {
        type: 'Integer'
      }
    }
  });
  let userSchema = new Schema({
    fields: {
      name: {
        type: 'String',
        validate: {
          presence: {message: 'is required'}
        }
      },
      newBook: {
        type: bookSchema,
        validate: {
          presence: {message: 'is required'}
        }
      },
      newBooks: {
        type: [bookSchema],
        validate: {
          presence: {message: 'is required'}
        }
      },
      oldBook: {
        type: bookSchema,
        validate: {
          presence: {message: 'is required'}
        }
      },
      oldBooks: {
        type: [bookSchema],
        validate: {
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

  let user = new Document(userSchema, data);

  t.deepEqual(await user.validate(), {
    name: {
      isValid: false,
      messages: ['is required']
    },
    newBook: {
      isValid: false,
      messages: ['is required']
    },
    newBooks: {
      isValid: false,
      messages: ['is required']
    },
    oldBook: {
      isValid: false,
      messages: [],
      related: {
        title: {
          isValid: false,
          messages: ['is required']
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
            messages: ['is required']
          }
        }
      ]
    }
  });
});

test('isValid', async (t) => {
  let bookSchema = new Schema({
    fields: {
      title: {
        type: 'String',
        validate: {
          presence: {message: 'is required'}
        }
      },
    }
  });
  let userSchema = new Schema({
    fields: {
      name: {
        type: 'String',
        validate: {
          presence: {message: 'is required'}
        }
      },
      book: {
        type: bookSchema,
        validate: {
          presence: {message: 'is required'}
        }
      },
      books: {
        type: [bookSchema],
        validate: {
          presence: {message: 'is required'}
        }
      }
    }
  });

  let data = {
    name: 'John',
    book: {
      title: 'Coding Is Fun'
    },
    books: [
      {
        title: 'Coding NodeJs'
      }
    ]
  };

  let user = new Document(userSchema, data);

  t.is(await user.isValid(), true);
});
