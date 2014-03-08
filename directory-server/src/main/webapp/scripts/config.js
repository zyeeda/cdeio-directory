define({
	settingsPath: 'invoke/settings',

	urlPrefix: function(app, path) {
        if ('/about' == path) {
            return '/invoke/about';
        }

        return 'invoke/scaffold/' + path;
	},

    disableAuthz: true
});
