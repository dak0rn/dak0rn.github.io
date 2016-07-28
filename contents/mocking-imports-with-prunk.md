---
title: "Mocking imports with prunk"
date: 2015-12-16
---

[prunk](https://www.npmjs.com/package/prunk) is a library that is used to mock imports in node.js. It was created while writing tests for React components that import stylesheets (SCSS in my case) directly.

Normally, webpack uses a loader to compile them to CSS and removes the import from the source. However, since our unit tests are run without a browser we needed a way to either remove or mock the stylesheet imports. Changing the way stylesheets are imported (e.g. by introducing a global SCSS file) was definitely not an option.

The requirement was quite simple: I wanted to use a regular expression to mock all imports that use stylesheets. I looked at several mocking libraries but did not find any that meets this requirement. So, I wrote **prunk**.

## Mocking around

prunk mocks (or suppresses) imports globally. It works with strings (name of the imports), regular expressions and test functions. It's quite easy to set up.

```javascript
const prunk = require('prunk');

prunk.mock('file', 'no file');
prunk.mock( what => 0 === what.indexOf('fs'), 42);
prunk.suppress('mhm');

require('file');  // 'no file'
require('fs');    // 42
require('fs/m');  // 42
require('mhm');   // undefined
```

## Mocking stylesheets with mocha

Our unit tests are run with mocha and started and configured with Grunt. We use a mocha `require` function to mock all the things that cause problems.

![Broken mocha tests](/images/mocha-broken.png)

```javascript
// grunt/mochaTest.js
var prunk = require('prunk');

var mockRequires = function() {
    // No stylesheets of any kind
    prunk.suppress(/\.(scss|css|less|sass)$/);
};

// ...

module.exports = function() {

    return {
        // grunt-mocha-test sub task
        src: {
            options: {
                reporter: 'spec',
                require: [
                    'babel-core/register',
                    mockRequires
                ]
            },
            // ...
        }
    };
};
```

After that small change, the stylesheet imports get ignored and mocha does not explode anymore.

![Running tests](/images/mocha-good.png)