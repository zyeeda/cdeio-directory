# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 127.0.0.1 (MySQL 5.6.20)
# Database: cdeio-samples
# Generation Time: 2014-09-22 13:56:57 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table CDE_ACCOUNT
# ------------------------------------------------------------

LOCK TABLES `CDE_ACCOUNT` WRITE;
/*!40000 ALTER TABLE `CDE_ACCOUNT` DISABLE KEYS */;

INSERT INTO `CDE_ACCOUNT` (`F_ID`, `F_ACCOUNT_NAME`, `F_DELETED`, `F_DISABLED`, `F_EMAIL`, `F_MOBILE`, `F_PASSWORD`, `F_REALNAME`, `F_TELEPHONE`, `F_DEPARTMENT_ID`)
VALUES
	('brook','brook',0,0,NULL,NULL,'brook','brook',NULL,'d-1009'),
	('chopper','chopper',0,0,NULL,NULL,'chopper','chopper',NULL,'d-1004'),
	('franky','franky',0,0,NULL,NULL,'franky','franky',NULL,'d-1004'),
	('luffy','luffy',0,0,NULL,NULL,'luffy','luffy',NULL,'d-1001'),
	('nami','nami',0,0,NULL,NULL,'nami','nami',NULL,'d-1003'),
	('robin','robin',0,0,NULL,NULL,'robin','robin',NULL,'d-1003'),
	('sanji','sanji',0,0,NULL,NULL,'sanji','sanji',NULL,'d-1004'),
	('tom','tom',0,0,NULL,NULL,'tom','tom',NULL,'d-1001'),
	('usopp','usopp',0,0,NULL,NULL,'usopp','usopp',NULL,'d-1009'),
	('zoro','zoro',0,0,NULL,NULL,'zoro','zoro',NULL,'d-1002');

/*!40000 ALTER TABLE `CDE_ACCOUNT` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
