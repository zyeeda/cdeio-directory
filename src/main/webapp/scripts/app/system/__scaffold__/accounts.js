define(['jquery', 'zui/coala/loader-plugin-manager'], function($, LoaderManager){
	return {
	    handlers: {
	    	changePassword: function() {
	            var me = this,
                grid = me.feature.views['views:grid'].components[0],
                selected = grid.getGridParam('selrow'),
                app = me.feature.module.getApplication();
	            if (!selected)
	                return app.info('请选择要操作的记录');
	            me.feature.model.set('id', selected);
	            $.when(me.feature.model.fetch()).done(function(){
	                LoaderManager.invoke('view', me.feature.module, me.feature, 'forms:changePwd').done(function(view){
	                    app.showDialog({
	                        view: view,
	                        title: '修改密码',
	                        buttons: [{
	                            label: 'OK',
	                            fn: function(){
//	                                var valid = view.$$('form').valid();
//	                                if (!valid) return false;
	                            	var _form = view.$$('form');
	                            	var oldPassword = _form.find('input[name="oldPassword"]');
	                            	var newPassword1 = _form.find('input[name="newPassword1"]');
	                            	var newPassword2 = _form.find('input[name="newPassword2"]');
	                                view.model.set('id', selected);
	                                
	                            	view.model.set('_formName_', 'changePassword');
//	                                view.model.set('password', newPassword1);
//	                                view.model.set('password2', newPassword2);
	                                view.model.save().done(function(){
	                                	console.log('test!');
	                                });
	                                return true;
	                            }
	                        }]
	                    });
	                });
	            });
	            return true;
            },
            departmentChanged: function(e, id) {
            	var me = this,
                grid = me.feature.views['views:grid'].components[0];
            	
                var myfilter = { groupOp: "AND", rules: [] };
                myfilter.rules.push({ field: "department.id", op: "eq", data: id });

            	grid.setGridParam({postData: { filters: JSON.stringify(myfilter)}});
            	grid.trigger('reloadGrid');
            }
	    }
	}
});
