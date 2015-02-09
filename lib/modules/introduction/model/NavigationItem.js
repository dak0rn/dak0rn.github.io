/**
 * An item in the navigation
 */
define([
    'app'
], function(app) {
    
    app.module('Introduction', function(Intro, dak0rn, Backbone, Marionette, $, _){
        
        Intro.NavigationItem = Backbone.Model.extend({
            defaults: {
                anchor: '',
                title: ''
            }
        });
        
    });
    
    return app.module('Introduction').NavigationItem;
    
});