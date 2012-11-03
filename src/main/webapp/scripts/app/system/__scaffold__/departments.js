define({
	handlers: {
        treeNodeClick: function(e, id, treeNode) {
        	var view = this.feature.module.findFeature('accounts').views['views:grid'];
        	view.$el.trigger('departmentChanged', treeNode.id);
        }
	}
});