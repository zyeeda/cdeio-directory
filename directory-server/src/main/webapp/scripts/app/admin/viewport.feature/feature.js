define({
    layout: {
        regions: {
            breadcrumbs: 'breadcrumbs'
        }
    },

    views: [{
        name: 'inline:breadcrumbs', region: 'breadcrumbs', avoidLoadingHandlers: true,
        extend: {
            serializeData: function(su) {
                var data = su.apply(this);
                data || (data = {});
                data.home = this.home;
                data.items = this.items;
                return data;
            }
        }
    }],

    extend: {
        onStart: function(_super, feature) {
            var header, sidebar, content;

            app.viewport = feature;

            header = feature.layout.$('header');
            sidebar = feature.layout.$('sidebar');
            content = feature.layout.$('content');

            app.startFeature('commons/header', { container: header, ignoreExists: true }).done(function (headerFeature) {
                app.startFeature('admin/account-menu', { container: headerFeature.views['inline:inner-header'].$('notification'), ignoreExists: true });
            });
            app.startFeature('commons/menu', { container: sidebar, ignoreExists: true });

            app.config.featureContainer = content;

            feature.setHome({ name: '首页', featurePath: 'admin/home', iconClass: 'icon-home' });
            feature.updateNavigator();
        },

        setHome: function(su, home) {
            this.views['inline:breadcrumbs'].home = home;
        },

        updateNavigator: function(su, menuItem) {
            var v = this.views['inline:breadcrumbs'], m = menuItem;
            v.home.isLast = !menuItem;
            v.items = [];
            while (m) {
                v.items.unshift(m);
                m = m.parent;
            }
            if (v.items.length > 0) {
                v.items[v.items.length -1].isLast = true;
            }
            v.render();
        }
    }
});
