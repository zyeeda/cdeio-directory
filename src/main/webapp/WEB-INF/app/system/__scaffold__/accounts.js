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
