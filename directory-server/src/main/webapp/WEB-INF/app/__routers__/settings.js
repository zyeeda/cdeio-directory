var {json} = require('coala/response');
var {createRouter} = require('coala/router');
var {frontendSettings} = require('coala/config');

var router = exports.router = createRouter();

router.get('/', function(request) {
    var  result = {}, key, item;

    for (key in frontendSettings) {
        result[key] = frontendSettings[key];
    }
    return json(result);
});