define({
    layout: {
        regions: {
            breadcrumbs: 'breadcrumbs'
        }
    },

    views: [{
        name: 'inline:breadcrumbs', region: 'breadcrumbs', avoidLoadingHandlers: true,
        extend: {
            serializeData: function(_super) {
                var data = _super.apply(this);
                data = data || (data = {});
                data.home = this.home;
                data.items = this.items;
                return data;
            }
        }
    }],

    extend: {
        onStart: function(_super) {
            var header, sidebar, content, d1, d2, d = $.Deferred();

            app.viewport = this;

            header = this.layout.$('header');
            sidebar = this.layout.$('sidebar');
            content = this.layout.$('content');

            app.startFeature('commons/header', { container: header, ignoreExists: true }).done(function (headerFeature) {
                d1 = app.startFeature('admin/account-menu', { container: headerFeature.views['inline:inner-header'].$('notification'), ignoreExists: true });
            });
            d2 = app.startFeature('commons/menu', { container: sidebar, ignoreExists: true });

            app.config.featureContainer = content;

            this.setHome({ name: '首页', featurePath: 'admin/home', iconClass: 'icon-home' });
            this.updateNavigator();

            $.when(d1, d2).then(function() {
                d.resolve();
            });

            return d.promise();
        },

        onStop: function(_super) {
            var commonsModule, adminModule;

            commonsModule = app.findModule('commons');
            commonsModule.findFeature('header').stop();
            commonsModule.findFeature('menu').stop();

            adminModule = app.findModule('admin');
            adminModule.findFeature('account-menu').stop();
        },

        setHome: function(_super, home) {
            this.views['inline:breadcrumbs'].home = home;
        },

        updateNavigator: function(_super, menuItem) {
            var v = this.views['inline:breadcrumbs'], menu;
            if (menuItem) {
                menu = menuItem.toJSON();
            }

            v.home.isLast = !menuItem;
            v.items = [];
            while (menu) {
                v.items.unshift(menu);
                menu = menu.parent;
            }
            if (v.items.length > 0) {
                v.items[v.items.length - 1].isLast = true;
            }
            v.render();
        }
    }
});
