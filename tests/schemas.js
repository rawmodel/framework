import test from 'ava';
import {Schema} from '../dist/index';

test('can be extended through mixins', async (t) => {
  let animalSchema = new Schema({
    fields: () => ({
      kind: {
        type: 'String'
      },
      relatives: {
        type: [animalSchema]
      }
    }),
    strict: true,
    validatorOptions: {
      foo: 'foo'
    },
    typeOptions: {
      foo: 'foo'
    }
  });
  let dogSchema = new Schema({
    mixins: [
      animalSchema
    ],
    fields: () => ({
      name: {
        type: 'String'
      }
    }),
    strict: false,
    validatorOptions: {
      bar: 'bar'
    },
    typeOptions: {
      bar: 'bar'
    }
  });
  let catSchema = new Schema({
    mixins: [
      dogSchema
    ],
    fields: () => ({
      dislikes: {
        type: [dogSchema]
      }
    }),
    validatorOptions: {
      baz: 'baz'
    },
    typeOptions: {
      baz: 'baz'
    }
  });

  let keys = [];
  // fields
  keys = Object.keys(catSchema.fields) // cats
  t.deepEqual(keys, ['kind', 'relatives', 'name', 'dislikes']);
  keys = Object.keys(catSchema.fields.dislikes.type[0].fields)
  t.deepEqual(keys, ['kind', 'relatives', 'name']); // dogs
  keys = Object.keys(catSchema.fields.dislikes.type[0].fields.relatives.type[0].fields)
  t.deepEqual(keys, ['kind', 'relatives']); // animals
  // strict
  t.is(dogSchema.strict, false);
  t.is(catSchema.strict, false);
  // validatorOptions
  keys = Object.keys(catSchema.validatorOptions)
  t.deepEqual(keys, ['foo', 'bar', 'baz']);
  // typeOptions
  keys = Object.keys(catSchema.typeOptions)
  t.deepEqual(keys, ['foo', 'bar', 'baz']);
});
