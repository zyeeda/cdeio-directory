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
                    me.feature.model.set('_formName_', 'move');
                    me.feature.model.set('parent', targetNode.id);
                    me.feature.model.save().done(function(data) {
                        app.success('操作成功');
                    });
                });
                return true;
            },
            toggleMove: function() {
                console.log(this);
                var me = this,
                tree = me.feature.views['treeViews:tree'].components[0],
                app = me.feature.module.getApplication();
                console.log(tree);
                return true;
            }
        }
    }
});
