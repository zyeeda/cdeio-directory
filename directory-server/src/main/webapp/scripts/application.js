define([
    'jquery',
    'underscore',
    'cdeio/cdeio',
    'cdeio/applications/default',
    'cdeio/core/config',
    'cdeio/vendors/jquery/jquery.slimscroll.min'
], function($, _, cdeio, createDefault, config) {

    return function(options) {
        var app, deferred = $.Deferred();

        options = _.extend(options, { useDefaultHome: false });
        app = createDefault(options);
        app.config = config;

        app.done(function() {
            if (app.settings.currentUser.isAdmin) {
                if (location.hash) {
                    app.startFeature('admin/viewport', { container: $(document.body), ignoreExists: true }).done(function() {
                        deferred.resolve();
                    });
                } else {
                    deferred.resolve();
                }
            } else {
                app.startFeature('profile/viewport', { container: $(document.body), ignoreExists: true }).done(function() {
                    deferred.resolve();
                });
            }
        });

        app.addPromise(deferred.promise());
        return app;
    };

});

