/**
 * The navigation
 */
define([
    'app',
    
    './NavigationItemView'
], function(app){
    
    app.module('Introduction', function(Intro, dak0rn, Backbone, Marionette, $, _){
        
        Intro.NavigationView = Marionette.CollectionView.extend({
            tagName: 'ul',
            className: 't-nav content-list',
            childView: dak0rn.module('Introduction').NavigationItemView
        });
        
    });
    
    return app.module('Introduction').NavigationView;
    
});