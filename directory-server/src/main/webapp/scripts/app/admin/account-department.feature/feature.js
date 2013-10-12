define({
    layout: {
        components: [{
            type: 'layout',
            defaults: {
                spacing_open: 0,
                hideTogglerOnSlide: true
            },
            west: {
                size: 260,
                minSize: 260,
                spacing_open: 5
            },
            center: {
                findNestedContent: true
            }
        }],

        regions: {
            deptTree: 'dept-tree',
            accountList: 'account-list'
        }
    },

    views: [{
        name: 'inline:dept-tree',
        region: 'deptTree',
        avoidLoadingHandlers: true
    }, {
        name: 'inline:account-list',
        region: 'accountList',
        avoidLoadingHandlers: true
    }],

    /*container: function(feature) {
        var layoutContainer = $('<div class="ace-fill"></div>');
        $(window).on('resize', function() {
            $.layout.callbacks.resizeLayout(layoutContainer);
        });
        layoutContainer.appendTo(app.config.featureContainer);
        return layoutContainer;
    },*/

    extend: {
        onStart: function(_super) {
            this.departmentDeferred = app.startFeature('system/scaffold:departments', { container: this.views['inline:dept-tree'].$el, ignoreExists: true });
            this.accountDeferred = app.startFeature('system/scaffold:accounts', { container: this.views['inline:account-list'].$el, ignoreExists: true });
        },

        onStop: function() {
            var systemModule;

            systemModule = app.findModule('system');
            systemModule.findFeature('scaffold:departments').stop();
            systemModule.findFeature('scaffold:accounts').stop();
        }
    }
});
