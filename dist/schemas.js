// import {isBoolean} from 'typeable';
// import {retrieve, merge} from './utils';
//
// /*
// * A class for defining Document structure and properties.
// */
//
// export class Schema {
//   fields: {};
//   strict: boolean;
//   validators: {};
//   types: {};
//   firstErrorOnly?: boolean;
//
//   /*
//   * Class constructor.
//   */
//
//   constructor ({
//     mixins = [], // not a property
//     fields = {},
//     strict,
//     validators = {},
//     types = {},
//     firstErrorOnly
//   }: {
//     mixins?: Schema[],
//     fields?: {},
//     strict?: boolean,
//     validators?: {},
//     types?: {},
//     firstErrorOnly?: boolean
//   } = {}) {
//
//     Object.defineProperty(this, 'fields', { // document fields
//       get: () => merge(
//         ...mixins.map((s) => retrieve(s.fields)),
//         retrieve(fields)
//       ),
//       enumerable: true // required for deep nesting
//     });
//
//     Object.defineProperty(this, 'strict', { // document schema mode
//       get: () => (
//         [true].concat(mixins.map((s) => s.strict), strict).filter((s) => isBoolean(s)).reverse()[0]
//       ),
//       enumerable: true // required for deep nesting
//     });
//
//     Object.defineProperty(this, 'validators', { // validatable.js configuration option
//       get: () => merge(
//         ...mixins.map((v) => v.validators),
//         validators
//       ),
//       enumerable: true // required for deep nesting
//     });
//
//     Object.defineProperty(this, 'types', { // typeable.js configuration option
//       get: () => merge(
//         ...mixins.map((v) => v.types),
//         types
//       ),
//       enumerable: true // required for deep nesting
//     });
//
//     Object.defineProperty(this, 'firstErrorOnly', { // validatable.js configuration option
//       get: () => (
//         [false].concat(mixins.map((s) => s.firstErrorOnly), firstErrorOnly).filter((s) => isBoolean(s)).reverse()[0]
//       ),
//       enumerable: true // required for deep nesting
//     });
//   }
//
// }
//# sourceMappingURL=schemas.js.map