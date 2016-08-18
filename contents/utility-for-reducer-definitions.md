---
title: A utility for reducer definitions
date: 2016-03-21
---
In [one of my previous posts](https://65535th.com/move-away/) I outlined the idea of more readable reducer definitions by replacing the `switch` statement with a property lookup. This makes a reducer more readable and easier to maintain. In fact, metrics like the [Cyclomatic Complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity) implicitly suggest this way, too.

However, there is still room for improvement. We use a [middleware](https://github.com/pburtchaell/redux-promise-middleware) that takes actions involving async operations, fires them multiple times with prefixes for the different statuses.

To handles these we have to build the object properties accordingly, either with concatenation or interpolation.

![](/images/ufrd-red.png)

And this makes the code less readable again and is error prone.

A good solution to this is nesting the reducers when writing and flattening them during runtime. A utility function then concats the function names to produce the well known flat structure with underscores.

```javascript
[ Actions.LOAD_SESSION ]: {
    PENDING(state, action) {},
    REJECTED(state, action) {},
    FULFILLED(state, action) {}
}
```

The idea was described in an [issue comment](https://github.com/pburtchaell/redux-promise-middleware/issues/35#issuecomment-162933877) on GitHub.

To use this in our projects, I wrote two small composable functions, `flattenReducers` to flatten the nested structure and `createReducer` that creates a reducer function.


```javascript
export const flattenReducers = reducers => {
    const output = {};
    const keys = Object.keys(reducers);

    keys.filter( key => reducers.hasOwnProperty(key) )
        .forEach( key => {
            const sub = reducers[key];

            // If it is a function copy as is
            if( 'function' === typeof sub ) {
                output[key] = sub;
                return;
            }

            // Otherwise copy all child elements
            Object.keys( sub )
                  .forEach( subkey => {
                      // Join keys with an underscore
                      output[`${key}_${subkey}`] = sub[subkey];
                  });
        });

    return output;
};
```

The second function expects a nested reducer definition and an optional initial state and returns a reducer that does to lookup and the

```javascript
export const createReducer = (reducers, initial = null ) => {
    const actual = flattenReducers(reducers);

    return (state = initial, action) => {
        const { type } = action;

        if( 'function' === typeof actual[type])
            return actual[type](state, action);

        return state;
    };
};
```