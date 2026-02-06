-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 06, 2026 at 01:11 PM
-- Server version: 8.4.3
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `catalog`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `start_date` datetime(3) NOT NULL,
  `end_date` datetime(3) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `level` int NOT NULL DEFAULT '0',
  `order` int NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `parent_id`, `level`, `order`, `active`, `created_at`, `updated_at`) VALUES
(1, 'Billboard', 'billboard', 'Various billboard advertisements', NULL, NULL, 0, 0, 1, '2026-01-27 16:03:49.302', '2026-01-27 16:03:49.302');

-- --------------------------------------------------------

--
-- Table structure for table `chats`
--

CREATE TABLE `chats` (
  `id` int NOT NULL,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('TEXT','IMAGE','DOCUMENT','ORDER_UPDATE','SYSTEM') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TEXT',
  `read` tinyint(1) NOT NULL DEFAULT '0',
  `read_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chats`
--

INSERT INTO `chats` (`id`, `sender_id`, `receiver_id`, `message`, `type`, `read`, `read_at`, `created_at`) VALUES
(1, 2, 1, 'whats am i', 'TEXT', 1, '2026-01-28 17:52:32.976', '2026-01-28 16:52:14.714'),
(2, 2, 1, 'Halo admin', 'TEXT', 1, '2026-01-28 17:52:32.976', '2026-01-28 17:05:45.991'),
(3, 1, 2, 'alo', 'TEXT', 0, NULL, '2026-01-28 17:12:54.598'),
(4, 2, 1, 'Halo', 'TEXT', 1, '2026-01-29 16:22:31.115', '2026-01-29 16:21:01.320'),
(5, 1, 2, 'Halo tol', 'TEXT', 0, NULL, '2026-01-29 16:22:37.057'),
(6, 1, 2, 'Letsugo', 'TEXT', 0, NULL, '2026-01-29 17:17:18.388'),
(7, 2, 1, 'Halo atmin', 'TEXT', 1, '2026-02-02 17:08:58.100', '2026-02-02 16:59:14.125'),
(8, 1, 2, 'ada yang bisa saya bantu?', 'TEXT', 0, NULL, '2026-02-02 17:09:09.742'),
(9, 2, 1, 'Halo adumin', 'TEXT', 0, NULL, '2026-02-06 12:41:20.539');

-- --------------------------------------------------------

--
-- Table structure for table `customer_data`
--

CREATE TABLE `customer_data` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `company_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company_address` text COLLATE utf8mb4_unicode_ci,
  `company_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `npwp_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `npwp_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ktp_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ktp_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_account` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verification_status` enum('PENDING','APPROVED','REJECTED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `verified_by` int DEFAULT NULL,
  `verified_at` datetime(3) DEFAULT NULL,
  `rejected_reason` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('ORDER_STATUS','PAYMENT_STATUS','PRODUCT_UPDATE','PROMOTION','CHAT_MESSAGE','SYSTEM_ALERT','REVIEW_REPLY') COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` json DEFAULT NULL,
  `read` tinyint(1) NOT NULL DEFAULT '0',
  `read_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `order_id`, `title`, `message`, `type`, `data`, `read`, `read_at`, `created_at`) VALUES
(1, 1, NULL, 'Pesan Baru dari ', 'whats am i', 'CHAT_MESSAGE', NULL, 0, NULL, '2026-01-28 16:52:15.056'),
(2, 2, 3, 'Pesanan Baru Dibuat', 'Pesanan ORD-1769619432331 telah berhasil dibuat. Tim kami akan segera memproses pesanan Anda.', 'ORDER_STATUS', NULL, 1, '2026-02-02 17:00:19.799', '2026-01-28 16:57:12.811'),
(3, 2, 4, 'Pesanan Baru Dibuat', 'Pesanan ORD-1769619432768 telah berhasil dibuat. Tim kami akan segera memproses pesanan Anda.', 'ORDER_STATUS', NULL, 1, '2026-02-02 17:00:19.799', '2026-01-28 16:57:12.889'),
(4, 1, NULL, 'Pesan Baru dari ', 'Halo admin', 'CHAT_MESSAGE', NULL, 0, NULL, '2026-01-28 17:05:46.328'),
(5, 2, 4, 'Pesanan Dikonfirmasi', 'Pesanan ORD-1769619432768 telah dikonfirmasi. Pembayaran Anda sedang diverifikasi.', 'ORDER_STATUS', NULL, 1, '2026-02-02 17:00:19.799', '2026-01-28 17:12:28.770'),
(6, 2, NULL, 'Pesan Baru dari ', 'alo', 'CHAT_MESSAGE', NULL, 1, '2026-02-02 17:00:19.799', '2026-01-28 17:12:54.808'),
(7, 1, NULL, 'Pesan Baru dari ', 'Halo', 'CHAT_MESSAGE', NULL, 0, NULL, '2026-01-29 16:21:01.645'),
(8, 1, NULL, 'Pesan Baru dari ', 'Halo atmin', 'CHAT_MESSAGE', NULL, 0, NULL, '2026-02-02 16:59:14.229'),
(9, 2, 4, 'Pesanan Selesai', 'Pesanan ORD-1769619432768 telah selesai sepenuhnya. Terima kasih atas kepercayaan Anda!', 'ORDER_STATUS', NULL, 1, '2026-02-06 12:54:25.902', '2026-02-02 17:09:44.104'),
(10, 2, 3, 'Pesanan Selesai', 'Pesanan ORD-1769619432331 telah selesai sepenuhnya. Terima kasih atas kepercayaan Anda!', 'ORDER_STATUS', NULL, 1, '2026-02-06 12:54:25.902', '2026-02-02 17:09:53.004'),
(11, 1, 1, 'Pesanan Dibatalkan', 'Pesanan ORD-1769434862697 telah dibatalkan. Jika ada pertanyaan, silakan hubungi support.', 'ORDER_STATUS', NULL, 0, NULL, '2026-02-02 17:10:13.938'),
(12, 1, NULL, 'Pesan Baru dari ', 'Halo adumin', 'CHAT_MESSAGE', NULL, 0, NULL, '2026-02-06 12:41:20.923');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `uuid` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int NOT NULL,
  `admin_id` int DEFAULT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `tax_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `discount_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `final_amount` decimal(15,2) NOT NULL,
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'IDR',
  `status` enum('PENDING','CONFIRMED','IN_PROGRESS','SHIPPED','DELIVERED','COMPLETED','CANCELLED','REFUNDED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `payment_method` enum('CASH','BANK_TRANSFER','CREDIT_CARD','E_WALLET','VOUCHER') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` enum('PENDING','PROCESSING','COMPLETED','FAILED','REFUNDED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `payment_date` datetime(3) DEFAULT NULL,
  `start_date` datetime(3) NOT NULL,
  `end_date` datetime(3) NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `shipping_address` text COLLATE utf8mb4_unicode_ci,
  `billing_address` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `uuid`, `order_number`, `user_id`, `admin_id`, `total_amount`, `tax_amount`, `discount_amount`, `final_amount`, `currency`, `status`, `payment_method`, `payment_status`, `payment_date`, `start_date`, `end_date`, `notes`, `shipping_address`, `billing_address`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '83f99c3c-33a7-47b4-8770-2e51071f8aff', 'ORD-1769434862697', 1, NULL, 666000000.00, 66000000.00, 0.00, 666000000.00, 'IDR', 'CANCELLED', 'BANK_TRANSFER', 'PENDING', NULL, '2026-01-26 00:00:00.000', '2026-02-26 00:00:00.000', 'King of the hill', 'Surakarta', 'Surakarta', '2026-01-26 13:41:02.708', '2026-02-02 17:10:13.849', NULL),
(2, '4a0fd601-a140-4848-8672-78db9b97d0d2', 'ORD-1769436326175', 1, NULL, 4162500000.00, 412500000.00, 0.00, 4162500000.00, 'IDR', 'REFUNDED', 'BANK_TRANSFER', 'PENDING', NULL, '2026-01-26 00:00:00.000', '2026-02-26 00:00:00.000', '', 'Jakarta Pusat', 'Jakarta Pusat', '2026-01-26 14:05:26.186', '2026-02-02 17:10:06.127', NULL),
(3, '5ecf8c04-e40e-4d79-9b12-4dcb75edddc1', 'ORD-1769619432331', 2, NULL, 240000000.00, 0.00, 0.00, 240000000.00, 'IDR', 'COMPLETED', NULL, 'PENDING', NULL, '2026-01-28 00:00:00.000', '2026-02-28 00:00:00.000', '', 'JCC Senayan', 'JCC Senayan', '2026-01-28 16:57:12.334', '2026-02-02 17:09:52.235', NULL),
(4, 'aa977746-d022-4eb8-9432-8d72cb8bdae7', 'ORD-1769619432768', 2, NULL, 240000000.00, 0.00, 0.00, 240000000.00, 'IDR', 'COMPLETED', NULL, 'PENDING', NULL, '2026-01-28 00:00:00.000', '2026-02-28 00:00:00.000', '', 'JCC Senayan', 'JCC Senayan', '2026-01-28 16:57:12.770', '2026-02-02 17:09:43.939', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `unit_price` decimal(15,2) NOT NULL,
  `total_price` decimal(15,2) NOT NULL,
  `start_date` datetime(3) NOT NULL,
  `end_date` datetime(3) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `unit_price`, `total_price`, `start_date`, `end_date`, `created_at`) VALUES
(1, 1, 3, 1, 20000000.00, 600000000.00, '2026-01-26 00:00:00.000', '2026-02-26 00:00:00.000', '2026-01-26 13:41:03.724'),
(2, 2, 2, 1, 125000000.00, 3750000000.00, '2026-01-26 00:00:00.000', '2026-02-26 00:00:00.000', '2026-01-26 14:05:26.291'),
(3, 3, 5, 1, 8000000.00, 240000000.00, '2026-01-28 00:00:00.000', '2026-02-28 00:00:00.000', '2026-01-28 16:57:12.334'),
(4, 4, 5, 1, 8000000.00, 240000000.00, '2026-01-28 00:00:00.000', '2026-02-28 00:00:00.000', '2026-01-28 16:57:12.770');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int NOT NULL,
  `uuid` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_id` int NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `method` enum('CASH','BANK_TRANSFER','CREDIT_CARD','E_WALLET','VOUCHER') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PENDING','PROCESSING','COMPLETED','FAILED','REFUNDED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `transaction_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gateway_response` json DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `paid_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `uuid` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category_id` int DEFAULT NULL,
  `subcategory_id` int DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `size_width` int DEFAULT NULL,
  `size_height` int DEFAULT NULL,
  `illumination` tinyint(1) NOT NULL DEFAULT '0',
  `visibility` enum('DAYTIME','NIGHTTIME','ALWAYSON') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DAYTIME',
  `price_daily` decimal(15,2) NOT NULL,
  `price_weekly` decimal(15,2) NOT NULL,
  `price_monthly` decimal(15,2) NOT NULL,
  `price_yearly` decimal(15,2) NOT NULL,
  `availability_status` enum('AVAILABLE','RESERVED','MAINTENANCE','UNAVAILABLE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'AVAILABLE',
  `stock_quantity` int NOT NULL DEFAULT '1',
  `images` json DEFAULT NULL,
  `specifications` json DEFAULT NULL,
  `rating` double NOT NULL DEFAULT '0',
  `review_count` int NOT NULL DEFAULT '0',
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  `published` tinyint(1) NOT NULL DEFAULT '0',
  `created_by` int NOT NULL,
  `approved_by` int DEFAULT NULL,
  `approved_at` datetime(3) DEFAULT NULL,
  `status` enum('DRAFT','PENDING_APPROVAL','APPROVED','REJECTED','ARCHIVED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `uuid`, `name`, `slug`, `description`, `category_id`, `subcategory_id`, `location`, `latitude`, `longitude`, `size_width`, `size_height`, `illumination`, `visibility`, `price_daily`, `price_weekly`, `price_monthly`, `price_yearly`, `availability_status`, `stock_quantity`, `images`, `specifications`, `rating`, `review_count`, `featured`, `published`, `created_by`, `approved_by`, `approved_at`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '9eb06e8a-1df8-418c-a95a-ffc8211b4ac9', 'Trial', 'trial', 'Trial', NULL, NULL, 'Surakarta', NULL, NULL, NULL, NULL, 0, 'DAYTIME', 20000000.00, 80000000.00, 20000000.00, 240000000.00, 'AVAILABLE', 1, '[\"blob:http://localhost:3000/6fe904fa-7e2c-4637-b21b-58afa27c68c7\"]', NULL, 0, 0, 1, 1, 1, NULL, NULL, 'DRAFT', '2026-01-25 11:33:42.679', '2026-01-25 11:33:42.679', NULL),
(2, '4fc30c08-481c-49c4-ba9f-5fdb2ff52fa6', 'Solvia', 'solvia', 'Solvia', NULL, NULL, 'Surakarta', NULL, NULL, NULL, NULL, 0, 'ALWAYSON', 20000000.00, 80000000.00, 20000000.00, 240000000.00, 'AVAILABLE', 1, '[\"blob:http://localhost:3000/e8abbb8b-1f95-425c-884f-7c079c2d139d\"]', NULL, 0, 0, 1, 1, 1, NULL, NULL, 'DRAFT', '2026-01-25 11:34:56.924', '2026-01-25 11:34:56.924', NULL),
(3, '0bea3a4e-7d65-455e-8fd7-955d831468b5', 'Miftah', 'miftah', 'Miftah', NULL, NULL, 'Surakarta', NULL, NULL, NULL, NULL, 0, 'DAYTIME', 20000000.00, 80000000.00, 20000000.00, 240000000.00, 'AVAILABLE', 1, '[\"/uploads/1769341781115-3595.png\"]', NULL, 0, 0, 1, 1, 1, NULL, NULL, 'DRAFT', '2026-01-25 11:49:41.150', '2026-01-25 11:49:41.150', NULL),
(4, '53d3068c-a2fa-4278-ab70-a53bd1684001', 'Kopi Nuri UMS', 'kopi-nuri-ums', 'Desk', NULL, NULL, 'Surakarta', -7.546468069276608, 110.8350220655733, 300, 199, 0, 'DAYTIME', 10000.00, 70000.00, 300000.00, 3650000.00, 'AVAILABLE', 1, '[\"/uploads/1769436491159-820.jpg\"]', NULL, 0, 0, 0, 0, 1, NULL, NULL, 'DRAFT', '2026-01-26 14:08:11.429', '2026-01-26 14:08:11.429', NULL),
(5, 'e8e2ff09-b01e-4fac-9efc-cfc3053077ae', 'Test Product', 'test-product', 'Test product for customer', 1, NULL, 'Test Location', -6.2088, 106.8456, 10, 5, 1, 'ALWAYSON', 500000.00, 3000000.00, 12000000.00, 144000000.00, 'AVAILABLE', 1, '[\"https://example.com/billboard1.jpg\"]', '{\"material\": \"Vinyl\", \"mounting\": \"Wall mounted\", \"wind_resistance\": \"Up to 120 km/h\"}', 0, 0, 1, 1, 3, NULL, NULL, 'DRAFT', '2026-01-27 16:03:51.660', '2026-01-27 16:03:51.660', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` int NOT NULL,
  `reporter_id` int NOT NULL,
  `resolved_by` int DEFAULT NULL,
  `reported_type` enum('USER','PRODUCT','REVIEW','CHAT','ORDER') COLLATE utf8mb4_unicode_ci NOT NULL,
  `reported_id` int NOT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('PENDING','RESOLVED','DISMISSED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `resolved_at` datetime(3) DEFAULT NULL,
  `resolution_note` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  `rating` tinyint NOT NULL DEFAULT '0',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `images` json DEFAULT NULL,
  `verified` tinyint(1) NOT NULL DEFAULT '0',
  `helpful` int NOT NULL DEFAULT '0',
  `reported` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subcategories`
--

CREATE TABLE `subcategories` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category_id` int NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order` int NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `uuid` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('ADMIN','CUSTOMER') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CUSTOMER',
  `user_type` enum('INDIVIDUAL','COMPANY') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'INDIVIDUAL',
  `company_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal_code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','SUSPENDED','PENDING_VERIFICATION') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING_VERIFICATION',
  `email_verified` tinyint(1) NOT NULL DEFAULT '0',
  `email_verified_at` datetime(3) DEFAULT NULL,
  `npwp_verified` tinyint(1) NOT NULL DEFAULT '0',
  `npwp_valid_until` datetime(3) DEFAULT NULL,
  `balance` decimal(15,2) NOT NULL DEFAULT '0.00',
  `points` int NOT NULL DEFAULT '0',
  `last_login_at` datetime(3) DEFAULT NULL,
  `last_login_ip` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remember_token` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `uuid`, `name`, `email`, `password_hash`, `role`, `user_type`, `company_name`, `phone`, `address`, `city`, `postal_code`, `status`, `email_verified`, `email_verified_at`, `npwp_verified`, `npwp_valid_until`, `balance`, `points`, `last_login_at`, `last_login_ip`, `remember_token`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'b11ebd20-29e8-438d-9ead-5aa8d3157daf', 'Nanda Holicom', 'nanda@gmail.com', '$2a$10$.GY/A4burZxH5/4elPw/WeysY6ToZUAYpgVyItOHJ0xRdODNHOTd.', 'ADMIN', 'INDIVIDUAL', 'Solvia Nova', '081236712', NULL, NULL, NULL, 'ACTIVE', 0, NULL, 0, NULL, 0.00, 0, '2026-02-06 11:26:51.266', NULL, NULL, '2026-01-25 11:03:27.963', '2026-02-06 12:23:48.927', NULL),
(2, 'c392b16b-4738-4d91-b261-91e439954a2a', 'Fhatoni Nur Ward', 'fhatoninur@gmail.com', '$2a$12$KjYmfQiEz6A6Xj.Dwak4A.ndAEv/dVYGbuLR4k49uqBE5fIABjXvm', 'CUSTOMER', 'INDIVIDUAL', 'DOTA 2', '087845640787', NULL, NULL, NULL, 'ACTIVE', 0, NULL, 0, NULL, 0.00, 0, '2026-02-06 12:37:04.860', NULL, NULL, '2026-01-26 13:19:22.254', '2026-02-06 12:37:04.868', NULL),
(3, '63ed7018-7028-420b-8333-d918683783ff', 'Customer User', 'customer@example.com', '$2a$10$vZNTmPR3oW6LE0b0goc/uOw6MiQvUhacr/ihBImjl47w32IPJx/Uq', 'CUSTOMER', 'INDIVIDUAL', NULL, NULL, NULL, NULL, NULL, 'ACTIVE', 1, NULL, 0, NULL, 0.00, 0, '2026-01-27 16:07:35.216', NULL, NULL, '2026-01-27 16:03:48.636', '2026-01-27 16:07:35.218', NULL),
(4, 'c433aee6-b779-48c7-959d-dde693d41b35', 'Test Customer', 'test@example.com', 'test123', 'CUSTOMER', 'INDIVIDUAL', NULL, NULL, NULL, NULL, NULL, 'ACTIVE', 1, NULL, 0, NULL, 0.00, 0, NULL, NULL, NULL, '2026-01-27 18:10:17.808', '2026-01-27 18:10:17.808', NULL),
(5, '4397132f-74c7-4627-969f-34e4b43334c0', 'Admin User', 'admin@example.com', '$2a$10$JOpIsCpy9R33pxSLkNJDJOaAjGLHXhvc1Zzd5wTxZHtFD27v5FfBO', 'ADMIN', 'INDIVIDUAL', NULL, NULL, NULL, NULL, NULL, 'ACTIVE', 1, NULL, 0, NULL, 0.00, 0, NULL, NULL, NULL, '2026-01-27 18:12:34.496', '2026-01-27 18:12:34.496', NULL),
(6, '81e79f07-6679-45c4-a3e9-630b97e36c08', 'John Doe', 'john@example.com', '$2a$10$xkNAd146ymClVP.oAHXQbO4qCqJCmgmoWP09mm90FE/0wlROR6wGW', 'CUSTOMER', 'INDIVIDUAL', NULL, NULL, NULL, NULL, NULL, 'ACTIVE', 1, NULL, 0, NULL, 0.00, 0, NULL, NULL, NULL, '2026-01-27 18:12:43.202', '2026-01-27 18:12:43.202', NULL),
(7, 'adfb03f9-d8c6-41e5-b5b5-d21d8ff7bf3d', 'Jane Smith', 'jane@example.com', '$2a$10$vu1LE9o/JzPkrXA5hphUBeIfIMs3muv0cPTjJSvQAA6dG5b3XLv6K', 'CUSTOMER', 'INDIVIDUAL', NULL, NULL, NULL, NULL, NULL, 'ACTIVE', 1, NULL, 0, NULL, 0.00, 0, NULL, NULL, NULL, '2026-01-27 18:12:52.260', '2026-01-27 18:12:52.260', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('2568a531-b3ad-464b-8f72-e35a35bc8af5', '3d9d24ab1b030f02be7481d8e833a9dea211138ad74fc86efc0b627bd8752e22', '2026-01-25 08:49:02.062', '20260125084748_init_full_schema', NULL, NULL, '2026-01-25 08:47:48.062', 1),
('3cf57ba3-fe38-4fb6-8a27-b9b5b1a63326', '9da854e6799f44e271679938972311b81910c091a205cedb31ffdb1a73d7a4bc', '2026-01-16 15:37:56.976', '20260116153754_fix_timestamps', NULL, NULL, '2026-01-16 15:37:54.519', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_cart_items_user` (`user_id`),
  ADD KEY `idx_cart_items_product` (`product_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_slug_key` (`slug`),
  ADD KEY `idx_categories_parent` (`parent_id`),
  ADD KEY `idx_categories_active` (`active`);

--
-- Indexes for table `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_chats_sender` (`sender_id`),
  ADD KEY `idx_chats_receiver` (`receiver_id`),
  ADD KEY `idx_chats_created_at` (`created_at`),
  ADD KEY `idx_chats_read` (`read`);

--
-- Indexes for table `customer_data`
--
ALTER TABLE `customer_data`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_customer_data_user` (`user_id`),
  ADD KEY `idx_customer_data_npwp` (`npwp_number`),
  ADD KEY `idx_customer_data_verification` (`verification_status`),
  ADD KEY `customer_data_verified_by_fkey` (`verified_by`);

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `favorites_user_id_product_id_key` (`user_id`,`product_id`),
  ADD KEY `idx_favorites_user` (`user_id`),
  ADD KEY `idx_favorites_product` (`product_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_notifications_user` (`user_id`),
  ADD KEY `idx_notifications_order` (`order_id`),
  ADD KEY `idx_notifications_type` (`type`),
  ADD KEY `idx_notifications_read` (`read`),
  ADD KEY `idx_notifications_created_at` (`created_at`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orders_uuid_key` (`uuid`),
  ADD UNIQUE KEY `orders_order_number_key` (`order_number`),
  ADD KEY `idx_orders_user` (`user_id`),
  ADD KEY `idx_orders_admin` (`admin_id`),
  ADD KEY `idx_orders_number` (`order_number`),
  ADD KEY `idx_orders_status` (`status`),
  ADD KEY `idx_orders_payment_status` (`payment_status`),
  ADD KEY `idx_orders_created_at` (`created_at`),
  ADD KEY `idx_orders_deleted_at` (`deleted_at`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order_items_order` (`order_id`),
  ADD KEY `idx_order_items_product` (`product_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payments_uuid_key` (`uuid`),
  ADD KEY `idx_payments_order` (`order_id`),
  ADD KEY `idx_payments_transaction` (`transaction_id`),
  ADD KEY `idx_payments_status` (`status`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `products_uuid_key` (`uuid`),
  ADD UNIQUE KEY `products_slug_key` (`slug`),
  ADD KEY `idx_products_created_by` (`created_by`),
  ADD KEY `idx_products_category` (`category_id`),
  ADD KEY `idx_products_subcategory` (`subcategory_id`),
  ADD KEY `idx_products_location` (`location`),
  ADD KEY `idx_products_availability` (`availability_status`),
  ADD KEY `idx_products_published` (`published`),
  ADD KEY `idx_products_deleted_at` (`deleted_at`),
  ADD KEY `products_approved_by_fkey` (`approved_by`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_reports_reporter` (`reporter_id`),
  ADD KEY `idx_reports_target` (`reported_type`,`reported_id`),
  ADD KEY `idx_reports_status` (`status`),
  ADD KEY `idx_reports_created_at` (`created_at`),
  ADD KEY `reports_resolved_by_fkey` (`resolved_by`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reviews_user_id_product_id_key` (`user_id`,`product_id`),
  ADD KEY `idx_reviews_user` (`user_id`),
  ADD KEY `idx_reviews_product` (`product_id`),
  ADD KEY `idx_reviews_rating` (`rating`),
  ADD KEY `reviews_order_id_fkey` (`order_id`);

--
-- Indexes for table `subcategories`
--
ALTER TABLE `subcategories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subcategories_slug_key` (`slug`),
  ADD KEY `idx_subcategories_category` (`category_id`),
  ADD KEY `idx_subcategories_active` (`active`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_uuid_key` (`uuid`),
  ADD UNIQUE KEY `users_email_key` (`email`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_status` (`status`),
  ADD KEY `idx_users_role` (`role`),
  ADD KEY `idx_users_deleted_at` (`deleted_at`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `chats`
--
ALTER TABLE `chats`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `customer_data`
--
ALTER TABLE `customer_data`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subcategories`
--
ALTER TABLE `subcategories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cart_items_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `chats`
--
ALTER TABLE `chats`
  ADD CONSTRAINT `chats_receiver_id_fkey` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `chats_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `customer_data`
--
ALTER TABLE `customer_data`
  ADD CONSTRAINT `customer_data_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `customer_data_verified_by_fkey` FOREIGN KEY (`verified_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `favorites_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_approved_by_fkey` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `products_subcategory_id_fkey` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_reporter_id_fkey` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reports_resolved_by_fkey` FOREIGN KEY (`resolved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `reviews_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reviews_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `subcategories`
--
ALTER TABLE `subcategories`
  ADD CONSTRAINT `subcategories_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
