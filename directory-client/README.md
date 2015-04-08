# 1、如何运行

## 1.1、直接运行

**注意：需要使用 Maven 3.3.1 及以上版本来运行。**

Maven 3.3.1 版本新增加的功能可以允许以前配置在 `MAVEN_OPTS` 环境变量中的参数现在配置到 `.mvn/jvm.config` 文件中，且这个配置文件可以随版本管理工具传播，避免了因环境变量设置不正确而引起的系统问题。

在 MySQL 中创建名为 `cdeio-samples` 的数据库，并将字符集设置为 UTF-8，在当前目录下运行 `mvn jetty:run` 既可启动服务。

在使用自己编写的 pom.xml 文件运行项目的时候，注意要添加对 `cdeio-sso-openid` 库的引用：

```xml
<dependency>
    <groupId>com.zyeeda</groupId>
    <artifactId>cdeio-sso-openid</artifactId>
    <version>2.1.0-SNAPSHOT</version>
</dependency>
```

## 1.2、在 Docker 中运行

1. 安装 docker-machine
2. 安装 docker-compose
3. `docker-machine create -d virtualbox rp` 创建虚拟机
4. `$(docker-machine env rp)` 将 docker 命令连接到新创建的虚拟机
5. `docker-machine ip` 记录下显示的 IP 地址
6. 在当前目录下运行 `docker-compose up -d` 启动系统
7. `docker-compose logs server` 显示系统启动日志
8. 系统启动完成后，打开浏览器访问 `http://<IP ADDRESS>:9100`
9. 使用 tom/tom 账户登录系统，如果能够登录成功则说明系统正常运行

# 2、系统介绍

本项目是一个 SSO consumer 的演示项目，用来连接 SSO provider 服务，实现单点登录功能。

# 3、如何配置

配置 SSO consumer 与 provider 的大部分内容是一样的，只是有一些地方稍有区别。本文档仅列出需要注意的内容，具体配置详情，请参考 SSO provider 的配置方法。

## 3.1、数据源配置

通常 SSO consumer 是跟业务系统集成的，因此需要配置数据库连接，而业务系统中的数据不存储在 LDAP 中，所以 consumer 的配置是不支持 LDAP 服务的。

## 3.2、web.xml 配置

由于 consumer 自己不管理登录，所以 consumer 不需要验证码服务，可以在 web.xml 文件中，去掉提供验证码功能的 kaptchaServlet。

## 3.3、application-context.xml 配置

对于 consumer 服务有用的 Spring 配置文件只有 3 个，但是如果同时运行业务系统的话，可能就需要其他更多的配置文件的支持，对这些配置文件的解释不在此文档的介绍范围之内。

`hibernate.xml` 和 `shiro.xml` 的配置同 provider 是一样的，但是 `freemarker.xml` 文件需要引用另外一个路径：`classpath:spring/sso/consumer/freemarker.xml`。这个路径是在 cdeio-sso-openid 这个依赖库里面定义的，这个 freemarker 的配置文件里面引用了一些固定的模板用来与 SSO provider 传递数据。

## 3.4、shiro.xml 配置

`shiro.xml` 的配置方法跟 provider 的有些类似，但是有些内容是不一样的，其中一个显著的区别就是在 consumer 服务的配置中，需要声明一个 `OpenIdConsumer` 对象而不是 `OpenIdProvider` 对象。

### 3.4.1、声明 openIdConsumer

`openIdConsumer` 的声明方法同 `openIdProvider` 类似，只是声明类型变为 `com.zyeeda.cdeio.sso.openid.consumer.support.ShiroSessionOpenIdConsumer`。初始化参数 `cdeio.application.name`、`cdeio.server.protocol`、`cdeio.server.address` 和 `cdeio.server.port` 等配置都与 provider 配置中的含义相同。其他参数的解释如下：

`cdeio.sso.rp.index.path` consumer 服务运行所在的上下文根目录，这个需要根据实际情况来设定，在本例中是 /；
`cdeio.sso.rp.signin.path` consumer 服务的登录路径
`cdeio.sso.rp.signout.path` consumer 服务的登出路径
`cdeio.sso.rp.returnto.path` consumer 服务的 return to 路径
`cdeio.sso.rp.callback.path` consumer 服务的 callback 路径

`cdeio.op.server.protocol` SSO provider 服务所使用的协议，http 或者 https，默认为 http；
`cdeio.op.server.address` SSO provider 服务所在的地址，可以是 IP 地址或域名；
`cdeio.op.server.port` SSO provider 服务所在的端口，默认为 9100；
`cdeio.sso.op.xrds.path` SSO provider 服务 XRDS 路径
`cdeio.sso.op.signin.path` SSO provider 服务登录路径
`cdeio.sso.op.signout.path` SSO provider 服务登出路径

### 3.4.2、声明 shiroFilter

`shiroFilter` 声明了对 6 个 filter 的引用，分别是 `authc`、`signin`，`signout`、`callback`、`index` 和 `open`，其中只有 `authc` 和 `callback` filter 的含义需要解释，其他的都与 provider 中的含义相同。

`authc` 因为 consumer 角色本身并不需要对用户身份进行校验，只是解析 provider 返回来的处理结果，此 filter 就是用来验证 provider 的返回信息，并判定用户是否登录成功。在我们的实现中，如果用户没有登录成功就会一直留在 provider 的登录界面无法返回，那么一旦请求返回，通常来讲都是登录成功的，除非数据传输过程中出现了错误；
`callback` provider 验证完用户身份以后，会访问此 filter 所在的地址，将验证结果信息传回 consumer。

### 3.4.3、路径映射

consumer 服务的路径映射与 provider 不同，配置如下：

```
/accounts/openid/signin = authc, signin
/accounts/openid/signout = signout
/accounts/openid/verify = authc
/accounts/openid/callback = authc, callback

/ = authc, index
/invoke/** = authc, open
```

所有映射到 `/accounts/openid/*` 路径下的服务都是用来处理单点登录请求的。映射到 `/` 路径下 的服务是用来显示首页的，首页在本例中是一个简单的 Freemarker 模板，打印 Hello World! 字符串；`invoke/**` 路径是具体的业务系统服务，由 `jsgiServlet` 来处理。

### 3.4.4、Realm

consumer 服务使用的 realm 与 provider 也不一样，配置如下：

```xml
<bean id="openIdConsumerRealm" class="com.zyeeda.cdeio.sso.openid.consumer.realm.OpenIdConsumerRealm"/>
```

## 3.5、persistence.xml 配置

需要引用的映射文件及实体如下：

```xml
<mapping-file>META-INF/mappings/commons/organization/account.orm.xml</mapping-file>

<class>com.zyeeda.cdeio.commons.organization.entity.Account</class>
<class>com.zyeeda.cdeio.commons.organization.entity.Department</class>
<class>com.zyeeda.cdeio.commons.authc.entity.Permission</class>
<class>com.zyeeda.cdeio.commons.authc.entity.Role</class>
```

