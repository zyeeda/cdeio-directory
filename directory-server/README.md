# 1、如何运行

## 1.1、直接运行

**注意：需要使用 Maven 3.3.1 及以上版本来运行。**

Maven 3.3.1 版本新增加的功能可以允许以前配置在 `MAVEN_OPTS` 环境变量中的参数现在配置到 `.mvn/jvm.config` 文件中，且这个配置文件可以随版本管理工具传播，避免了因环境变量设置不正确而引起的系统问题。

在 MySQL 中创建名为 `cdeio-directory` 的数据库，并将字符集设置为 UTF-8，在当前目录下运行 `mvn jetty:run` 既可启动服务。

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
3. `docker-machine create -d virtualbox op` 创建虚拟机
4. `$(docker-machine env op)` 将 docker 命令连接到新创建的虚拟机
5. `docker-machine ip` 记录下显示的 IP 地址
6. 返回到此工作区的根目录，即 `cdeio-directory` 目录
7. `docker-compose up -d` 启动系统
8. `docker-compose logs op` 显示系统启动日志
9. 系统启动完成后，打开浏览器访问 `http://<IP ADDRESS>:9100`
10. 使用 admin/admin 登录系统，如果能够登录成功则说明运行成功

# 2、系统介绍

## 2.1、目录服务

目录服务主要用来管理系统中的用户及组织机构，是基于 CDE.IO 平台构建的一个简单应用。

## 2.2、单点登录服务

单点登录过程主要由两种角色的服务参与：一个是单点登录提供者，一个是单点登录消费者。本项目所实现的功能是单点登录提供者，即向消费者提供用户身份认证的服务。

# 3、如何配置

这个项目可以被看做是目录服务和单点登录服务的综合演示项目。根据应用系统的需要，可以单独部署其中的任何一部分功能。对于只希望提供登录服务而无需接入其他单点登录请求的应用来说，也一样需要将服务器角色部署为单点登录服务提供者，只是不使用其单点登录功能罢了。目前还没有一个简单的非单点登录的解决方案存在于本项目的实现中，需要自行开发。

## 3.1、数据源配置

本系统可以配置使用 LDAP 服务器或关系型数据库服务器作为身份认证信息存取的数据源。

### 3.1.1、关系型数据库

打开 `src/main/webapp/WEB-INF/jetty-env.xml` 文件，找到 `jdbc/defaultDS` 数据源配置，修改数据库的连接信息：

```xml
<New class="org.eclipse.jetty.plus.jndi.Resource">
        <Arg>
            <Ref refid='wac'/>
        </Arg>
        <Arg>jdbc/defaultDS</Arg>
        <Arg>
            <New class="bitronix.tm.resource.jdbc.PoolingDataSource">
                <Set name="className">com.mysql.jdbc.jdbc2.optional.MysqlXADataSource</Set>
                <Set name="uniqueName">defaultDS</Set>
                <Set name="allowLocalTransactions">true</Set>
                <Set name="minPoolSize">5</Set>
                <Set name="maxPoolSize">30</Set>
                <Get name="driverProperties">
                    <Put name="URL">jdbc:mysql://mysql:3306/cdeio-directory?pinGlobalTxToPhysicalConnection=true&amp;useUnicode=yes&amp;characterEncoding=UTF-8</Put>
                    <Put name="user">root</Put>
                    <Put name="password">mysecretpassword</Put>
                </Get>
                <Call name="init"/>
            </New>
        </Arg>
    </New>
```

### 3.1.2、LDAP 数据库

暂不支持。

## 3.2、web.xml 文件配置

在 web.xml 文件中主要配置了一个 filter 和两个 servlet 来提供相关的服务。

* `shiroFilter` 是 Apache Shiro 项目提供的一个方便配置 servlet filter 的代理，因此大部分系统中的 filter 配置都转移到了 Shiro 的配置文件中；
* `kaptchaServlet` 是基于 Kaptcha 项目配置的验证码服务，在用户登录的过程中会使用到；
* `jsgiServlet` 是应用系统提供业务服务的主要入口。

## 3.3、application-context.xml 配置

与本系统运行有关的 Spring 配置文件如下：

* `spring/cdeio/validation.xml` 创建 ValidationFactory 实例，在目录服务中用来验证存储到数据库中的数据是否合法；
* `spring/sso/provider/ehcache.xml` 用来暂存用户登录过程中的信息，主要在反机器人登录的过程中使用；
* `spring/freemarker.xml` Freemarker 配置，从当前项目的 classpath 中（WEB-INF/templates）加载模板，用来渲染一些主要的界面；
* `spring/hibernate.xml` Hibernate 配置，当使用关系型数据库作为数据源的时候需要使用；
* `spring/ldap.xml` LDAP 配置，当使用 LDAP 数据库作为数据源的时候需要使用；
* `spring/shiro.xml` 由 shiroFilter 所代理的 servlet filter 均在这里配置。

## 3.4、shiro.xml 配置

`shiro.xml` 是对单点登录系统而言最重要的一份配置文件，大部分的配置过程都在这里完成。

### 3.4.1、声明 openIdProvider

对于单点登录提供者服务，需要先声明一个 `openIdProvider` 对象，初始化这个对象需要用到的一些配置参数在 `cdeio.properties` 和 `sso.properties` 两个文件中可以找到，每个参数的具体含义如下：

* `cdeio.application.name` 应用程序的名称，用来显示在系统的标题栏以及登录界面上；
* `cdeio.server.protocol` 访问当前应用程序需要使用的访问协议，通常是 http 和 https，默认为 http；
* `cdeio.server.address` 访问当前应用程序的地址，可以是 IP 地址或者域名；
* `cdeio.server.port` 当前系统运行的端口，默认为 9100；
* `cdeio.sso.op.index.path` 单点登录服务运行所在的上下文根目录，默认为 /；
* `cdeio.sso.op.base.path` 单点登录服务相对于 `cdeio.sso.op.index.path` 的路径，默认为 /provider。

### 3.4.2、声明 shiroFilter

`shiroFilter` 的定义是此配置中最重要的部分，首先需要声明到各个 filter 的引用别名（`filters` 属性），然后要配置这些 filter 如何被应用到系统路径上（`filterChainDefinitions` 属性）。

每个 filter 的具体含义如下：

* `antibot` 用来防止机器人登录，这个 filter 里面会用到 Ehcache 来存储登录前的状态数据；
* `authc` 对用户进行登录认证；
* `signin` 用来显示登录页面；
* `endpoint` 单点登录协议需要使用的一个路径，单点登录请求从这里开始；
* `signout` 登出用户并显示登出后的界面，与 signin filter 不同的是，signout filter 除了显示登出后的界面以外还处理登出操作，但是 signin filter 只用来显示登录界面，具体的用户认证操作的是由 authc filter 完成的；
* `xrds` 和 `user` 都是单点登录协议需要使用的路径；
* `check` 检查用户是否登录（仅检查不负责具体认证）；
* `index` 用户登录成功以后，显示系统首页。这时存在两种情况，一种是用户直接在单点登录提供者端登录，不使用单点功能，则认证成功以后进入目录管理主页；另外一种是用户通过消费者端登录，则认证成功以后，会把用户重定向到来时的路径；
* `open` Spring 的 OpenEntityManagerInViewFilter 的实例，用来控制在一个请求范围内的 EntityManager 的生命周期。

**注：每一个 filter 的具体定义是在此文件的最后面依次罗列的。**

### 3.4.3、路径映射

filter 到路径映射的配置如下：

```
/provider/signin = antibot, open, authc, signin
/provider/signout = signout
/provider/endpoint/** = endpoint, open, authc
/provider/xrds = xrds
/provider/user = user

<!-- deprecated, backward compatibility -->
/provider/signin.jsp = antibot, open, authc, signin
/provider/xrds.jsp = xrds
/provider/user.jsp = user
```

这些配置是用来提供单点登录服务的，在单点登录服务路径没有变化的情况下就不需要修改。其中 JSP 的部分是为了兼容以前的系统。

`/ = check, index` 这行配置用来检查用户是否登录，并在认证通过的情况下显示首页。

`/invoke/** = check, open` 这行配置对所有访问系统后台的请求进行身份认证，然后控制 EntityManager 的打开和关闭，之后的事情就交由 `jsgiServlet` 来处理了。

### 3.4.4、Realm

Realm 是对存储认证信息的数据库的抽象，在本系统中，可以配置 3 种类型的 realm：

* `LdapRealm` 以 LDAP 数据库作为后端存储的认证信息库；
* `JpaRealm` 以关系型数据库作为后端存储的认证信息库；
* `MockRealm` 伪装的认证信息库，实际上没有任何存储，当输入的用户名和密码相同的时候就可以登录。系统默认启用此 realm。

