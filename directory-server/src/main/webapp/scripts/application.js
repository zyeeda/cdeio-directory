define([
    'underscore',
    'coala/coala',
    'coala/applications/default',
    'coala/core/config',
    'coala/vendors/jquery/jquery.slimscroll.min'
], function(_, coala, createDefault, config) {

    return function(options) {
        options = _.extend(options, {useDefaultHome: false});
        app = createDefault(options);
        app.config = config;

        app.done(function() {
            if (app.settings.currentUser.isAdmin) {
                if (location.hash) {
                    app.startFeature('admin/viewport', { container: $(document.body), ignoreExists: true });
                }
            } else {
                app.startFeature('profile/viewport', { container: $(document.body), ignoreExists: true });
            }
        });

        return app;
    }

});

