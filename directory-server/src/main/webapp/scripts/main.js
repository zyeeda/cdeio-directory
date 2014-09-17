define([
    'jquery',
    'cdeio/cdeio',
    'application'
], function ($, cdeio) {

    $(function() {
        var app = window.app = cdeio.startApplication('application');
    });

});
