define([
    'underscore',
    'coala/applications/default',
    'coala/core/config',
    'coala/vendors/jquery/jquery.slimscroll.min',
    'coala/components/easy-pie',
    'coala/components/sparkline',
    'coala/components/plot'
], function(_, createDefault, config) {

    return function(options) {
        options = _.extend(options, {useDefaultHome: false});
        app = createDefault(options);
        app.config = config;

        return app;
    }

});

