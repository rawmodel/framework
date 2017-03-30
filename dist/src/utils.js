"use strict";
exports.__esModule = true;
var merge = require("lodash.merge");
exports.merge = merge;
var isEqual = require("lodash.isequal");
exports.isEqual = isEqual;
function serialize(data) {
    return JSON.parse(JSON.stringify(data));
}
exports.serialize = serialize;
//# sourceMappingURL=utils.js.map