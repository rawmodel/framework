const {Schema, Document} = require('../dist');

let schema = new Schema({ // root document
  fields: { // document fields
    name: { // field name
      type: 'String', // field type (string)
      validate: [ // field validators
        {
          validator: 'presence',  // validator name
          message: 'is required' // validator error message
        }
      ]
    }
  }
});

let data = {
  name: 'John Smith',
  books: [
    {
      title: 'True Detective'
    }
  ]
};

let user = new Document({data, schema}); // new document instance
console.log('title:', user.name);
console.log('$title:', user.$name.value);
user.validate({quiet: true}).then(() => {
  console.log('isValid:', user.isValid());
});
