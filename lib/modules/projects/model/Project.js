/**
 * Model that represents a project
 */
define([
    'app'
], function(app){
    
    app.module('Projects',function(Projects, dak0rn, Backbone, Marionette, $, _){
        
        Projects.Project = Backbone.Model.extend({
            defaults: {
                title: '',
                image: '',
                desc: ''
            }
        });
        
    });
    
    return app.module('Projects').Project;
});