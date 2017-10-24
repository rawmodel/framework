"use strict";
exports.__esModule = true;
var merge = require("lodash.merge");
exports.merge = merge;
var isEqual = require("lodash.isequal");
exports.isEqual = isEqual;
function normalize(data) {
    if (typeof data === 'undefined') {
        return undefined;
    }
    else {
        return JSON.parse(JSON.stringify(data));
    }
}
exports.normalize = normalize;
//# sourceMappingURL=utils.js.map