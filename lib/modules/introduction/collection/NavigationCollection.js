/*
 * Collection for navigation items
 */
define([
    'app',
    '../model/NavigationItem'
], function(app){
    
    app.module('Introduction', function(Intro, dak0rn, Backbone, Marionette, $, _){
        
        Intro.NavigationCollection = Backbone.Collection.extend({
            module: dak0rn.module('Introduction').NavigationItem
        });
        
    });
    
    return app.module('Introduction').NavigationCollection;
    
});