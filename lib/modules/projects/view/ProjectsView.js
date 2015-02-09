/**
 * View for the projects collection
 */
define([
    'app',
    
    './ProjectView'
], function(app){
    
    app.module('Projects',function(Projects, dak0rn, Backbone, Marionette, $, _){
        
        Projects.ProjectsView = Marionette.CollectionView.extend({
            childView: Projects.ProjectView
            // className: 'inset scrollable'
        });
        
    });
    
    return app.module('Projects').ProjectsView;
});