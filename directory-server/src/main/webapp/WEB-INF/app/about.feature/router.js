var {SecurityUtils} = org.apache.shiro;

var {SessionUtil} = com.zyeeda.sso.openid.provider.util;

var logger = require('ringo/logging').getLogger(module.id);
var {json} = require('coala/response');
var {createRouter} = require('coala/router');
var {frontendSettings} = require('coala/config');

var router = exports.router = createRouter();

router.get('/', function(request) {
    var subject, p, result, sites, i, s;
    subject = SecurityUtils.getSubject();
    p = subject.getPrincipal();
    result = {
        accountName: p.getAccountName(),
        realName: p.getRealName(),
        email: p.getEmail(),
        mobile: p.getMobile(),
        telephone: p.getTelephone(),
        department: p.getDepartment() ? p.getDepartment().getName() : null,
        sites: []
    };
    sites = SessionUtil.retrieveSites(subject.getSession());
    logger.debug('Active sites\' count = {}', sites.size());
    for (i = 0; i < sites.size(); i++) {
        s = sites.get(i);
        result.sites.push({
            index: i + 1,
            name: s.name,
            signInTime: s.signInTime,
            indexUrl: s.indexUrl,
            signOutUrl: s.signOutUrl
        });
    }
    return json(result);
});

router.get('/', function(request) {
    var  result = {}, key, item;

    for (key in frontendSettings) {
        result[key] = frontendSettings[key];
    }
    return json(result);
});