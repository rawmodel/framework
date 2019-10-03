import { Spec } from '@hayspec/spec';
import { floatParser, stringParser } from '@rawmodel/parsers';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('deeply assignes property data using strategies', (ctx) => {
  class Book extends Model {
    @prop({
      parser: { resolver: floatParser() },
      populatable: ['output'],
    })
    id: number;
    @prop({
      parser: { resolver: stringParser() },
    })
    title: string;
    @prop({
      parser: { resolver: stringParser() },
      populatable: ['input'],
    })
    description: string;
  }
  class User extends Model {
    @prop({
      parser: { resolver: floatParser() },
      populatable: ['output'],
    })
    id: number;
    @prop({
      parser: { resolver: stringParser() },
    })
    name: string;
    @prop({
      parser: { resolver: stringParser() },
      populatable: ['input'],
    })
    email: string;
    @prop({
      parser: { resolver: Book },
      populatable: ['output'],
    })
    book0: Book;
    @prop({
      parser: { resolver: Book },
    })
    book1: Book;
    @prop({
      parser: { array: true, resolver: Book },
      populatable: ['input'],
    })
    books: Book[];
  }
  const data = {
    id: 100,
    name: 'John',
    email: 'foo@bar.com',
    book0: {
      id: 200,
      title: 'Foo',
      description: 'Bar',
    },
    book1: undefined,
    books: [
      undefined,
      {
        id: 300,
        title: 'Baz',
        description: 'Zed',
      },
    ],
  };
  const book = new Book();
  const user0 = new User();
  const user1 = new User();
  const user2 = new User();
  const user3 = new User();
  user0.populate(null); // should not break
  user0.populate(false); // should not break
  user0.populate(''); // should not break
  user0.populate(true); // should not break
  user0.populate(100); // should not break
  user0.populate(data);
  ctx.is(user0.id, 100);
  ctx.is(user0.name, 'John');
  ctx.is(user0.book0.id, 200);
  ctx.is(user0.book0.title, 'Foo');
  ctx.is(user0.book1, null);
  ctx.is(user0.books[0], undefined);
  ctx.is(user0.books[1].title, 'Baz');
  user1.populate(data, 'input');
  ctx.is(user1.id, null);
  ctx.is(user1.name, null);
  ctx.is(user1.email, 'foo@bar.com');
  ctx.is(user1.book0, null);
  ctx.is(user1.book1, null);
  ctx.is(user1.books[0], undefined);
  ctx.is(user1.books[1].id, null);
  ctx.is(user1.books[1].title, null);
  ctx.is(user1.books[1].description, 'Zed');
  user2.populate(data, 'output');
  ctx.is(user2.id, 100);
  ctx.is(user2.name, null);
  ctx.is(user2.email, null);
  ctx.is(user2.book0.id, 200);
  ctx.is(user2.book0.title, null);
  ctx.is(user2.book0.description, null);
  ctx.is(user2.book1, null);
  ctx.is(user2.books, null);
  user3.populate({ book0: book, books: [book] });
  ctx.is(user3.book0, book); // preserves instance
  ctx.is(user3.books[0], book); // preserves instance
});

spec.test('ignores not enumerable properties', (ctx) => {
  class Book extends Model {
    @prop({ enumerable: false })
    id: number;
    @prop()
    name: number;
  }
  class User extends Model {
    @prop({ enumerable: false })
    id: number;
    @prop()
    name: number;
    @prop({
      parser: { resolver: Book },
    })
    book: Book;
  }
  const data = {
    id: 100,
    name: 'John',
    book: { id: 200, name: 'Smith' },
  };
  const user = new User();
  user.populate(data);
  ctx.is(user.id, null);
  ctx.is(user.name, 'John');
  ctx.is(user.book.id, null);
});

export default spec;
