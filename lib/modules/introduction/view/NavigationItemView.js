/**
 * The navigation
 */
define([
    'app',
    'text!../template/NavigationItem.html'
], function(app, template){
    
    app.module('Introduction', function(Intro, dak0rn, Backbone, Marionette, $, _){
        
        Intro.NavigationItemView = Marionette.ItemView.extend({
            tagName: 'li',
            className: 'a-right slide-text sl-3',
            template: _.template(template),
            
            events: {
                'click a': 'scrollToPage'
            },
            
            scrollToPage: function(e) {
                e.preventDefault();
                dak0rn.bus.trigger('main:scroll:to:page', $(e.target).attr('data-href') );
            }
        });
        
    });
    
    
    return app.module('Introduction').NavigationItemView;
});