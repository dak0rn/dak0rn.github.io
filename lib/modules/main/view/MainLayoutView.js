/**
 * The collection view that powers the whole layout
 */
define([
    'app',
    
    // silent dependencies
    './SectionView',
    'fullpage'
], function(app, template){
    
    app.module('Main', function(Main, dak0rn, Backbone, Marionette, $, _){
        
        Main.MainLayoutView = Marionette.CollectionView.extend({
            tagName: 'div',
            id: 'page',
            
            childView: Main.SectionView,
            
            // We want to force the tagName to make sure
            // the fullPage.js plugin works correctly
            childViewOptions: {
                tagName: 'section'
            },
            
            // Options for the fullpage plugin
            fullpageOptions: {
                sectionSelector: 'section'
            },
            
            initialize: function() {
                // Make sure the fullpage function is run when
                // the view has been rendered and inserted
                dak0rn.bus.on('app:after:render', this.runFullPage, this);
                dak0rn.bus.on('main:scroll:to:page', this.scrollPage, this);
                
                // This is the point where pages can register async operations
                // that have to be performed before the fullpage.js plugin can
                // be run
                dak0rn.bus.reply('main:fullpage:promises',[]);
            },
            
            // Invoked when the layout is ready
            // Initializes the fullpage.js plugin
            
            runFullPage: function(){
                
                // We need this delegator object because 
                // the `onLeave` function needs access to the original scope
                var handleDelegate = _.bind(this.handleLeave, this);
                
                var startPlugin = _.bind(function(){
                    console.log('Running the fullpage plugin w/', this.fullpageOptions);
                    this.$el.fullpage( this.fullpageOptions );
                }, this);
                
                this.fullpageOptions.afterLoad = _.bind(this.handleLoad, this);
                this.fullpageOptions.onLeave   = function(index,nextIndex,direction) {
                    handleDelegate(this,index,nextIndex,direction);
                };
                
                var promises = dak0rn.bus.request('main:fullpage:promises');
              
                if( ! _.isArray(promises) || 0 === promises.length )
                    startPlugin();
                else {
                    console.log("Waiting for async renderings: ", promises.length);
                    $.when.apply(this,promises).done( startPlugin );
                }
                    
                    
            },
            
            handleLoad: function(anchor,id) {
                console.log('Loaded page', anchor, id);
                
                             // remove the prefix
                anchor     = this._buildID(anchor);
                var pages  = dak0rn.bus.request('main:pages:get');
                var model  = pages[anchor];    
                var view   = this.children.findByModel(model);
                
                var target = {
                    model: model,
                    anchor: anchor,
                    view: view
                };
                
                dak0rn.bus.trigger('main:loaded:section',target);
            },
            
            handleLeave: function(scope, index, nextIndex, direction) {
                
                var fromAnchor = this._buildID( $(scope).attr('data-anchor') );
                var toAnchor   = this._buildID( this.fullpageOptions.anchors[nextIndex - 1] );  // get the anchor from the options
                                                                                                // The plugin is very bad at this point
                var pages      = dak0rn.bus.request('main:pages:get');
                
                var fromModel  = pages[fromAnchor];
                var toModel    = pages[toAnchor];
                
                var fromView   = this.children.findByModel(fromModel);
                var toView     = this.children.findByModel(toModel);
                
                var from = {
                    model: fromModel,
                    anchor: fromAnchor,
                    view: fromView
                };
                
                var to = {
                    model: toModel,
                    anchor: toAnchor,
                    view: toView
                };
                
                dak0rn.bus.trigger('main:leaving:section',from,to);
            },
            
            _buildID: function(anchor) {
                return anchor.substr( dak0rn.bus.request('main:anchor:prefix').length );
            },
            
            onRender: function() {
                console.log('Rendered child views in tagName: ',this.childViewOptions.tagName);
            },
            
            scrollPage: function(page) {
                page = dak0rn.bus.request('main:anchor:prefix') + page; // add the prefix
                
                console.log('Scrolling to page',page);
                this.$el.fullpage.moveTo(page);
            }
            
        });
        
    });
    
});