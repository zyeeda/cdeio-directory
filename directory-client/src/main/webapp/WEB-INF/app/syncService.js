var {mark} = require('coala/mark');
var {sync} = require('config');
var {String} = java.lang;
var {Session, TextMessage, MessageListener} = javax.jms;
var {Department, Account} = com.zyeeda.framework.commons.organization.entity;
var {ObjectMapper} = com.fasterxml.jackson.databind;
var {FileCopyUtils} = org.springframework.util;
var {TypeReference} = com.fasterxml.jackson.core.type;
var {List} = java.util;
var {URL} = java.net;

exports.createService = function () {
	service = {
		revMsg: mark('beans', 'connectionFactory').on(function (connectionFactory) {
			var connection, session, topic, comsumer;
			connection = connectionFactory.createConnection();
		    session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
		    topic = session.createTopic("directory.messages");
	        connection.start();
		    comsumer = session.createConsumer(topic);
		    comsumer.setMessageListener(
		        function onMessage(m) {
		        	service.handle(m);
		        }
		    );
		}),
		
		handle: function(m) {
			if(m && m.text) {
	            var obj = JSON.parse(m.text);
	            var mapper = new ObjectMapper();
                var str = new String(JSON.stringify(obj.content));
	            if('department' === obj.resource) {
	                var dept = mapper.readValue(str, Department);
	                if('create' === obj.type) {
	                	service.updateDept(dept);
	                }else if('update' === obj.type) {
	                	service.updateDept(dept);
	                }else if('remove' === obj.type) {
	                	service.removeDept(dept);
	                }else if('move' === obj.type) {
	                	service.moveDept(dept);
	                }
	            }else if('account' === obj.resource) {
	                var account = mapper.readValue(str, Account);
	                if('create' === obj.type) {
	                	service.updateAccount(account);
	                }else if('update' === obj.type) {
	                	service.updateAccount(account);
	                }else if('remove' === obj.type) {
	                	service.removeAccount(account);
	                }
	            }
            }
		},
		
		createDept: mark('managers', Department).mark('tx').on(function (deptMgr, dept) {
			deptMgr.save(dept);
		}),
		
		updateDept: mark('managers', Department).mark('tx').on(function (deptMgr, dept) {
			deptMgr.merge(dept);
		}),
		
		removeDept: mark('managers', Department).mark('tx').on(function (deptMgr, dept) {
			deptMgr.removeById(dept.id);
		}),
		
		moveDept: mark('managers', Department).mark('tx').on(function (deptMgr, dept) {
			changeChildrenPath(dept);
		}),
		
		removeAllDepts: mark('managers', Department).mark('tx').on(function (deptMgr) {
			deptMgr.removeAllDepartments(null, true);
		}),
		
		removeSubDepts: mark('managers', Department).mark('tx').on(function (deptMgr, parentId) {
			deptMgr.removeSubDepartments({parentId: parentId}, true);
		}),
		
		removeChildrenDepts: mark('managers', Department).mark('tx').on(function (deptMgr, path) {
			deptMgr.removeChildrenDepartments({likePath: path + '%', path: path}, true);
		}),

        createAccount: mark('managers', Account).mark('tx').on(function (accountMgr, account) {
        	accountMgr.save(account);
		}),
		
		updateAccount: mark('managers', Account).mark('tx').on(function (accountMgr, account) {
			accountMgr.merge(account);
		}),
		
		removeAccount: mark('managers', Account).mark('tx').on(function (accountMgr, account) {
			accountMgr.removeById(account.id);
		}),
		
		removeAllAccounts: mark('managers', Account).mark('tx').on(function (accountMgr) {
			accountMgr.removeAllAccounts(null, true);
		}),
		
		removeSubAccounts: mark('managers', Account).mark('tx').on(function (accountMgr, parentId) {
			accountMgr.removeSubAccounts({parentId: parentId}, true);
		}),
		
		removeChildrenAccounts: mark('managers', Account).mark('tx').on(function (accountMgr, path) {
			accountMgr.removeChildrenAccounts({likePath: path + '%'}, true);
		}),
		
		syncAllDepts: function () {
			service.removeAllDepts();
			var uri = sync.serviceUri + '/invoke/scaffold/system/departments';
			service.requestAndSaveItems(uri, 'dept', true);
        },
        
		syncAllAccounts: function () {
			service.removeAllAccounts();
			var uri = sync.serviceUri + '/invoke/scaffold/system/accounts';
			service.requestAndSaveItems(uri, 'account', true);
        },
		
		syncSome: function (path, isSyncTree, isSyncAccount) {
			if(isSyncTree) {
				service.removeChildrenDepts(path);
				var deptUri = sync.serviceUri + '/invoke/scaffold/system/departments/sync/' + path;
				service.requestAndSaveItems(deptUri, 'dept', false);
				if(isSyncAccount) {
					service.removeChildrenAccounts(path);
					var accountUri = sync.serviceUri + '/invoke/scaffold/system/accounts/sync/' + path;
					service.requestAndSaveItems(accountUri, 'account', false);
				}
			}else {
				service.removeSubDepts(path);
				var deptUri = sync.serviceUri + '/invoke/scaffold/system/departments/sync/' + path;
				service.requestAndSaveItems(deptUri, 'dept', false);
				if(isSyncAccount) {
					service.removeSubAccounts(path);
					var accountUri = sync.serviceUri + '/invoke/scaffold/system/accounts/sync/' + path;
					service.requestAndSaveItems(accountUri, 'account', false);
				}
			}
        },
        
        sync: function(id) {
        	try {
        		service.removeDept({id: id});
        	}catch(e) {
        		print('not entity!');
        	}
        	var uri = sync.serviceUri + '/invoke/scaffold/system/departments/child/' + id;
        	service.requestAndRecursion(uri);
        },
        
        requestAndRecursion: function (uri) {
        	var conn, url, inStream, data, result, obj, mapper, dept;
        	try {
                url = new URL(uri);
                conn = url.openConnection();
                conn.setRequestMethod('GET');
                inStream = conn.getInputStream();    
                data = FileCopyUtils.copyToByteArray(inStream);
                result = new String(data, "UTF-8");
                obj = JSON.parse(result);
                mapper = new ObjectMapper();
                dept = mapper.readValue(JSON.stringify(obj), Department);
                service.recursion(dept);
        	} catch (error) {
        		return 'error';
        	} finally {
                if (conn != null) {
                  conn.disconnect();
                }
        	}
        },
        
        recursion: function(dept, parent) {
        	if(parent) {
        		dept.setParent(parent);
        	}else {
        		 var str = dept.path.replace(dept.id + ',', '');
        		 var temp, parentId;
        		 if(str.length > 0) {
            		 temp = str.substr(0, str.length -1);
            		 parentId = temp.substr(temp.lastIndexOf(',') + 1, temp.length);
        		 }
        		 if(parentId) {
        			 var newParent = new Department();
        			 newParent.setId(parentId);
        			 dept.setParent(newParent);
        		 }
        	}
        	service.updateDept(dept);
        	if(dept.accounts && dept.accounts.size() > 0) {
	        	for(var i = 0; i < dept.accounts.size(); i++) {
	        		var account = dept.accounts.get(i);
	        		account.setDepartment(dept);
	        		service.updateAccount(account);
	        	}
        	}
        	if(dept.children && dept.children.size() > 0) {
	        	for(var i = 0; i < dept.children.size(); i++) {
	        		service.recursion(dept.children.get(i), dept);
	        	}
        	}
        },
        
        requestAndSaveItems: function (uri, type, inner) {
        	var conn, url, inStream, data, result, obj, mapper, list, i = 0, item;
        	try {
                url = new URL(uri);
                conn = url.openConnection();
                conn.setRequestMethod('GET');
                inStream = conn.getInputStream();    
                data = FileCopyUtils.copyToByteArray(inStream);
                result = new String(data, "UTF-8");
                obj = JSON.parse(result);
                if(inner) {
                	list = obj.results;
                }else {
                	list = obj;
                }
                mapper = new ObjectMapper();
                for (i; i < list.length; i++) {
                	if('account' === type) {
                		item = mapper.readValue(JSON.stringify(list[i]), Account);
                		service.updateAccount(item);
                	}else {
                		var dept = {id: list[i].parent.id}
                		list[i].parent = {id: list[i].parent.id};
                		item = mapper.readValue(JSON.stringify(list[i]), Department);
                		service.updateDept(item);
                	}
                }
        	} catch (error) {
        		return 'error';
        	} finally {
                if (conn != null) {
                  conn.disconnect();
                }
        	}
        }
	};
	return service;
}

changeChildrenPath = mark('managers', Department).mark('tx').on(function (deptMgr, department) {
	var oldDept = deptMgr.find(department.id);
	var oldPath = oldDept.path;
	var newPath = department.path;
	var children = deptMgr.getChildrenDepartments({likePath: oldPath + '%', path: oldPath});
	deptMgr.merge(department);
	var i = 0, _len = children.size(), child;
	for(i; i < _len; i++) {
		child = children.get(i);
		child.path = child.path.replace(oldPath, newPath);
		deptMgr.merge(child);
	}
	return department;
});

