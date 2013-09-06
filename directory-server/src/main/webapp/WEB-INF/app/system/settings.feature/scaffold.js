var config = require('coala/config');
var {createService} = require('coala/service');
var {json} = require('coala/response');
var {SettingItem} = com.zyeeda.coala.commons.resource.entity;
var {SecurityUtils} = org.apache.shiro;
var logger = require('ringo/logging').getLogger(module.id);

getSession = function() {
    var subject = SecurityUtils.getSubject()
      , p = subject.getPrincipal(), o
      , service = createService()
      , roles, i, j;

    logger.debug('principal = {}', p);
    if (p == null) {
        return null;
    }

    o = {
        accountName: p.getAccountName(),
        realName: p.getRealName(),
        email: p.getEmail(),
        isAdmin: true,
        roles: [],
        permissions: {},
        authenticated: subject.isAuthenticated()
    };

    roles = service['sso.openid.realm.findRolesByAccountId'](null, { id: p.id });
    for (i = 0; i < roles.size(); i ++) {
        role = roles.get(i);
        o.roles.push(role.name);
        for (j = 0; j < role.permissions.size(); j ++) {
            permission = role.permissions.get(j);
            o.permissions[permission.value] = true;
        }
    }

    return o;
},

exports.filters = {
    defaults: {
        exclude: {
            settingFilter: ''
        }
    }
};

exports.doWithRouter = function(router) {
    router.get('all', function(request) {
        var baseService = createService()
          , manager = baseService.createManager(SettingItem)
          , list = manager.getAll()
          , result = {}, key, item
          , frontendSettings = config.frontendSettings;

        for (key in frontendSettings) {
            result[key] = frontendSettings[key];
        }

        for (key = 0; key < list.size(); key ++) {
            item = list.get(key);
            result[item.name] = item.value;
        }

        if (config.coala.disableAuthc !== true) {
            result.session = getSession();
        }

        return json(result);
    });
};
