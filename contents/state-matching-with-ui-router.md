---
title: "State matching with ui-router"
date: 2015-12-07
---

Angular's **ui-router** gives you easy access to the current route; the `$state` services contains all the information about the current route including its URL, the state name and any other information provided in the configuration.

If you want to implement a dynamic navigation that highlights the currently active page you can use the name of the state for it. Imagine a `HeaderService` that contains all navigation links each containing a title and the name of the target scope.

```javascript
{
    title: '',
    state: ''
}
```

Usually, a global navigation does not contain all states but the top level ones. If the active state is a child of a state referenced in the navigation a simple matching would not find the correct entry.

Given your navigation contains a link to the state `app.dashboard` and the currently active state is `app.dashboard.groups` the former should be considered active. If `app.dashboard.groups` is also referenced in the navigation this one should be taken instead.

What you basically have to do is to walk up the state tree and check if one route matches. This should happen when the app starts as well as when the state changes. I use the following controller for that:

```javascript
/**
 * Controller for the navigation
 */
export default class NavivgationController {

    /* @ngInject */
    constructor(Navigation, $rootScope, $state) {
        // Things for the scope
        this.leftItems = Navigation.leftItems;
        this.rightItems = Navigation.rightItems;
        this.$state = $state;
        this.currentState = void 0;

        const removeListener = $rootScope.$on('$stateChangeSuccess', (event) => this._stateChanged(event));

        $rootScope.$on('$destroy', () => {
            removeListener();
        });

        // Find the correct items
        this._stateChanged();
    }

    _stateChanged(/* event */) {
        // See below
    }
}
```

The `_stateChanged()` function does the magic here; it uses the currently active state, builds a list of parent states, iterates over all registered navigation items and finds either the active state or one of its parents - or `undefined` if no parent is registered in the navigation.

```javascript
//...
    _stateChanged(/* event */) {
        const states = this.$state.current.name.split('.');

        // If a sub state has been activated we highlight
        // one of its parent if it is not contained in the navigation
        // itself.
        // Build a list of possible states and parent states
        const probes = states
            .reduce( (names, name) => {
                const last = names[names.length - 1];

                if( ! last )
                    return [[name]];

                return names.concat( [last.concat([name])] );

            }, [])
            .reverse()
            .map( def => def.join('.'));

        // We now try to find a state in all lists
        // This matches either the active state or one of its parents
        this.currentState = this.leftItems
                            .concat( this.rightItems )
                            .filter( item => -1 !== probes.indexOf( item.state ) )
                            .map( item => item.state )[0];

    }
//...
```

The function splits the current state, creates an array of the state and parent states, reverses them and joins them again.

```
'app.dashboard.groups'
<split and reduce>
[ ['app'], ['app', 'dashboard'], ['app', 'dashboard', 'groups'] ]
<reverse>
[ ['app', 'dashboard', 'groups'], ['app', 'dashboard'], ['app'] ]
<map: join>
[ 'app.dashboard.groups', 'app.dashboard', 'app' ]
```

After that it searches for a matching definition and sets`this.currenState` to the state.
