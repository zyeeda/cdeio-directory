define(['jquery'], function($) {

    return {
        handlers: {
            changePassword: function() {
                var me = this
                  , grid = me.feature.views['grid:body'].components[0]
                  , selected = grid.getSelected();

                app = me.feature.module.getApplication();
                view = me.feature.views['form:changePassword'];
                view.model.clear();
                app.showDialog({
                    view: view,
                    title: '修改密码',
                    buttons: [{
                        label: '确定',
                        status: 'btn-primary',
                        fn: function() {
                            data = view.getFormData();
                            data.id = selected.id;
                            me.feature.request({
                                url: 'password',
                                type: 'put',
                                data: data,
                                success: function(d) {
                                    //app.success('密码修改成功');
                                }
                            });
                        }
                    }]
                });
                return true;
            },

            departmentChanged: function(feature, view, tree, e, treeId, treeNode) {
                var grid, defaultFilters;

                grid = this.feature.views['grid:body'].components[0];
                defaultFilters = ['like', 'department.path', treeNode.path || '', { mode: 'start' }];
                if (treeNode.isRoot) {
                    grid.removeFilter(defaultFilters);
                } else {
                    grid.addFilter(defaultFilters);
                }
                grid.refresh();
            }
        }
    };
});
