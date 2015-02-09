/**
 * A collection for SectionModels
 */
define([
    'app',
    
    // silent dependencies
    '../model/SectionModel'
], function(app){
    
    app.module('Main', function(Main,dak0rn,Backbone, Marionette, $, _){
        
        Main.SectionCollection = Backbone.Collection.extend({
            model: dak0rn.module('Main').SectionModel,
            comparator: 'viewID'
        });
        
    });
    
});