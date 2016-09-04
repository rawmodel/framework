const test = require('ava');
const {Document, Schema} = require('../dist');

test('document.isValid', (t) => {
  t.pass();
  // let userSchema = new Schema({
  //   fields: {
  //     name: {
  //       type: 'string',
  //       validations: {
  //         isPresent: {
  //           message: 'is required'
  //         }
  //       }
  //     }
  //   }
  // });
  // let user = new Document(userSchema);
  //
  // t.is(user.isValid(), false);
});
