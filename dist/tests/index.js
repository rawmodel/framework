"use strict";
exports.__esModule = true;
var ava_1 = require("ava");
var objectschema = require("../src");
ava_1["default"]('exposed content', function (t) {
    t.is(!!objectschema.Model, true);
    t.is(!!objectschema.Field, true);
});
//# sourceMappingURL=index.js.map