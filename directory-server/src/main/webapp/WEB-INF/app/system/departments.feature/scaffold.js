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
            departmentFilter: ['parent', 'children(1)'],
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

exports.style = 'tree';

exports.entityLabel = '部门';
exports.labels = {
    parent: '上级部门',
    name: '部门名称'
};

exports.fieldGroups = {
    DEFAULT: ['name', 'parent'],
};

exports.tree = {
    isAsync: true,
    root: '所有部门',
	edit: {
        drag: {
            autoExpandTrigger: true
        },
		showRemoveBtn: false,
		showRenameBtn: false
	},
    view: {
        selectedMulti: false,
        showLine: false
    },
	callback: {
    	'onDrop': 'departmentMoved'
    }
};

exports.operators = {
    add: { icon: 'icon-plus', style: 'btn-info', group: 'add' },
    refresh: { icon: 'icon-refresh', group: 'refresh' },
    edit: { icon: 'icon-edit', group: 'action' },
    del: { icon: 'icon-minus', style: 'btn-danger', group: 'action' },
    show: false,
    toggleMove: { icon: 'icon-move', group: 'other' }
};

exports.validators = {
    remove: {
        defaults: mark('services', 'system/departments').on(function (departmentSvc, context, department, request) {
            var isEmpty = departmentSvc.isEmpty(department);
            if (!isEmpty) {
                context.addViolation({ message: '不能删除非空的组织机构或部门' });
            }
        })
    }
};

exports.hooks = {
	afterCreate: {
		add: mark('services', 'system/departments', 'system/jms').on(function (departmentSvc, jmsService, department) {
			department =  departmentSvc.buildPath(department);
			var msg = {resource: 'department', type: 'create', content: department};
			json(msg, exports.filters.defaults).body.forEach(function(str){
				jmsService.sendMsg(str);
			})
		})
	},

	afterUpdate: {
		edit: mark('services', 'system/jms').on(function (jmsService, department) {
			var msg = {resource: 'department', type: 'update', content: department};
			json(msg, exports.filters.defaults).body.forEach(function(str){
				jmsService.sendMsg(str);
			})
		}),
		move: mark('services', 'system/departments', 'system/jms-service').on(function (departmentSvc, jmsService, department) {
			departmentSvc.changeChildrenPath(department);
			var msg = {resource: 'department', type: 'move', content: department};
			json(msg, exports.filters.defaults).body.forEach(function(str){
				jmsService.sendMsg(str);
			})
		})
	},

	afterRemove: {
		defaults: mark('services', 'system/jms').on(function (jmsService, department) {
			var msg = {resource: 'department', type: 'remove',	content: department};
			json(msg, exports.filters.defaults).body.forEach(function(str){
				jmsService.sendMsg(str);
			})
		})
	}
};

exports.doWithRouter = function(router) {
    router.get('/sync/:path', mark('services', 'system/departments').on(function (deptService, request, path) {
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

    router.get('/sub/:id', mark('services', 'system/departments').on(function (deptService, request, id) {
    	var results = deptService.get(id);
        return json(results, exports.filters.sub);
    }));

    router.get('/child/:id', mark('services', 'system/departments').on(function (deptService, request, id) {
    	var results = deptService.get(id);
        return json(results, exports.filters.child);
    }));
};

