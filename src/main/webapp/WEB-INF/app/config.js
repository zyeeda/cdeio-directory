exports.coala = {

    appPath: 'src/main/webapp/WEB-INF/app/',

    entityPackages : [
        'com.zyeeda.framework.commons.organization.entity',
        'com.zyeeda.directory'
    ],

    orms: [
        'src/main/resources/META-INF/orm/account-department.xml'
    ]

}