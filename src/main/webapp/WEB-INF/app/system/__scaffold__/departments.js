var {mark} = require('coala/mark');
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

exports.style = 'tree';

exports.labels = {
        name: '部门'
};

exports.fieldGroups = {
        DEFAULT: ['name']
};

exports['tree'] = {
        callback: {
        	onClick: 'treeNodeClick'
        }
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
	beforeCreate: {
		add: mark('services', 'system:departments').on(function (departmentSvc, department) {
			departmentSvc.genPath(department);
		})
	}
};