"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
                }
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
                }
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
    }
});
user.validate({ quiet: true }).then(function () {
    process.stdout.write('user.name: ' + user.name + '\n');
    process.stdout.write('user.book.title:' + user.book.title + '\n');
    process.stdout.write('user.isValid():' + user.isValid() + '\n');
});
//# sourceMappingURL=index.js.map