
var {mark} = require('coala/mark');

exports.filters = {
    defaults: {
        exclude: {
        	departmentFilter: ['children', 'accounts']
//            departmentFilter: ['children', 'accounts', 'parent(1)']
        }
    }
};

exports.picker = {
    grid: {
        colModel: [
            {name:'name',label: '部门', width: 500}
        ]
    }
};

exports.style = 'grid';

exports.labels = {
        name: '部门'
};

exports.fieldGroups = {
        DEFAULT: ['name']
};

exports['grid'] = {
        colModel: [
                  {name:'name', label: '部门'}
        ],
		height: 350,
		width: 100
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