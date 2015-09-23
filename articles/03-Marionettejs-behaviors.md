[Marionette](http://marionettejs.com) comes with a very handy feature named **Behavior**s that
helps you to write DRY views by moving repetetive parts to a separate module. It allows you to
write reusable components without creating heavy-weight parent classes. Behaviors are comparable with
mixins or interfaces known from other languages and can be integrated in existing code with minor changes.

When developing web applications I often use a fade over effect between views when navigating to another
page. The idea is quite simple: the view hides itself if it gets rendered (`onRender`) and can then be
made visible using the triggered methods `fade:in` and `fade:out` that use promises to tell other parts
when the animation has finished.

While its quite easy to implement the code for these three concepts has to be written in every view that
wants to use it - including complex views, custom views and layouts. All in all, that is not very dry.

## Marionette behaviors

- Behavior components extend `Marionette.Behavior`.
- They have default values (in `.defaults`) and can have an `events` hash (using the view's `ui` property).
- Events emitted by `triggerMethod()` are given to the behavior when triggered on the view and the methods `initialize`, `onRender`, `onBeforeShow`
and `onBeforeDestroy` can be overwritten to inject custom stuff there.
- Behaviors can also define `triggers`, have access to the view's `$`, `$el` and `el` and event to the view itself using `this.view`.
- Even more, they can have its own `ui` hash. And of course, they can listen to events emitted by
the view's model (`modelEvents`) or its collection (`collectionEvents`).

Behaviors are managed using the utility class `Marionette.Behaviors`. While it works well out of the box
you **have to overwrite** at least the function `Marionette.Behaviors.behaviorsLookup` that is supposed to
return the datastore with behaviors.

## The fading example

Enough theory, let's write an example.
I will use a global variable as behavior store (I would not recommend that for production), so the first step is
to create that variable and make sure Marionette can find our Behaviors.

```coffee
_bh = {}
Marionette.Behaviors.behaviorsLookup = -> _bh
```

(Yes, that is CoffeeScript)

Now, let's implement the behavior that does the fading animation

```coffee
class _bh.FadingBehavior extends Marionette.Behavior
	defaults:
		duration: 200
		
	onFadeIn: (def) ->
		@$el.animate opacity:1, @options.duration, def?.resolve
		
	onFadeOut: (def) ->
		@$el.animate opacity:0, @options.duration, def?.resolve
		
	onRender: () ->
		@$el.css opacity:0
```

This snippet uses a cool feature of CoffeeScript: it creates a *class* that is
automatically added to `_bh`. It has a default animation `duration` of 200 ms
and overwrites the handler `onRender` invoked after the view's `render` function.
It also provides functions for the events `fade:in` and `fade:out`.

Now, we have the behavior that manages the fade effects and a way to export it
(`_bh` and `Marionette.Behaviors.behaviorsLookup`) we need to write views that use
this behavior.

## The view

The following view does nothing special but displaying text. In addition, it includes the
previously defined behavior that provides the fading functionality. It also overwrites the
default fading duration.

```coffee
class AwesomeView extends Marionette.ItemView
    template: _.template 'So awesome. Very view. Much fading'
    
    behaviors:
        FadingBehavior:
            duration: 1500
``` 

That is all that has to be written to integrate a behavior into a view.
Let's add some boilerplate code to render the view.

## The boilerplate

We will use a `Marionette.LayoutView` to add the view, fade it in and
display a message afterwards.

The layout for that:

```coffee
class Layout extends Marionette.LayoutView
    template: _.template '<main></main><footer></footer>'
    el: 'body'
    regions:
        main: 'main'
```

And the code that uses it:

```coffee
# Action
layout = new Layout
view = new AwesomeView
def = $.Deferred()

layout.render()
layout.getRegion('main').show view

view.triggerMethod 'fade:in', def

def.done -> layout.$el.find('footer').text 'View has been faded in'
```

## JSBin
If you want to play around with this example you can find a working
[JSBin here](http://jsbin.com/nurehu/1/edit?js,output). It also uses
CoffeeScript.