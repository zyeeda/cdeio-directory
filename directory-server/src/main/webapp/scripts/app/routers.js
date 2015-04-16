define([
    'underscore'
], function(_) {
    return {
        routes: {
            '': 'showHome',
            'profile': 'showProfile',
            'account-department': 'showAccountDepartment',
            'permissions': 'showPermissions',
            'roles': 'showRoles',
            'feature/*name': 'showMenu'
        },

        showMenu: function(name) {
            this._showFeature(name);
        },

        showHome: function() {
            if (app.settings.currentUser.isAdmin) {
                return app.startFeature('admin/viewport', { container: $(document.body), ignoreExists: true });
            }
            return app.startFeature('main/home', { container: $(document.body), ignoreExists: true });
        },

        showProfile: function() {
            app.startFeature('profile/viewport', { container: $(document.body), ignoreExists: true });
        },

        showAccountDepartment: function() {
            this._showFeature('admin/account-department');
        },

        showPermissions: function() {
            this._showFeature('system/scaffold:permissions');
        },

        showRoles: function() {
            this._showFeature('system/scaffold:roles');
        },

        _showFeature: function(featurePath) {
            var show = _.bind(function() {
                app.startFeature(featurePath, { ignoreExists: true });
                this._activateMenu(location.hash);
            }, this);
            if (app.viewport.module.baseName !== 'admin') {
                this.showHome().done(show);
                return;
            }
            show();
        },

        _activateMenu: function(hash) {
            var menuFeature = app.findModule('commons').findFeature('menu');
            var menuItem = menuFeature.activateMenu(hash);
            if (menuItem) {
                app.viewport.updateNavigator(menuItem);
            }
        }

    };
});
