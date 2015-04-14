var {mark}  = require('cdeio/mark');
var {json} = require('cdeio/response');
var data = require('system/menu.feature/data');

exports.filters = {
    defaults: {
        '!menuItemFilter': ['children']
    }
};

exports.doWithRouter = function(router) {
    router.get('/all', mark('services', 'system/menu').on(function(service) {
        return json({results: service.list()}, exports.filters.defaults);
    }));

    router.get('/import', mark('services', 'system/menu').on(function(service) {
        return json({results: service.import(data.results)});
    }));
};
