-- MySQL dump 10.13  Distrib 5.6.23, for osx10.10 (x86_64)
--
-- Host: localhost    Database: cdeio-directory
-- ------------------------------------------------------
-- Server version	5.6.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `CDE_ACCOUNT`
--

DROP TABLE IF EXISTS `CDE_ACCOUNT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CDE_ACCOUNT` (
  `F_ID` varchar(255) NOT NULL,
  `F_ACCOUNT_NAME` varchar(30) DEFAULT NULL,
  `F_DELETED` tinyint(1) DEFAULT NULL,
  `F_DISABLED` tinyint(1) DEFAULT NULL,
  `F_EMAIL` varchar(100) DEFAULT NULL,
  `F_MOBILE` varchar(30) DEFAULT NULL,
  `F_PASSWORD` varchar(60) DEFAULT NULL,
  `F_REALNAME` varchar(30) DEFAULT NULL,
  `F_TELEPHONE` varchar(30) DEFAULT NULL,
  `F_DEPARTMENT_ID` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`F_ID`),
  KEY `FK_gk10g5o8p3oaw2dtg7jc71pq6` (`F_DEPARTMENT_ID`),
  CONSTRAINT `FK_gk10g5o8p3oaw2dtg7jc71pq6` FOREIGN KEY (`F_DEPARTMENT_ID`) REFERENCES `CDE_DEPARTMENT` (`F_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CDE_ACCOUNT`
--

LOCK TABLES `CDE_ACCOUNT` WRITE;
/*!40000 ALTER TABLE `CDE_ACCOUNT` DISABLE KEYS */;
/*!40000 ALTER TABLE `CDE_ACCOUNT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CDE_DEPARTMENT`
--

DROP TABLE IF EXISTS `CDE_DEPARTMENT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CDE_DEPARTMENT` (
  `F_ID` varchar(255) NOT NULL,
  `F_CODE` varchar(3000) DEFAULT NULL,
  `F_DELETED` tinyint(1) DEFAULT NULL,
  `F_NAME` varchar(30) DEFAULT NULL,
  `F_PATH` varchar(3000) DEFAULT NULL,
  `F_RANK` int(11) DEFAULT NULL,
  `F_PARENT_ID` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`F_ID`),
  KEY `FK_42vf1lbf0wbm1cf55nekdptqe` (`F_PARENT_ID`),
  CONSTRAINT `FK_42vf1lbf0wbm1cf55nekdptqe` FOREIGN KEY (`F_PARENT_ID`) REFERENCES `CDE_DEPARTMENT` (`F_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CDE_DEPARTMENT`
--

LOCK TABLES `CDE_DEPARTMENT` WRITE;
/*!40000 ALTER TABLE `CDE_DEPARTMENT` DISABLE KEYS */;
/*!40000 ALTER TABLE `CDE_DEPARTMENT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CDE_MENUITEM`
--

DROP TABLE IF EXISTS `CDE_MENUITEM`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CDE_MENUITEM` (
  `F_ID` varchar(255) NOT NULL,
  `F_DESC` varchar(2000) DEFAULT NULL,
  `F_ICON` varchar(100) DEFAULT NULL,
  `F_NAME` varchar(100) DEFAULT NULL,
  `F_OPENED` tinyint(1) DEFAULT NULL,
  `F_OPTION` varchar(2000) DEFAULT NULL,
  `F_PATH` varchar(200) DEFAULT NULL,
  `F_RANK` int(11) DEFAULT NULL,
  `F_PARENT_ID` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`F_ID`),
  KEY `FK_h2b6b8m4xpfwhq7ywuw69lx84` (`F_PARENT_ID`),
  CONSTRAINT `FK_h2b6b8m4xpfwhq7ywuw69lx84` FOREIGN KEY (`F_PARENT_ID`) REFERENCES `CDE_MENUITEM` (`F_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CDE_MENUITEM`
--

LOCK TABLES `CDE_MENUITEM` WRITE;
/*!40000 ALTER TABLE `CDE_MENUITEM` DISABLE KEYS */;
/*!40000 ALTER TABLE `CDE_MENUITEM` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CDE_PERMISSION`
--

DROP TABLE IF EXISTS `CDE_PERMISSION`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CDE_PERMISSION` (
  `F_ID` varchar(255) NOT NULL,
  `F_DESC` varchar(2000) DEFAULT NULL,
  `F_NAME` varchar(100) DEFAULT NULL,
  `F_SCAFFOLD` tinyint(1) DEFAULT NULL,
  `F_VALUE` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`F_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CDE_PERMISSION`
--

LOCK TABLES `CDE_PERMISSION` WRITE;
/*!40000 ALTER TABLE `CDE_PERMISSION` DISABLE KEYS */;
/*!40000 ALTER TABLE `CDE_PERMISSION` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CDE_ROLE`
--

DROP TABLE IF EXISTS `CDE_ROLE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CDE_ROLE` (
  `F_ID` varchar(255) NOT NULL,
  `F_DESC` varchar(2000) DEFAULT NULL,
  `F_SCAFFOLD` tinyint(1) DEFAULT NULL,
  `F_NAME` varchar(30) DEFAULT NULL,
  `F_DEPARTMENT_ID` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`F_ID`),
  KEY `FK_bomgp52wcxa6p5b22rpjxeugb` (`F_DEPARTMENT_ID`),
  CONSTRAINT `FK_bomgp52wcxa6p5b22rpjxeugb` FOREIGN KEY (`F_DEPARTMENT_ID`) REFERENCES `CDE_DEPARTMENT` (`F_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CDE_ROLE`
--

LOCK TABLES `CDE_ROLE` WRITE;
/*!40000 ALTER TABLE `CDE_ROLE` DISABLE KEYS */;
/*!40000 ALTER TABLE `CDE_ROLE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CDE_ROLE_ACCOUNT`
--

DROP TABLE IF EXISTS `CDE_ROLE_ACCOUNT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CDE_ROLE_ACCOUNT` (
  `F_ACCOUNT_ID` varchar(255) NOT NULL,
  `F_ROLE_ID` varchar(255) NOT NULL,
  PRIMARY KEY (`F_ACCOUNT_ID`,`F_ROLE_ID`),
  KEY `FK_1cwly3tmp1u1qq9nc371nth0v` (`F_ROLE_ID`),
  KEY `FK_dhb02hwgd5r5467skqq93lcui` (`F_ACCOUNT_ID`),
  CONSTRAINT `FK_1cwly3tmp1u1qq9nc371nth0v` FOREIGN KEY (`F_ROLE_ID`) REFERENCES `CDE_ROLE` (`F_ID`),
  CONSTRAINT `FK_dhb02hwgd5r5467skqq93lcui` FOREIGN KEY (`F_ACCOUNT_ID`) REFERENCES `CDE_ACCOUNT` (`F_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CDE_ROLE_ACCOUNT`
--

LOCK TABLES `CDE_ROLE_ACCOUNT` WRITE;
/*!40000 ALTER TABLE `CDE_ROLE_ACCOUNT` DISABLE KEYS */;
/*!40000 ALTER TABLE `CDE_ROLE_ACCOUNT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CDE_ROLE_PERMISSION`
--

DROP TABLE IF EXISTS `CDE_ROLE_PERMISSION`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CDE_ROLE_PERMISSION` (
  `F_ROLE_ID` varchar(255) NOT NULL,
  `F_PERMISSION_ID` varchar(255) NOT NULL,
  PRIMARY KEY (`F_ROLE_ID`,`F_PERMISSION_ID`),
  KEY `FK_huvp2upfuevk02659kj2i5mi0` (`F_PERMISSION_ID`),
  KEY `FK_ioxwdkt2i1s51j7qy5ss9te86` (`F_ROLE_ID`),
  CONSTRAINT `FK_huvp2upfuevk02659kj2i5mi0` FOREIGN KEY (`F_PERMISSION_ID`) REFERENCES `CDE_PERMISSION` (`F_ID`),
  CONSTRAINT `FK_ioxwdkt2i1s51j7qy5ss9te86` FOREIGN KEY (`F_ROLE_ID`) REFERENCES `CDE_ROLE` (`F_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CDE_ROLE_PERMISSION`
--

LOCK TABLES `CDE_ROLE_PERMISSION` WRITE;
/*!40000 ALTER TABLE `CDE_ROLE_PERMISSION` DISABLE KEYS */;
/*!40000 ALTER TABLE `CDE_ROLE_PERMISSION` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CDE_SETTINGITEM`
--

DROP TABLE IF EXISTS `CDE_SETTINGITEM`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CDE_SETTINGITEM` (
  `F_ID` varchar(255) NOT NULL,
  `F_DESC` varchar(2000) DEFAULT NULL,
  `F_NAME` varchar(200) DEFAULT NULL,
  `F_VALUE` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`F_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CDE_SETTINGITEM`
--

LOCK TABLES `CDE_SETTINGITEM` WRITE;
/*!40000 ALTER TABLE `CDE_SETTINGITEM` DISABLE KEYS */;
/*!40000 ALTER TABLE `CDE_SETTINGITEM` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-03-27 22:16:03
