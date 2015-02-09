/**
 * Application configuration
 */
define([
],function(){
    
    return {
        
        // The main module
        main: 'modules/main/Controller',
        
        modules: [
            'modules/introduction/Controller',
            'modules/terminal/Controller',
            'modules/techs/Controller',
            'modules/projects/Controller'
            ]
    };
    
});