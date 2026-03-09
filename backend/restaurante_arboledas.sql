-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-02-2026 a las 21:53:38
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `restaurante_arboledas`
--



-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--


--
-- Volcado de datos para la tabla `categoria`
--


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `categoria_id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `sku` varchar(255) DEFAULT NULL,
  `peso` decimal(10,2) DEFAULT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`categoria_id`, `nombre`, `descripcion`, `precio`, `sku`, `peso`, `imagen_url`, `created_at`, `updated_at`) VALUES
(1, 'Platos Fuertes', 'Platos principales con ingredientes premium', NULL, NULL, NULL, 'url_platos.jpg', '2026-02-17 00:09:12', '2026-02-17 00:09:12'),
(2, 'Postres', 'Dulces artesanales', NULL, NULL, NULL, 'url_postres.jpg', '2026-02-17 00:09:12', '2026-02-17 00:09:12'),
(3, 'Bebidas', 'Vinos y refrescos', NULL, NULL, NULL, 'url_bebidas.jpg', '2026-02-17 00:09:12', '2026-02-17 00:09:12');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--


--
-- Volcado de datos para la tabla `cliente`
--



-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `cliente_id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `failed_jobs`
--


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jobs`
--


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `job_batches`
--


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodo_pago`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodo_pagos`
--

CREATE TABLE `metodo_pagos` (
  `metodo_pago_id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago`
--


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `pago_id` bigint(20) UNSIGNED NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `pedido_id` bigint(20) UNSIGNED NOT NULL,
  `metodo_pago_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `pedido_id` bigint(20) UNSIGNED NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `total` decimal(10,2) NOT NULL,
  `estado` varchar(255) NOT NULL DEFAULT 'Pendiente',
  `cliente_id` bigint(20) UNSIGNED NOT NULL,
  `producto_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--


--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `producto_id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `sku` varchar(255) DEFAULT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `categoria_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`producto_id`, `nombre`, `descripcion`, `precio`, `sku`, `imagen_url`, `categoria_id`, `created_at`, `updated_at`) VALUES
(1, 'Ceviche de Mango y Camarones', 'Camarones tigre frescos marinados en leche de tigre con mango tropical.', 38000.00, 'PLA-001', NULL, 1, '2026-02-17 00:09:12', '2026-02-17 00:09:12'),
(2, 'Lomo en Costra de Hierbas', 'Lomo de res premium en costra de hierbas finas.', 45000.00, 'PLA-002', NULL, 1, '2026-02-17 00:09:12', '2026-02-17 00:09:12'),
(3, 'Tiramisú de Café Colombiano', 'Versión artesanal con café colombiano premium.', 22000.00, 'POS-001', NULL, 2, '2026-02-17 00:09:12', '2026-02-17 00:09:12'),
(4, 'Volcán de Chocolate Belga', 'Bizcocho de chocolate 70% cacao con centro líquido.', 26000.00, 'POS-002', NULL, 2, '2026-02-17 00:09:12', '2026-02-17 00:09:12'),
(5, 'Vino Tinto Reserva', 'Copa de vino tinto reserva especial.', 32000.00, 'BEB-001', NULL, 3, '2026-02-17 00:09:12', '2026-02-17 00:09:12');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--



-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `proveedor_id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `contacto` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resena`
--


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resenas`
--

CREATE TABLE `resenas` (
  `resena_id` bigint(20) UNSIGNED NOT NULL,
  `calificacion` int(11) NOT NULL,
  `comentario` text DEFAULT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `cliente_id` bigint(20) UNSIGNED NOT NULL,
  `producto_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--



--
-- Estructura de tabla para la tabla `users`
--



--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cache`
--


--
-- Indices de la tabla `cache_locks`
--

--
-- Indices de la tabla `categoria`
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`categoria_id`);

--
-- Indices de la tabla `cliente`
--


--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`cliente_id`),
  ADD UNIQUE KEY `clientes_email_unique` (`email`);

--
-- Indices de la tabla `failed_jobs`


--
-- Indices de la tabla `jobs`


--
-- Indices de la tabla `job_batches`


--
-- Indices de la tabla `metodo_pago`
--


--
-- Indices de la tabla `metodo_pagos`
--
ALTER TABLE `metodo_pagos`
  ADD PRIMARY KEY (`metodo_pago_id`);

--
-- Indices de la tabla `migrations`
--


--
-- Indices de la tabla `pago`
--


--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`pago_id`),
  ADD KEY `pagos_pedido_id_foreign` (`pedido_id`),
  ADD KEY `pagos_metodo_pago_id_foreign` (`metodo_pago_id`);

--
-- Indices de la tabla `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indices de la tabla `pedido`
--

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`pedido_id`),
  ADD KEY `pedidos_cliente_id_foreign` (`cliente_id`),
  ADD KEY `pedidos_producto_id_foreign` (`producto_id`);

--
-- Indices de la tabla `producto`
--


--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`producto_id`),
  ADD KEY `productos_categoria_id_foreign` (`categoria_id`);

--
-- Indices de la tabla `proveedor`
--

--
-- Indices de la tabla `proveedores`
--

--
-- Indices de la tabla `resena`


--
-- Indices de la tabla `resenas`
--
ALTER TABLE `resenas`
  ADD PRIMARY KEY (`resena_id`),
  ADD KEY `resenas_cliente_id_foreign` (`cliente_id`),
  ADD KEY `resenas_producto_id_foreign` (`producto_id`);

--
-- Indices de la tabla `sessions`
--


--
-- Indices de la tabla `users`

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categoria`
--


--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `categoria_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `cliente`
--


--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `cliente_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `failed_jobs`
--


--
-- AUTO_INCREMENT de la tabla `jobs`
--


--
-- AUTO_INCREMENT de la tabla `metodo_pago`
--

--
-- AUTO_INCREMENT de la tabla `metodo_pagos`
--
ALTER TABLE `metodo_pagos`
  MODIFY `metodo_pago_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `migrations`
--


--
-- AUTO_INCREMENT de la tabla `pago`
--

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `pago_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-