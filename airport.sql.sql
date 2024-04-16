-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 16, 2024 at 02:55 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sem4dbsproject`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `calculate_fare` (IN `v_flight_id` VARCHAR(7), IN `departure1` DATETIME)   BEGIN
    DECLARE v_disc_amt numeric;
    DECLARE v_fare_amt numeric;
	DECLARE net_fare numeric;
    SELECT standard_amt INTO v_fare_amt FROM leg WHERE flight_id = v_flight_id AND departure = departure1;


    Select fare_plan,v_fare_amt-(disc_amt*v_fare_amt)/100 as net from fare;
    
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `find_runways` (IN `IATA1` CHAR(3))   BEGIN
DECLARE num_runways INT;
SELECT count(*) into num_runways from runway where airport_id = IATA1;
SELECT num_runways as num;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `airport`
--

CREATE TABLE `airport` (
  `IATA` char(3) NOT NULL,
  `City` varchar(20) NOT NULL,
  `Name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `airport`
--

INSERT INTO `airport` (`IATA`, `City`, `Name`) VALUES
('HYD', 'Hyderabad', 'Rajiv Gandhi International Airport'),
('IXE', 'Mangalore', 'Mangaluru International Airport'),
('MAA', 'Chennai', 'Indira Gandhi International Airport');

--
-- Triggers `airport`
--
DELIMITER $$
CREATE TRIGGER `delete_data_after_airport_delete` AFTER DELETE ON `airport` FOR EACH ROW BEGIN
    -- Delete flights connecting to the deleted airport
    DELETE FROM leg WHERE source_id = OLD.IATA OR destination_id = OLD.IATA;
    
    -- Delete tickets of flights connecting to the deleted airport
    DELETE FROM ticket WHERE flight_id IN (SELECT ID FROM plane WHERE plane.ID IN (SELECT flight_id FROM leg WHERE source_id = OLD.IATA OR destination_id = OLD.IATA));

    -- Delete employees assigned to the deleted airport
    DELETE FROM employee WHERE airport_id = OLD.IATA;

    -- Delete runways of the deleted airport
    DELETE FROM runway WHERE airport_id = OLD.IATA;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `baggage`
--

CREATE TABLE `baggage` (
  `id` char(1) NOT NULL,
  `passenger_id` varchar(9) NOT NULL,
  `weight` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE `company` (
  `ID` char(5) NOT NULL,
  `Location` varchar(20) NOT NULL,
  `Name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `company`
--
DELIMITER $$
CREATE TRIGGER `delete_employees_after_company_delete` AFTER DELETE ON `company` FOR EACH ROW BEGIN
    -- Delete employees belonging to the deleted company
    DELETE FROM employee WHERE company_id = OLD.ID;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `ID` char(7) DEFAULT NULL,
  `phone` decimal(10,0) NOT NULL,
  `name` varchar(20) NOT NULL,
  `airport_id` char(3) NOT NULL,
  `company_id` char(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fare`
--

CREATE TABLE `fare` (
  `id` char(1) NOT NULL,
  `fare_plan` varchar(10) NOT NULL,
  `disc_amt` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fare`
--

INSERT INTO `fare` (`id`, `fare_plan`, `disc_amt`) VALUES
('1', 'Standard', 0),
('2', 'Student', 15);

-- --------------------------------------------------------

--
-- Table structure for table `leg`
--

CREATE TABLE `leg` (
  `flight_id` varchar(7) NOT NULL,
  `source_id` char(3) NOT NULL,
  `destination_id` char(3) NOT NULL,
  `departure` datetime NOT NULL,
  `arrival` datetime NOT NULL,
  `standard_amt` decimal(10,0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `leg`
--

INSERT INTO `leg` (`flight_id`, `source_id`, `destination_id`, `departure`, `arrival`, `standard_amt`) VALUES
('6E-727', 'IXE', 'HYD', '2024-04-16 12:30:50', '2024-04-16 16:00:50', 6000);

-- --------------------------------------------------------

--
-- Table structure for table `model`
--

CREATE TABLE `model` (
  `name` varchar(10) NOT NULL,
  `seats` decimal(10,0) NOT NULL,
  `fuel_capacity` decimal(3,0) NOT NULL,
  `weight_capacity` decimal(2,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `passenger`
--

CREATE TABLE `passenger` (
  `id` varchar(9) NOT NULL,
  `name` varchar(20) NOT NULL,
  `phone` decimal(10,0) NOT NULL,
  `email` varchar(40) NOT NULL,
  `address` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `passenger`
--
DELIMITER $$
CREATE TRIGGER `delete_tickets_after_passenger_delete` AFTER DELETE ON `passenger` FOR EACH ROW BEGIN
    -- Delete tickets related to the deleted passenger
    DELETE FROM ticket WHERE passenger_id = OLD.id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `plane`
--

CREATE TABLE `plane` (
  `ID` varchar(7) DEFAULT NULL,
  `model_name` varchar(10) DEFAULT NULL,
  `company_id` char(5) DEFAULT NULL,
  `manufacturer` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `plane`
--
DELIMITER $$
CREATE TRIGGER `delete_tickets_after_plane_delete` AFTER DELETE ON `plane` FOR EACH ROW BEGIN
    -- Delete tickets related to the deleted plane
    DELETE FROM ticket WHERE flight_id = OLD.ID;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `runway`
--

CREATE TABLE `runway` (
  `ID` char(1) NOT NULL,
  `airport_id` char(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `runway`
--

INSERT INTO `runway` (`ID`, `airport_id`) VALUES
('1', 'HYD'),
('1', 'IXE'),
('2', 'IXE');

-- --------------------------------------------------------

--
-- Table structure for table `ticket`
--

CREATE TABLE `ticket` (
  `flight_id` varchar(7) NOT NULL,
  `seat` decimal(10,0) NOT NULL,
  `passenger_id` varchar(9) NOT NULL,
  `departure` datetime NOT NULL,
  `fare_id` char(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `airport`
--
ALTER TABLE `airport`
  ADD PRIMARY KEY (`IATA`);

--
-- Indexes for table `baggage`
--
ALTER TABLE `baggage`
  ADD PRIMARY KEY (`id`,`passenger_id`),
  ADD KEY `passenger_id` (`passenger_id`);

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD KEY `airport_id` (`airport_id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `fare`
--
ALTER TABLE `fare`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `leg`
--
ALTER TABLE `leg`
  ADD PRIMARY KEY (`flight_id`,`departure`);

--
-- Indexes for table `model`
--
ALTER TABLE `model`
  ADD PRIMARY KEY (`name`);

--
-- Indexes for table `passenger`
--
ALTER TABLE `passenger`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `plane`
--
ALTER TABLE `plane`
  ADD KEY `model_name` (`model_name`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `runway`
--
ALTER TABLE `runway`
  ADD PRIMARY KEY (`ID`,`airport_id`),
  ADD KEY `airport_id` (`airport_id`);

--
-- Indexes for table `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`flight_id`,`passenger_id`,`departure`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `baggage`
--
ALTER TABLE `baggage`
  ADD CONSTRAINT `baggage_ibfk_1` FOREIGN KEY (`passenger_id`) REFERENCES `passenger` (`id`);

--
-- Constraints for table `employee`
--
ALTER TABLE `employee`
  ADD CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`airport_id`) REFERENCES `airport` (`IATA`),
  ADD CONSTRAINT `employee_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `company` (`ID`);

--
-- Constraints for table `plane`
--
ALTER TABLE `plane`
  ADD CONSTRAINT `plane_ibfk_1` FOREIGN KEY (`model_name`) REFERENCES `model` (`name`),
  ADD CONSTRAINT `plane_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `company` (`ID`);

--
-- Constraints for table `runway`
--
ALTER TABLE `runway`
  ADD CONSTRAINT `runway_ibfk_1` FOREIGN KEY (`airport_id`) REFERENCES `airport` (`IATA`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
