define([
    'jquery',
    'coala/coala',
    'coala/zui/coala/config',
    './directory-application'
], function ($, coala, config) {

    $(function() {
        var app = window.app = coala.startApplication('directory-application');
        app.done(function(){
        	app.startFeature('viewport').done(function (viewport) {
                config.featureContainer = function (feature) {
                    return viewport.layout.$('sidebar');
                }
                coala.startBackboneHistory(app);
            }).done(function(viewport){
            	app.startFeature('system/departments', {container: viewport.layout.$('sidebar')});
            }).done(function(viewport){
            	app.startFeature('system/accounts', {container: viewport.layout.$('content')});
            });
        });
    });

});
