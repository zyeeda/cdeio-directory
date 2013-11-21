exports.entityLabel = '角色';

exports.labels = {
    id: 'ID',
    name: '名称',
    description: '描述',
    department: '部门',
    permissions: '权限'
};

exports.fieldGroups = {
    defaults: ['name', 'description', 'department', {
        name: 'permissions', type: 'inline-grid', multiple: true
    }]
};

exports.filters = {
    defaults: {
        '!roleFilter': ['permissions'],
        accountFilter: ['password', 'password2'],
        departmentFilter: ['children', 'accounts', 'parent(1)']
    },
    get: {
        '!roleFilter': '',
        '!permissionFilter': 'roles',
        accountFilter: ['password', 'password2'],
        departmentFilter: ['children', 'accounts', 'parent(1)']
    }
};

exports.style = 'grid';
exports.grid = {
    multiple: true,
    columns: [
        { name: 'name' },
        { name: 'description' },
        { name: 'department' }
    ],
    multiple: true
};

exports.picker = {
    grid: {
        columns: ['name', 'description', 'department']
    }
};
