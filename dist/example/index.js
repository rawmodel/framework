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
exports.__esModule = true;
var src_1 = require("../src");
var Book = (function (_super) {
    __extends(Book, _super);
    function Book(data) {
        if (data === void 0) { data = {}; }
        var _this = _super.call(this, data) || this;
        _this.defineField('title', {
            type: 'String',
            validate: [
                {
                    validator: 'presence',
                    message: 'must be present'
                },
            ]
        });
        _this.populate(data);
        _this.commit();
        return _this;
    }
    return Book;
}(src_1.Model));
var User = (function (_super) {
    __extends(User, _super);
    function User(data) {
        if (data === void 0) { data = {}; }
        var _this = _super.call(this, data) || this;
        _this.defineField('name', {
            type: 'String',
            validate: [
                {
                    validator: 'presence',
                    message: 'must be present'
                },
            ]
        });
        _this.defineField('book', {
            type: Book,
            validate: [
                {
                    validator: 'presence',
                    message: 'must be present'
                }
            ]
        });
        _this.defineField('books', {
            type: [Book],
            nullValue: []
        });
        _this.populate(data);
        _this.commit();
        return _this;
    }
    return User;
}(src_1.Model));
var user = new User({
    name: 'John Smith',
    book: {
        title: 'True Detective'
    },
    books: null
});
user.validate({ quiet: true }).then(function () {
    var data = user.serialize();
    process.stdout.write(JSON.stringify(data, null, 2) + '\n');
});
//# sourceMappingURL=index.js.map