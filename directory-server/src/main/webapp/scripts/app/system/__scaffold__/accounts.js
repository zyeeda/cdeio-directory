define(['jquery', 'coala/core/loader-plugin-manager', 'coala/scaffold/abstract-view-loader'], function($, LoaderManager, ViewLoader){
	return {
	    handlers: {
	    	add: function() {
    			var me = this,
                grid = me.feature.views['views:grid'].components[0],
                app = me.feature.module.getApplication();
    			var selectNodes = app.findModule('system').findFeature('departments')
    				.views['treeViews:tree'].components[0].getSelectedNodes();
    			me.feature.model.clear();
    			if(selectNodes[0]) {
    				me.feature.model.set('department', selectNodes[0].id);
    			}
                LoaderManager.invoke('view', me.feature.module, me.feature, 'forms:add').done(function(view) {
                    app.showDialog({
                        view: view,
                        title: '增加人员',
                        buttons: [{
                            label: 'OK',
                            fn: function() {
                            	ViewLoader.getFormData(view);
                                view.model.save().done(function(data) {
                                	grid.trigger('reloadGrid');
	                                app.success('操作成功');
                                });
                            }
                        }]
                    })
                });
	    	},
	    	
	    	changePassword: function() {
	            var me = this,
                grid = me.feature.views['views:grid'].components[0],
                selected = grid.getGridParam('selrow'),
                app = me.feature.module.getApplication();
	            if (!selected)
	                return app.info('请选择要操作的记录');
	            me.feature.model.clear();
	            me.feature.model.set('id', selected);
                LoaderManager.invoke('view', me.feature.module, me.feature, 'forms:changePwd').done(function(view){
                    app.showDialog({
                        view: view,
                        title: '修改密码',
                        buttons: [{
                            label: 'OK',
                            fn: function() {
                                var valid = view.$$('form').valid();
                                if (!valid) return false;
                            	var _form = view.$$('form');
                            	var oldPassword = _form.find('input[name="oldPassword"]');
                            	var newPassword1 = _form.find('input[name="newPassword"]');
                            	var newPassword2 = _form.find('input[name="newPassword2"]');
                                view.model.set('id', selected);
                                view.model.set('oldPassword', oldPassword.val());
                                view.model.set('newPassword', newPassword1.val());
                                view.model.set('newPassword2', newPassword2.val());
                            	view.model.set('__formName__', 'changePassword');
                                view.model.save().done(function(data) {
                                    if(data.violations) {
	                                    var msg = '', summary = '', i = 0, j = 0, err = {}, label = {}, labels = view.forms.fields;
	                                    for(i; i < data.violations.length; i++) {
	                                    	err = data.violations[i];
	                                        if(!err.properties) {
	                                            summary += err.message + '\n';
	                                        }
	                                        for(j; j < labels.length; j++) {
	                                        	label = labels[j];
	                                            if(label.name === err.properties) {
	                                                msg += (label.label  + ' ' + err.message + '\n');
	                                            }
	                                        }
	                                    }
	                                    msg += summary;
	                                    app.error(msg, '验证提示');
	                                    return;
                                    }
	                                app.success('操作成功');
                                });
                                return true;
                            }
                        }]
                    }).done(function() {
	                    if(!view.forms.validator) return;
	                        var result = view.forms.validator;
	                        view.$$('form').validate({
	                            rules: view.forms.validator.rules,
	                            messages: view.forms.validator.messages,
	                            highlight: function(label) {
	                                $(label).closest('.control-group').removeClass('success');
	                                $(label).closest('.control-group').addClass('error');
	                            },
	                            success: function(label) {
	                                $(label).text('OK!').addClass('valid').closest('.control-group').removeClass('error');
	                                $(label).text('OK!').addClass('valid').closest('.control-group').addClass('success');
	                            }
	                        });
                    });
                });
            return true;
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