var {FrontendSettingsCollector} = com.zyeeda.coala.web;
var {SecurityUtils} = org.apache.shiro;


exports.coala = {

    entityPackages : [
        'com.zyeeda.coala.commons.organization.entity',
        'com.zyeeda.directory'
    ],

    orms: [
        'src/main/resources/META-INF/mappings/account-department.orm.xml'
    ]

}

exports.directoryServer = {
		activemq: {
			disable: true
		}
}

FrontendSettingsCollector.add('collector', 'registered in collector');

exports.frontendSettings = {
		
    'subject': function(context) {
    	return SecurityUtils.subject.getPrincipal().username;
    },
    'singoutUrl': function(context) {
    	var openIdConsumer = context.getBean('openIdConsumer');
    	return openIdConsumer.getSignOutPath();
    }
};