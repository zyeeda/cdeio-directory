define({
    routes: {
        '': 'showHome',
        'profile': 'showProfile',
        'account-department': 'showAccountDepartment'
    },

    showHome: function() {
        if (app.settings.currentUser.isAdmin) {
            return app.startFeature('admin/viewport', { container: $(document.body), ignoreExists: true });
        }
        return app.startFeature('profile/viewport', { container: $(document.body), ignoreExists: true });
    },

    showProfile: function() {
        app.startFeature('profile/viewport', { container: $(document.body), ignoreExists: true });
    },

    showAccountDepartment: function() {
        function _show() {
            var menuFeature;
            app.startFeature('admin/account-department', { ignoreExists: true });
            menuFeature = app.findModule('commons').findFeature('menu');
            menuFeature.activateMenu(location.hash);
        }

        if (app.viewport.module.baseName !== 'admin') {
            this.showHome().done(_show);
            return;
        }

        _show();
    }
});
