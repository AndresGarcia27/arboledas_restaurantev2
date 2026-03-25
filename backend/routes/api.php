<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


use App\Http\Controllers\ApiClienteController;
use App\Http\Controllers\ApiCategoriaController;
use App\Http\Controllers\ApiPedidoController;
use App\Http\Controllers\ApiProveedorController;
use App\Http\Controllers\ApiMetodoPagoController;
use App\Http\Controllers\ApiPagoController;
use App\Http\Controllers\ApiResenaController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminProductoController; 
use App\Http\Controllers\ReservaController;

/* --- RUTAS PÚBLICAS --- */
// Dejamos solo un login, apuntando al AuthController que tiene los superpoderes de Sanctum
Route::post('/login', [AuthController::class, 'login']);
Route::post('/registro', [ApiClienteController::class, 'store']);
Route::post('/crear-preferencia', [App\Http\Controllers\ApiPedidoController::class, 'crearPreferencia']);
Route::post('/checkout', [App\Http\Controllers\ApiPedidoController::class, 'procesarCheckout']);
Route::get('/pedidos', [App\Http\Controllers\ApiPedidoController::class, 'index']);
/* --- RECURSOS API --- */
Route::apiResource('clientes', ApiClienteController::class);

Route::apiResource('productos', AdminProductoController::class); 
Route::apiResource('categorias', ApiCategoriaController::class);
Route::apiResource('pedidos', ApiPedidoController::class);
Route::apiResource('proveedores', ApiProveedorController::class);
Route::apiResource('metodos-pago', ApiMetodoPagoController::class);
Route::apiResource('pagos', ApiPagoController::class);
Route::apiResource('resenas', ApiResenaController::class);
Route::apiResource('reservas', ReservaController::class);
// Ruta para verificar el correo con el código de 6 dígitos
Route::post('/clientes/verificar', [App\Http\Controllers\ApiClienteController::class, 'verificar']);