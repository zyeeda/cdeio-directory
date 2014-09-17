var {mark} = require('cdeio/mark');
var {Department} = com.zyeeda.cdeio.commons.organization.entity;
var PATH_DELIMITER = '/';

function buildPath(department) {
    var path;
    if (department.parent) {
        path = department.parent.path + department.id + PATH_DELIMITER;
    } else {
        path = PATH_DELIMITER + department.id + PATH_DELIMITER;
    }
    return path;
}

exports.createService = function () {
	return {
		isEmpty: mark('managers', Department).on(function (deptMgr, department) {
			var deptCount = deptMgr.getSubDepartmentCount({ departmentId: department.getId() }, 1);
			var accountCount = deptMgr.getAccountCount({ departmentId: department.getId() }, 1);

			return deptCount === 0 && accountCount === 0;
		}),

        buildPath: mark('managers', Department).mark('tx').on(function (deptMgr, department) {
            department.path = buildPath(department);
        }),

		changeChildrenPath: mark('managers', Department).mark('tx').on(function (deptMgr, department) {
			var oldPath = department.path;
            var newPath = buildPath(department);
			var children = deptMgr.getChildDepartments({ likePath: oldPath + '%', path: oldPath });
			department.path = newPath;
			var i = 0, _len = children.size(), child;
			for (i; i < _len; i++) {
				child = children.get(i);
				child.path = child.path.replace(oldPath, newPath);
			}
			return department;
		}),

		getDepartments: mark('managers', Department).mark('tx').on(function (deptMgr, path, isSyncTree) {
			if (isSyncTree) {
				return deptMgr.getChildrenDepartments({ likePath: path + '%', path: path });
			} else {
				return deptMgr.getSubDepartments({ parentId: path });
			}
		}),

		get: mark('managers', Department).mark('tx').on(function (deptMgr, id) {
			return deptMgr.find(id);
		})
	};
}
