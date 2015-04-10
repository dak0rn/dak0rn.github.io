---
title: Access-Control-Allow-Headers
author: dak0rn
date: "2015-04-10 11:10"
---

The [HTTP Access Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)
is an important feature of the security model for modern web applications. One part
of it is the *Access-Control-Allow-Headers* HTTP header that contains a list of
allowed HTTP headers.

For example, if you try to save a Backbone model in a JavaScript application
to the API running on another port Chrome will send an `OPTIONS` request
first determining if the access is allowed. Both *Access-Control-Allow-Origin*
and *Access-Control-Allow-Headers* have to contain values indicating allowed
headers and request origins.

*Access-Control-Allow-Origin* is often a static property set per API so that
the global API option `headers` can be used to add a header field for that:

```javascript
new Espresso({
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
});
```

In general, `Access-Control-Allow-Headers` could be configured this way, too.
However, or testing purposes or during development it is often quite useful
to allow all headers. Since this property does not allow wildcards this can
be achieved by sending requested methods back.

This can be done in the root handler. If cascading is used all other handlers
will have this header field for their responses, too.

```javascript
api.resource('/', {
    get: function(request, response) {
       
        if( request.headers['access-control-request-headers'] )
            response.headers['Access-Control-Allow-Headers'] = request.headers['access-control-request-headers'];
    }
});
```
