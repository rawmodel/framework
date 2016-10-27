const test = require('ava');
const {Document, Schema} = require('../../dist');

test('method `validate`', async (t) => {
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
      messages: ['is required']
    },
    newBook: {
      messages: ['is required']
    },
    newBooks: {
      messages: ['is required']
    },
    oldBook: {
      messages: [],
      related: {
        title: {
          messages: ['is required']
        }
      }
    },
    oldBooks: {
      messages: [],
      related: [
        undefined,
        {
          title: {
            messages: ['is required']
          }
        }
      ]
    }
  });
});

test('method `isValid`', async (t) => {
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

test('validator parent reference', async (t) => {
  let name = null
  let validators = {
    async coolness (value, definition) {
      name = this.getParent().name;
    }
  }

  let bookSchema = new Schema({
    fields: {
      title: {
        type: 'String',
        validate: {
          coolness: {message: 'must be cool'}
        }
      },
    },
    validatorOptions: {
      validators
    }
  });
  let userSchema = new Schema({
    fields: {
      name: {
        type: 'String'
      },
      books: {
        type: [bookSchema]
      }
    }
  });

  let data = {
    name: 'John',
    books: [
      {
        title: 'Coding NodeJs'
      }
    ]
  };

  let user = new Document(userSchema, data);
  await user.validate();
  t.is(name, 'John');
});
