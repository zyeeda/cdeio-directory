# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 127.0.0.1 (MySQL 5.6.20)
# Database: cdeio-samples
# Generation Time: 2014-09-22 13:58:06 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table CDE_DEPARTMENT
# ------------------------------------------------------------

LOCK TABLES `CDE_DEPARTMENT` WRITE;
/*!40000 ALTER TABLE `CDE_DEPARTMENT` DISABLE KEYS */;

INSERT INTO `CDE_DEPARTMENT` (`F_ID`, `F_CODE`, `F_DELETED`, `F_NAME`, `F_PATH`, `F_RANK`, `F_PARENT_ID`)
VALUES
	('d-1001',NULL,0,'研发部',NULL,NULL,NULL),
	('d-1002',NULL,0,'人资部',NULL,NULL,NULL),
	('d-1003',NULL,0,'综合部',NULL,NULL,NULL),
	('d-1004',NULL,0,'财务部',NULL,NULL,NULL),
	('d-1009',NULL,0,'领导',NULL,NULL,NULL);

/*!40000 ALTER TABLE `CDE_DEPARTMENT` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
