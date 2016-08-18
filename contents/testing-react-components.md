---
title: "Testing React Components"
date: 2016-01-19
---

Testing is complex. Writing front-end tests is often a pain, especially if you need some kind of web server. It takes quite some time to configure all the tools so that they work correctly in environments larger than a Todo application. And depending on the framework(s) you use testing can get really nasty. React's component approach makes it easy to write self-contained components that can be unit tested without the need to run the whole application.

## Entering the toolchain

When it comes to testing, we use a small and fast setup, that lets us do Behavior Driven Development without the hassle of having to wait for browsers or testing servers. What we do:

- Use `npm` as task runner
- `better-npm-run` for platform independent run scripts
- `mocha` with `chai` for BDD style assertions
- `sinon` for function spying
- `jsdom` for a DOM in node
- `react-addons-test-utils`, `react` and `react-dom` for all the things related to React
- `prunk` to remove imports of SASS or CSS files
- `babel-core/register` to make sure we can write tests with ES2015

All in all:

```bash
npm install --save-dev mocha chai jsdom sinon react react-dom react-addons-test-utils babel-core prunk better-npm-run
```

Everything runnable is configured in the `package.json`. Here is the important part for test:

```javascript
{
  // ...
  "scripts": {
    "test": "better-npm-run test",
    "test-watch": "better-npm-run test -w"
  },
  "betterScripts": {
    "test": {
      "command": "mocha -r babel-core/register -r ./mocha-setup.js 'src/**/__test__/*-test.js'"
  },
  // ...
}
```

The `npm test` commands starts the `test` script from `better-npm-run`, `npm run test-watch` does the same but lets mocha watch our test files.

The command requires `babel-core/register` that enables us to write ES2015 in our tests. The globbing pattern matches all JavaScript files ending with `-test.js` in all `__test__` directories, e.g. `components/__test__/Toolbar-test.js`.

It also requires `mocha-setup.js` that sets up some things we need before running tests. This file is located right next to our `package.json`.

```javascript
/**
 * Mocha setup
 */
import prunk from 'prunk';
import React from 'react';
import jsdom from 'jsdom';

// Suppress stylesheet imports
prunk.suppress(/\.(scss|css|less|sass)$/i);

// Provide the global things
global.document = jsom.jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.window.localStorage = {};  // We use that in the application

// Make browser things available in global scope
Object.keys(global.window)
        .filter( key => ! (key in global) )
        .forEach( key => global[key] = global.window[key] );

// We also need React
global.window.React;
```

It uses `prunk` to prevent node from importing stylesheet files, creates a DOM and makes it globally available. It also copies everything from `window` to `global` so that tests do not break if developers skip `window` in their code (e.g. `location` instead of `window.location`).

### A wild component appears

I will demonstrate how to write test with a small toolbar component that renders a small toolbar consisting of an input field and a button.

![](/images/toolbar.png)

The component expects us to provide it with labels and handler functions for the input and the button. Internally, it does not use any state but completely relies on what is provided by its properties.

```javascript
import React from 'react';

export default class Toolbar extends React.Component {

    render() {
        const { term,
                onChange,
                searchPlaceholder,
                onCreate,
                createText } = this.props;

        return <div id="search-bar" className="row">
            <div className="col-sm-3 col-md-push-9">
                <div className="input-group">
                    <input type="text"
                           className="form-control"
                           value={ term }
                           placeholder={ searchPlaceholder }
                           onChange={ e => onChange(e.target.value) } />

                       <span className="input-group-btn">
                           <button className="btn btn-success" onClick={ onCreate }>
                               <span className="glyphicon glyphicon-plus"></span>
                               { createText }
                           </button>
                       </span>
                </div>
            </div>
        </div>;
    }
}
```

The test for this component is placed in the `__test__` directory next to it and is named `Toolbar-test.js`. This test is found by `mocha` automatically.

It imports the component, renders it and then tests whether the properties are used correctly, asserts that the component has an ID and reacts properly if the button is clicked.

### A test utility

To perform the rendering we have a small utility that can render a React component either in the DOM provided by `jsdom` or shallowly with the renderer from `react-addons-test-utils`. We usually provide this function globally using the `mocha-setup.js` file. For this example, I moved it into the test to make it easier to understand the test.

```javascript
const renderToolbar = (props = {}) => {

    // Rendered stuff
    let shallow = null;
    let component = null;

    return {
        // Shallowly rendered output
        get shallow() {
            if( ! shallow ) {
                const renderer = ReactTestUtils.createRenderer();

                renderer.render(<Toolbar {...props} />);
                shallow = renderer.getRenderOutput();
            }

            return shallow;
        },

        get component() {
            if( ! component ) {
                component = ReactTestUtils.renderIntoDocument(<Toolbar {...props} />);
            }

            return component;
        },

        // DOM node
        get node() {
            return ReactDOM.findDOMNode( this.component );
        }
    };
};
```

This small helper takes an object with component properties and returns an object that renders with the shallow renderer (`.shallow`) or with the DOM (`.node` / `.component`). We use getters to let it render lazily and speed up the tests a bit.

## Tests. Finally.

This is all we need to setup the testing tools and utilities. Writing unit tests for that component is quite simple now.

```javascript
import { expect } from 'chai';
import ReactTestUtils from 'react-addons-test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Toolbar from '../Toolbar';   // << the component
import sinon from 'sinon';

// ... (helper) ...

describe('Toolbar', () => {

    describe('properties', () => {

        it('should set the initial value correctly', () => {
            const term = '--search--';
            const { node } = renderToolbar({ term });
            const { value } = node.querySelector('input.form-control');

            expect( value ).to.equal( term );
        });

        it('should invoke the onCreate callback correctly', () => {
            const callback = sinon.spy();

            const { node } = renderToolbar({ onCreate: callback });
            const button = node.querySelector('button.btn.btn-success');

            ReactTestUtils.Simulate.click( button );

            expect( callback.called ).to.be.true;
        });

    });

});
```

At this point, you can run the tests with

```bash
npm test
```

![npm-test](/images/npm-test.png)

## Conclusion

Writing tests can be easy. If you have ever set up Karma, Protractor and Selenium you might understand why we think testing React components is easy; these tests executed in the node environment run fast, they are easy to setup and do not require you to watch out for state manipulation or network requests.

And if you use something like Redux you can write components that use properties as much as possible and are simple to test.