const {Schema, Document} = require('../dist');

/* Model definition ***********************************************************/

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

/* Usage example **************************************************************/

let user = new Document({ // new model instance with data
  name: 'John Smith',
}, schema);

console.log('title:', user.name); // fields
console.log('$title:', user.$name.value);

user.validate({quiet: true}).then(() => { // built-in methods
  console.log('isValid:', user.isValid());
});
