import { Model } from '../src';

/*
* Book model
*/

class Book extends Model {
  public title: string;

  public constructor (data = {}) {
    super(data);

    this.defineProp('title', {
      type: 'String',
      validate: [
        {
          validator: 'presence',
          message: 'must be present',
        },
      ],
    });

    this.populate(data);
    this.commit();
  }
}

/*
* User model
*/

class User extends Model {
  public name: string;
  public book: Book;
  public books: [Book];

  public constructor (data = {}) {
    super(data);

    this.defineProp('name', {
      type: 'String',
      validate: [
        {
          validator: 'presence',
          message: 'must be present',
        },
      ],
    });
    this.defineProp('book', {
      type: Book,
      validate: [
        {
          validator: 'presence',
          message: 'must be present',
        }
      ],
    });
    this.defineProp('books', {
      type: [Book],
      nullValue: [],
    });

    this.populate(data);
    this.commit();
  }
}

/*
* Usage
*/

const user = new User({
  name: 'John Smith',
  book: {
    title: 'True Detective',
  },
  books: null,
});

user.validate({quiet: true}).then(() => {
  const data = user.serialize();
  process.stdout.write(JSON.stringify(data, null, 2) + '\n');
});
