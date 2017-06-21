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
ava_1["default"]('method `defineField` initializes nullified enumerable property', function (t) {
    var user = new (function (_super) {
        __extends(User, _super);
        function User() {
            var _this = _super.call(this) || this;
            _this.defineField('name');
            return _this;
        }
        return User;
    }(src_1.Model));
    var descriptor = Object.getOwnPropertyDescriptor(user, 'name');
    t.is(typeof descriptor.get, 'function');
    t.is(typeof descriptor.set, 'function');
    t.is(descriptor.enumerable, true);
    t.is(descriptor.configurable, true);
    t.is(user.name, null);
});
ava_1["default"]('method `defineType` defines a custom data type', function (t) {
    var user = new (function (_super) {
        __extends(User, _super);
        function User() {
            var _this = _super.call(this) || this;
            _this.defineType('cool', function (v) { return v + "-cool"; });
            _this.defineField('name0', { type: 'cool' });
            _this.defineField('name1', { type: ['cool'] });
            return _this;
        }
        return User;
    }(src_1.Model));
    user.name0 = 'foo';
    user.name1 = ['foo'];
    t.is(user.name0, 'foo-cool');
    t.deepEqual(user.name1, ['foo-cool']);
});
ava_1["default"]('method `populate` deeply populates fields', function (t) {
    var Book = (function (_super) {
        __extends(Book, _super);
        function Book(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('title', { type: 'String' });
            _this.populate(data);
            return _this;
        }
        return Book;
    }(src_1.Model));
    var User = (function (_super) {
        __extends(User, _super);
        function User(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('name', { type: 'String' });
            _this.defineField('book', { type: Book });
            _this.defineField('books', { type: [Book] });
            _this.populate(data);
            return _this;
        }
        return User;
    }(src_1.Model));
    var user = new User({
        name: 100,
        book: {
            title: 200
        },
        books: [
            undefined,
            {
                title: 300
            }
        ]
    });
    t.is(user.name, '100');
    t.is(user.book.title, '200');
    t.is(user.books[0], null);
    t.is(user.books[1].title, '300');
});
ava_1["default"]('property `parent` holds an instance of a parent model', function (t) {
    var Book = (function (_super) {
        __extends(Book, _super);
        function Book(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('title', { type: 'String' });
            _this.populate(data);
            return _this;
        }
        return Book;
    }(src_1.Model));
    var User = (function (_super) {
        __extends(User, _super);
        function User(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('name', { type: 'String' });
            _this.defineField('book', { type: Book });
            _this.defineField('books', { type: [Book] });
            _this.populate(data);
            return _this;
        }
        return User;
    }(src_1.Model));
    var user = new User({
        book: {
            title: 200
        },
        books: [
            undefined,
            {
                title: 300
            }
        ]
    });
    t.is(user.parent, null);
    t.is(user.propertyIsEnumerable('parent'), false);
    t.is(user.book.parent, user);
    t.is(user.books[1].parent, user);
});
ava_1["default"]('property `root` return the first model in a tree of nested models', function (t) {
    var Book = (function (_super) {
        __extends(Book, _super);
        function Book(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('title');
            _this.populate(data);
            return _this;
        }
        return Book;
    }(src_1.Model));
    var User = (function (_super) {
        __extends(User, _super);
        function User(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('book', { type: Book });
            _this.populate(data);
            return _this;
        }
        return User;
    }(src_1.Model));
    var user = new User({
        book: {
            title: 200
        }
    });
    t.is(user.root, user);
    t.is(user.book.root, user);
});
ava_1["default"]('method `getField` returns an instance of a field at path', function (t) {
    var Book = (function (_super) {
        __extends(Book, _super);
        function Book(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('title', { type: 'String' });
            _this.populate(data);
            return _this;
        }
        return Book;
    }(src_1.Model));
    var User = (function (_super) {
        __extends(User, _super);
        function User(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('name', { type: 'String' });
            _this.defineField('book', { type: Book });
            _this.defineField('books', { type: [Book] });
            _this.populate(data);
            return _this;
        }
        return User;
    }(src_1.Model));
    var user = new User({
        name: 'foo',
        book: {
            title: 'bar'
        },
        books: [
            undefined,
            {
                title: 'baz'
            }
        ]
    });
    t.is(user.getField(['name']).value, 'foo');
    t.is(user.getField('name').value, 'foo');
    t.is(user.getField(['book', 'title']).value, 'bar');
    t.is(user.getField('book', 'title').value, 'bar');
    t.is(user.getField(['books', 1, 'title']).value, 'baz');
    t.is(user.getField('books', 1, 'title').value, 'baz');
    t.is(user.getField(['fake']), undefined);
    t.is(user.getField(['fake', 10, 'title']), undefined);
    t.is(user.getField(), undefined);
});
ava_1["default"]('method `hasField` returns `true` if the field exists', function (t) {
    var User = (function (_super) {
        __extends(User, _super);
        function User(data) {
            if (data === void 0) { data = {}; }
            var _this = _super.call(this) || this;
            _this.defineField('name', { type: 'String' });
            _this.populate(data);
            return _this;
        }
        return User;
    }(src_1.Model));
    var user = new User();
    t.is(user.hasField(['name']), true);
    t.is(user.hasField(['book', 'title']), false);
});
ava_1["default"]('method `serialize` converts model into a serialized data object', function (t) {
    var Book = (function (_super) {
        __extends(Book, _super);
        function Book(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('title', { type: 'String' });
            _this.populate(data);
            return _this;
        }
        return Book;
    }(src_1.Model));
    var User = (function (_super) {
        __extends(User, _super);
        function User(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('name', { type: 'String' });
            _this.defineField('description', { serializable: false });
            _this.defineField('book', { type: Book });
            _this.defineField('books', { type: [Book] });
            _this.populate(data);
            return _this;
        }
        return User;
    }(src_1.Model));
    var user = new User({
        name: 'foo',
        description: 'foo',
        book: {
            title: 'bar'
        },
        books: [
            undefined,
            {
                title: 'baz'
            }
        ]
    });
    t.deepEqual(user.serialize(), {
        name: 'foo',
        book: {
            title: 'bar'
        },
        books: [
            null,
            {
                title: 'baz'
            }
        ]
    });
});
ava_1["default"]('method `flatten` returns an array of fields', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var Book, User, user;
    return __generator(this, function (_a) {
        Book = (function (_super) {
            __extends(Book, _super);
            function Book(data) {
                var _this = _super.call(this, data) || this;
                _this.defineField('title', { type: 'String' });
                _this.populate(data);
                return _this;
            }
            return Book;
        }(src_1.Model));
        User = (function (_super) {
            __extends(User, _super);
            function User(data) {
                var _this = _super.call(this, data) || this;
                _this.defineField('name', { type: 'String' });
                _this.defineField('book', { type: Book });
                _this.defineField('books', { type: [Book] });
                _this.populate(data);
                return _this;
            }
            return User;
        }(src_1.Model));
        user = new User({
            name: 'foo',
            book: {
                title: 'bar'
            },
            books: [
                undefined,
                {
                    title: 'baz'
                }
            ]
        });
        t.deepEqual(user.flatten().map(function (f) { return f.path; }), [
            ['name'],
            ['book'],
            ['book', 'title'],
            ['books'],
            ['books', 1, 'title']
        ]);
        t.deepEqual(Object.keys(user.flatten()[0]), ['path', 'field']);
        t.deepEqual(user.flatten()[0].path, ['name']);
        t.is(user.flatten()[0].field.value, 'foo');
        return [2];
    });
}); });
ava_1["default"]('method `collect` returns an array of results', function (t) {
    var Book = (function (_super) {
        __extends(Book, _super);
        function Book(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('title', { type: 'String' });
            _this.populate(data);
            return _this;
        }
        return Book;
    }(src_1.Model));
    var User = (function (_super) {
        __extends(User, _super);
        function User(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('name', { type: 'String' });
            _this.defineField('book', { type: Book });
            _this.populate(data);
            return _this;
        }
        return User;
    }(src_1.Model));
    var user = new User({
        name: 'foo',
        book: {
            title: 'bar'
        }
    });
    var results = user.collect(function (_a) {
        var path = _a.path;
        return path;
    });
    t.deepEqual(results, [
        ['name'],
        ['book'],
        ['book', 'title']
    ]);
});
ava_1["default"]('method `scroll` runs the provided handler on each field', function (t) {
    var Book = (function (_super) {
        __extends(Book, _super);
        function Book(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('title', { type: 'String' });
            _this.populate(data);
            return _this;
        }
        return Book;
    }(src_1.Model));
    var User = (function (_super) {
        __extends(User, _super);
        function User(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('name', { type: 'String' });
            _this.defineField('book', { type: Book });
            _this.populate(data);
            return _this;
        }
        return User;
    }(src_1.Model));
    var user = new User({
        name: 'foo',
        book: {
            title: 'bar'
        }
    });
    var count = user.scroll(function (_a) {
        var path = _a.path;
        return null;
    });
    t.deepEqual(count, 3);
});
ava_1["default"]('method `filter` converts a model into serialized object with only keys that pass the test', function (t) {
    var Book = (function (_super) {
        __extends(Book, _super);
        function Book(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('title', { type: 'String' });
            _this.populate(data);
            return _this;
        }
        return Book;
    }(src_1.Model));
    var User = (function (_super) {
        __extends(User, _super);
        function User(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('name', { type: 'String' });
            _this.defineField('book', { type: Book });
            _this.defineField('books', { type: [Book] });
            _this.populate(data);
            return _this;
        }
        return User;
    }(src_1.Model));
    var user = new User({
        name: 'foo',
        book: {
            title: 'bar'
        },
        books: [
            undefined,
            {
                title: 'bar'
            }
        ]
    });
    var result = user.filter(function (_a) {
        var path = _a.path, field = _a.field;
        return field.value !== 'foo';
    });
    t.deepEqual(result, {
        book: {
            title: 'bar'
        },
        books: [
            null,
            {
                title: 'bar'
            }
        ]
    });
});
ava_1["default"]('method `reset` sets fields to their default values', function (t) {
    var Book = (function (_super) {
        __extends(Book, _super);
        function Book(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('title', { defaultValue: 'foo' });
            _this.populate(data);
            return _this;
        }
        return Book;
    }(src_1.Model));
    var User = (function (_super) {
        __extends(User, _super);
        function User(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('name', { defaultValue: 'bar' });
            _this.defineField('book', { type: Book, defaultValue: {} });
            _this.defineField('books', { type: [Book], defaultValue: [null, {}] });
            _this.populate(data);
            return _this;
        }
        return User;
    }(src_1.Model));
    var user = new User({
        name: 'fake',
        book: {
            title: 'fake'
        },
        books: [
            {
                title: 'fake'
            }
        ]
    });
    user.reset();
    t.deepEqual(user.serialize(), {
        name: 'bar',
        book: {
            title: 'foo'
        },
        books: [
            null,
            {
                title: 'foo'
            }
        ]
    });
});
ava_1["default"]('method `fake` sets fields to their fake values', function (t) {
    var Book = (function (_super) {
        __extends(Book, _super);
        function Book(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('title', { fakeValue: 'foo' });
            _this.populate(data);
            return _this;
        }
        return Book;
    }(src_1.Model));
    var User = (function (_super) {
        __extends(User, _super);
        function User(data) {
            if (data === void 0) { data = {}; }
            var _this = _super.call(this) || this;
            _this.defineField('name', { fakeValue: 'bar' });
            _this.defineField('book', { type: Book, defaultValue: {} });
            _this.defineField('books', { type: [Book], defaultValue: [null, {}] });
            _this.populate(data);
            return _this;
        }
        return User;
    }(src_1.Model));
    var user = new User();
    user.fake();
    t.deepEqual(user.serialize(), {
        name: 'bar',
        book: {
            title: 'foo'
        },
        books: [
            null,
            {
                title: 'foo'
            }
        ]
    });
});
ava_1["default"]('method `clear` sets fields to `null`', function (t) {
    var Book = (function (_super) {
        __extends(Book, _super);
        function Book(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('title', { defaultValue: 'foo' });
            _this.populate(data);
            return _this;
        }
        return Book;
    }(src_1.Model));
    var User = (function (_super) {
        __extends(User, _super);
        function User(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('name', { defaultValue: 'bar' });
            _this.defineField('book', { type: Book, defaultValue: {} });
            _this.defineField('books', { type: [Book], defaultValue: [null, {}] });
            _this.populate(data);
            return _this;
        }
        return User;
    }(src_1.Model));
    var user = new User({
        name: 'fake',
        book: {
            title: 'fake'
        },
        books: [
            {
                title: 'fake'
            }
        ]
    });
    user.clear();
    t.deepEqual(user.serialize(), {
        name: null,
        book: null,
        books: null
    });
});
ava_1["default"]('methods `commit()` and `rollback()` manage committed states', function (t) {
    var Book = (function (_super) {
        __extends(Book, _super);
        function Book(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('title');
            _this.populate(data);
            return _this;
        }
        return Book;
    }(src_1.Model));
    var User = (function (_super) {
        __extends(User, _super);
        function User(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('name');
            _this.defineField('book', { type: Book });
            _this.defineField('books', { type: [Book] });
            _this.populate(data);
            return _this;
        }
        return User;
    }(src_1.Model));
    var user = new User({
        name: 'foo',
        book: {
            title: 'bar'
        },
        books: [
            {
                title: 'baz'
            }
        ]
    });
    user.commit();
    t.is(user.getField('name').initialValue, 'foo');
    t.is(user.getField('book', 'title').initialValue, 'bar');
    t.is(user.getField('books', 0, 'title').initialValue, 'baz');
    user.populate({
        name: 'foo-new',
        book: {
            title: 'bar-new'
        },
        books: [
            {
                title: 'baz-new'
            }
        ]
    });
    user.rollback();
    t.is(user.getField('name').value, 'foo');
    t.is(user.getField('book', 'title').value, 'bar');
    t.is(user.getField('books', 0, 'title').value, 'baz');
});
ava_1["default"]('method `equals` returns `true` when the passing object looks the same', function (t) {
    var Book = (function (_super) {
        __extends(Book, _super);
        function Book(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('title');
            _this.populate(data);
            return _this;
        }
        return Book;
    }(src_1.Model));
    var User = (function (_super) {
        __extends(User, _super);
        function User(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('name');
            _this.defineField('book', { type: Book });
            _this.defineField('books', { type: [Book] });
            _this.populate(data);
            return _this;
        }
        return User;
    }(src_1.Model));
    var data = {
        name: 'foo',
        book: {
            title: 'bar'
        },
        books: [
            null,
            {
                title: 'baz'
            }
        ]
    };
    t.is(new User(data).equals(new User(data)), true);
});
ava_1["default"]('method `isChanged` returns `true` if at least one field has been changed', function (t) {
    var Book = (function (_super) {
        __extends(Book, _super);
        function Book(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('title');
            _this.populate(data);
            _this.commit();
            return _this;
        }
        return Book;
    }(src_1.Model));
    var User = (function (_super) {
        __extends(User, _super);
        function User(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('name');
            _this.defineField('book', { type: Book });
            _this.defineField('books', { type: [Book] });
            _this.populate(data);
            _this.commit();
            return _this;
        }
        return User;
    }(src_1.Model));
    var data = {
        name: 'foo',
        book: {
            title: 'bar'
        },
        books: [
            null,
            {
                title: 'baz'
            }
        ]
    };
    var user0 = new User(data);
    var user1 = new User(data);
    var user2 = new User(data);
    var user3 = new User(data);
    t.is(user0.isChanged(), false);
    user0.name = 'foo-new';
    user1.book.title = 'bar-new';
    user2.books[0] = { title: 'baz-new' };
    user3.books[1].title = 'baz-new';
    t.is(user0.isChanged(), true);
    t.is(user1.isChanged(), true);
    t.is(user2.isChanged(), true);
    t.is(user3.isChanged(), true);
});
ava_1["default"]('method `isNested` returns `true` if nested fields exist', function (t) {
    var Book = (function (_super) {
        __extends(Book, _super);
        function Book(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('title');
            _this.populate(data);
            return _this;
        }
        return Book;
    }(src_1.Model));
    var User = (function (_super) {
        __extends(User, _super);
        function User(data) {
            if (data === void 0) { data = {}; }
            var _this = _super.call(this) || this;
            _this.defineField('name');
            _this.defineField('books', { type: [Book] });
            _this.populate(data);
            return _this;
        }
        return User;
    }(src_1.Model));
    var user = new User();
    t.is(user.isNested(), true);
});
ava_1["default"]('method `collectErrors` returns an array of field errors', function (t) {
    var Book = (function (_super) {
        __extends(Book, _super);
        function Book(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('title');
            _this.populate(data);
            return _this;
        }
        return Book;
    }(src_1.Model));
    var User = (function (_super) {
        __extends(User, _super);
        function User(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('name');
            _this.defineField('book', { type: Book });
            _this.defineField('books', { type: [Book] });
            _this.populate(data);
            return _this;
        }
        return User;
    }(src_1.Model));
    var user = new User({
        book: {},
        books: [{}]
    });
    user.getField('name').errors = [{ message: 'foo' }];
    user.getField('book', 'title').errors = [{ message: 'bar' }];
    user.getField('books', 0, 'title').errors = [{ message: 'baz' }];
    t.deepEqual(user.collectErrors(), [
        { path: ['name'], errors: [{ message: 'foo' }] },
        { path: ['book', 'title'], errors: [{ message: 'bar' }] },
        { path: ['books', 0, 'title'], errors: [{ message: 'baz' }] }
    ]);
});
ava_1["default"]('method `applyErrors` sets fields errors', function (t) {
    var Book = (function (_super) {
        __extends(Book, _super);
        function Book(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('title');
            _this.populate(data);
            return _this;
        }
        return Book;
    }(src_1.Model));
    var User = (function (_super) {
        __extends(User, _super);
        function User(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('name');
            _this.defineField('book', { type: Book });
            _this.defineField('books', { type: [Book] });
            _this.populate(data);
            return _this;
        }
        return User;
    }(src_1.Model));
    var user = new User({
        book: {},
        books: [null, {}]
    });
    user.applyErrors([
        { path: ['name'], errors: [{ message: 'foo' }] },
        { path: ['book', 'title'], errors: [{ message: 'bar' }] },
        { path: ['books', 1, 'title'], errors: [{ message: 'baz' }] }
    ]);
    t.deepEqual(user.getField('name').errors, [{ message: 'foo' }]);
    t.deepEqual(user.getField('book', 'title').errors, [{ message: 'bar' }]);
    t.deepEqual(user.getField('books', 1, 'title').errors, [{ message: 'baz' }]);
});
ava_1["default"]('methods `isValid` and `hasErrors` tell if errors exist', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var Book, User, user0, user1;
    return __generator(this, function (_a) {
        Book = (function (_super) {
            __extends(Book, _super);
            function Book(data) {
                var _this = _super.call(this, data) || this;
                _this.defineField('title');
                _this.populate(data);
                return _this;
            }
            return Book;
        }(src_1.Model));
        User = (function (_super) {
            __extends(User, _super);
            function User(data) {
                var _this = _super.call(this, data) || this;
                _this.defineField('name');
                _this.defineField('book', { type: Book });
                _this.defineField('books', { type: [Book] });
                _this.populate(data);
                return _this;
            }
            return User;
        }(src_1.Model));
        user0 = new User({
            book: {},
            books: [null, {}]
        });
        user1 = new User();
        t.is(user0.hasErrors(), false);
        t.is(user1.hasErrors(), false);
        t.is(user0.isValid(), true);
        t.is(user1.isValid(), true);
        user0.applyErrors([
            { path: ['books', 1, 'title'], errors: [{ message: 'baz' }] }
        ]);
        t.is(user0.hasErrors(), true);
        t.is(user0.isValid(), false);
        return [2];
    });
}); });
ava_1["default"]('method `validate` validates fields and throws an error', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var validate, Book, User, user, errors, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                validate = [{
                        validator: 'presence',
                        message: 'foo'
                    }];
                Book = (function (_super) {
                    __extends(Book, _super);
                    function Book(data) {
                        var _this = _super.call(this, data) || this;
                        _this.defineField('title', { validate: validate });
                        _this.populate(data);
                        return _this;
                    }
                    return Book;
                }(src_1.Model));
                User = (function (_super) {
                    __extends(User, _super);
                    function User(data) {
                        var _this = _super.call(this, data) || this;
                        _this.defineField('name', { validate: validate });
                        _this.defineField('book0', { type: Book, validate: validate });
                        _this.defineField('books0', { type: [Book], validate: validate });
                        _this.defineField('book1', { type: Book, validate: validate });
                        _this.defineField('books1', { type: [Book], validate: validate });
                        _this.populate(data);
                        return _this;
                    }
                    return User;
                }(src_1.Model));
                user = new User({
                    book1: {},
                    books1: [{}]
                });
                errors = [{ validator: 'presence', message: 'foo', code: 422 }];
                return [4, user.validate({ quiet: true })];
            case 1:
                _c.sent();
                _b = (_a = t).is;
                return [4, user.validate()["catch"](function () { return false; })];
            case 2:
                _b.apply(_a, [_c.sent(), false]);
                t.deepEqual(user.collectErrors(), [
                    { path: ['name'], errors: errors },
                    { path: ['book0'], errors: errors },
                    { path: ['books0'], errors: errors },
                    { path: ['book1', 'title'], errors: errors },
                    { path: ['books1', 0, 'title'], errors: errors },
                ]);
                return [2];
        }
    });
}); });
ava_1["default"]('method `defineValidator` defines a custom field validator', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var validator, validate, Book, User, user, errors;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                validator = function (v) {
                    return this.value === 'cool' && v === 'cool';
                };
                validate = [{
                        validator: 'coolness',
                        message: 'foo'
                    }];
                Book = (function (_super) {
                    __extends(Book, _super);
                    function Book(data) {
                        var _this = _super.call(this, data) || this;
                        _this.defineValidator('coolness', validator);
                        _this.defineField('title', { validate: validate });
                        _this.populate(data);
                        return _this;
                    }
                    return Book;
                }(src_1.Model));
                User = (function (_super) {
                    __extends(User, _super);
                    function User(data) {
                        var _this = _super.call(this, data) || this;
                        _this.defineValidator('coolness', validator);
                        _this.defineField('name', { validate: validate });
                        _this.defineField('book', { type: Book, validate: validate });
                        _this.populate(data);
                        return _this;
                    }
                    return User;
                }(src_1.Model));
                user = new User({
                    book: {}
                });
                errors = [{ validator: 'coolness', message: 'foo', code: 422 }];
                return [4, user.validate({ quiet: true })];
            case 1:
                _a.sent();
                t.deepEqual(user.collectErrors(), [
                    { path: ['name'], errors: errors },
                    { path: ['book'], errors: errors },
                    { path: ['book', 'title'], errors: errors },
                ]);
                return [2];
        }
    });
}); });
ava_1["default"]('method `failFast` configures validator to stop validating field on the first error', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var validate, Book, User, user, errors;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                validate = [
                    { validator: 'presence', message: 'foo' },
                    { validator: 'presence', message: 'foo' }
                ];
                Book = (function (_super) {
                    __extends(Book, _super);
                    function Book(data) {
                        var _this = _super.call(this, data) || this;
                        _this.failFast();
                        _this.defineField('title', { validate: validate });
                        _this.populate(data);
                        return _this;
                    }
                    return Book;
                }(src_1.Model));
                User = (function (_super) {
                    __extends(User, _super);
                    function User(data) {
                        var _this = _super.call(this, data) || this;
                        _this.failFast();
                        _this.defineField('name', { validate: validate });
                        _this.defineField('book', { type: Book });
                        _this.populate(data);
                        return _this;
                    }
                    return User;
                }(src_1.Model));
                user = new User({
                    book: {}
                });
                errors = [{ validator: 'presence', message: 'foo', code: 422 }];
                return [4, user.validate({ quiet: true })];
            case 1:
                _a.sent();
                t.is(user.getField('name').errors.length, 1);
                t.is(user.getField('book', 'title').errors.length, 1);
                return [2];
        }
    });
}); });
ava_1["default"]('method `invalidate` clears fields errors', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var Book, User, user;
    return __generator(this, function (_a) {
        Book = (function (_super) {
            __extends(Book, _super);
            function Book(data) {
                var _this = _super.call(this, data) || this;
                _this.defineField('title');
                _this.populate(data);
                return _this;
            }
            return Book;
        }(src_1.Model));
        User = (function (_super) {
            __extends(User, _super);
            function User(data) {
                var _this = _super.call(this, data) || this;
                _this.defineField('name');
                _this.defineField('book', { type: Book });
                _this.defineField('books', { type: [Book] });
                _this.populate(data);
                return _this;
            }
            return User;
        }(src_1.Model));
        user = new User({
            book: {},
            books: [null, {}]
        });
        user.applyErrors([
            { path: ['name'], errors: [{ message: 'foo' }] },
            { path: ['book', 'title'], errors: [{ message: 'bar' }] },
            { path: ['books', 1, 'title'], errors: [{ message: 'baz' }] }
        ]);
        user.invalidate();
        t.deepEqual(user.getField('name').errors, []);
        t.deepEqual(user.getField('book', 'title').errors, []);
        t.deepEqual(user.getField('books', 1, 'title').errors, []);
        return [2];
    });
}); });
ava_1["default"]('method `clone` returns an exact copy of the original', function (t) {
    var Book = (function (_super) {
        __extends(Book, _super);
        function Book(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('title');
            _this.populate(data);
            _this.commit();
            return _this;
        }
        return Book;
    }(src_1.Model));
    var User = (function (_super) {
        __extends(User, _super);
        function User(data) {
            var _this = _super.call(this, data) || this;
            _this.defineField('name');
            _this.defineField('book', { type: Book });
            _this.defineField('books', { type: [Book] });
            _this.populate(data);
            _this.commit();
            return _this;
        }
        return User;
    }(src_1.Model));
    var parent = new Book();
    var user = new User({
        parent: parent,
        name: 'foo',
        book: {
            title: 'bar'
        },
        books: [
            null,
            {
                title: 'baz'
            }
        ]
    });
    var clone0 = user.clone();
    var clone1 = user.clone({ book: { title: 'foo' } });
    t.is(clone0 !== user, true);
    t.is(clone0.equals(user), true);
    t.is(clone0.book.parent, clone0);
    t.is(clone0.parent, parent);
    t.is(clone0.parent, parent);
    t.is(clone1.book.title, 'foo');
});
ava_1["default"]('method `handle` handles field-related errors', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    var handle, Book, Country, User, user, problem0, problem1, errors, _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                handle = [{
                        handler: 'block',
                        message: '%{foo}',
                        block: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2, true];
                        }); }); },
                        foo: 'foo'
                    }];
                Book = (function (_super) {
                    __extends(Book, _super);
                    function Book(data) {
                        var _this = _super.call(this, data) || this;
                        _this.defineField('title', { handle: handle });
                        _this.populate(data);
                        return _this;
                    }
                    return Book;
                }(src_1.Model));
                Country = (function (_super) {
                    __extends(Country, _super);
                    function Country(data) {
                        var _this = _super.call(this, data) || this;
                        _this.defineField('code');
                        _this.populate(data);
                        return _this;
                    }
                    return Country;
                }(src_1.Model));
                User = (function (_super) {
                    __extends(User, _super);
                    function User(data) {
                        var _this = _super.call(this, data) || this;
                        _this.defineField('name', { handle: handle });
                        _this.defineField('book0', { type: Book, handle: handle });
                        _this.defineField('books0', { type: [Book], handle: handle });
                        _this.defineField('book1', { type: Book });
                        _this.defineField('books1', { type: [Book] });
                        _this.defineField('country', { type: [Country] });
                        _this.populate(data);
                        return _this;
                    }
                    return User;
                }(src_1.Model));
                user = new User({
                    book1: {},
                    books1: [{}],
                    country: {}
                });
                problem0 = new Error();
                problem1 = new Error();
                problem1.code = 422;
                errors = [{ handler: 'block', message: 'foo', code: 422 }];
                _b = (_a = t).is;
                return [4, user.handle(problem0, { quiet: false })["catch"](function () { return false; })];
            case 1:
                _b.apply(_a, [_g.sent(), false]);
                _d = (_c = t).is;
                return [4, user.handle(problem0).then(function () { return true; })];
            case 2:
                _d.apply(_c, [_g.sent(), true]);
                _f = (_e = t).is;
                return [4, user.handle(problem1, { quiet: false }).then(function () { return true; })];
            case 3:
                _f.apply(_e, [_g.sent(), true]);
                return [4, user.handle(problem0)];
            case 4:
                _g.sent();
                t.deepEqual(user.collectErrors(), [
                    { path: ['name'], errors: errors },
                    { path: ['book0'], errors: errors },
                    { path: ['books0'], errors: errors },
                    { path: ['book1', 'title'], errors: errors },
                    { path: ['books1', 0, 'title'], errors: errors },
                ]);
                return [2];
        }
    });
}); });
ava_1["default"]('method `defineHandler` defines a custom field handler', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var handler, handle, Book, User, user, problem, errors;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                handler = function (e) {
                    return e.message === 'cool';
                };
                handle = [{
                        handler: 'coolness',
                        message: '%{foo}',
                        foo: 'foo'
                    }];
                Book = (function (_super) {
                    __extends(Book, _super);
                    function Book(data) {
                        var _this = _super.call(this, data) || this;
                        _this.defineHandler('coolness', handler);
                        _this.defineField('title', { handle: handle });
                        _this.populate(data);
                        return _this;
                    }
                    return Book;
                }(src_1.Model));
                User = (function (_super) {
                    __extends(User, _super);
                    function User(data) {
                        var _this = _super.call(this, data) || this;
                        _this.defineHandler('coolness', handler);
                        _this.defineField('name', { handle: handle });
                        _this.defineField('book', { type: Book });
                        _this.defineField('books', { type: [Book] });
                        _this.populate(data);
                        return _this;
                    }
                    return User;
                }(src_1.Model));
                user = new User({
                    book: {},
                    books: [{}]
                });
                problem = new Error('cool');
                errors = [{ handler: 'coolness', message: 'foo', code: 422 }];
                return [4, user.handle(problem)];
            case 1:
                _a.sent();
                t.deepEqual(user.collectErrors(), [
                    { path: ['name'], errors: errors },
                    { path: ['book', 'title'], errors: errors },
                    { path: ['books', 0, 'title'], errors: errors },
                ]);
                return [2];
        }
    });
}); });
//# sourceMappingURL=models.js.map