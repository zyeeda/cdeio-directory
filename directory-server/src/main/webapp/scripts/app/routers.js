define({
    routes: {
        '': 'showHome',
        'profile': 'showProfile',
        'account-department': 'showAccountDepartment'
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
    },

    showAccountDepartment: function() {
        app.startFeature('admin/account-department', { ignoreExists: true });
        app.menuFeatureDeferred.done(function (menuFeature) {
            menuFeature.activateMenu(location.hash);
        });
    }
});
