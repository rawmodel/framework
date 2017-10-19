"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var ava_1 = require("ava");
var src_1 = require("../src");
ava_1["default"]('nullifies a value by default', function (t) {
    var f = new src_1.Field();
    t.is(f.value, null);
});
ava_1["default"]('provides getter and setter for the current value', function (t) {
    var f = new src_1.Field();
    f.value = 'foo';
    t.is(f.value, 'foo');
});
ava_1["default"]('supports custom getter and setter for the current value', function (t) {
    var f0 = new src_1.Field({ get: function (v) { return v + "-" + this.constructor.name; } });
    var f1 = new src_1.Field({ set: function (v) { return v + "-" + this.constructor.name; } });
    f0.value = 'foo';
    f1.value = 'foo';
    t.is(f0.value, 'foo-Field');
    t.is(f1.value, 'foo-Field');
});
ava_1["default"]('can automatically cast a value to a specific data type', function (t) {
    var f0 = new src_1.Field({ type: ['String'] });
    var f1 = new src_1.Field({ type: function (v) { return v + "-foo"; } });
    f0.value = 100;
    f1.value = 100;
    t.deepEqual(f0.value, ['100']);
    t.deepEqual(f1.value, '100-foo');
});
ava_1["default"]('can have a default value', function (t) {
    var f0 = new src_1.Field({ defaultValue: 'foo' });
    var f1 = new src_1.Field({ defaultValue: function () { return this.constructor.name; } });
    var f2 = new src_1.Field({ defaultValue: function () { return Math.random(); } });
    t.is(f0.value, 'foo');
    t.is(f1.value, 'Field');
    t.is(f0.defaultValue, 'foo');
    t.is(f1.defaultValue, 'Field');
    t.is(f2.defaultValue !== f2.defaultValue, true);
});
ava_1["default"]('can have a fake value', function (t) {
    var f0 = new src_1.Field({ fakeValue: 'foo' });
    var f1 = new src_1.Field({ fakeValue: function () { return this.constructor.name; } });
    var f2 = new src_1.Field({ fakeValue: function () { return Math.random(); } });
    t.is(f0.fakeValue, 'foo');
    t.is(f1.fakeValue, 'Field');
    t.is(f2.fakeValue !== f2.fakeValue, true);
});
ava_1["default"]('method `reset()` sets value to the default value', function (t) {
    var f0 = new src_1.Field();
    var f1 = new src_1.Field({ defaultValue: 'foo' });
    var f2 = new src_1.Field({ defaultValue: function () { return Math.random(); } });
    t.is(f0.value, null);
    f1.value = 'bar';
    f1.reset();
    t.is(f1.value, 'foo');
    f2.reset();
    t.is(f1.value !== f2.value, true);
});
ava_1["default"]('method `fake()` sets value to the fake value', function (t) {
    var f0 = new src_1.Field();
    var f1 = new src_1.Field({ fakeValue: 'foo' });
    var f2 = new src_1.Field({ fakeValue: function () { return Math.random(); } });
    f0.value = 'foo';
    f0.fake();
    t.is(f0.value, null);
    f1.value = 'bar';
    f1.fake();
    t.is(f1.value, 'foo');
    f2.value = 'foo';
    f2.fake();
    t.is(f2.value !== f1.value, true);
});
ava_1["default"]('method `clear()` sets value to `null`', function (t) {
    var f = new src_1.Field();
    f.value = 'foo';
    f.errors = [
        { validator: 'foo', message: 'bar', code: 422 }
    ];
    f.clear();
    t.is(f.errors.length, 1);
    t.is(f.value, null);
});
ava_1["default"]('methods `commit()` and `rollback()` manage committed value state', function (t) {
    var f = new src_1.Field();
    f.value = 'foo';
    t.is(f.initialValue, null);
    f.commit();
    t.is(f.initialValue, 'foo');
    f.value = 'bar';
    f.rollback();
    t.is(f.value, 'foo');
});
ava_1["default"]('method `equals()` returns `true` when the provided `data` equals to the current value', function (t) {
    var f0 = new src_1.Field();
    var f1 = new src_1.Field();
    f0.value = 'foo';
    f1.value = 'foo';
    t.is(f0.equals(f1), true);
    t.is(f0.equals(f1.value), true);
});
ava_1["default"]('method `isChanged()` returns `true` if the value have been changed', function (t) {
    var f = new src_1.Field();
    t.is(f.isChanged(), false);
    f.value = 'foo';
    t.is(f.isChanged(), true);
});
ava_1["default"]('method `isNested()` returns `true` if the field type is un instance of a Model', function (t) {
    var f0 = new src_1.Field();
    var f1 = new src_1.Field({ type: [src_1.Model] });
    var f2 = new src_1.Field({ type: [(function (_super) {
                __extends(User, _super);
                function User() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return User;
            }(src_1.Model))] });
    t.is(f0.isNested(), false);
    t.is(f1.isNested(), true);
    t.is(f2.isNested(), true);
});
ava_1["default"]('method `validate()` validates the value and populates the `errors` property', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var f;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                f = new src_1.Field({
                    validate: [
                        { validator: 'presence', message: 'foo' },
                        { validator: 'coolness', message: 'is not cool' },
                        { validator: 'coolness', code: 999 },
                    ],
                    validators: {
                        coolness: function () { return this.value === 'cool'; }
                    }
                });
                return [4, f.validate()];
            case 1:
                _a.sent();
                t.deepEqual(f.errors, [
                    { validator: 'presence', message: 'foo', code: 422 },
                    { validator: 'coolness', message: 'is not cool', code: 422 },
                    { validator: 'coolness', message: undefined, code: 999 }
                ]);
                return [2];
        }
    });
}); });
ava_1["default"]('method `invalidate()` clears the `errors` property', function (t) {
    var f = new src_1.Field();
    f.errors.push({ message: 'foo' });
    f.invalidate();
    t.deepEqual(f.errors, []);
});
ava_1["default"]('method `hasErrors()` returns `true` when errors exist', function (t) {
    var f = new src_1.Field();
    t.is(f.hasErrors(), false);
    f.errors.push({ message: 'foo' });
    t.is(f.hasErrors(), true);
});
ava_1["default"]('method `isValid()` returns `true` when no errors exist', function (t) {
    var f = new src_1.Field();
    t.is(f.isValid(), true);
    f.errors.push({ message: 'foo' });
    t.is(f.isValid(), false);
});
ava_1["default"]('has enumeratable properties', function (t) {
    var f = new src_1.Field();
    t.deepEqual(Object.keys(f), ['errors', 'value', 'defaultValue', 'fakeValue', 'initialValue', 'serializable', 'enumerable', 'type', 'owner']);
});
ava_1["default"]('method `handle()` handles an error and populates the `errors` property', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var f, e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                f = new src_1.Field({
                    handle: [
                        { handler: 'block', block: function () { return true; }, message: 'foo' },
                        { handler: 'coolness', message: 'cool' },
                        { handler: 'coolness', code: 999 }
                    ],
                    handlers: {
                        coolness: function (error) { return error.message === 'cool'; }
                    }
                });
                e = new Error('cool');
                return [4, f.handle(e)];
            case 1:
                _a.sent();
                t.deepEqual(f.errors, [
                    { handler: 'block', message: 'foo', code: 422 },
                    { handler: 'coolness', message: 'cool', code: 422 },
                    { handler: 'coolness', message: undefined, code: 999 },
                ]);
                return [2];
        }
    });
}); });
//# sourceMappingURL=fields.js.map