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
    entity: '账户',
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
    baseInfo: ['username', 'email'],
    pwdInfo: [{
        name: 'password',
        type: 'password'
    }, {
        name: 'password2',
        type: 'password'
    }],
    extInfo: ['realName', 'department', 'mobile', 'telephone', {
        name: 'disabled',
        type: 'dropdown',
        source: [{
            id: true,
            text: '禁用'
        }, {
            id: false,
            text: '启用'
        }]
    }],
    editPwdInfo: [
        {name: 'oldPassword', type: 'password', rules: {required: true, rangelength:[6, 60]}, messages: {required: '不能为空', rangelength:'个数必须在6和60之间'}},
        {name: 'newPassword', type: 'password', rules: {required:true, rangelength:[6, 60]}, messages: {required: '不能为空', rangelength:'个数必须在6和60之间'}},
        {name: 'newPassword2', type: 'password', rules: {required: true, equalTo: 'newPassword'}, messages: {required: '不能为空', equalTo: '不匹配'}}
    ]
};

exports.forms = {
    defaults: {
        groups: [{
            name: 'baseInfo',
            columns: 2
        }, {
            name: 'extInfo',
            columns: 2
        }]
    },
    add: {
        groups: [{
            name: 'baseInfo',
            columns: 2
        }, {
            name: 'pwdInfo',
            columns: 2
        }, {
            name: 'extInfo',
            columns: 2
        }]
    },
    addWithDept: {
        groups: [{
            name: 'baseInfo',
            columns: 2
        }, {
            name: 'pwdInfo',
            columns: 2
        }, {
            name: 'extInfo',
            columns: 2
        }]
    },
    changePassword: {
        groups: ['editPwdInfo']
    }
}


exports.grid = {
    colModel: [
        {name: 'realName', search: true},
        {name: 'username', search: true},
        {name: 'email', search: true},
        {name: 'mobile', search: true},
        {name: 'disabled', type: 'boolean', search: true},
        {label: '部门', name: 'department.name', search: true}
    ],
    filterToolbar: true,
    events: {
        'system/departments#tree:onClick': 'departmentChanged'
    }
}

exports.operators = {
    add: {label: '添加', icon: 'icon-plus', group: 'add'},
    refresh: {label: '刷新', icon: 'icon-refresh', group: 'refresh'},
    show: {label: '查看', icon: 'icon-eye-open', group: 'modify'},
    edit: {label: '编辑', icon: 'icon-edit', group: 'modify'},
    changePassword: {label: '修改密码', icon: 'icon-edit', group: 'modify'},
    del: {label: '删除', icon: 'icon-minus', group: 'modify'}
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
            var msg = {resource: 'account', type: 'create',	content: account};
            json(msg, exports.filters.defaults).body.forEach(function(str){
                jmsService.sendMsg(str);
            })
        }),
        addWithDept: mark('services','system:jms-service').on(function (jmsService, account) {
            var msg = {resource: 'account', type: 'create',	content: account};
            json(msg, exports.filters.defaults).body.forEach(function(str){
                jmsService.sendMsg(str);
            })
        })
    },
    afterUpdate: {
        edit: mark('services','system:jms-service').on(function (jmsService, account) {
            var msg = {resource: 'account', type: 'update',	content: account};
            json(msg, exports.filters.defaults).body.forEach(function(str){
                jmsService.sendMsg(str);
            })
        })
    },
    afterRemove: {
        defaults: mark('services','system:jms-service').on(function (jmsService, account) {
            var msg = {resource: 'account', type: 'remove',	content: account};
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
