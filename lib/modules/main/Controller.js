/**
 * Controller for the main module
 */
define([
    'app',
    
    // silent dependencies
    './view/MainLayoutView',
    './view/SectionView',
    './collection/SectionCollection'
], function(app){
    
    app.module('Main', function(Main, dak0rn, Backbone, Marionette, $, _ ){
        
        // This API is private
        var api = {
            
            // Used to register a page
            registerPage: function(id,view) {
                if( ! _.isString(id) || _.isEmpty(id) || ! _.isObject(view) ) {
                    console.log('registerPage: invalid args',arguments);
                    return;
                }
                
                //id = "s-" + id;
                
                console.log('registerPage: registered',id);
                this.pages[id] = view;
            },
            
            // Used to unregister a page
            unregisterPage: function(id) {
                if( ! _.isString(id) ) 
                    console.log('unregisterPage: invalid args',arguments);
                else if( ! _.has(this.pages,id) )
                    console.log('unreigsterPage: there is no registered page w/ the id',id);
                else
                    delete this.pages[id];
            },
            
            
            // Used to start the controller
            start: function(target) {
                this.trigger('main:before:start');
                
                console.log('Main.Controller starting...');
                
                // Create a collection with all the registered views
                var models  = new Main.SectionCollection( _.values(this.pages) );
                models.sort();
                
                console.log('Sections to render:', models.length);
                
                // Create a new layout
                var layout = new Main.MainLayoutView({collection:models});
                
                // Set the anchor prefix
                // This is required due to fullpage.js restrictions
                var prefix = "s-";
                dak0rn.bus.reply('main:anchor:prefix',prefix);
                var addPrefix = function(str) { return prefix+str; };
                
                // underscore is fucking not functional
                // _.compose( _.map(addPrefix), _.keys)(this.pages)
                var ids = _.map(_.keys(this.pages), addPrefix);
                console.log('Telling fullpage about',ids);
                
                // Set the registered pages for fullpage.js
                layout.fullpageOptions.anchors = ids;
                
                this.trigger('main:before:render');
                
                // Render the layout
                layout.render();
                target.append(layout.el);
                
                console.log('Main.Controller started. Triggering events now.');
                
                this.trigger('main:after:render');
                this.trigger('main:after:start');
                
            }
            
        };
        
        
        // Expose the controller object
        // using the facade pattern
        Main.Controller = Marionette.Object.extend({
            
            _context: {},
            
            pages: {},
            
            initialize: function() {
                // Create a context that combines the hidden
                // api functions and the object's properties
                this._context = _.extend(this,api);
                
                // Register events
                dak0rn.bus.on('app:register:page', this._context.registerPage, this._context);
                dak0rn.bus.on('app:unregister:page', this._context.unregisterPage, this._context);
                dak0rn.bus.reply('main:pages:get', this.pages);
                
            },
            
            // Invoked by the application
            start: function(target) {
                this._context.start(target);
            },
            
            
            
            
        });
        
    });
    
    return app.module('Main');
    
});