---
title: "Debounced input component"
date: 2016-01-26
---

Whenever you develop a search interface in a single page application that should render results on the fly you have to make sure to keep the UI responsive and not spamming your backend with search requests while the user is typing.

![Searching...](/images/search_waiting.png)

A quite simple and very helpful approach is to start the search after the user has stopped typing. If you add a minimum input length constraint to this you can really speed up things in both front-end and back-end.

Determining that the user does no longer type can be easily achieved with a timeout between key strokes:

![Key stroke timeout](/images/typing.png)

Every time the user hits a key, a timeout is set. If the user presses another key the timeout is cancelled and a new one is set. This way, only the last timed out function is executed and this is the one triggering the backend for search results. We call this principle _debouncing_, some people refer to it as _throttling_, too.

Depending on your target audience the timeout duration can differ. For people used to type we found a delay of 300ms suitable.

## The component

To make reusable throughout our application we created a very basic input field component that performs the debouncing.

```javascript
import React from 'react';

export default class DebouncedInput extends React.Component {
    // Will follow...
}
```

To the outside, the component should behave just like a normal `<input />` and thus should accept all common properties.

This is a stateful component because it keeps track of the timeout and the current value. The constructor initializes the component's state with a timeout ID (`tid`) and the current value (`value`)  taken from the component's properties if provided.

```javascript
    /**
     * Creates a new DebouncedInput
     *
     * @param  {object}  props  Component properties
     */
    constructor(props) {
        super(props);

        this.state = {
            // Timeout ID
            tid: void 0,

            // Value of the input
            value: props.value || ''
        };
    }
```

Rendering the component is also quite simple. An `<input />` is rendered, properties are forwarded but the `onChange` and `value` properties are overriden (the property order matters here!).

```javascript
    /**
     * Render the component
     */
    render() {
        const props = this.props;
        const { value } = this.state;

        return <input type="text"
                        className="form-control"
                        {...props}
                        value={value}
                        onChange={ this.changeTerm.bind(this) } />;
    }
```

The render function references a `changeTerm()` function, the event handler for the input. This function sets the input's value (through the state). It also cancels an existing timeout and creates a new one.

```javascript
    /**
     * Invoked when the user changes the input field's value
     *
     * @param  {object}  event  UI event
     */
    changeTerm(event) {
        const { value } = event.target;
        const { tid } = this.state;

        if( tid )
            clearTimeout(tid);

        this.setState({
            value,
            tid: setTimeout( this.emitChange.bind(this), 300)
        });
    }
```

When the timeout runs out, `emitChange()` will be invoked. This function invokes the `onChange()` handler of the component with the current input's value.

```javascript
    /**
     * Emits a change event with the term
     */
    emitChange() {
        const { value } = this.state;
        const { onChange } = this.props;

        this.setState({ tid: void 0 });

        onChange(value);
    }
```

This function also resets the timeout identifier in the component's state.

## Optimizations
Two aspects of this implementation can be optimized.

If the component gets unmounted the timeout should be cancelled to prevent race conditions. Using React's lifecycle methods, this is done quickly.

```javascript
    /**
     * Invoked when the component will be removed from the DOM.
     * Makes sure the timeout is cancelled
     */
    componentWillUnmount() {
        const { tid } = this.state;

        window.clearTimeout(tid);
    }
```

On the other hand, `shouldComponentUpdate` is used to determine if the component should be rerendered. And this should be done in two cases:

1. Properties have changed
2. Input value has changed

Within the method we try to to the cheap stuff first and the heavy calculations afterwards.

```javascript
    /**
     * Determines if the component should be rerendered
     *
     * @param  {object}  nextProps  Next properties
     * @param  {object}  nextState  Next state
     * @return  {boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        const keys = Object.keys(nextProps);
        const { value } = this.state;

        // We only consider the search term from the state
        if( value !== nextState.value )
            return true;

        // We render if anything in the properties changed

        // > Different number of properties
        if( keys.length !== Object.keys(this.props).length )
            return true;

        // > Different properties
        const changed = keys.some( key => nextProps[key] !== this.props[key] );

        if( changed )
            return true;

        return false;
    }
```

## Further improvement

There are a few things yet to be added to the component:

- Passing the timeout duration using a property
- Adding additional validation (e.g. minimum length)

## Conclusion

All in all (and with PropTypes)

<script src="https://gist.github.com/dak0rn/5993c85d4c839a1f3438.js"></script>