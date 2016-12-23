"use strict";
const typeable_1 = require("typeable");
const merge = require("lodash.merge");
exports.merge = merge;
const isEqual = require("lodash.isequal");
exports.isEqual = isEqual;
/*
* Returns a duplicated data object (useful to remove data bindings).
*/
function serialize(data) {
    return JSON.parse(JSON.stringify(data));
}
exports.serialize = serialize;
/*
* A helper method for retrieving a value from an input which can be
* a value or a function.
*/
function retrieve(input) {
    return typeable_1.isFunction(input) ? input() : input;
}
exports.retrieve = retrieve;
//# sourceMappingURL=utils.js.map