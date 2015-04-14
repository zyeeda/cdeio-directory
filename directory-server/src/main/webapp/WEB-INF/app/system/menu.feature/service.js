var {mark}  = require('cdeio/mark');
var {cdeio} = require('config');
var _       = require('underscore');

var {MenuItem} = com.zyeeda.cdeio.commons.resource.entity;

exports.createService = function() {
    var asc;

    asc = function (x, y) {
        return x.rank < y.rank ? -1 : 1;
    };

    return {
        list: mark('managers', MenuItem).on(function(mm) {
            var results = mm.findByExample(new MenuItem(), {orderBy: [{'rank': 'asc'}]});
            return results
        }),

        // 执行 import data.js 前，先把ZDA_MENUITEM表数据清空
        import: mark('managers', MenuItem).mark('tx').on(function(mm, datas) {
            for(var i  = 0; i < datas.length; i++) {
                var d = datas[i];
                var mi = new MenuItem();
                var parent = new MenuItem();

                mi.setId(d.id);
                mi.setName(d.name);
                mi.setDescription(d.name);
                mi.setIconClass(d.iconClass);
                mi.setPath(d.path || '#');
                mi.setOpened(d.opened || false);
                mi.setRank(i * 5);
                if(d.parent) {
                    parent.setId(d.parent.id);
                    mi.setParent(parent);
                }
                mm.merge(mi);
            }
            return 'success';
        }),
    };
};
