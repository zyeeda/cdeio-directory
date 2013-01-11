var _ = require('underscore');
var logger = require('ringo/logging').getLogger(module.id);

var {json, error, html} = require('coala/response');
var {mark} = require('coala/mark');
var validator = require('coala/validation/validator').createValidator();

var {Account, Gender} = com.zyeeda.framework.commons.organization.entity;

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
    sync: {label: "同步全部用户", icon: "icon-plus"},
    refresh: {label: "刷新", icon: "icon-refresh"},
    show: {label: "查看",icon: "icon-eye-open"}
}

exports.doWithRouter = function(router) {
    router.get('/sync', function(request) {
    	var service = require('sync-service').createService();
        service.syncAllAccounts();
        return html('success');
    });
    
};
