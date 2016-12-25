// import {Document} from 'objectschema';

// class Book extends Document { // Book model
//   constructor (data, options) {
//     super(data, options);

//     this.defineField('title', { // field definition
//       type: 'String', // field type
//       validate: [{validator: 'presence', message: 'must be present'}] // field validation recipes
//     });

//     this.populate(data); // set values
//   }
// }

// class User extends Document { // User model
//   constructor (data, options) {
//     super(data, options);

//     this.defineField('name', {
//       type: 'String', // field type
//       validate: [{validator: 'presence', message: 'must be present'}] // field validation recipes
//     });
//     this.defineField('book', {
//       type: Book, // nested model field type
//       validate: [{validator: 'presence', message: 'must be present'}] // field validation recipes
//     });

//     this.populate(data); // set values
//   }
// }

// let user = new User({
//   name: 'John Smith'
//   book: {
//     title: 'True Detective'
//   }
// });
// user.name; // => "True Detective"
// user.book.title; // => "True Detective"
// await user.validate({quiet: true});
// user.isValid(); // => false
