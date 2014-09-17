var {SecurityUtils} = org.apache.shiro;

var logger = require('ringo/logging').getLogger(module.id);
var {mark} = require('cdeio/mark');

exports.cdeio = {
    entityPackages : [
        'com.zyeeda.cdeio.commons.resource.entity',
        'com.zyeeda.cdeio.commons.organization.entity',
        'com.zyeeda.cdeio.commons.authc.entity',
        'com.zyeeda.directory'
    ],

    orms: [
        'src/main/resources/META-INF/mappings/account-department.orm.xml'
    ],

    disableAuthz: true
};

exports.directoryServer = {
    activemq: {
        disable: true
    }
};

exports.frontendSettings = {
    currentUser: function(context) {
        var subject = SecurityUtils.getSubject();
        var p = subject.getPrincipal();
        logger.debug('principal = {}', p);
        if (p == null) {
            return {};
        }

        return {
            accountName: p.getAccountName(),
            realName: p.getRealName(),
            email: p.getEmail(),
            isAdmin: true
        };
    },

    signOutUrl: mark('beans', 'openIdProvider').on(function(openIdProvider, context) {
        return openIdProvider.getSignOutUrl();
    })
};
