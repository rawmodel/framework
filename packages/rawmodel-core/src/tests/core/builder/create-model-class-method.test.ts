import { Spec } from '@hayspec/spec';
import { createModelClass, Model } from '../../..';

const spec = new Spec();

spec.test('generates empty model class', (ctx) => {
  const Klass = createModelClass([]);
  ctx.true(new Klass() instanceof Model);
});

spec.test('generates model with properties', (ctx) => {
  const Klass = createModelClass([
    {
      name: 'name',
    },
    {
      name: 'book',
      prop: {
        parse: {
          resolver: createModelClass([
            {
              name: 'title',
            }
          ]),
        },
      }
    }
  ]);
  const data = {
    name: 'foo',
    book: { title: 'bar' },
  };
  const model = new Klass(data);
  ctx.deepEqual(model.serialize(), data);
});

export default spec;
