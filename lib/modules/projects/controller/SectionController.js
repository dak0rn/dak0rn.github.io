/**
 * Controller for the section
 */
define([
    'app',
    
    '../collection/ProjectCollection',
    '../view/ProjectsView'
], function(app){
    
    app.module('Projects',function(Projects, dak0rn, Backbone, Marionette, $, _){
        
        Projects.SectionController = Marionette.Object.extend({
            
            initialize: function() {
                dak0rn.bus.on('main:loaded:section', this.animate, this);
                dak0rn.bus.on('main:leaving:section', this.animateLeaving, this);
            },
            
            onRenderSection: function(layout) {
                var collection = new Projects.ProjectCollection();
                var promise = $.Deferred();
                
                // Since fetching is done asynchronously we
                // store the promise in the list of the main layout
                // which will then wait for this module
                var promises = dak0rn.bus.request('main:fullpage:promises');
                if( _.isArray(promises) ) promises.push(promise);
                
                collection.fetch({
                    success: function() {
                        
                        var view = new Projects.ProjectsView({collection:collection});

                        view.render();
                        
                        // hacky
                        layout.$el.append( view.$el.html() );
                        
                        promise.resolve({layout:layout,controller:this});
                    }
                });
                
            },
            
            animate: function(target) {
               
            },
            
            animateLeaving: function(from, to) {
                
            }
            
        });
        
    });
    
    return app.module("Terminal").SectionController;
    
});