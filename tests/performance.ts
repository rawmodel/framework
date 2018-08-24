import { ObjectId } from 'mongodb';
import test from 'ava';
import { Model } from '../src';

/**
 * Post model supporting 2-levels threaded list.
 */
export class Post extends Model {
  public _id: ObjectId;
  public _deletedAt: Date;
  public id: ObjectId;
  public courseId: ObjectId;
  public userId: ObjectId;
  public postId: ObjectId;
  public message: string;
  public createdAt: Date;
  public author: Author;
  public answers: Post[];

  /**
   * Class constructor.
   * @param data Input data.
   */
  constructor(data?: any) {
    super(data);
    this.defineObjectIdType();
    this.defineIdFields();
    this.defineDeletedAtField();
    this.defineCourseIdField();
    this.defineUserIdField();
    this.definePostIdField();
    this.defineMessageField();
    this.defineCreatedAtField();
    this.defineAuthorField();
    this.defineAnswersField();
    this.populate(data);
  }

  /**
   * Defines the `ObjectId` type.
   */
  protected defineObjectIdType() {
    this.defineType('ObjectId', (v) => {
      return ObjectId.isValid(v) ? new ObjectId(v) : null;
    });
  }

  /**
   * Defines the `_id` and `id` fields.
   */
  protected defineIdFields() {
    this.defineField('_id', {
      type: 'ObjectId',
    });
    this.defineField('id', {
      type        : 'ObjectId',
      serializable: ['out-admin', 'out-profile'],
      get         : () => this._id,
      set         : (v) => this._id = v,
    });
  }

  /**
   * Defines the `_deletedAt` field.
   */
  protected defineDeletedAtField() {
    this.defineField('_deletedAt', {
      type        : 'Date',
      serializable: ['in-db'],
    });
  }

  /**
   * Defines the `courseId` field.
   */
  protected defineCourseIdField() {
    this.defineField('courseId', {
      type        : 'ObjectId',
      serializable: ['in-db', 'out-admin', 'out-profile'],
      validate    : [
        {
          validator: 'presence',
          code     : 42217,
        },
      ],
      fakeValue   : () => new ObjectId(),
    });
  }

  /**
   * Defines the `userId` field.
   */
  protected defineUserIdField() {
    this.defineField('userId', {
      type        : 'ObjectId',
      serializable: ['in-db', 'out-admin', 'out-profile'],
      validate    : [
        {
          validator: 'presence',
          code     : 42218,
        },
      ],
      fakeValue   : () => new ObjectId(),
    });
  }

  /**
   * Defines the `postId` field.
   */
  protected definePostIdField() {
    this.defineField('postId', {
      type        : 'ObjectId',
      populatable : ['in-admin'],
      serializable: ['in-db', 'out-admin', 'out-profile'],
      validate    : [
        {
          validator: 'parentPostIdValidity',
          code     : 42216,
          condition: () => !!this.postId,
        },
      ],
    });
  }

  /**
   * Defines the `message` field.
   */
  protected defineMessageField() {
    this.defineField('message', {
      type        : 'String',
      populatable : ['in-admin', 'in-profile'],
      serializable: ['in-db', 'out-admin', 'out-profile'],
      validate    : [
        {
          validator: 'presence',
          code     : 42219,
        },
      ]
    });
  }

  /**
   * Defines the `createdAt` field.
   */
  protected defineCreatedAtField() {
    this.defineField('createdAt', {
      type        : 'Date',
      serializable: ['in-db', 'out-admin', 'out-profile'],
      defaultValue: () => new Date(),
    });
  }

  /**
   * Defines the `author` field.
   */
  protected defineAuthorField() {
    this.defineField('author', {
      type        : Author,
      serializable: ['out-admin', 'out-profile'],
    });
  }

  /**
   * Defines the `answers` field.
   */
  protected defineAnswersField() {
    this.defineField('answers', {
      type        : [Post],
      serializable: ['out-admin', 'out-profile'],
      defaultValue: []
    });
  }
}

/**
 * Post author model.
 */
export class Author extends Model {
  public firstName: string;
  public lastName: string;
  public role: number;

  /**
   * Class constructor.
   * @param data Input data.
   * @param ctx Request context.
   */
  constructor(data?: any) {
    super(data);
    this.defineFirstNameFields();
    this.defineLastNameField();
    this.defineRoleField();
    this.populate(data);
  }

  /**
   * Defines the `firstName` field.
   */
  protected defineFirstNameFields() {
    this.defineField('firstName', {
      type        : 'String',
      serializable: ['out-admin', 'out-profile'],
    });
  }

  /**
   * Defines the `lastName` field.
   */
  protected defineLastNameField() {
    this.defineField('lastName', {
      type        : 'String',
      serializable: ['out-admin', 'out-profile'],
    });
  }

  /**
   * Defines the `role` field.
   */
  protected defineRoleField() {
    this.defineField('role', {
      type        : 'Integer',
      serializable: ['out-admin', 'out-profile'],
      defaultValue: false,
      get         : () => 3
    });
  }

}

test('method `populate` deeply assignes data - stages', (t) => {

  console.time('POSTS');
  const posts = [];
  let i = 0;
  // Create posts
  while ( i < 100) {
    posts.push(new Post({
      courseId: new ObjectId(),
      userId: new ObjectId(),
      postId: null,
      message: 'test' + i,
      author: new Author({firstName: 'Test', lastName: 'User'}),
      answers: []
    }));
    i++;
  }
  console.timeEnd('POSTS');

  // Create answers
  console.time('ANSWERS');
  let j = 0;
  const answers = [];
  while ( j < 50) {
    answers.push(new Post({
      courseId: new ObjectId(),
      userId: new ObjectId(),
      postId: new ObjectId(),
      message: 'answer' + j,
      author: new Author({firstName: 'Test', lastName: 'User'}),
      answers: []
    }));
    j++;
  }
  console.timeEnd('ANSWERS');

  // Populate posts with answers
  console.time('POPULATE');
  posts.forEach(x => x.populate({answers: answers}));
  console.timeEnd('POPULATE');

  t.is(posts.length, 100);
  // t.is(user.parent, null);
  // t.is(user.parent, null);
});

test('method `populate` deeply assignes data -- all at once', (t) => {

  console.time('ATONCE');
  const posts = [];
  let i = 0;
  let j = 0;
  const answers = [];
  while ( j < 50) {
    answers.push(new Post({
      courseId: new ObjectId(),
      userId: new ObjectId(),
      postId: new ObjectId(),
      message: 'answer' + j,
      author: new Author({firstName: 'Test', lastName: 'User'}),
      answers: []
    }));
    j++;
  }
  // Create posts
  while ( i < 100) {
    posts.push(new Post({
      courseId: new ObjectId(),
      userId: new ObjectId(),
      postId: null,
      message: 'test' + i,
      author: new Author({firstName: 'Test', lastName: 'User'}),
      answers: answers
    }));
    i++;
  }
  console.timeEnd('ATONCE');

  t.is(posts.length, 100);
});