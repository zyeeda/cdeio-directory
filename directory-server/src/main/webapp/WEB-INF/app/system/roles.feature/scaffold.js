exports.entityLabel = '角色';

exports.labels = {
    id: 'ID',
    name: '名称',
    description: '描述',
    department: '部门',
    permissions: '权限'
};

exports.fieldGroups = {
    defaults: ['name', 'description', 'department'],
    inlineGrid: [{
        name: 'permissions', type: 'inline-grid', path: '/system/permissions', refKey: 'roles', allowPick: true, manyToMany: true
    }]
};

exports.forms = {
    defaults: {
        groups: ['defaults']
    },
    edit: {
        groups: ['defaults', 'inlineGrid']
    }
};

exports.filters = {
    defaults: {
        '!roleFilter': ['permissions'],
        accountFilter: ['password', 'password2'],
        departmentFilter: ['children', 'accounts', 'parent(1)']
    }
};

exports.style = 'grid';
exports.grid = {
    columns: [
        { name: 'name' },
        { name: 'description' },
        { name: 'department' }
    ]
};
