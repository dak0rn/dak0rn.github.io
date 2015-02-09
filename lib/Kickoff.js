/**
 * Start file
 */
define([
    'marionette',
    'backbone',
    'underscore',
    'jquery',
    
    'backbone.radio'
], function(Marionette, Backbone, _, $){

    var app = new Marionette.Application();
    
    // Communication channel
    app.bus = Backbone.Radio.channel('dak0rn');
    
    var startModules = function (promise) {
        // Function invoked when require loaded all modules
        return function() {
            _.each( Array.prototype.slice.call(arguments), function(model){
            if( _.isObject(model) && _.isFunction(model.start) )
                model.start.call({});
            });
            
            promise.resolve();
        };
    };
    
    app.on('start', function(){
        // Render main layout
        var MainController = app.module('Main').Controller;
        var controller = new MainController();
        
        console.log('Loaded the main module');
        
        // Now that the main controller is ready let us load
        // the other modules that may depend on it
        app.bus.trigger('app:before:modules');
        
        // We use a promise to make sure all modules are loaded
        var promise = $.Deferred();
        
        // TODO Add the suitsoft sandbox here
        require(app.configuration.modules, startModules(promise) );
        
        
        promise.done(function(){
            
            app.bus.trigger('app:after:modules');
        
            app.bus.trigger('app:before:render');
            controller.start( $('body') );
            app.bus.trigger('app:after:render');
            
        });
        
        
        
    });
    
    return app;
});