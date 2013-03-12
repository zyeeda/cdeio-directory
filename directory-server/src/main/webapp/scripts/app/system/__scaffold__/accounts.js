define(['jquery', 'coala/core/loader-plugin-manager'], function($, LoaderManager){
	return {
	    handlers: {
	    	changePassword: function() {
	            var me = this, grid = me.feature.views['views:grid'].components[0],
                selected = grid.getGridParam('selrow'),
                app = me.feature.module.getApplication();
                app.loadView(me.feature, 'forms:changePassword').done(function(view){
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
                var myfilter = { groupOp: "AND", rules: [] };
                myfilter.rules.push({ field: "department.path", op: "like", data: treeNode.path + '%' });
            	grid.setGridParam({postData: { filters: JSON.stringify(myfilter)}});
            	grid.trigger('reloadGrid');
            }, 
            
            del: function() {
            	if(!window.confirm('确定要删除选中的记录吗?')){
            		return;
            	}
            	var me = this,
                grid = me.feature.views['views:grid'].components[0],
                selected = grid.getGridParam('selarrrow');
            	me.feature.request({
        			url: 'delete',
        			type: 'post',
        			data: {ids: selected},
        			success: function(d) {
                    	grid.trigger('reloadGrid');
        			}
            	});
            }
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
