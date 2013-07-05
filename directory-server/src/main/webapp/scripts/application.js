define([
    'underscore',
    'coala/applications/default',
    'coala/core/config',
    'coala/vendors/jquery/jquery.slimscroll.min',
    'coala/components/easy-pie',
    'coala/components/sparkline',
    'coala/components/plot'
], function(_, createDefault, config) {

    return function(options) {
        options = _.extend(options, {useDefaultHome: false});
        app = createDefault(options);

        if (app.settings.currentUser.isAdmin) {
            app.startFeature('main/viewport').done(function(feature) {
                app.viewport = feature;

                sidebar = feature.layout.$('sidebar');
                content = feature.layout.$('main-content');
                userProfile = feature.views['header'].$('user-profile');
                app.startFeature('main/menu', {container: sidebar});
                app.startFeature('main/home', {container: content});
                app.startFeature('main/user-profile', {container: userProfile});

                app.done(function() {
                    config.featureContainer = content;
                });

                feature.setHome({name: '首页', featurePath: 'main/home', iconClass: 'icon-home'});
                feature.updateNavigator();
            });
        } else {
            app.startFeature('about').done(function(feature) {
                app.viewport = feature;

                app.done(function() {
                    config.featureContainer = feature.layout.$('content');
                });
            });
        }

        return app;
    }

});

/*
define(['jquery', 'underscore',  'coala/core/config', 'coala/applications/default'], function($, _, config, createDefaultApplication) {
    return function() {

        // 获取一个加载了内置features, 有openDialog方法的app
        // 一般只需要把loadSettings, useDefaultHome设成false就行了
        app = createDefaultApplication({
            loadSettings: false,
            useDefaultHome: false,
        });

        // do with app

        $.get(config.settingsPath, function(data) {
            app.settings = _.extend({}, data);
        })

        return app;
    };
});
*/
