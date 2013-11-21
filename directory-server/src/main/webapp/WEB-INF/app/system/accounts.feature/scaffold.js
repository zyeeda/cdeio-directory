var _ = require('underscore');
var logger = require('ringo/logging').getLogger(module.id);
var {SecurityUtils} = org.apache.shiro;

var {json, error, html} = require('coala/response');
var {mark} = require('coala/mark');
var validator = require('coala/validation/validator').createValidator();

var {BCrypt} = com.zyeeda.coala.commons.crypto;
var {Account, Gender} = com.zyeeda.coala.commons.organization.entity;
var {Update} = com.zyeeda.coala.validation.group;

exports.filters = {
    defaults: {
        exclude: {
            accountFilter: ['password', 'password2', 'roles'],
            departmentFilter: ['accounts', 'children', 'parent(1)']
        }
    },
    get: {
        '!accountFilter': ['password', 'password2'],
        '!departmentFilter': ['accounts', 'children', 'parent(1)'],
        '!roleFilter': ['accounts', 'permissions']
    }
};

exports.enableFrontendExtension = true;
exports.haveFilter = true;
exports.style = 'grid';

exports.entityLabel = '账户';
exports.labels = {
    id: 'ID',
    realName: '姓名',
    accountName: '账户名',
    password: '密码',
    password2: '重复密码',
    email: '邮箱',
    mobile: '手机',
    telephone: '电话',
    disabled: '状态',
    oldPassword: '原密码',
    newPassword: '新密码',
    newPassword2: '重复密码',
    department: '部门',
    'department.id': '部门'
};

exports.fieldGroups = {
    baseInfo: ['accountName', 'email'],
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
    roles: [{
        name: 'roles', type: 'inline-grid', colspan: 2, multiple: true
    }],
    editPwdInfo: [
        {name: 'oldPassword', type: 'password', required: true, validations: {rules: {required: true, rangelength:[6, 60]}, messages: {required: '不能为空', rangelength:'个数必须在6和60之间'}}},
        {name: 'newPassword', type: 'password', required: true, validations: {rules: {required: true, rangelength:[6, 60]}, messages: {required: '不能为空', rangelength:'个数必须在6和60之间'}}},
        {name: 'newPassword2', type: 'password', required: true, validations: {rules: {required: true, equalTo: 'newPassword'}, messages: {required: '不能为空', equalTo: '不匹配'}}}
    ],
    filter: [{name :'department.id', type: 'tree-picker', source: '/system/departments'}]
};

exports.feature = {
    views: ['form:changePassword']
};

exports.forms = {
    edit: {
        groups: [{
            name: 'baseInfo',
            columns: 2
        }, {
            name: 'extInfo',
            columns: 2
        }, 'roles']
    },
    show: {
        labelOnTop: false,
        groups: [{
            name: 'baseInfo'
        }, {
            name: 'extInfo'
        }, 'roles']
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
        }, 'roles']
    },
    changePassword: {
        size: 'mini',
        groups: ['editPwdInfo']
    },
    filter: {
        groups: [{
            name: 'filter', columns: 4
        }]
    }
};

exports.grid = {
    columns: [
        { name: 'realName', search: true, sortable: false },
        { name: 'accountName', search: true },
        { name: 'email', search: true },
        { name: 'mobile', search: true, renderer: 'mobileRenderer' },
        { name: 'disabled', type: 'boolean', search: true },
        { name: 'department.name', header: '部门', defaultContent: '', search: true }
    ],
    filterToolbar: true,
    events: {
        'system/departments#tree:onClick': 'departmentChanged'
    }
};

exports.operators = {
    changePassword: { label: '修改密码', icon: 'icon-key', group: '20-selected' }
};

exports.validators = {
    remove: {
        defaults: function (context, account, request) {
            if (account.getAccountName() === SecurityUtils.getSubject().getPrincipal().getAccountName()) {
                context.addViolation({ message: '不能删除当前登录的用户!' });
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
    	defaults: mark('services', 'system/accounts').on(function (accountSvc, entity) {
            accountSvc.hashPassword(entity);
        })
    },

    beforeUpdate: {
        changePassword: mark('services', 'system/accounts').on(function (accountSvc, account, request) {
            accountSvc.hashPassword(account);
        }),

        enable: mark('services', 'system/accounts').on(function (accountSvc, account) {
            accountSvc.enableAccount(account);
        }),

        disable: mark('services', 'system/accounts').on(function (accountSvc, account) {
            accountSvc.disableAccount(account);
        })
    },

    afterCreate: {
    	defaults: mark('services','system/jms').on(function (jmsService, account) {
            var msg = {resource: 'account', type: 'create',	content: account};
            json(msg, exports.filters.defaults).body.forEach(function(str){
                jmsService.sendMsg(str);
            })
        })
    },

    afterUpdate: {
    	defaults: mark('services','system/jms').on(function (jmsService, account) {
            var msg = {resource: 'account', type: 'update',	content: account};
            json(msg, exports.filters.defaults).body.forEach(function(str){
                jmsService.sendMsg(str);
            })
        })
    },

    afterRemove: {
        defaults: mark('services','system/jms').on(function (jmsService, account) {
            var msg = {resource: 'account', type: 'remove',	content: account};
            json(msg, exports.filters.defaults).body.forEach(function(str){
                jmsService.sendMsg(str);
            })
        })
    }
};

exports.doWithRouter = function(router) {
    router.get('/sync/:path', mark('services', 'system/accounts').on(function (accountSvc, request, path) {
        var results;
        if(!path) {
            return html('notfound!');
        }else if(path.indexOf(',') !== -1) {
            results = accountSvc.getAccounts(path, true);
        }else {
            results = accountSvc.getAccounts(path, false);
        }
        return json(results, exports.filters.defaults);
    }));

    router.put('/password', mark('services', 'system/accounts').on(function (accountSvc, request) {
    	var data = request.params;
        return json(accountSvc.changePassword(data), exports.filters.defaults);
    }));
};
