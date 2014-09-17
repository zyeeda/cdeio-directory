var _ = require('underscore');
var {mark} = require('cdeio/mark');
var {json, error} = require('cdeio/response');

var {BCrypt} = com.zyeeda.cdeio.crypto;
var {Account} = com.zyeeda.cdeio.commons.organization.entity;

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
    	})
    	
    };
    
    return service;
};
