require.config({
    urlArgs: '_c=' + (new Date()).getTime(),
    paths: {
        CoffeeScript: 'libs/coffee-script',
        cs: 'libs/require/plugins/cs',
        i18n: 'libs/require/plugins/i18n',
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
    'order!zui/coala',
    'order!zui/coala/config',
    'order!zui/components/grid',
    'order!zui/components/accordion',
    'order!zui/components/tree',
    'order!zui/components/select',
    'order!zui/components/picker',
    'order!zui/components/tabs',
    'order!libs/bootstrap/bootstrap',
    'order!zui/components/datetimepicker',
    'order!libs/jquery/layout/jquery.layout',
    'order!libs/jquery/layout/jquery.layout.resizeTabLayout',
    'order!libs/jquery/daterangepicker/date',
    'order!libs/jquery/jquery.validate',
    'order!libs/jquery/daterangepicker/daterangepicker',
    'order!directory-application'
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
            	app.startFeature('system/departments');
            }).done(function(viewport){
            	app.startFeature('system/accounts', {container: viewport.layout.$('content')});
            });
        });
    });

});
