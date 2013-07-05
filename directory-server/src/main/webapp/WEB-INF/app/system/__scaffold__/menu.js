exports.style = 'tree';

exports.filters = {
    defaults: {
        exclude: {
            menuItemFilter: ['parent(1)']
        }
    }
};

exports.labels = {
    name: '名称',
    description: '描述',
    featurePath: '标识',
    iconClass: '图标',
    option: '配置'
}

exports.fieldGroups = {
    DEFAULT: [
        'name',
        'description',
        'featurePath',
        'iconClass', {
            name: 'option',
            type: 'textarea',
            rowspan: 5
        }
    ]
}
