exports.coala = {

    entityPackages : [
        'com.zyeeda.coala.commons.organization.entity',
        'com.zyeeda.directory'
    ],

    orms: [
        'src/main/resources/META-INF/orm/account-department.xml'
    ]

}

exports.directoryServer = {
		activemq: {
			disable: true
		}
}

