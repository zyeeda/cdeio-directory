var _ = require('underscore');
var {mark} = require('coala/mark');
var {json, error} = require('coala/response');
var {createValidationContext} = require('coala/validation/validation-context');

var {BCrypt} = com.zyeeda.coala.commons.crypto;
var {Account} = com.zyeeda.coala.commons.organization.entity;

exports.createService = function() {

    var service = {
    	
    	hashPassword: mark('tx').on(function (account) {
    		var hashed = BCrypt.hashpw(account.password, BCrypt.gensalt());
    		account.setPassword(hashed);
    		return account;
    	}),
    	
    	enableAccount: mark('tx').on(function (account) {
    		account.setDisabled(false);
    	}),
    	
    	disableAccount: mark('tx').on(function (account) {
    		account.setDisabled(true);
    	}),
    	
		getAccounts: mark('managers', Account).mark('tx').on(function (accountMgr, path, isSyncTree) {
			if(isSyncTree) {
				return accountMgr.getChildrenAccounts({likePath: path + '%'});
			}else {
				return accountMgr.getSubAccounts({parentId: path});
			}
		}),
		
		changePassword: mark('managers', Account).mark('tx').on(function (accountMgr, data) {
			var account = accountMgr.find(data.id);
			var context = createValidationContext();
			var result = {violations: []};
			try {
                if (!BCrypt.checkpw(data.oldPassword, account.getPassword())) {
                	result.violations.push({ message: '不正确', properties: 'oldPassword' });
                }
            } catch (e) {
                result.violations.push({ message: '原密码哈希有误' });
            }

            if (result.violations.length > 0) {
                return result;
            }
            account.setPassword(BCrypt.hashpw(data.newPassword, BCrypt.gensalt()));
            account.setPassword(BCrypt.hashpw(data.newPassword2, BCrypt.gensalt()));
            return accountMgr.merge(account);
		})
    	
    };
    
    return service;
};
