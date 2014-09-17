define([
    'jquery',
    'cdeio/cdeio',
    'cdeio/core/config',
    './directory-application'
], function ($, cdeio, config) {

    $(function() {
        var app = window.app = cdeio.startApplication('directory-application');
        app.done(function(){
        	app.startFeature('viewport').done(function (viewport) {
                config.featureContainer = function (feature) {
                    return viewport.layout.$('sidebar');
                }
                cdeio.startBackboneHistory(app);
            }).done(function(viewport){
            	app.startFeature('system/departments', {container: viewport.layout.$('sidebar')});
            }).done(function(viewport){
            	app.startFeature('system/accounts', {container: viewport.layout.$('content')});
            });
        });
    });

});
