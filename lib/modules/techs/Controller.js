/**
 * Controller for the techs-images page
 */
define([
    'app',
    'text!./template/layout.html',
    
    './controller/SectionController'
], function(app,tpl){
    
   app.module('Techs',function(Techs, dak0rn, Backbone, Marionette, $, _){
        // Turn off auto start
        this.startWithParent = false;
       
        
        Techs.start = function() {
            // Register a new section on the page
            var section = new (dak0rn.module('Main').SectionModel)({
                viewID: '2-techs',
                viewClassName: 'asphalt',
                controller: new Techs.SectionController(),
                template: _.template(tpl),
                title: 'what i do'
            });
            
            // Bit of a hack, but I do not want to introduce another
            // request bus just for that one object we need in the
            // section controller.
            Techs.start._sectionInstance = section;
            
            // Register our page
            dak0rn.bus.trigger('app:register:page', '2-techs' ,section);
        };
       
   });
   
   return app.module('Techs');
    
});