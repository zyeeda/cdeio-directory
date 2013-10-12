exports.entityLabel = '权限';

exports.labels = {
    id: 'ID',
    name: '名称',
    value: '值',
    description: '描述'
};

exports.fieldGroups = {
    defaults: ['name', 'value', 'description']
};

exports.filters = {
    defaults: {
        '!permissionFilter': ''
    }
};

exports.style = 'grid';
exports.grid = {
    columns: [
        { name: 'name' },
        { name: 'value' },
        { name: 'description' }
    ]
};