I have just release a new minor version of [espressojs](https://github.com/dak0rn/espressojs)
that contains important bug fixes.

I noticed yesterday that a handler for root resources (`/`) was not invoked
if a sub handler was requested:

```javascript
api.resource('/', function() {});
api.resource('/login', function() {});

api.dispatchRequest( new Espresso.Request({method:'get', path: '/login'}) );
// `/login` will be invoked but `/` not.
```

Two more lines of code in the request handling function solved the problem.

espressojs can now be updated via `npm` if installed that way.

```bash
npm update
```
