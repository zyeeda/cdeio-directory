var {mark} 					= require('coala/mark');
var {Session, DeliveryMode} = javax.jms;
var {HashMap} 				= java.util;

exports.createService = function () {
	return {
		sendMsg: mark('beans', 'connectionFactory').on(function (connectionFactory, msg) {
			var connection, session, topic, publisher;
			connection = connectionFactory.createConnection();
	        session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
	        topic = session.createTopic("directory.messages");
	        publisher = session.createProducer(topic);
	        publisher.setDeliveryMode(DeliveryMode.NON_PERSISTENT);
	        connection.start();
	        publisher.send(session.createTextMessage(msg));
	        connection.stop();
	        connection.close();
		}),
		buildMsg: function(resource, type, entity) {
			var msg = new HashMap();
			msg.put('resource', resource);
			msg.put('type', type);
			msg.put('content', entity);
			return msg;
		}
	};
}