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
            accountFilter: '',
            departmentFilter: ['accounts', 'children', 'parent(1)']
        }
    }
};

exports.enableFrontendExtension = true;
exports.style = 'grid';

exports.labels = {
        id: 'ID',
        familyName: '姓',
        firstName: '名',
        nickname: '昵称',
        username: '用户名',
        password: '密码',
        password2: '重复密码',
        gender: '性别',
        birthday: '生日',
        email: '邮箱',
        mobile: '手机',
        telephone: '电话',
        disabled: '禁用状态',
        oldPassword: '原密码',
        newPassword: '新密码',
        newPassword2: '重复密码',
        department: '部门'
        	
};

exports.fieldGroups = {
		baseInfo: ['familyName', 'firstName', 'nickname', 'email', 'username'],
		pwdInfo: ['password', {name: 'password2'}],
		editPwdInfo: [
		    {name: 'oldPassword', type: 'string', rules: {required: true, rangelength:[6, 60]}, messages: {required: '不能为空', rangelength:'个数必须在6和60之间'}},
		    {name: 'newPassword', type: 'string', rules: {required:true, rangelength:[6, 60]}, messages: {required: '不能为空', rangelength:'个数必须在6和60之间'}},
		    {name: 'newPassword2', type: 'string', rules: {required: true, equalTo: 'newPassword'}, messages: {required: '不能为空', equalTo: '不匹配'}}
		],
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
        ,
        changePwd: {
        	tabs: [
                   {title: '密码信息', groups: ['editPwdInfo']},
               ],
        	groups: ['editPwdInfo']
        }
}


exports['grid'] = {
		colModel: [
           {name: 'familyName', width: 50},
           {name: 'firstName', width: 50},
           {name: 'birthday', type: 'date'},
           'nickname','username', 'email',
           {name: 'disabled', type: 'boolean'},
           {label: '部门', name: 'department.name'}
	    ],
	    height: '400px',
	    events: {
	    	'system/departments#tree:onClick': 'departmentChanged'
	    }
}

exports.operators = {
    add: {label: "添加", icon: "icon-plus"},
    edit: {label: "编辑", icon: "icon-edit"},
    del: {label: "删除",icon: "icon-minus"},
    show: {label: "查看",icon: "icon-eye-open"},
    refresh: {label: "刷新", icon: "icon-refresh"},
    changePassword: {label: "修改密码", icon: "icon-edit"}
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
					context.addViolation({ message: '不正确', properties: 'oldPassword' });
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
			if (account.getUsername() === 'tangrui1') {
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
	},
	
	afterCreate: {
		defaults: mark('services','system:jmsService').on(function (jmsService, account) {
			var msg = jmsService.buildMsg('account', 'create', account);
			json(msg, exports.filters.defaults).body.forEach(function(str){
				jmsService.sendMsg(str);
			})
		})
	},
	afterUpdate: {
		defaults: mark('services','system:jmsService').on(function (jmsService, account) {
			var msg = jmsService.buildMsg('account', 'update', account);
			json(msg, exports.filters.defaults).body.forEach(function(str){
				jmsService.sendMsg(str);
			})
		})
	},
	afterRemove: {
		defaults: mark('services','system:jmsService').on(function (jmsService, account) {
			var msg = jmsService.buildMsg('account', 'remove', account);
			json(msg, exports.filters.defaults).body.forEach(function(str){
				jmsService.sendMsg(str);
			})
		})
	}
};