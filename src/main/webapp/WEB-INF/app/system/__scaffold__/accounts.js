var _ = require('underscore');
var logger = require('ringo/logging').getLogger(module.id);

var {json, error, html} = require('coala/response');
var {mark} = require('coala/mark');
var validator = require('coala/validation/validator').createValidator();

var {BCrypt} = com.zyeeda.framework.commons.crypto;
var {Account, Gender} = com.zyeeda.framework.commons.organization.entity;
var {Update} = com.zyeeda.framework.validation.group;

exports.filters = {
    defaults: {
        exclude: {
            accountFilter: ['password', 'password2'],
            departmentFilter: ['accounts', 'children', 'parent']
        }
    }
};

exports.style = 'grid';

exports.labels = {
        id: 'ID',
        familyName: '姓',
        firstName: '名',
        nickname: '昵称',
        username: '用户名',
        password: '密码',
        password2: '重复密码',
        department: '部门',
        gender: '性别',
        birthday: '生日',
        email: '邮箱',
        mobile: '手机',
        telephone: '电话',
        disabled: '禁用状态'
};

exports.fieldGroups = {
		baseInfo: ['familyName', 'firstName', 'nickname', 'email', 'username'],
		pwdInfo: ['password', {name: 'password2'}],
		others: [
			'department',
			{name: 'gender', type: 'picker', group: 'others',
				pickerSource: [{id: 'MALE', text: '男'}, {id: 'FEMALE', text: '女'}]},
			'birthday', 'mobile', 'telephone',
			{name: 'disabled', type: 'picker', group: 'others',
				pickerSource: [{id: true, text: '禁用'}, {id: false, text: '启用'}]}
		]
};

exports.forms = {
        defaults: {
            tabs: [
                {title: '基本信息', groups: ['DEFAULT', 'baseInfo', 'pwdInfo']},
                {title: '其它信息', groups: ['others']}
            ],
            groups: ['baseInfo', 'pwdInfo', 'others']
        },
        edit: {
        	 tabs: [
                {title: '基本信息', groups: ['DEFAULT', 'baseInfo']},
                {title: '其它信息', groups: ['others']}
            ],
            groups: ['baseInfo', 'others']
        }
//        ,
//        changePwd: {
//        	tabs: [
//                   {title: '密码信息', groups: ['pwdInfo']},
//               ],
//        	groups: ['pwdInfo']
//        }
}


exports['grid'] = {
		colModel: [
           {label: '姓', name: 'familyName'},
           {label: '名', name: 'firstName'},
           {label: '生日', name: 'birthday', type: 'date'},
           {label: '昵称', name: 'nickname'},
           {label: '用户名', name: 'username'},
           {label: '邮箱', name: 'email'},
           {label: '禁用状态', name: 'disabled', type: 'boolean'},
           {label: '部门', name: 'department.name'}
	    ],
	    height: '350px'
}

// listBySql
//exports['grid'] = {
//	colModel: [
//	    // {label: 'id', name: 'id', alias: 'f_id', position: 0},
//	   {label: '姓', name: 'familyName',alias: 'F_FAMILY_NAME',  position: 1},
//	   {label: '名', name: 'firstName', alias: 'F_FIRST_NAME', position: 2},
//	   {label: '昵称', name: 'nickname',alias: 'F_NICKNAME', position: 3},
//	   {label: '用户名', name: 'username',alias: 'F_USERNAME', position: 4},
//	   {label: '邮箱', name: 'email',alias: 'F_EMAIL', position: 5},
//	   {label: '禁用状态', name: 'disabled', alias: 'F_DISABLED', type: 'boolean', position: 6}
////	   {label: '部门', name: 'department.name', position: 7}
//	],
//	height: '350px'
//	// resultClass: 'com.zyeeda.framework.commons.organization.entity.Account'
//}

exports.operators = {
	    "add": {
	        "label": "添加",
	        "icon": "icon-plus"
	    },
	    "edit": {
	        "label": "编辑",
	        "icon": "icon-edit"
	    },
	    "del": {
	        "label": "删除",
	        "icon": "icon-minus"
	    },
	    "show": {
	        "label": "查看",
	        "icon": "icon-eye-open"
	    },
	    "changePwd": {
	        "label": "修改密码",
	        "icon": "icon-edit"
	    }
	}

exports.converters = {
	'com.zyeeda.framework.commons.organization.entity.Gender': function (value, fieldMeta) {
		return Gender.valueOf(value);
	}
};

exports.validators = {
	update: {
		changePassword: function (context, account, request) {
			try {
				if (!BCrypt.checkpw(request.params.oldPassword, account.getPassword())) {
					context.addViolation({ message: '旧密码不正确', properties: 'oldPassword' });
				}
			} catch (e) {
				context.addViolation({ message: '原密码哈希有误' });
			}
			
			if (context.hasViolations()) {
				context.skipBeanValidation();
				return;
			}
			
			account.setPassword(request.params.newPassword);
			account.setPassword2(request.params.newPassword2);
		}
	},
	
	remove: {
		defaults: function (context, account, request) {
			if (account.getUsername() === 'tangrui') {
				context.addViolation({ message: '不能删除' + account.getUsername() + '用户'});
			}
		}
	},
	
	batchRemove: {
		defaults: function (context, accounts, request) {
			if (accounts.length > 2) {
				context.addViolation({ message: '不能同时删除两条以上的数据' });
			}
		}
	}
};

exports.hooks = {
	beforeCreate: {
		defaults: mark('services', 'system:accounts').on(function (accountSvc, entity) {
			accountSvc.hashPassword(entity);
		})
	},
	
	beforeUpdate: {
		defaults: mark('services', 'system:accounts').on(function (accountSvc, account, request) {
			accountSvc.hashPassword(account);
		}),
		
		changePassword: mark('services', 'system:accounts').on(function (accountSvc, account, request) {
			accountSvc.hashPassword(account);
		}),
		
		enable: mark('services', 'system:accounts').on(function (accountSvc, account) {
			accountSvc.enableAccount(account);
		}),
		
		disable: mark('services', 'system:accounts').on(function (accountSvc, account) {
			accountSvc.disableAccount(account);
		})
	}
};

/*
exports.picker = {
    grid: {
        height: 300,
        colModel: [
            {label: 'ID', index: 'id', name: 'id'},
            {label: '名称', index: 'name', name: 'name'},
            {label: '描述', index: 'description', name: 'description'}
        ]
    }
};

exports.doWithRouter = function(router) {
    router.get('/roles', mark('services', 'system:account-service').on(function(service, request){
        var {id} = request.params, results;

        if (!id) {
            return json(false);
        }
        results = service.findRolesByAccountId(id);
        
        return json({results: results}, {
            exclude: {
                roleFilter: 'accounts'
            }
        });

    }));
};
*/
