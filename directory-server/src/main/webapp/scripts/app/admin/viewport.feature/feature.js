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
        onStart: function(_super) {
            console.log('viewport.feature.onStart');
            var header, sidebar, content, d1, d2, d = $.Deferred();

            app.viewport = this;

            header = this.layout.$('header');
            sidebar = this.layout.$('sidebar');
            content = this.layout.$('content');

            console.log(app.getPromises().length);
            app.startFeature('commons/header', { container: header, ignoreExists: true }).done(function (headerFeature) {
                d1 = app.startFeature('admin/account-menu', { container: headerFeature.views['inline:inner-header'].$('notification'), ignoreExists: true });
            });
            console.log('b');
            d2 = app.startFeature('commons/menu', { container: sidebar, ignoreExists: true });

            app.config.featureContainer = content;

            console.log(app.getPromises().length);

            this.setHome({ name: '首页', featurePath: 'admin/home', iconClass: 'icon-home' });
            this.updateNavigator();

            $.when(d1, d2).then(function() {
                console.log('c');
                d.resolve();
            });

            return d.promise();
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
