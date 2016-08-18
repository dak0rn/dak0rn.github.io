---
title: Move away from reducer switch statements
date: 2016-01-26
---

I often read other people's code to see how they implement things differently than me. Nearly every time I look at reducer function implementations in applications using Redux I come across these `switch` statement blocks.

```javascript
function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    default:
      return state
  }
}
```

This is an actual example taken from the [official documentation](http://redux.js.org/docs/basics/Reducers.html) and that might be the reason why many developer adapt this pattern.

However, in my opinion, code like this is hard to reason about (manly because it is ugly) and thus it is hard to maintain.

An the _solution_ to this is not only simple but elegant; use an object with functions! The computed property is very helpful here, especially if you store all your actions in a separate file.

```javascript
import * as Actions from './Actions';
import { initialState } from './InitialStates';

const reducers = {
    // Something simple
    [ Actions.SET_VISIBILITY_FILTER ](state, action) {
        const { filter } = action;
        return state.set('visibilityFilter', filter);
    },

    // If you use redux-promise-middleware
    [ Actions.SAVE + '_PENDING' ](state) {
        return state.set('saving', true);
    }

    // ...
};
```

The actual function reducer just looks up the function in the object and invokes the function if available.

```javascript
const reducer = (state = initialState, action) => {
    const { type } = action;

    if( reducers[type] )
        return reducers[type](state, action);

    return state;
}
```

The advantages from my point of view:

- The reducer function is very slick and simple
- If required you can implement special action handling quite easy. For example, if you always want to set a loading state when an actions ends with `_PENDING` it is quite simple to add to the reducer function without making it unreadable.
- The object approach feels very natural if you are coming from a language that uses classes