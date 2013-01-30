var {mark} 					= require('coala/mark');
var {directoryServer} 		= require('config'); 
var {MessageCreator} 		= org.springframework.jms.core;

exports.createService = function () {
	return {
		sendMsg: mark('beans',  ['jmsTemplate', 'destination']).on(function (jmsTemplate, destination, msg) {
			if(directoryServer.activemq.disable) {
				return;
			}
			jmsTemplate.send(destination, new MessageCreator() {
				createMessage: function(session) {
					return session.createTextMessage(msg);
				}
			});
		})
	};
}