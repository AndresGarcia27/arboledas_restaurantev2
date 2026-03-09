<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Importaciones organizadas
use App\Http\Controllers\ApiClienteController;
use App\Http\Controllers\ApiProductoController;
use App\Http\Controllers\ApiCategoriaController;
use App\Http\Controllers\ApiPedidoController;
use App\Http\Controllers\ApiProveedorController;
use App\Http\Controllers\ApiMetodoPagoController;
use App\Http\Controllers\ApiPagoController;
use App\Http\Controllers\ApiResenaController;

/* --- RUTAS PÚBLICAS --- */
Route::post('/login', [ApiClienteController::class, 'login']);
Route::post('/registro', [ApiClienteController::class, 'store']);

/* --- RECURSOS API --- */
// Al usar apiResource, Laravel crea: index, store, show, update y destroy automáticamente.
Route::apiResource('clientes', ApiClienteController::class);
Route::apiResource('productos', ApiProductoController::class);
Route::apiResource('categorias', ApiCategoriaController::class);
Route::apiResource('pedidos', ApiPedidoController::class);
Route::apiResource('proveedores', ApiProveedorController::class);
Route::apiResource('metodos-pago', ApiMetodoPagoController::class);
Route::apiResource('pagos', ApiPagoController::class);
Route::apiResource('resenas', ApiResenaController::class);