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
                app.loadView(me.feature, 'form:changePassword').done(function(view){
                	view.model.clear();
            		app.showDialog({
                        view: view,
                        title: '修改密码',
                        buttons: [{
                            label: '确定',
                            fn: function() {
                            	view.getFormData();
                            	view.model.set('id', selected);
                            	me.feature.request({
                        			url: 'password',
                        			type: 'put',
                        			data: view.model.toJSON(),
                        			success: function(d) {
                                    	return true;
                        			}
                            	});
                            }
                        }]
                    })
                });
                return true;
            },

            departmentChanged: function(feature, view, tree, e, viewName, treeNode) {
            	var me = this,
                grid = me.feature.views['views:grid'].components[0];
            	me.feature.model.set('department', treeNode);
            	var defaultFilters = [{name: "department.path",operator: "like", value: treeNode.path + "%"}];
            	grid.setGridParam({postData: { defaultFilters: defaultFilters}});
            	grid.trigger('reloadGrid');
            },

            /*del: function() {
                var me = this;

                app.confirm('确定要删除选中的记录吗?', function() {
                    var grid = me.feature.views['grid:body'].components[0]
                      , selected = grid.getSelected();

                    me.feature.request({
                        url: 'delete',
                        type: 'post',
                        data: { ids: selected },
                        success: function(d) {
                            grid.refresh();
                        }
                    });
                });
            }*/
	    },

	    initOperatorsVisibility: function(operators) {
	        var o, _i, _len, _results;
	        _results = [];
	        for (_i = 0, _len = operators.length; _i < _len; _i++) {
	          o = operators[_i];
	          if (['edit', 'del', 'show', 'changePassword'].indexOf(o.id) !== -1) {
	            _results.push(this.$(o.id).hide());
	          }
	        }
	        return _results;
	     },

	    ensureOperatorsVisibility: function(operators, id) {
	        var o, _i, _len, _results;
	        _results = [];
	        for (_i = 0, _len = operators.length; _i < _len; _i++) {
	          o = operators[_i];
	          if (['edit', 'del', 'show', 'changePassword'].indexOf(o.id) !== -1) {
	            _results.push(id ? this.$(o.id).show() : this.$(o.id).hide());
	          }
	        }
	        return _results;
	    }
	}
});
