define(['jquery'], function($){
    return {
        handlers: {
        	sync: function(e, treeId, treeNodes, targetNode) {
                if(!targetNode) return;
                var me = this,
                tree = me.feature.views['treeViews:tree'].components[0],
                app = me.feature.module.getApplication();
                console.log(tree);
                return true;
            }
        }
    }
});
