define({
    routes: {
        '': 'showHome',
        'profile': 'showProfile'
    },

    showHome: function() {
        if (app.settings.currentUser.isAdmin) {
            app.startFeature('admin/viewport', { container: $(document.body), ignoreExists: true });
        } else {
            app.startFeature('profile/viewport', { container: $(document.body), ignoreExists: true });
        }
    },

    showProfile: function() {
        app.startFeature('profile/viewport', { container: $(document.body), ignoreExists: true });
    }
});
