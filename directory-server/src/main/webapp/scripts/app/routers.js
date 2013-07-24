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
        var menuFeature;

        app.startFeature('admin/account-department', { ignoreExists: true });
        console.log('e');
        menuFeature = app.findModule('commons').findFeature('menu');
        menuFeature.activateMenu(location.hash);
        /*app.menuFeatureDeferred.done(function (menuFeature) {
            console.log('3');
            menuFeature.activateMenu(location.hash);
        });*/
    }
});
