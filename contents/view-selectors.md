---
title: "Abstracting view selectors"
date: 2015-08-01
---

The `ui` property in `Marionette.View` allows you to abstract parts of a view's DOM structure. You often find code like the following that plays with jQuery to manipulate parts of a rendered view:

```coffee
	# ...
    onShowError: (msg) ->
		error = @$('.error')
		error.text msg
		error.animate opacity:1, 200

	onHideError: () ->
		error = @$('.error')
		error.text ''
		error.animate opacity:0, 200

	# ...
```

While this seems to be an appropriate solution it has some major downsides:

1. It is slow. Every time the function is executed jQuery uses its selector engine to find the desired node(s).
2. The node selectors are hard coded which may lead to repetitive code

## The `ui` property

A `Marionette.View`'s `ui` property allows you to abstract these selectors with identifiers. It is an object that maps a name to a jQuery selector. Thus, the partial view from the previous example could also be written like that:

```coffee
	# ...
	ui:
		error: '.error'

	onShowError: (msg) ->
		@ui.error.text msg
		@ui.error.animate opacity:1, 200

	onHideError: () ->
		@ui.error.text ''
		@ui.error.animate opacity:0, 200

	# ...
```

As you can see, the selector has been moved to a separate object and can then be accessed using `@ui.error` (or `this.ui.error` in JavaScript).

Using this approach you get a couple of advantages:

1. Your code is more DRY
2. It is - in my point of view - more readable
3. Parent views and `Marionette.Behavior`s can use them, too. Thus, they have a way better interface
4. It is faster

## How it works

The `ui` bindings are cached when the view has been rendered and are accessible afterwards.
The functions for that are defined in `Marionette.View`:

```javascript
Marionette.View = Backbone.View.extend({

	// ...

	bindUIElements: function() {
      this._bindUIElements();
      _.invoke(this._behaviors, this._bindUIElements);
    },

    // This method binds the elements specified in the "ui" hash inside the view's code with
    // the associated jQuery selectors.
    _bindUIElements: function() {
      if (!this.ui) { return; }

      // store the ui hash in _uiBindings so they can be reset later
      // and so re-rendering the view will be able to find the bindings
      if (!this._uiBindings) {
        this._uiBindings = this.ui;
      }

      // get the bindings result, as a function or otherwise
      var bindings = _.result(this, '_uiBindings');

      // empty the ui so we don't have anything to start with
      this.ui = {};

      // bind each of the selectors
      _.each(bindings, function(selector, key) {
        this.ui[key] = this.$(selector);
      }, this);
    },

	// ...

})
```

The `_bindUIElements` function gets called by `bindUIElements` that is invoked when the view has been rendered and before the `onRender` handler gets executed.

As you can see, it first copies the defined bindings from `ui` to `_uiBindings`, iterates over them and caches the references to the desired nodes which are then available in `this.ui`.

```javascript
this.ui[key] = this.$(selector);
```