Although [express](http://expressjs.com/) does not provide a logging
function out of the box it is quite easy to add one.
All you have to do is to add a middleware function that hooks into the request
and calculate the time that was needed to process it.

This is based on some events in the request object that seem not to be
documented.

```javascript
server.use( function(request, response, next) {
    
        // Start time
        var _st = new Date().getTime();

        // Handler function
        var z = function () {

            // Remove listeners again
            response.removeListener('finish', z);
            response.removeListener('close',  z);

            // Log that stuff
            console.log(
                request.method,
                request.originalUrl,
                response.statusCode,
                (new Date().getTime() - _st)+"ms")
            );
        };

        // Attach a listener
        response.on('finish',z);
        response.on('close', z);

        // Continue processing
        next();
});
```

Bascially, we attach a handler function to the response's `finish` and
`close` events that will print some information about the request
and the time that has passed since it was made.

I recommend setting it as the first middleware function depending on
what other middlewares do.

**Pro tip:** combine it with a formatting utility and some aligning to get
awesome server logs.
