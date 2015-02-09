/**
 * View for a single project
 */
define([
    'app',
    'text!../template/ProjectView.html'
], function(app, template){
    
    app.module('Projects',function(Projects, dak0rn, Backbone, Marionette, $, _){
        
        Projects.ProjectView = Marionette.ItemView.extend({
            template: _.template(template),
            className: 'slide',
            tagName: 'div'
        });
        
    });
    
    
    return app.module('Projects').ProjectView;
});