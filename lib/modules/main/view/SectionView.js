/**
 * A view for a section on the page
 */
define([
    'app'
], function(app){
    
    app.module('Main', function(Main, dak0rn, Backbone, Marionette, $, _){
        
        Main.SectionView = Marionette.LayoutView.extend({
            
            initialize: function(){
                this.template = this.model.get('template');
            },
            
            onDestroy: function(){
                this.model.get('controller').triggerMethod('destroy:layout');
            },
            
            // Retrieve the class name from the model
            className: function() {
                return this.model.get('viewClassName');
            },
            
            // Retrieve the ID from the model
            id: function() {
                return this.model.get('viewID');
            },
            
            template: function(){}, // noop here by default
            
            onRender: function() {
                // Ensure the data attribute is set properly
                var elementID = _.result(this,'id');
                
                if( _.isString(elementID) ) {
                    this.$el.attr('data-anchor','none!!!');
                }
                
                // Trigger the model's controller reference
                var controller = this.model.get('controller');
                
                if( ! _.isObject(controller) || ! _.isFunction(controller.triggerMethod) )
                    console.log('The model has an invalid controller set', this.model);
                else
                    controller.triggerMethod('renderSection',this);
            }
            
        });
        
    });
    
});