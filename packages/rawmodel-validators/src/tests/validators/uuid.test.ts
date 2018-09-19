import { Spec } from '@hayspec/spec';
import { uuidValidator } from '../..';

const spec = new Spec();

spec.test('fails when not a string', (ctx) => {
  ctx.false(uuidValidator()(true));
});

spec.test('passes for valid v1', (ctx) => {
  ctx.true(uuidValidator({ version: 1 })('857b3f0a-a777-11e5-bf7f-feff819cdc9f'));
  ctx.true(uuidValidator({ version: 1 })('857b4504-a777-11e5-bf7f-feff819cdc9f'));
});

spec.test('passes for valid v2', (ctx) => {
  ctx.true(uuidValidator({ version: 2 })('a14e3bb3-d7a3-2ea8-9481-881eaf75fdc5'));
  ctx.true(uuidValidator({ version: 2 })('5a3c2348-6e2f-280e-aade-7dc8afdb18b9'));
});

spec.test('passes for valid v3', (ctx) => {
  ctx.true(uuidValidator({ version: 3 })('49072879-c5c6-3b4e-9900-34e5df285522'));
  ctx.true(uuidValidator({ version: 3 })('5a3c2348-6e2f-380e-aade-7dc8afdb18b9'));
});

spec.test('passes for valid v4', (ctx) => {
  ctx.true(uuidValidator({ version: 4 })('82ca85b8-7841-42f0-80d8-48bbe11a005b'));
  ctx.true(uuidValidator({ version: 4 })('58dbb3a5-a95a-4120-b4e0-483eea26ab74'));
});

spec.test('passes for valid v5', (ctx) => {
  ctx.true(uuidValidator({ version: 5 })('482d11be-b03f-5ff3-b99d-9b6ceef18874'));
  ctx.true(uuidValidator({ version: 5 })('6a5b4d3f-02cf-5e2d-89d5-2f2163bb69f9'));
});

export default spec;
