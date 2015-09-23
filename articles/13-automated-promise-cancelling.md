Whenever you work with promises to encapsulate asynchronous tasks it might be useful to cancel operations
after a certain time to recognize operation timeouts. In a concrete case, an application uses a component that
abstracts a remote API and uses promises to enable waiting for responses. After a 30 second timeout pending
operations should be cancelled and a warning should be displayed.

From an architectural point of view, this change to the API component behavior should be implemented with as less
code changes as possible. All network requests are enapsulated in a single function `_requestAPIEndpoint()` and
that is where the promise manipulation will happen.

The idea is basically to add a promise that gets rejected after some time. The `Promise.any()` function is the helper
utility that makes this possible; it takes a number or Promises and returns a Promises that is resolved or rejected
whenver one of the given Promises is resolved or rejected. Any other promise settled after the first one is ignored.

`Promise.any()` is used to create a joined Promise of the network Promise and the one that gets always rejected. This
functionality is implemented in a little helper function.

```javascript
    // ...

    //+ _timeoutHandler :: Promise -> Promise
    _timeoutHandler: function (promise) {
        var rejection = new WinJS.Promise(function (_, r) {
        setTimeout(r.bind({}, 'timeout'), Configuration.networkTimeout);
    });

    return WinJS.Promise.any([promise, rejection]).then(function (info) {
        return info.value._value;
    });
},
```

All we have to do now is to manipulate the return value by passing the network promise to `_timeoutHandler`:

```javascript
    // ...

    _requestAPIEndpoint: function() {
	
        // much business logic, very secret, so code

        return this._timeoutHandler( client.getStringAsync(url) );
	}	
```
