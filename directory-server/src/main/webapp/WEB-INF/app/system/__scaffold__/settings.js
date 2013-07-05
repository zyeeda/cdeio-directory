var {frontendSettings} = require('coala/config');
var {createService} = require('coala/service');
var {json} = require('coala/response');
var {SettingItem} = com.zyeeda.coala.commons.resource.entity;

exports.filters = {
    defaults: {
        exclude: {
            settingFilter: ''
        }
    }
};

exports.doWithRouter = function(router) {
    router.get('all', function(request) {
        var baseService = createService(),
            manager = baseService.createManager(SettingItem),
            list = manager.getAll(),
            result = {}, key, item;

        for (key in frontendSettings) {
            result[key] = frontendSettings[key];
        }

        for (key = 0; key < list.size(); key ++) {
            item = list.get(key);
            result[item.name] = item.value
        }
        return json(result);
    });
};
