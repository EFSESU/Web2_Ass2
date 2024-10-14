/*
 Navicat Premium Data Transfer

 Source Server         : MySQL本地数据库
 Source Server Type    : MySQL
 Source Server Version : 80029
 Source Host           : localhost:3306
 Source Schema         : crowdfunding_db

 Target Server Type    : MySQL
 Target Server Version : 80029
 File Encoding         : 65001

 Date: 11/10/2024 21:09:13
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category`  (
  `CATEGORY_ID` int(0) NOT NULL,
  `NAME` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`CATEGORY_ID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES (1, 'Education Fund');
INSERT INTO `category` VALUES (2, 'Medical Fund');

-- ----------------------------
-- Table structure for donation
-- ----------------------------
DROP TABLE IF EXISTS `donation`;
CREATE TABLE `donation`  (
  `donation_id` int(0) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `amount` decimal(10, 2) NOT NULL,
  `giver_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `fundraiser_id` int(0) NULL DEFAULT NULL,
  PRIMARY KEY (`donation_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of donation
-- ----------------------------
INSERT INTO `donation` VALUES (1, '2023-01-15', 500.00, 'Alice Johnson', 1);
INSERT INTO `donation` VALUES (2, '2023-02-10', 1000.00, 'Bob Smith', 2);
INSERT INTO `donation` VALUES (3, '2023-03-20', 750.00, 'Charlie Brown', 3);
INSERT INTO `donation` VALUES (4, '2023-04-15', 250.00, 'David Lee', 4);
INSERT INTO `donation` VALUES (5, '2023-05-10', 300.00, 'Eve White', 5);
INSERT INTO `donation` VALUES (6, '2023-06-20', 400.00, 'Frank Black', 1);
INSERT INTO `donation` VALUES (7, '2023-07-15', 600.00, 'Grace Green', 2);
INSERT INTO `donation` VALUES (8, '2023-08-10', 500.00, 'Henry Blue', 3);
INSERT INTO `donation` VALUES (9, '2023-09-20', 350.00, 'Ivy Red', 4);
INSERT INTO `donation` VALUES (10, '2023-10-15', 450.00, 'Jack Yellow', 5);
INSERT INTO `donation` VALUES (11, '2024-10-10', 200.00, 'kevin', 2);
INSERT INTO `donation` VALUES (12, '2024-10-10', 5.00, 'kevin', 1);
INSERT INTO `donation` VALUES (13, '2024-10-10', 5.00, 'kevin', 1);
INSERT INTO `donation` VALUES (14, '2024-10-10', 5.00, 'qwe', 1);

-- ----------------------------
-- Table structure for fundraiser
-- ----------------------------
DROP TABLE IF EXISTS `fundraiser`;
CREATE TABLE `fundraiser`  (
  `FUNDRAISE_ID` int(0) NOT NULL AUTO_INCREMENT,
  `ORGANIZER` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `CAPTION` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `TARGET_FUNDING` int(0) NOT NULL,
  `CURRENT_FUNDING` int(0) NOT NULL,
  `CITY` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ACTIVE` tinyint(0) NOT NULL,
  `CATEGORY_ID` int(0) NOT NULL,
  PRIMARY KEY (`FUNDRAISE_ID`) USING BTREE,
  INDEX `CATEGROY_ID_idx`(`CATEGORY_ID`) USING BTREE,
  CONSTRAINT `CATEGROY_ID` FOREIGN KEY (`CATEGORY_ID`) REFERENCES `category` (`CATEGORY_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fundraiser
-- ----------------------------
INSERT INTO `fundraiser` VALUES (1, 'Jakee', 'For his tuition', 2000, 500, 'LAa', 1, 1);
INSERT INTO `fundraiser` VALUES (2, 'Lisa', 'For her operate', 3500, 100, 'LA', 1, 2);
INSERT INTO `fundraiser` VALUES (3, 'Mick', 'For his mom\'s operate', 5000, 1000, 'NY', 0, 2);
INSERT INTO `fundraiser` VALUES (4, 'Jhon', 'For his blood', 1000, 500, 'LA', 1, 2);
INSERT INTO `fundraiser` VALUES (5, 'Black', 'For his tuition', 700, 600, 'NY', 0, 1);

SET FOREIGN_KEY_CHECKS = 1;
