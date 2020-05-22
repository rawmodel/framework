import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('returns the first model in a tree of nested models', (ctx) => {
  class Author extends Model {
    @prop()
    public name: string;
  }
  class Book extends Model {
    @prop()
    public title: string;
    @prop({
      parser: { resolver: Author },
    })
    public author: Author;
  }
  class User extends Model {
    @prop({
      parser: { resolver: Book },
    })
    public book: Book;
  }
  const user = new User({
    book: {
      title: 200,
      author: { name: 'John' },
    },
  });
  ctx.deepEqual(user.getAncestors(), []);
  ctx.deepEqual(user.book.getAncestors(), [user]);
  ctx.deepEqual(user.book.author.getAncestors(), [user, user.book]);
});

export default spec;
