define(['jquery', 'backbone'], function($, Backbone) {
    return {
        viewSource: function() {
            var scaffold = false,
                source, example;
            if (location.hash) {
                var url = location.hash;
                if (url.indexOf('#feature/') === 0) {
                    url = url.replace('#feature/', '');
                    Backbone.history.navigate('/#code/' + url);
                    source = this.$('view-source');
                    example = this.$('view-example');
                    source.hide();
                    example.show();
                } else if (url.indexOf('#report/') === 0) {
                    url = url.replace('#report/', '');
                    Backbone.history.navigate('/#code/' + url);
                    source = this.$('view-source');
                    example = this.$('view-example');
                    source.hide();
                    example.show();
                }
            }
        },
        viewExample: function() {
            window.history.back();
            var source = this.$('view-source');
            var example = this.$('view-example');
            source.show();
            example.hide();
        }
    };
});
