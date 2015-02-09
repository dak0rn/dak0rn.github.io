/**
 * A shim that replaces Backbone.wreqr with Backbone.Radio
 * in Marionette
 */
define(['marionette','backbone.radio','underscore'], function(Marionette,Radio,_){
    'use strict';
    
    Marionette.Application.prototype._initChannel = function () {
    this.channelName = _.result(this, 'channelName') || 'global';
    this.channel = _.result(this, 'channel') || Radio.channel(this.channelName);
  }
    
});