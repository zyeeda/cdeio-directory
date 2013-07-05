define({
    layout: {
        regions: {
            header: 'header',
            content: 'content'
        }
    },
    views: [{
        name: 'inline:header',
        region: 'header',
        avoidLoadingHandlers: true
    }, {
        name: 'inline:content',
        region: 'content',
        avoidLoadingHandlers: true,
        model: 'about',
        extend: {
            serializeData: function(_super) {
                var deferred = $.Deferred();
                var m = this.model;
                var data = _super.apply(this);
                m.fetch().done(function() {
                    data.info = m.toJSON();
                    deferred.resolve(data);
                });
                return deferred.promise();
            }
        }
    }]
});
