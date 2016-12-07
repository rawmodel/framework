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

class User extends Document { // creating a model

  constructor (data) {
    super(data, schema);
  }

  echo () {
    return `echo for ${this.name}`;
  }
}

/* Usage example **************************************************************/

let user = new User({ // new model instance with data
  name: 'John Smith',
  books: [
    {
      title: 'True Detective'
    }
  ]
});

console.log('title:', user.name); // fields
console.log('$title:', user.$name.value);

user.validate({quiet: true}).then(() => { // built-in methods
  console.log('isValid:', user.isValid());
});

console.log('echo():', user.echo()); // custom methods
