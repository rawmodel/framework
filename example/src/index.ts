import {Model} from '../..';

/*
* Book model
*/

class Book extends Model {
  public title: string;

  public constructor (data?, options?) {
    super(data, options);

    this.defineField('title', {
      type: 'String',
      validate: [
        {
          validator: 'presence',
          message: 'must be present'
        }
      ]
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

  public constructor (data?, options?) {
    super(data, options);

    this.defineField('name', {
      type: 'String',
      validate: [
        {
          validator: 'presence',
          message: 'must be present'
        }
      ]
    });
    this.defineField('book', {
      type: Book,
      validate: [
        {
          validator: 'presence',
          message: 'must be present'
        }
      ]
    });

    this.populate(data);
    this.commit();
  }
}

/*
* Usage
*/

let user = new User({
  name: 'John Smith',
  book: {
    title: 'True Detective'
  }
});

user.validate({quiet: true}).then(() => {
  console.log('user.name:', user.name);
  console.log('user.book.title:', user.book.title);
  console.log('user.isValid():', user.isValid());
});
