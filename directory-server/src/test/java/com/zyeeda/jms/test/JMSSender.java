package com.zyeeda.jms.test;

import javax.jms.Connection;
import javax.jms.Destination;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageConsumer;
import javax.jms.MessageListener;
import javax.jms.Session;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.jms.core.JmsTemplate;

public class JMSSender {

	/**
	 * @param args
	 * @throws JMSException 
	 */
	public static void main(String[] args) throws JMSException {
		
		ApplicationContext applicationContext=new ClassPathXmlApplicationContext("spring/jms.xml");
		JmsTemplate template=(JmsTemplate)applicationContext.getBean("jmsTemplate");
		Destination destination=(Destination)applicationContext.getBean("destination");
//		template.send(destination, new MessageCreator(){
//
//			@Override
//			public Message createMessage(Session session) throws JMSException {
//				// TODO Auto-generated method stub
//				return session.createTextMessage("Send Message:Hello ActiveMQ Text Message!");
//			}
//			
//		});
		
		Connection connection = template.getConnectionFactory().createConnection();
	    Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
        connection.start();
        MessageConsumer comsumer = session.createConsumer(destination);
	    comsumer.setMessageListener(new MessageListener() {
			@Override
			public void onMessage(Message message) {
            	System.err.println("ConsumerA get " + message);
			}
		});
	    
	}

}
