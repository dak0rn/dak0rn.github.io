/**
 * Controller for the section
 */
define([
    'app'
], function(app){
    
    app.module('Terminal',function(Terminal, dak0rn, Backbone, Marionette, $, _){
        
        Terminal.SectionController = Marionette.Object.extend({
            
            initialize: function() {
                dak0rn.bus.on('main:loaded:section', this.animate, this);
                dak0rn.bus.on('main:leaving:section', this.animateLeaving, this);
            },
            
            onRenderSection: function(layout) {
                console.log('Terminal - My section has been redered',layout);
            },
            
            animate: function(target) {
                // Scrolled to another page?
                if( '1-terminal' !== target.anchor )
                    return;
                
                var terminal = target.view.$el.find('#terminal-window');
                terminal.animate({'margin-right':'0px'}, 400);
            },
            
            animateLeaving: function(from, to) {
                if( '1-terminal' === to.anchor ) {
                    var terminal = to.view.$el.find('#terminal-window');
                    terminal.css('margin-right', (0 - terminal.width())+"px");
                }
                    
            }
            
        });
        
    });
    
    return app.module("Terminal").SectionController;
    
});