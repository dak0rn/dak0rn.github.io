[highlight.js](https://highlightjs.org/) is an easy to use JavaScript library
that can be used to highlight source code in websites. While that works great
for static websites you may have some trouble when using dynamically rendered
views and follow the standard documentation.

Highlighting code is quite simple and should be done after all elements are
rendered and exist in the DOM. Thus, they recommend to include and start
the script at the end of your page.

```html
<script src="/path/to/highlight.pack.js"></script>
<script>hljs.initHighlightingOnLoad();</script>
```

However, using a snippet like that at the end of a Backbone application works for
all content that has been rendered and inserted into the DOM before. Views generated
later will not be highlighted.

Luckily, highlight.js offers a `highlightBlock()` function that that takes a reference
to a DOM element and highlights it.
I used that function for the views powering this blog: whenever a view gets
rendered, all `<pre><code>` blocks will be passed to the highlighter. This can be
done using the `onRender()` function in Backbone / Marionette views:

```javascript
var ArticleView = Marionette.ItemView.extend({
    tagName: 'article',
    className: 'small',
    template: _.template('<div class="article-title"><a href="#post"><%=title%></a></div><div class="article-content"><%=contents%></div>'),
    triggers: {
        'click .article-title>a': 'show:single'
    },

    onRender: function() {
        var h = hljs;

        if( ! h || ! h.highlightBlock ) {
            h = {
                highlightBlock: function() {}
            };
        }

        this.$('pre code').each(function(i, block) {
                h.highlightBlock(block);
        });
    }

});
```
