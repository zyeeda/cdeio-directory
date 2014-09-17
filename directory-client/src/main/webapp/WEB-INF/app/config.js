exports.cdeio = {

    appPath: 'src/main/webapp/WEB-INF/app/',

    entityPackages : [
        'com.zyeeda.cdeio.commons.organization.entity',
        'com.zyeeda.directory'
    ],

    orms: [
        'src/main/resources/META-INF/mappings/account-department.orm.xml'
    ]

}

exports.sync = {
	serviceUri: 'http://localhost:9200'
}
