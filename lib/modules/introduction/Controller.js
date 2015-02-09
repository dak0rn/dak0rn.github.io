/**
 * Controller for the introduction page
 */
define([
    'app',
    'text!./template/layout.html',
    
    
    
    'modules/main/model/SectionModel',
    './controller/SectionController'
], function(app,tpl){
    
   app.module('Introduction',function(Intro, dak0rn, Backbone, Marionette, $, _){
        // Turn off auto start
        this.startWithParent = false;
       
        
        Intro.start = function() {
            // Register a new section on the page
            var section = new (dak0rn.module('Main').SectionModel)({
                viewID: '0-introduction',
                viewClassName: 'introduction',
                controller: new Intro.SectionController,
                template: _.template(tpl),
                title: 'Intro'
            });
            
            // Bit of a hack, but I do not want to introduce another
            // request bus just for that one object we need in the
            // section controller.
            Intro.start._sectionInstance = section;
            
            // Register our page
            dak0rn.bus.trigger('app:register:page', '0-introduction' ,section);
        };
       
   });
   
   return app.module('Introduction');
    
});