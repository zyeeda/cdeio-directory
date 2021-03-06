
var {mark} 			= require('cdeio/mark');
var {Department} 	= com.zyeeda.cdeio.commons.organization.entity;
var {Session, DeliveryMode} = javax.jms;
var {HashMap} = java.util;

exports.createService = function () {
	return {
		isEmpty: mark('managers', Department).on(function (deptMgr, department) {
			var deptCount = deptMgr.getSubDepartmentCount({ departmentId: department.getId() }, 1);
			var accountCount = deptMgr.getAccountCount({ departmentId: department.getId() }, 1);
			
			return deptCount === 0 && accountCount === 0
		}),
		buildPath: mark('managers', Department).mark('tx').on(function (deptMgr, department) {
			department.path = department.parent ? department.parent.path + department.id + ',': department.id + ',';
			deptMgr.merge(department);
			return department;
		}),
		changeChildrenPath: mark('managers', Department).mark('tx').on(function (deptMgr, department) {
			var oldPath = department.path;
			var newPath = department.parent ? department.parent.path + department.id + ',': department.id + ',';
			var children = deptMgr.getAllChildren({likePath: oldPath + '%', path: oldPath});
			department.path = newPath;
			deptMgr.merge(department);
			var i = 0, _len = children.size(), child;
			for(i; i < _len; i++) {
				child = children.get(i);
				child.path = child.path.replace(oldPath, newPath);
				deptMgr.merge(child);
			}
			return department;
		})
	};
}