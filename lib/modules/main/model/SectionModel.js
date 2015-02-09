/**
 * A model that represents a section on the page
 */
define(['app'], function(app){
    
    app.module('Main', function(Main, dak0rn, Backbone, Marionette, $, _ ){
        
        Main.SectionModel = Backbone.Model.extend({
            defaults: {
                
                // The ID of the section
                viewID: '',
                
                // The class name of the section
                viewClassName: '',
                
                // The controller will receive the event `renderSection`
                // with the LayoutView as argument when the section is rendered
                controller: new Marionette.Object({}),
                
                // This is the template the layout will render
                template: function() {},
                
                title: ''
                
            }
        });
        
    });
    
});