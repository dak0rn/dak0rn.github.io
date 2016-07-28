---
title: bookshelf-cast
date: 2016-03-31
---

Yesterday I published a library named [bookshelf-cast](https://www.npmjs.com/package/bookshelf-cast). This plugin for the [Bookshelf](http://bookshelfjs.org) ORM provides a simple way to cast values retrieved from the database. The idea is basically the same as with [Attribute casting](https://laravel.com/docs/5.2/eloquent-mutators#attribute-casting) from Laravel.

Castings are defined in a `.casts` property in the model. One can use built-in identifiers or custom functions, attributes without casts assigned will be left untouched.

```javascript
const Model = bookshelf.Model.extend({

    casts: {
        locked: 'boolean',
        idStr(what) { return parseInt(what, 10); }
    }
});
```

The idea is basically to overwrite `Bookshelf.Model.parse()` and modify the attributes that should be casted. This plugin reduces the required boilerplate and provides a convenient way to define casts.

As usual, this project is Open Source, available on [GitHub](https://github.com/dak0rn/bookshelf-cast) and [npm](https://www.npmjs.com/package/bookshelf-cast). There are a couple of [tests](https://github.com/dak0rn/bookshelf-cast/blob/master/test.js), written with [ava](https://github.com/sindresorhus/ava).