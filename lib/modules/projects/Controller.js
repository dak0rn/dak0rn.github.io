/**
 * Controller for the projects page
 */
define([
    'app',
    'text!./template/layout.html',
    
    './controller/SectionController'
], function(app,tpl){
    
   app.module('Projects',function(Projects, dak0rn, Backbone, Marionette, $, _){
        // Turn off auto start
        this.startWithParent = false;
       
        
        Projects.start = function() {
            // Register a new section on the page
            var section = new (dak0rn.module('Main').SectionModel)({
                viewID: '3-projects',
                viewClassName: 'asbestos',
                controller: new Projects.SectionController(),
                template: _.template(tpl),
                title: 'what i did'
            });
            
            // Bit of a hack, but I do not want to introduce another
            // request bus just for that one object we need in the
            // section controller.
            Projects.start._sectionInstance = section;
            
            // Register our page
            dak0rn.bus.trigger('app:register:page', '3-projects' ,section);
        };
       
   });
   
   console.log('Projects!');
   
   return app.module('Projects');
    
});