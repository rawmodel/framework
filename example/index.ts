import {Model} from '../src';

/*
* Book model
*/

class Book extends Model {
  public title: string;

  public constructor (data = {}) {
    super(data);

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

  public constructor (data = {}) {
    super(data);

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
  process.stdout.write('user.name: ' + user.name + '\n');
  process.stdout.write('user.book.title:' + user.book.title + '\n');
  process.stdout.write('user.isValid():' + user.isValid() + '\n');
});
