define(['jquery', 'coala/core/loader-plugin-manager'], function($, LoaderManager){
	return {
	    handlers: {
    	
	    	changePassword: function() {
	            var me = this, grid = me.feature.views['views:grid'].components[0],
                selected = grid.getGridParam('selrow'),
                app = me.feature.module.getApplication();
	            if (!selected)
	                return app.info('请选择要操作的记录');
	            me.feature.model.clear();
				me.feature.model.set('id', selected);
                LoaderManager.invoke('view', me.feature.module, me.feature, 'forms:changePassword').done(function(view){
                	me.feature.model.fetch().done(function(d) {
                    	console.log(d, me.feature.model);
                		app.showDialog({
                            view: view,
                            title: '修改密码',
                            buttons: [{
                                label: 'OK',
                                fn: function() {
                                	view.submit();
                                	return true;
                                }
                            }]
                        })
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
