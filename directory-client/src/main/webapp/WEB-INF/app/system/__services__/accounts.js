var _ = require('underscore');
var {mark} = require('coala/mark');
var {json, error} = require('coala/response');

var {BCrypt} = com.zyeeda.coala.crypto;
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
    	})
    	
    };
    
    return service;
};
