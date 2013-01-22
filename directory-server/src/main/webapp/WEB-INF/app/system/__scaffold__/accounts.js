var _ = require('underscore');
var logger = require('ringo/logging').getLogger(module.id);

var {json, error, html} = require('coala/response');
var {mark} = require('coala/mark');
var validator = require('coala/validation/validator').createValidator();

var {BCrypt} = com.zyeeda.coala.commons.crypto;
var {Account, Gender} = com.zyeeda.coala.commons.organization.entity;
var {Update} = com.zyeeda.coala.validation.group;

exports.filters = {
    defaults: {
        exclude: {
            accountFilter: ['password', 'password2'],
            departmentFilter: ['accounts', 'children', 'parent(1)']
        }
    }
};

exports.enableFrontendExtension = true;
exports.style = 'grid';

exports.labels = {
		entity: '人员',
        id: 'ID',
        realName: '姓名',
        username: '用户名',
        password: '密码',
        password2: '重复密码',
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
		baseInfo: ['realName', 'email', 'username'],
		pwdInfo: [{name: 'password', type: 'password'}, {name: 'password2', type: 'password'}],
		editPwdInfo: [
		    {name: 'oldPassword', type: 'password', rules: {required: true, rangelength:[6, 60]}, messages: {required: '不能为空', rangelength:'个数必须在6和60之间'}},
		    {name: 'newPassword', type: 'password', rules: {required:true, rangelength:[6, 60]}, messages: {required: '不能为空', rangelength:'个数必须在6和60之间'}},
		    {name: 'newPassword2', type: 'password', rules: {required: true, equalTo: 'newPassword'}, messages: {required: '不能为空', equalTo: '不匹配'}}
		],
		departmentInfo: [{name: 'department', minor: 'tree'}],
		others: [
			'mobile', 'telephone',
			{name: 'disabled', type: 'picker', group: 'others',
				pickerSource: [{id: true, text: '禁用'}, {id: false, text: '启用'}]}
		]
};

exports.forms = {
		defaults: {
        	 tabs: [
                {title: '基本信息', groups: ['DEFAULT', 'baseInfo']},
                {title: '其它信息', groups: ['departmentInfo', 'others']}
            ],
            groups: ['baseInfo', 'departmentInfo', 'others']
        },
        add: {
            tabs: [
                {title: '基本信息', groups: ['DEFAULT', 'baseInfo', 'pwdInfo']},
                {title: '其它信息', groups: ['others']}
            ],
            groups: ['baseInfo', 'pwdInfo', 'others']
        },
        addWithDept: {
            tabs: [
                {title: '基本信息', groups: ['DEFAULT', 'baseInfo', 'pwdInfo']},
                {title: '其它信息', groups: ['departmentInfo', 'others']}
            ],
            groups: ['baseInfo', 'pwdInfo', 'departmentInfo', 'others']
        },
        changePassword: {
        	tabs: [
                   {title: '密码信息', groups: ['editPwdInfo']},
               ],
        	groups: ['editPwdInfo']
        }
}


exports['grid'] = {
		colModel: [
		   'realName',
           'username', 'email','mobile',
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
			if (account.getUsername() === 'admin') {
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
		add: mark('services', 'system:accounts').on(function (accountSvc, entity) {
			accountSvc.hashPassword(entity);
		}),
		addWithDept: mark('services', 'system:accounts').on(function (accountSvc, entity) {
			accountSvc.hashPassword(entity);
		})
	},
	
	beforeUpdate: {
		edit: mark('services', 'system:accounts').on(function (accountSvc, account, request) {
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
		add: mark('services','system:jms-service').on(function (jmsService, account) {
			var msg = jmsService.buildMsg('account', 'create', account);
			json(msg, exports.filters.defaults).body.forEach(function(str){
				jmsService.sendMsg(str);
			})
		}), 
		addWithDept: mark('services','system:jms-service').on(function (jmsService, account) {
			var msg = jmsService.buildMsg('account', 'create', account);
			json(msg, exports.filters.defaults).body.forEach(function(str){
				jmsService.sendMsg(str);
			})
		})
	},
	afterUpdate: {
		edit: mark('services','system:jms-service').on(function (jmsService, account) {
			var msg = jmsService.buildMsg('account', 'update', account);
			json(msg, exports.filters.defaults).body.forEach(function(str){
				jmsService.sendMsg(str);
			})
		})
	},
	afterRemove: {
		defaults: mark('services','system:jms-service').on(function (jmsService, account) {
			var msg = jmsService.buildMsg('account', 'remove', account);
			json(msg, exports.filters.defaults).body.forEach(function(str){
				jmsService.sendMsg(str);
			})
		})
	}
};

exports.doWithRouter = function(router) {
    router.get('/sync/:path', mark('services', 'system:accounts').on(function (accountMgr, request, path) {
    	var results;
    	if(!path) {
    		return html('notfound!');
    	}else if(path.indexOf(',') !== -1) {
    		results = accountMgr.getAccounts(path, true);
    	}else {
    		results = accountMgr.getAccounts(path, false);
    	}
        return json(results, exports.filters.defaults);
    }));
};