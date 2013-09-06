exports.entityLabel = '角色';

exports.labels = {
    id: 'ID',
    name: '名称',
    description: '描述',
    department: '部门'
};

exports.fieldGroups = {
    defaults: ['name', 'description', 'department']
};

exports.filters = {
    defaults: {
        '!roleFilter': '',
        '!permissionFilter': '',
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
