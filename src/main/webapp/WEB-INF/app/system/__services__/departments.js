
var {mark} 			= require('coala/mark');
var {Department} 	= com.zyeeda.framework.commons.organization.entity;

exports.createService = function () {
	return {
		isEmpty: mark('managers', Department).on(function (deptMgr, department) {
			var deptCount = deptMgr.getSubDepartmentCount({ departmentId: department.getId() }, 1);
			var accountCount = deptMgr.getAccountCount({ departmentId: department.getId() }, 1);
			
			return deptCount === 0 && accountCount === 0
		}),
		genPath: mark('managers', Department).on(function (deptMgr, department) {
			department.path = department.parent ? department.parent.path + ',' +  department.name : department.name;
			return department;
		})
	};
}