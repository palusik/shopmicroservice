CREATE DATABASE  IF NOT EXISTS `shop` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `shop`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: shop
-- ------------------------------------------------------
-- Server version	5.7.18-log

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
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer` (
  `customerID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `password` varchar(40) NOT NULL,
  `address` varchar(60) DEFAULT NULL,
  `role` varchar(15) DEFAULT NULL,
  `email` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`customerID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (1,'joe','joe','cork','operator','joe@cork.ie'),(2,'mary','mary','dublin',NULL,'marv@dublin.ie'),(3,'joey','joey','london','operator','joey@london.co.uk'),(4,'fred','fred','dublin','null','fred@dublin.ie'),(5,'admin','admin','cork','admin','admin@cork.ie'),(6,'test','test','cork',NULL,'test@cork.ie'),(7,'palo','palo','palo',NULL,'palo@cork.ie');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customerissue`
--

DROP TABLE IF EXISTS `customerissue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customerissue` (
  `customerissueID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `issuecomment` varchar(250) DEFAULT NULL,
  `issuestatus` varchar(40) DEFAULT NULL,
  `issuedate` varchar(40) DEFAULT NULL,
  `resolvedate` varchar(40) DEFAULT NULL,
  `resolution` varchar(500) DEFAULT NULL,
  `customerID` int(10) DEFAULT NULL,
  `resolverID` int(10) DEFAULT NULL,
  PRIMARY KEY (`customerissueID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customerissue`
--

LOCK TABLES `customerissue` WRITE;
/*!40000 ALTER TABLE `customerissue` DISABLE KEYS */;
INSERT INTO `customerissue` VALUES (1,'blablabla','COMPLETE','2017-05-28 00:07:57','2017-05-28 00:25:11','invalid query',1,1),(2,'my product is not in catalogue.','COMPLETE','2017-05-28 00:09:48','2017-05-28 01:04:04','test',1,5),(3,'test','NEW','2017-05-28 00:55:16',NULL,NULL,4,NULL),(4,'test 2','NEW','2017-05-28 01:00:24',NULL,NULL,4,NULL),(5,'test 3','NEW','2017-05-28 01:01:26',NULL,NULL,4,NULL),(6,'i dont know when to plant','NEW','2017-06-16 22:37:23',NULL,NULL,4,NULL);
/*!40000 ALTER TABLE `customerissue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderdetails`
--

DROP TABLE IF EXISTS `orderdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orderdetails` (
  `orderdetailsID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `orderID` int(10) unsigned NOT NULL,
  `productID` int(10) unsigned NOT NULL,
  `quantity` int(10) unsigned NOT NULL,
  PRIMARY KEY (`orderdetailsID`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderdetails`
--

LOCK TABLES `orderdetails` WRITE;
/*!40000 ALTER TABLE `orderdetails` DISABLE KEYS */;
INSERT INTO `orderdetails` VALUES (1,6,1,1),(2,6,2,1),(3,7,1,2),(4,7,2,1),(6,9,6,2),(7,10,6,1),(8,10,5,1),(9,10,4,1),(10,11,1,2),(11,12,1,3),(12,12,5,1),(13,13,1,4),(14,14,1,1001),(15,14,2,100),(16,15,1,8);
/*!40000 ALTER TABLE `orderdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `orderID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `customerID` int(10) unsigned NOT NULL,
  `saledate` varchar(40) NOT NULL,
  `orderstatus` varchar(30) DEFAULT NULL,
  `price` decimal(7,2) DEFAULT NULL,
  PRIMARY KEY (`orderID`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (4,1,'2017-05-22 01:19:42','PROCESSED',0.97),(5,1,'2017-05-22 01:27:19','NEW',0.97),(6,1,'2017-05-22 01:31:31','NEW',0.97),(7,1,'2017-05-22 09:31:40','NEW',1.45),(9,5,'2017-05-22 16:05:42','NEW',24.00),(10,1,'2017-05-22 17:55:53','PROCESSED',12.58),(11,5,'2017-05-22 20:50:58','NEW',0.96),(12,5,'2017-05-29 00:03:54','NEW',1.69),(13,5,'2017-06-16 22:27:48','PROCESSED',1.92),(14,4,'2017-06-16 22:35:47','NEW',529.48),(15,7,'2017-06-16 22:39:55','NEW',3.84);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `productID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL DEFAULT '',
  `quantity` int(10) unsigned NOT NULL DEFAULT '0',
  `price` decimal(7,2) NOT NULL DEFAULT '99999.99',
  `image` varchar(30) NOT NULL DEFAULT '',
  PRIMARY KEY (`productID`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Product 1',10000,0.48,'product1.jpg'),(2,'Product 2',8000,0.49,'product2.jpg'),(4,'Product 4',80,0.33,'product3.jpg'),(5,'Product 5',90,0.25,'product5.jpg'),(6,'Product 6',12,12.00,'product4.jpg'),(22,'tes',12,22.00,'product7.jpg');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-06-16 23:58:13
