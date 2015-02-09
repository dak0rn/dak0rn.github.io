/**
 * Controller for the section
 */
define([
    'app',
    
    '../model/Project'
], function(app){
    
    app.module('Projects',function(Projects, dak0rn, Backbone, Marionette, $, _){
    
        Projects.ProjectCollection = Backbone.Collection.extend({
            model: Projects.Project,
            url: '/projects.json'
        });
        
    });
    
    return app.module('Project').ProjectCollection;
    
});