/**
 * The application's loader
 */
requirejs.config({
    baseUrl: './lib',
    
    // Package path configuration
    paths: {
        'app': 'Kickoff',
        'backbone': '../bower_components/backbone/backbone',
        'backbone.babysitter': '../bower_components/backbone.babysitter/lib/backbone.babysitter',
        'backbone.wreqr': '../bower_components/backbone.wreqr/lib/backbone.wreqr',
        'backbone.radio': '../bower_components/backbone.radio/build/backbone.radio',
        'fullpage': '../bower_components/fullpage.js/jquery.fullPage',
        'jquery': '../bower_components/jquery/dist/jquery',
        'marionette': '../bower_components/marionette/lib/backbone.marionette',
        'underscore': '../bower_components/underscore/underscore',
        'text': '../bower_components/requirejs-text/text'
    },
    
    // Dependency shims
    shim: {
        jquery: { exports: 'jquery' },
        backbone: { deps: ['jquery','underscore'], exports: 'backbone' },
        underscore: { exports: 'underscore' },
        marionette: { deps: ['backbone.babysitter','backbone.wreqr','backbone'] },
        'backbone.wreqr': { deps: ['backbone'] },
        'backbone.radio': { deps: ['backbone'] },
        
        'fullpage': { deps: ['jquery'] }
    }
    
});

// Start the loader
require([
    'app',
    'config',
    
    // silent dependencies
    'backbone.radio.shim'
], function(app, config) {
    'use strict';
    
    console.log('Loader: kicking off w/ main module',config.main);
    app.configuration = config;
    
    // Load the main module, this is the only hard module dependency
    require([config.main],function(){
        window.App = app;
        app.start();
    });
    
    
    
});