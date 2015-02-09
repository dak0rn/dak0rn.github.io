/**
 * Controller for the section
 */
define([
    'app'
], function(app){
    
    app.module('Techs',function(Techs, dak0rn, Backbone, Marionette, $, _){
        
        Techs.SectionController = Marionette.Object.extend({
            
            initialize: function() {
                dak0rn.bus.on('main:loaded:section', this.animate, this);
                dak0rn.bus.on('main:leaving:section', this.animateLeaving, this);
            },
            
            onRenderSection: function(layout) {
                console.log('Techs - My section has been redered',layout);
            },
            
            // Curried function to create an animation callback
            _createAnimationCallback: function(element) {
                var $element = $(element);
                
                return function(callback) {
                    $element.animate({'opacity':'1'},100,callback);
                };
            },
            
            animate: function(target) {
                if( '2-techs' !== target.anchor )
                    return;
                
                var actions = [];
                this._ensureImages(target.view);
                
                this._images.each( _.bind( function(i,image) {
                    actions.push( this._createAnimationCallback(image) );
                }, this ) );
                
                // Reduce the array from the right. Executes all
                // animations in order
                _(actions).reduceRight(_.wrap, _.identity)();
            },
            
            animateLeaving: function(from, to) {
                if( '2-techs' === to.anchor  ) {
                    this._ensureImages(to.view);
                    this._images.css({'opacity':'0'});
                }
            },
            
            _ensureImages: function(view) {
                
                if( 'undefined' === typeof this._images ) {
                    this._images = view.$el.find('.tech-image');
                }
                
            },
            
            // Invoked when the corresponding layout is destroyed
            onDestroyLayout: function() {
               this._images = undefined; 
            },
            
            // Cache for the images reference to speed up the page
            _images: undefined
            
        });
        
    });
    
    return app.module("Terminal").SectionController;
    
});