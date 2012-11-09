
var {mark} 			= require('coala/mark');
var {Department} 	= com.zyeeda.framework.commons.organization.entity;

exports.createService = function () {
	return {
		isEmpty: mark('managers', Department).on(function (deptMgr, department) {
			var deptCount = deptMgr.getSubDepartmentCount({ departmentId: department.getId() }, 1);
			var accountCount = deptMgr.getAccountCount({ departmentId: department.getId() }, 1);
			
			return deptCount === 0 && accountCount === 0
		}),
//		genCode: mark('managers', Department).on(function (deptMgr, department) {
//			if(department.parent === null) {
//				department.code = '0000';
//				department.pathCode = '0000';
//			}else {
//				children = department.parent.children;
//				if(children.size() === 0) {
//					department.code = '0000';
//				}else {
//					var _code = '';
//					for(var i = 0; i < 4 - (children.size() + '').length; i++) {
//						_code += '0';
//					}
//					department.code = _code + children.size();
//				}
//				department.pathCode = department.parent.code + department.code;
//			}
//			return department;
//		}),
		genPath: mark('managers', Department).on(function (deptMgr, department) {
			var codeLen = 4, i = 0, _max, _code = 0, _path = '';
			_max = deptMgr.getDepartmentMaxCode().get(0);
			_code =  _max !== null ? _max + 1 : 0;
			department.code = _code;
			for(i; i < codeLen - (_code + '').length; i++) {
				_path += '0';
			}
			_path = _path + _code;
			department.path = department.parent ? department.parent.path + _path : _path;
			return department;
		})
	};
}