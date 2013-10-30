define([
    'jquery',
    'coala/core/loader-plugin-manager'
], function($, LoaderManager) {

	return {
	    handlers: {
	    	changePassword: function() {
	            var me = this
                  , grid = me.feature.views['grid:body'].components[0]
                  , selected = grid.getSelected();

                app = me.feature.module.getApplication();
                app.loadView(me.feature, 'form:changePassword').done(function(view) {
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
                    })
                });
                return true;
            },

            departmentChanged: function(feature, view, tree, e, treeId, treeNode) {
            	var me = this
                  , defaultFilters;

                grid = me.feature.views['grid:body'].components[0];
            	me.feature.model.set('department', treeNode);
                defaultFilters = ['like', 'department.path', treeNode.path || '', { mode: 'start' }];
                grid.addFilter(defaultFilters);
                grid.refresh();
            }
	    }
	}
});
