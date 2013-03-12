var {mark} = require('coala/mark');
var {json} = require('coala/response');

exports.enableFrontendExtension = true;
exports.filters = {
    defaults: {
        exclude: {
            departmentFilter: ['children', 'accounts', 'parent(1)']
        }
    },
    sub: {
        exclude: {
            departmentFilter: ['parent', 'children(2)'],
            accountFilter: ['department', 'password', 'password2']
        }
    },
    child: {
        exclude: {
            departmentFilter: ['parent'],
            accountFilter: ['department', 'password', 'password2']
        }
    }
};

exports.enableFrontendExtension = true;
exports.style = 'tree';

exports.labels = {
		entity: '部门',
		parent: '上级部门',
        name: '部门'
};

exports.fieldGroups = {
        DEFAULT: ['parent', 'name'],
};

exports['tree'] = {
    isAsync: false,
	edit: {
		showRemoveBtn: false,
		showRenameBtn: false
	},
	callback: {
    	'onDrop': 'departmentMoved'
    }
};

exports.operators = {
	    add: {icon: "icon-plus"},
	    edit: {icon: "icon-edit"},
	    del: {icon: "icon-minus"},
	    toggleMove: {icon: "icon-move"}
		//add: {label: "添加", icon: "icon-plus"},
		//edit: {label: "编辑", icon: "icon-edit"},
		//del: {label: "删除",icon: "icon-minus"},
		//toggleMove: {label: "开启移动", icon: "icon-move"}
};

exports.validators = {
	remove: {
		defaults: mark('services', 'system:departments').on(function (departmentSvc, context, department, request) {
			var isEmpty = departmentSvc.isEmpty(department);
			if (!isEmpty) {
				context.addViolation({ message: '不能删除非空的组织机构或部门' });
			}
		})
	}
}

exports.hooks = {

	afterCreate: {
		add: mark('services', ['system:departments', 'system:jms-service']).on(function (departmentSvc, jmsService, department) {
			department =  departmentSvc.buildPath(department);
			var msg = {resource: 'department', type: 'create', content: department};
			json(msg, exports.filters.defaults).body.forEach(function(str){
				jmsService.sendMsg(str);
			})
		})
	},
	afterUpdate: {
		edit: mark('services', 'system:jms-service').on(function (jmsService, department) {
			var msg = {resource: 'department', type: 'update', content: department};
			json(msg, exports.filters.defaults).body.forEach(function(str){
				jmsService.sendMsg(str);
			})
		}),
		move: mark('services', ['system:departments', 'system:jms-service']).on(function (departmentSvc, jmsService, department) {
			departmentSvc.changeChildrenPath(department);
			var msg = {resource: 'department', type: 'move', content: department};
			json(msg, exports.filters.defaults).body.forEach(function(str){
				jmsService.sendMsg(str);
			})
		})
	},
	afterRemove: {
		defaults: mark('services', 'system:jms-service').on(function (jmsService, department) {
			var msg = {resource: 'department', type: 'remove',	content: department};
			json(msg, exports.filters.defaults).body.forEach(function(str){
				jmsService.sendMsg(str);
			})
		})
	}
};

exports.doWithRouter = function(router) {
    router.get('/sync/:path', mark('services', 'system:departments').on(function (deptService, request, path) {
    	var results;
    	if(!path) {
    		return html('notfound!');
    	}else if(path.indexOf(',') !== -1) {
    		results = deptService.getDepartments(path, true);
    	}else {
    		results = deptService.getDepartments(path, false);
    	}
        return json(results, exports.filters.defaults);
    }));

    router.get('/sub/:id', mark('services', 'system:departments').on(function (deptService, request, id) {
    	var results = deptService.get(id);
        return json(results, exports.filters.sub);
    }));

    router.get('/child/:id', mark('services', 'system:departments').on(function (deptService, request, id) {
    	var results = deptService.get(id);
        return json(results, exports.filters.child);
    }));

};

