-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- 主機： mysql
-- 產生時間： 2023 年 05 月 27 日 11:01
-- 伺服器版本： 10.6.11-MariaDB-log
-- PHP 版本： 8.0.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `nyust_mis`
--

-- --------------------------------------------------------

--
-- 資料表結構 `removeGradu`
--

CREATE TABLE `removeGradu` (
  `ID` varchar(9) NOT NULL,
  `Name` varchar(70) NOT NULL,
  `Sex` enum('女','男') DEFAULT NULL,
  `Education_type` enum('四技','二技','碩士','博士','碩士在職專班','香港二技專班','數位碩士在職專班','其他') DEFAULT NULL,
  `School_Email` varchar(70) DEFAULT NULL,
  `Email` varchar(70) DEFAULT NULL,
  `Facebook_Email` varchar(70) DEFAULT NULL,
  `Phone` varchar(30) DEFAULT NULL,
  `Address` varchar(150) DEFAULT NULL,
  `Teacher` varchar(30) DEFAULT NULL,
  `Status` enum('服兵役','升學','延畢','就業','出國留學','其他') DEFAULT NULL,
  `Status_detail` varchar(70) DEFAULT NULL,
  `Year` year(4) NOT NULL,
  `Complete` enum('N','Y') NOT NULL DEFAULT 'N'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
