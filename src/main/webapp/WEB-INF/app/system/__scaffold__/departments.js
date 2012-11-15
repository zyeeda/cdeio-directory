var {mark} = require('coala/mark');
var {json} = require('coala/response');

exports.enableFrontendExtension = true;
exports.filters = {
    defaults: {
        exclude: {
            departmentFilter: ['children', 'accounts', 'parent(1)']
        }
    }
};

exports.picker = {
	grid: {
        colModel: [
            {name: 'name', label: '部门', width: 500}
        ]
    }
};

exports.enableFrontendExtension = true;
exports.style = 'tree';

exports.labels = {
        name: '部门'
};

exports.fieldGroups = {
        DEFAULT: ['name']
};

exports['tree'] = {
	edit: {
		enable: true,
		showRemoveBtn: false,
		showRenameBtn: false
	},
	callback: {
    	'onDrop': 'departmentMoved'
    }
};

exports.operators = {
	    add: {label: "添加", icon: "icon-plus"},
	    edit: {label: "编辑", icon: "icon-edit"},
	    del: {label: "删除",icon: "icon-minus"},
	    toggleMove: {label: "开启移动", icon: "icon-move"}
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
		defaults: mark('services', ['system:departments', 'system:jmsService']).on(function (departmentSvc, jmsService, department) {
			department =  departmentSvc.buildPath(department);
			var msg = jmsService.buildMsg('department', 'create', department);
			json(msg, exports.filters.defaults).body.forEach(function(str){
				jmsService.sendMsg(str);
			})
		})
	},
	afterUpdate: {
		defaults: mark('services', 'system:jmsService').on(function (jmsService, department) {
			var msg = jmsService.buildMsg('department', 'update', department);
			json(msg, exports.filters.defaults).body.forEach(function(str){
				jmsService.sendMsg(str);
			})
		}),
		move: mark('services', ['system:departments', 'system:jmsService']).on(function (departmentSvc, jmsService, department) {
			departmentSvc.changeChildrenPath(department);
			var msg = jmsService.buildMsg('department', 'move', department);
			json(msg, exports.filters.defaults).body.forEach(function(str){
				jmsService.sendMsg(str);
			})
		})
	},
	afterRemove: {
		defaults: mark('services', 'system:jmsService').on(function (jmsService, department) {
			var msg = jmsService.buildMsg('department', 'remove', department);
			json(msg, exports.filters.defaults).body.forEach(function(str){
				jmsService.sendMsg(str);
			})
		})
	}
};