-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 22, 2024 at 12:19 PM
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
-- Database: `bike_store`
--

-- --------------------------------------------------------

--
-- Table structure for table `car`
--

CREATE TABLE `car` (
  `id` int(11) NOT NULL,
  `brand` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `engine_capacity` decimal(10,0) NOT NULL,
  `color` varchar(255) NOT NULL,
  `doors` int(11) NOT NULL,
  `category` varchar(255) NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `car`
--

INSERT INTO `car` (`id`, `brand`, `model`, `engine_capacity`, `color`, `doors`, `category`, `price`, `quantity`) VALUES
(1, 'Audi ', 'Q5', 3200, 'gray', 4, '1', 7000, 2),
(2, 'Mercedes-Benz', 'C220', 2200, 'black', 4, '1', 16000, 3),
(3, 'Infiniti', 'Q30', 2200, 'red', 3, '4', 15198, 1),
(4, 'Kia', 'K5', 2000, 'white', 4, '1', 16350, 1),
(5, 'Dacia ', 'Duster ', 1461, 'black', 2, '2', 14526, 1),
(6, 'Audi ', 'A7', 3000, 'red', 4, '1', 18451, 1),
(7, 'BMW', '540', 3000, 'black', 4, '1', 35870, 1),
(8, 'Citroen', 'C3', 1400, 'black', 4, '4', 2500, 1),
(9, 'Skoda ', 'Octavia ', 1600, 'braun', 2, '4', 12450, 1),
(12, 'Renault ', 'Megane ', 1600, 'brown', 4, '1', 16500, 1);

-- --------------------------------------------------------

--
-- Table structure for table `car_type`
--

CREATE TABLE `car_type` (
  `id` int(11) NOT NULL,
  `type_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `car_type`
--

INSERT INTO `car_type` (`id`, `type_name`) VALUES
(1, 'Sedan'),
(2, 'SUV'),
(3, 'Crossover'),
(4, 'Hatchback'),
(5, 'Coupe'),
(6, 'Convertible'),
(7, 'Minivan');

-- --------------------------------------------------------

--
-- Table structure for table `messenger_messages`
--

CREATE TABLE `messenger_messages` (
  `id` bigint(20) NOT NULL,
  `body` longtext NOT NULL,
  `headers` longtext NOT NULL,
  `queue_name` varchar(190) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `available_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `delivered_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `motorcycle`
--

CREATE TABLE `motorcycle` (
  `id` int(11) NOT NULL,
  `brand` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `engine_capacity` int(11) NOT NULL,
  `color` varchar(255) NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `motorcycle`
--

INSERT INTO `motorcycle` (`id`, `brand`, `model`, `engine_capacity`, `color`, `price`, `quantity`) VALUES
(5, 'Kawasaki ', 'Z1000 Akrapovic', 1000, 'black', 6799, 1),
(8, 'Ducati ', 'Streetfighter 848 DTC/BREMBO', 848, 'black', 6800, 1),
(9, 'Aprilia', 'Special Edition 125', 125, 'black', 2600, 1),
(10, 'Yamaha ', 'XT 600 600', 600, 'black', 3400, 1),
(11, 'Suzuki', 'GSX-S 750', 750, 'black', 5800, 1),
(12, 'Yamaha ', 'MT-09 Tracer', 900, 'red', 10200, 1),
(13, 'Honda Silver', 'Wing 400', 400, 'white', 2600, 1);

-- --------------------------------------------------------

--
-- Table structure for table `trailer`
--

CREATE TABLE `trailer` (
  `id` int(11) NOT NULL,
  `brand` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `load_capacity` int(11) NOT NULL,
  `axles` int(11) NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `trailer`
--

INSERT INTO `trailer` (`id`, `brand`, `model`, `load_capacity`, `axles`, `price`, `quantity`) VALUES
(1, 'Repo', ' ', 750, 1, 1200, 1),
(2, 'VESTA ', ' LIGHT 25DA', 520, 2, 1700, 1),
(3, 'Wiola', '', 3500, 3, 8400, 1);

-- --------------------------------------------------------

--
-- Table structure for table `truck`
--

CREATE TABLE `truck` (
  `id` int(11) NOT NULL,
  `brand` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `quantity` int(11) NOT NULL,
  `engine_capacity` int(11) NOT NULL,
  `color` varchar(255) NOT NULL,
  `beds` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `truck`
--

INSERT INTO `truck` (`id`, `brand`, `model`, `price`, `quantity`, `engine_capacity`, `color`, `beds`) VALUES
(1, 'Daf', 'LF 45.220', 13500, 1, 6700, 'white', 2),
(2, 'Opel', 'Vivaro', 6540, 1, 2400, 'orange', 0),
(3, 'Iveco', '35c12', 16448, 1, 3000, 'white', 0),
(4, 'Man', 'TGL 12.210', 17860, 1, 8500, 'white', 1),
(5, 'Iveco ', 'Eurocargo 180e24', 13800, 1, 9000, 'white', 1),
(7, 'Man ', 'TGA 26.430 D20', 12000, 1, 9000, 'blue', 2);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `followed_vehicles` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`followed_vehicles`)),
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `email`, `type`, `followed_vehicles`, `created_at`) VALUES
(1, 'plamena', '$2y$10$HYv4CmcRgm3p2JiR20.IHuuBJcEZzt4gc1pvv9ZIu/gmKGgwC3ueK', 'plamenajelqzkova95@gmail.com', 'Merchant', '{\"car\":{\"4\":\"3\",\"5\":\"2\",\"6\":\"4\"},\"motorcycle\":[\"11\"],\"truck\":[\"3\"]}', '2024-10-14 10:56:51'),
(2, 'admin', '$2y$10$pHGstW61aT2NMm4mc/KIxOoScjfE.jqtrbhpWWjTXoTfyqMBpx.Hi', 'admin@hotmail.com', 'Buyer', '{\"car\":[\"2\",\"4\",\"1\"],\"motorcycle\":[\"12\"]}', '2024-10-19 11:14:16'),
(3, 'admin1', '$2y$10$S6nlt2I7eLaDsG9CcndB5eSHMjAlPKhC6KuEj6J3EEsByexJe3HnK', 'admin195@gmail.com', 'Merchant', '{\"car\":[\"2\",\"3\"]}', '2024-10-21 19:06:26'),
(4, 'blabla', '$2y$10$npmFHj0EvnbNxKTJdeGAiu5mfUAT42zyKNAZub6Dc41vZ9RB5vOyO', 'blabla@gmail.com', 'Buyer', '{\"car\":[]}', '2024-10-22 10:19:35');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `car`
--
ALTER TABLE `car`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `car_type`
--
ALTER TABLE `car_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messenger_messages`
--
ALTER TABLE `messenger_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_75EA56E0FB7336F0` (`queue_name`),
  ADD KEY `IDX_75EA56E0E3BD61CE` (`available_at`),
  ADD KEY `IDX_75EA56E016BA31DB` (`delivered_at`);

--
-- Indexes for table `motorcycle`
--
ALTER TABLE `motorcycle`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `trailer`
--
ALTER TABLE `trailer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `truck`
--
ALTER TABLE `truck`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `car`
--
ALTER TABLE `car`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `car_type`
--
ALTER TABLE `car_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `messenger_messages`
--
ALTER TABLE `messenger_messages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `motorcycle`
--
ALTER TABLE `motorcycle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `trailer`
--
ALTER TABLE `trailer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `truck`
--
ALTER TABLE `truck`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
