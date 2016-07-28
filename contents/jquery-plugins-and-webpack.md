---
title: "jQuery, plugins and webpack"
date: 2016-02-19
---

Using jQuery with plugins in a webpack setup is hard. It is hard because webpack embraces modules and imports (e.g. CommonJS). And jQuery makes itself available in the global namespace and provides its own way to register plugins.

There are usually two types of plugins:

1. _Legacy_ plugins that rely on a globally available jQuery instance
2. _Modern_ plugins that often use [UMD](https://github.com/umdjs/umd). They either use a global jQuery or import it.

The second way seems pretty clever on a first glance. jQuery gets imported and the plugin is registered.

```javascript
const $ = require('jQuery');
// ...
$.fn.myPlugin = ...
```

There problem here is, that exports are cached - if jQuery gets required a second time somewhere else in the code the original object is returned. The manipulations done to `$.fn` are not visible to the rest of the application.

## jQuery + webpack

To get things to work the following workaround is applied

1. Make jQuery available globally
2. Always use `window.$` in the code

For the global part the `expose-loader` is used. It adds jQuery to the global scope as `$` and `jQuery` whenever it gets imported:

```javascript
// webpack.config.js
//...
module: {
    loaders: [
        // ...
        { test: /jquery/, loader: 'expose?$!expose?jQuery' }
    ]
}
```

Now in webpack's entry point jQuery is imported first and all plugins that rely on it afterwards.

```javascript
// webpack entry point
import 'jQuery';  // jQuery is in global scope after this
import 'bootstrap';
import 'eonasdan-bootstrap-datetimepicker';
import 'fullpage.js';
```

Finally, this globally exposed jQuery has to be used. Thus, scripts need to use `window.$` instead of requiring it.

```javascript
    componentDidMount() {
        const { inputGroup } = this.refs;
        const $inputGroup = window.$(inputGroup);

        $inputGroup.datetimepicker();
    }
```