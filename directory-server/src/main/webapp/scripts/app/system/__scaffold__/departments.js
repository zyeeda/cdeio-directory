define(['jquery'], function($){
    return {
        handlers: {
            departmentMoved: function(e, treeId, treeNodes, targetNode) {
                if(!targetNode) return;
                var me = this,
                tree = me.feature.views['treeViews:tree'].components[0],
                app = me.feature.module.getApplication();
                me.feature.model.set('id', treeNodes[0].id);
                $.when(me.feature.model.fetch()).done(function(){
                    me.feature.model.set('__formName__', 'move');
                    me.feature.model.set('parent', targetNode.id);
                    me.feature.model.save().done(function(data) {
                        app.success('操作成功');
                    });
                });
                return true;
            },
            toggleMove: function(e) {
                var me = this,
                tree = me.feature.views['treeViews:tree'].components[0],
                app = me.feature.module.getApplication();
                var $ele = $(e.currentTarget);
                if(tree.setting.edit.enable) {
                	 tree.setting.edit.enable = false;
                     $ele.toggleClass('btn-danger');
                }else {
                	 tree.setting.edit.enable = true;
                     $ele.toggleClass('btn-danger');
                }
                return true;
            }
        }
    }
});
