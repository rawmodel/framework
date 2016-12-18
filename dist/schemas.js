"use strict";
var typeable_1 = require("typeable");
var utils_1 = require("./utils");
/*
* A class for defining Document structure and properties.
*/
var Schema = (function () {
    /*
    * Class constructor.
    */
    function Schema(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.mixins, mixins = _c === void 0 ? [] : _c, // not a property
        _d = _b.fields, // not a property
        fields = _d === void 0 ? {} : _d, strict = _b.strict, _e = _b.validators, validators = _e === void 0 ? {} : _e, _f = _b.types, types = _f === void 0 ? {} : _f, firstErrorOnly = _b.firstErrorOnly;
        Object.defineProperty(this, 'fields', {
            get: function () { return utils_1.merge.apply(void 0, mixins.map(function (s) { return utils_1.retrieve(s.fields); }).concat([utils_1.retrieve(fields)])); },
            enumerable: true // required for deep nesting
        });
        Object.defineProperty(this, 'strict', {
            get: function () { return ([true].concat(mixins.map(function (s) { return s.strict; }), strict).filter(function (s) { return typeable_1.isBoolean(s); }).reverse()[0]); },
            enumerable: true // required for deep nesting
        });
        Object.defineProperty(this, 'validators', {
            get: function () { return utils_1.merge.apply(void 0, mixins.map(function (v) { return v.validators; }).concat([validators])); },
            enumerable: true // required for deep nesting
        });
        Object.defineProperty(this, 'types', {
            get: function () { return utils_1.merge.apply(void 0, mixins.map(function (v) { return v.types; }).concat([types])); },
            enumerable: true // required for deep nesting
        });
        Object.defineProperty(this, 'firstErrorOnly', {
            get: function () { return ([false].concat(mixins.map(function (s) { return s.firstErrorOnly; }), firstErrorOnly).filter(function (s) { return typeable_1.isBoolean(s); }).reverse()[0]); },
            enumerable: true // required for deep nesting
        });
    }
    return Schema;
}());
exports.Schema = Schema;
