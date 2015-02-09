/**
 * Controller for the section
 */
define([
    'app',
    
    '../model/NavigationItem',
    '../collection/NavigationCollection',
    '../view/NavigationView'
], function(app){
    
    app.module('Introduction',function(Intro, dak0rn, Backbone, Marionette, $, _){
        
        Intro.SectionController = Marionette.Object.extend({
            
            onRenderSection: function(layout) {
                
                var pages = null;
                var items = new Intro.NavigationCollection();
                
                var NavigationItem = Intro.NavigationItem;
                
                console.log('Introduction: setting up regions');
                layout.addRegions({ navigation: '#navigation' });
                
                pages = dak0rn.bus.request("main:pages:get");
                
                if( ! _.isObject(pages) ) {
                    console.log('got freaky pages [no-object]', pages);
                    return;
                }
                
                _.each( pages, function(item, key){
                    // This section should not be included in the navigation
                    if( item !== Intro.start._sectionInstance )
                        items.add( new NavigationItem({
                            anchor:key,
                            title:item.get('title')
                            
                            })
                        );
                });
                
                console.log('Rendering links', items);
                
                var view = new Intro.NavigationView({collection:items});
                layout.getRegion('navigation').show(view);
                
                console.log('Introduction - My section has been redered',layout);
            }
            
        });
        
    });
    
    return app.module("Introduction").SectionController;
    
});