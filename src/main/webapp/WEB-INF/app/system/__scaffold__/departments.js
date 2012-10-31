
var {mark} = require('coala/mark');

exports.filters = {
    defaults: {
        exclude: {
            departmentFilter: ['children', 'accounts', 'parent(1)']
        }
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