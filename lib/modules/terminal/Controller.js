/**
 * Controller for the terminal page
 */
define([
    'app',
    'text!./template/layout.html',
    
    './controller/SectionController'
], function(app,tpl){
    
   app.module('Terminal',function(Terminal, dak0rn, Backbone, Marionette, $, _){
        // Turn off auto start
        this.startWithParent = false;
       
        
        Terminal.start = function() {
            // Register a new section on the page
            var section = new (dak0rn.module('Main').SectionModel)({
                viewID: '1-terminal',
                viewClassName: 'midnight',
                controller: new Terminal.SectionController(),
                template: _.template(tpl),
                title: 'who i am'
            });
            
            // Bit of a hack, but I do not want to introduce another
            // request bus just for that one object we need in the
            // section controller.
            Terminal.start._sectionInstance = section;
            
            // Register our page
            dak0rn.bus.trigger('app:register:page', '1-terminal' ,section);
        };
       
   });
   
   return app.module('Terminal');
    
});