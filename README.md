![Build Status](https://travis-ci.org/xpepermint/opendocumentjs.svg?branch=master)&nbsp;[![NPM Version](https://badge.fury.io/js/approved.svg)](https://badge.fury.io/js/approved)&nbsp;[![Dependency Status](https://gemnasium.com/xpepermint/opendocumentjs.svg)](https://gemnasium.com/xpepermint/opendocumentjs)


# opendocument.js

> Schema enforced JavaScript objects.

<img src="giphy.gif" width="300" />

## Install

```
$ npm install --save opendocument
```

## Example

```js
import {
  Document,
  Schema
} from 'opendocument';

let bookSchema = new Schema({
  fields: {
    title: {
      type: 'string'
    }
  }
});

let userSchema = new Schema({
  fields: {
    name: {
      type: 'string'
    },
    books: [bookSchema]
  }
});

let data = {
  name: 'John Smith',
  books: [
    {
      title: 'True Detective'
    }
  ]
};

let user = new Document(userSchema, data);
user.name; // -> 'John Smith'
```

## License (MIT)

```
Copyright (c) 2016 Kristijan Sedlak <xpepermint@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
