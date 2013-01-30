define(['jquery', 'coala/core/loader-plugin-manager'], function($, LoaderManager){
	return {
	    handlers: {
	    	sync: function() {
                app = this.feature.module.getApplication();
	            $.ajax({
	            	url: 'invoke/scaffold/system/accounts/sync',
	            	type: 'GET',
	            	success: function(e) {
	            		app.success('同步成功！');
	            	}
	            })
            },
            departmentChanged: function(feature, view, tree, e, viewName, treeNode) {
            	var me = this,
                grid = me.feature.views['views:grid'].components[0];
            	
                var myfilter = { groupOp: "AND", rules: [] };
                myfilter.rules.push({ field: "department.path", op: "like", data: treeNode.path + '%' });

            	grid.setGridParam({postData: { filters: JSON.stringify(myfilter)}});
            	grid.trigger('reloadGrid');
            }
	    }
	}
});
