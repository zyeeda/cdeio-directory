define(['jquery'], function($){
    return {
        handlers: {
        	sync: function() {
        		var id = window.prompt('请输入需要同步的部门id');
        		if(id == "") {
        			return;
        		}
        		app = this.feature.module.getApplication();
	            $.ajax({
	            	url: 'invoke/scaffold/system/departments/sync/' + id,
	            	type: 'GET',
	            	success: function(e) {
	            		app.success('同步成功！');
	            	}
	            })
                return true;
            }
        }
    }
});
