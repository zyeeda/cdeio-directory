require.config({
    urlArgs: '_c=' + (new Date()).getTime(),
    paths: {
        order: 'libs/require/plugins/order',
        text: 'libs/require/plugins/text',

        zui: 'libs/zui',
        jquery: 'libs/jquery/jquery',
        jqueryui: 'libs/jquery/ui',
        underscore: 'libs/lodash',
        backbone: 'libs/backbone',
        marionette: 'libs/backbone.marionette',
        handlebars: 'libs/handlebars-amd'
    }
});

define([
    'jquery',

    'zui/coala',
    'zui/coala/browser',
    'zui/coala/application',
    'zui/coala/component-handler',
    'zui/coala/config',

    'libs/bootstrap/bootstrap',
    'libs/jquery/layout/jquery.layout',
    'order!libs/jquery/layout/jquery.layout.resizeTabLayout'
], function ($, coala, detectBrowser, Application, ComponentHandler, config) {

    $(function() {
        var app;

        detectBrowser();

        app = new Application();

        ComponentHandler.initialize().done(function () {

            app.startFeature('viewport').done(function (viewport) {
                config.featureContainer = function (feature) {
                    return viewport.views.content.$el;
                }
                coala.startBackboneHistory(app);
            });

        });
    });

});
