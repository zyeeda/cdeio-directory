define(['coala/applications/default'], function(createDefaultApplication) {
    return function() {

        // 获取一个加载了内置features, 有openDialog方法的app
        // 一般只需要把loadSettings, useDefaultHome设成false就行了
        app = createDefaultApplication({
            loadSettings: false,
            useDefaultHome: false,
        });

        // do with app

        return app;
    };
});