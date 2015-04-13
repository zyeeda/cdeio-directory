define({
	layout: {
		regions: {
			header: 'header',
			content: 'content'
		}
	},
	views: [{
		name: 'inline:header', region: 'header', avoidLoadingHandlers: true
	}, {
		name: 'inline:content', region: 'content',
		model: 'about',
		extend: {
            serializeData: function(_super) {
                var deferred = $.Deferred();
                var m = this.model;
                var data = _super.apply(this);
                m.fetch().done(function() {
                    data.info = m.toJSON();
                    data.info.name='zhangsan';
                    data.info.email='zhangsan@163.com';
                    data.info.mobile='12345678910';
                    data.info.role='lingdao';
                    deferred.resolve(data);
                });
                return deferred.promise();
            }
        },
        events: {
            'click change-password-btn': 'showChangePasswordForm'
        }
	}]
});